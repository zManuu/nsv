/// <reference types="@altv/types-natives" />

import alt from 'alt-client'
import native, { createCamera } from 'natives'
import * as NativeUI from './includes/NativeUI/NativeUI';
import * as spotlight from './spotlights.js'
import * as carsteal from './carsteal.js'
import * as seatbelt from './seatbelt.js'
import * as streetrace from './streetrace.js'
import * as utilcommands from './utilcommands.js'
import * as hackerlaptop from './hackerlaptop.js'
import * as tempomat from './tempomat.js'
import * as hackinggame from './Hacking.js'
import * as weaponrecoil from './weaponrecoil.js'
import * as search from './search.js'
import * as poastal from './poastal.js'
import * as pdcams from './pdcams.js'
//import * as locationdisplay from './locationdisplay.js'

export var webView
//export var hudWV
export var handGuns = [ 1467525553, 403140669, 905830540, 4116483281, 1927398017, 3238253642, 3322144245 ]
var handsUp = false
var carStealColshapeInterval
var bankRoberyColshapeInterval
var inEngineCooldown = false

alt.onServer('Server:HUD:SetWaypoint', (x, y) => {   native.setNewWaypoint(x, y)   })

alt.onServer("Client:HUD:CreateCEF", (hunger, thirst, currentmoney) => {
    webView = new alt.WebView("http://resource/client/html/index.html", false)
    //hudWV = new alt.WebView("http://resource/client/html/HUD/index.html", false)
    //hudWV.emit('SetHunger', hunger)
    //hudWV.emit('SetThirst', thirst)

    native.setPedConfigFlag(alt.Player.local.scriptID, 32, false)
    native.setPedConfigFlag(alt.Player.local.scriptID, 184, true)
    native.setWeatherTypeNowPersist('EXTRASUNNY')
    //enableSnow()

    // Register listeners
    registerAltListeners()
    registerServerEmitListeners()
    registerWebviewEmitListeners()
    registerKeyListener()

    // Start timers
    startTimers()

    // Start other js files
    spotlight.enable()
    carsteal.enable()
    seatbelt.enable()
    streetrace.enable()
    utilcommands.enable()
    hackerlaptop.enable()
    tempomat.enable()
    //locationdisplay.enable()
    weaponrecoil.enable()
    search.enable()
    poastal.enable()
    pdcams.enable()
});

