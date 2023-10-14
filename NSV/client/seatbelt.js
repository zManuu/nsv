/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client'
import * as native from 'natives'
import { webView } from './client.js'

export function enable() {
    let seatbeltOn = false
    let exitContolBlocked = false
    let p = alt.Player.local

    alt.on('keydown', (key) => {
        var v = p.vehicle
        if (v == null || key != 226) return // 226: <

        alt.setTimeout(() => {
            seatbeltOn = !seatbeltOn
            emitToWebview(seatbeltOn)
            exitContolBlocked = seatbeltOn
        }, 3200)

        // AUDIO
        if (!seatbeltOn)     webView.emit('PlayAudio', './audio/buckle.ogg', 0.5)
        else                 webView.emit('PlayAudio', './audio/unbuckle.ogg', 0.5)
    })

    alt.on('enteredVehicle', (vehicle, seat) => {
        seatbeltOn = false
        emitToWebview(false)
        exitContolBlocked = false
    })
    alt.on('leftVehicle', (vehicle, seat) => {
        seatbeltOn = false
        emitToWebview(false)
        exitContolBlocked = false
    })

    alt.everyTick(() => {
        if (exitContolBlocked) {
            native.disableControlAction(0, 75, true)
        } else {
            native.enableControlAction(0, 75, true)
        }
    })

    alt.onServer('Server:Seatbelt:Crash', () => {
        if (seatbeltOn) return

        let pos = p.pos
        let v = p.vehicle
        let dir = native.getEntityForwardVector(v)
        //alt.log(JSON.stringify(dir))
        native.smashVehicleWindow(v, 6)
        native.setEntityCoords(p, pos.x, pos.y, pos.z, true, false, false, true)
        native.setEntityVelocity(p, dir.x, dir.y, dir.z)
        alt.setTimeout(() => {
            native.setPedToRagdoll(p, 3000, 3000, 0, false, false, false)
        }, 1)
    })
}

export function emitToWebview(toggle) {
    webView.emit('SetSeatbelt', toggle)
}