function registerAltListeners() {
    alt.on('enteredVehicle', (vehicle, seat) => {
        native.displayRadar(true);
        webView.emit('ToggleCar', true);
    });

    alt.on('leftVehicle', (vehicle, seat) => {
        native.displayRadar(false);
        webView.emit('ToggleCar', false);
    });

    alt.on('ToggleHUD', value => {
        webView.isVisible = value
    })
}
function registerServerEmitListeners() {

    //#region CAR STEAL MISSION

    alt.onServer('Client:CarSteal:StartHack', () => alt.emit("HackingGame:Start", 'ABCDEFGH', 2, 50, 100))

    alt.onServer('Server:CarSteal:CreateColshape', (x, y, z) => {
        carStealColshapeInterval = alt.setInterval(() => {
            native.drawMarker(1, x, y, z-1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 214, 137, 16, 100, false, false, 2, false, undefined, undefined, false);
        }, 10);
    });

    alt.onServer('Server:CarSteal:RemoveColshape', () => {   alt.clearInterval(carStealColshapeInterval)   });

    //#endregion

    //#region BANK ROBERY


    native.addDoorToSystem(218, native.getHashKey('v_ilev_bk_gate2'), 262.1981, 222,5188, 106.4296, false, false, false)
    native.doorSystemSetDoorState(218, 1, false, false)
    alt.onServer('Client:BankRobery:OpenFirstDoor', () => {
        native.doorSystemSetDoorState(218, 0, false, false)
    })
    alt.onServer('Client:BankRobery:StartHack', () => alt.emit("HackingGame:Start", 'BANKRAUB', 2, 50, 100))
    alt.onServer('Client:BankRobery:PlayWeldScenario', () => {
        native.clearPedTasks(alt.Player.local)
        native.taskStartScenarioInPlace(alt.Player.local, 'WORLD_HUMAN_WELDING', 0, true)
        alt.toggleGameControls(false)
        alt.setTimeout(() => alt.toggleGameControls(true), 5000)
    })
    alt.onServer('Client:BankRobery:DrawColshape', (x, y, z) => {
        if (bankRoberyColshapeInterval) alt.clearInterval(bankRoberyColshapeInterval)

        bankRoberyColshapeInterval = alt.setInterval(() => {
            native.drawMarker(1, x, y, z-1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 214, 137, 16, 100, false, false, 2, false, undefined, undefined, false)
        }, 10)
    })
    alt.onServer('Client:BankRobery:End', () => alt.clearInterval(bankRoberyColshapeInterval))
    alt.onServer('Client:BankRobery:OpenVault', () => {
        let vaultDoor = native.getClosestObjectOfType(253.92, 224.56, 101.88, 2.0, native.getHashKey('v_ilev_bk_vaultdoor'), false, false, false)
        native.setEntityHeading(vaultDoor, native.getEntityHeading(vaultDoor) - 100)
    })


    //#endregion


    // OTHER

    alt.onServer('Client:Game:ToggleControls', state => alt.toggleGameControls(state))

    alt.onServer('Client:ShowAdminMessage', msg => NativeUI.MidsizedMessage.ShowMidsizedShardMessage('ANKÜNDIGUNG', msg, NativeUI.HudColor.HUD_COLOUR_REDDARK, true, true, 10000) )

    alt.onServer('Client:Vehicle:Clean', veh => {
        native.setVehicleDirtLevel(veh, -1)
        native.washDecalsFromVehicle(veh, 1.0)
    })

    alt.onServer('Server:ToggleSiren', (vehicle, isMuted) => native.setVehicleHasMutedSirens(vehicle, isMuted))

    alt.on('SaltyChat:VoiceRangeChanged', (range, rangeIndex) => webView.emit('SetVoiceRange', range) )

    alt.onServer('Server:WeaponSwitch', (oldWeapon, weapon) => {
        var weaponModel = native.getWeapontypeModel(weapon);
        //alt.log(weaponModel.toString())
        if (alt.Player.local.vehicle) return;
        if (handGuns.includes(weaponModel)) { // player took out handgun
            alt.emit('emote:play', 'Pull gun', 49)
            alt.setTimeout(() => native.clearPedTasks(alt.Player.local.scriptID), 1500)
        } else if (weaponModel == 0 && handGuns.includes(native.getWeapontypeModel(oldWeapon))) { // player switched from handgun to hand
            alt.emit('emote:play', 'Store gun', 49)
            alt.setTimeout(() => native.clearPedTasks(alt.Player.local.scriptID), 1500)
        }
    })

    alt.onServer('Server:Audio:Play', (path, volume = 1) => webView.emit('PlayAudio', path, volume))

    alt.onServer('Server:HUD:Update', (health, armour) => {
        webView.emit('SetHealth', health)
        webView.emit('SetArmour', armour)
    })

    alt.onServer("Client:HUD:SetPlayerHUDVehicleInfos", (fuel, km) => {
        if (alt.Player.local.vehicle != null) {
            //console.log(`Vehicle Update: ${fuel}, ${km}`);
            webView.emit("SetFuel", fuel);
            webView.emit("SetKM", km);
        }
    });
    alt.onServer('Client:HUD:updateHUDPosInVeh', (state, fuel, km) => {
        if (alt.Player.local.vehicle != null) {
            //console.log(`Vehicle Update: ${fuel}, ${km}`);
            webView.emit("SetFuel", fuel);
            webView.emit("SetKM", km);
        }
    })

    alt.onServer("Client:HUD:UpdateDesire", (hunger, thirst) => webView.emit("hud:updateIndicators", alt.Player.local.health, alt.Player.local.armour, hunger, thirst))
}
function registerWebviewEmitListeners() {
    webView.on("hud:webViewRequestVehicleManagementUpdate", (currentStatus) => {
        if (alt.Player.local.vehicle != undefined) {
            webView.emit("hud:updateVehicleManagement", !currentStatus);
            alt.showCursor(!currentStatus);
            alt.toggleGameControls(currentStatus);
            if (currentStatus) {
                webView.unfocus();
            }
        }
    });
    webView.on("vehicle:webViewRequestEngineToggle", () => {
        alt.emitServer("vehicle:toggleEngine", alt.Player.local.vehicle);
    });
    webView.on("vehicle:webViewRequestSeatbeltToggle", () => {
        alt.emitServer("vehicle:toggleSeatbelt");
    });
    var trunkOpen = false;
    webView.on("vehicle:webViewRequestTrunk", () => {
        if (trunkOpen) {
            native.setVehicleDoorShut(alt.Player.local.vehicle, 5, true);
            trunkOpen = false;
        } else {
            native.setVehicleDoorOpen(alt.Player.local.vehicle, 5, false, true);
            trunkOpen = true;
        }
    });
    var hoodOpen = false;
    webView.on("vehicle:webViewRequestHood", () => {
        if (hoodOpen) {
            native.setVehicleDoorShut(alt.Player.local.vehicle, 4, true);
            hoodOpen = false;
        } else {
            native.setVehicleDoorOpen(alt.Player.local.vehicle, 4, false, true);
            hoodOpen = true;
        }
    });
    webView.on("vehicle:webViewRequestLight", () => {
        alt.emitServer("vehicle:light");
    });
}
function registerKeyListener() {
    alt.on("keydown", (key) => {
        var p = alt.Player.local;
        var v = p.vehicle;

        if (key === 72 && v == undefined && alt.gameControlsEnabled()) { // H
            if (handsUp) {
                native.clearPedTasks(alt.Player.local.scriptID);
                handsUp = false;
            } else {
                native.requestAnimDict("ped");
                let interval = alt.setInterval(() => {
                    if (native.hasAnimDictLoaded("ped")) {
                        alt.clearInterval(interval);
                        native.taskPlayAnim(p.scriptID, 'ped', 'handsup_base', 1, -1, -1, 49, 1, 0, 0, 0);
                        handsUp = true;
                    }
                }, 0);
            }
        } else if (key === 76 && alt.gameControlsEnabled()) { // L
            alt.emitServer("Client:Vehicle:RequestLock")
        } else if (key === 69) { // E
            alt.emitServer('Client:PressE')
            alt.emitServer('Server:Vehicle:Clean')
            alt.emitServer('Server:BankRobery:PressE')
            alt.emitServer('Server:TruckerJob:PressE')
            alt.emitServer('Server:Search:PressE')
            alt.emitServer('Server:Keydown:E')
        } else if (key === 188) { // ,
            if (!inEngineCooldown) {
                alt.emitServer('Server:Raycast:ToggleVehicleEngine', v)
                inEngineCooldown = true
                alt.setTimeout(() => inEngineCooldown = false, 500)
            }
        } else if (key === 121) { // F10
            alt.emitServer('Client:PanicButton')
        } else if (key === 71) { // G
            if (v == null) return // player isn't in a vehicle
            if (native.getVehicleClass(v) != 18) return // player isn't in an emergency vehicle
            alt.emitServer('Client:ToggleSiren', v)
        } else if (key === 27) { // ESC
            alt.emitServer('Server:Keydown:ESC')
        }
    });
}

function enableSnow() {
    native.setForceVehicleTrails(true)
    native.setForcePedFootstepsTracks(true)
    native.requestScriptAudioBank("ICE_FOOTSTEPS", false, 0)
    native.requestScriptAudioBank("SNOW_FOOTSTEPS", false, 0)

    native.requestNamedPtfxAsset("core_snow");

    let timer = alt.setInterval(() => {
        if(native.hasNamedPtfxAssetLoaded("core_snow")){
            native.useParticleFxAsset("core_snow");
            alt.clearInterval(timer);
        }
    }, 1);
}

function startTimers() {
    let p = alt.Player.local

    alt.setInterval(function() {
        let v = p.vehicle

        if (v != null) {
            let speedVector = v.speedVector.length
            let vehSpeed = Math.round(((speedVector * 3.6) * 100) / 100)
            webView.emit('SetSpeed', vehSpeed)
        }

        /*let health = alt.Player.local.health
        if (health != 0) health -= 100
        webView.emit('SetHealth', health)
        webView.emit('SetArmour', alt.Player.local.armour)*/
    }, 100) // 0.1 sec

}