/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import alt from 'alt-client'
import native from 'natives'

export function enable() {
    alt.setInterval(() => {

        let scriptID = alt.Player.local.scriptID
        let ped = native.getPlayerPed(scriptID)
		let weapon = native.getSelectedPedWeapon(ped)
		
		// Disable reticle
		native.hideHudComponentThisFrame(14)
		
		// Disable melee while aiming (may be not working)
		if (native.isPlayerFreeAiming(scriptID)) {
		    native.disableControlAction(0,140,true)
		    native.disableControlAction(0,141,true)
		    native.disableControlAction(0,142,true)
		    native.disableControlAction(0,143,true)
        }
		
		// Shakycam
		
		// Pistol
		if (weapon == native.getHashKey("WEAPON_STUNGUN")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.01)
			
		
		
		if (weapon == native.getHashKey("WEAPON_FLAREGUN")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.01)
			
		
		
		if (weapon == native.getHashKey("WEAPON_SNSPISTOL")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.02)
			
		
		
		if (weapon == native.getHashKey("WEAPON_SNSPISTOL_MK2")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.025)
			
		
		
		if (weapon == native.getHashKey("WEAPON_PISTOL")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.025)
			
		
		
		if (weapon == native.getHashKey("WEAPON_PISTOL_MK2")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.03)
			
		
		
		if (weapon == native.getHashKey("WEAPON_APPISTOL")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.05)
			
		
		
		if (weapon == native.getHashKey("WEAPON_COMBATPISTOL")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.03)
			
		
		
		if (weapon == native.getHashKey("WEAPON_PISTOL50")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.05)
			
		
		
		if (weapon == native.getHashKey("WEAPON_HEAVYPISTOL")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.03)
			
		
		
		if (weapon == native.getHashKey("WEAPON_VINTAGEPISTOL")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.025)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MARKSMANPISTOL")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.03)
			
		
		
		if (weapon == native.getHashKey("WEAPON_REVOLVER")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.045)
			
		
		
		if (weapon == native.getHashKey("WEAPON_REVOLVER_MK2")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.055)
			
		
		
		if (weapon == native.getHashKey("WEAPON_DOUBLEACTION")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.025)
			
		
		// SMG
		
		if (weapon == native.getHashKey("WEAPON_MICROSMG")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.035)
			
		
		
		if (weapon == native.getHashKey("WEAPON_COMBATPDW")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.045)
			
		
		
		if (weapon == native.getHashKey("WEAPON_SMG")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.045)
			
		
		
		if (weapon == native.getHashKey("WEAPON_SMG_MK2")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.055)
			
		
		
		if (weapon == native.getHashKey("WEAPON_ASSAULTSMG")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.050)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MACHINEPISTOL")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.035)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MINISMG")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.035)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MG")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.07)
			
		
		
		if (weapon == native.getHashKey("WEAPON_COMBATMG")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.08)
			
		
		
		if (weapon == native.getHashKey("WEAPON_COMBATMG_MK2")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.085)
			
		
		
		// Rifles
		
		if (weapon == native.getHashKey("WEAPON_ASSAULTRIFLE")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.07)
			
		
		
		if (weapon == native.getHashKey("WEAPON_ASSAULTRIFLE_MK2")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.075)
			
		
		
		if (weapon == native.getHashKey("WEAPON_CARBINERIFLE")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.06)
			
		
		
		if (weapon == native.getHashKey("WEAPON_CARBINERIFLE_MK2")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.065)
			
		
		
		if (weapon == native.getHashKey("WEAPON_ADVANCEDRIFLE")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.06)
			
		
		
		if (weapon == native.getHashKey("WEAPON_GUSENBERG")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.05)
			
		
		
		if (weapon == native.getHashKey("WEAPON_SPECIALCARBINE")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.06)
			
		
		
		if (weapon == native.getHashKey("WEAPON_SPECIALCARBINE_MK2")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.075)
			
		
		
		if (weapon == native.getHashKey("WEAPON_BULLPUPRIFLE")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.05)
			
		
		
		if (weapon == native.getHashKey("WEAPON_BULLPUPRIFLE_MK2")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.065)
			
		
		
		if (weapon == native.getHashKey("WEAPON_COMPACTRIFLE")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.05)
			
		
		
		// Shotgun
		
		if (weapon == native.getHashKey("WEAPON_PUMPSHOTGUN")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.07)
			
		
		
		if (weapon == native.getHashKey("WEAPON_PUMPSHOTGUN_MK2")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.085)
			
		
		
		if (weapon == native.getHashKey("WEAPON_SAWNOFFSHOTGUN")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.06)
			
		
		
		if (weapon == native.getHashKey("WEAPON_ASSAULTSHOTGUN")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.12)
			
		
		
		if (weapon == native.getHashKey("WEAPON_BULLPUPSHOTGUN")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.08)
			
		
		
		if (weapon == native.getHashKey("WEAPON_DBSHOTGUN")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.05)
			
		
		
		if (weapon == native.getHashKey("WEAPON_AUTOSHOTGUN")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.08)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MUSKET")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.04)
			
		
		
		if (weapon == native.getHashKey("WEAPON_HEAVYSHOTGUN")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.13)
			
		
		
		// Sniper
		
		if (weapon == native.getHashKey("WEAPON_SNIPERRIFLE")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.2)
			
		
		
		if (weapon == native.getHashKey("WEAPON_HEAVYSNIPER")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.3)
			
		
		
		if (weapon == native.getHashKey("WEAPON_HEAVYSNIPER_MK2")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.35)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MARKSMANRIFLE")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.1)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MARKSMANRIFLE_MK2")) 			
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.1)
			
		
		
		// Launcher
		
		if (weapon == native.getHashKey("WEAPON_GRENADELAUNCHER")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.08)
			
		
		
		if (weapon == native.getHashKey("WEAPON_RPG")) 
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.9)
			
		
		
		if (weapon == native.getHashKey("WEAPON_HOMINGLAUNCHER")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.9)
			
		
		
		if (weapon == native.getHashKey("WEAPON_MINIGUN")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.20)
			
		
		
		if (weapon == native.getHashKey("WEAPON_RAILGUN")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 1.0)
				
			
		
		
		if (weapon == native.getHashKey("WEAPON_COMPACTLAUNCHER")) 		
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.08)
			
		
		
		if (weapon == native.getHashKey("WEAPON_FIREWORK")) 	
			if (native.isPedShooting(ped))
				native.shakeGameplayCam('SMALL_EXPLOSION_SHAKE', 0.5)
			
}, 0)

// recoil script by bluethefurry / Blumlaut https://forum.fivem.net/t/betterrecoil-better-3rd-person-recoil-for-fivem/82894
// I just added some missing weapons because of the doomsday update adding some MK2.
// I can't manage to make negative hashes works, if someone make it works, please let me know =)

var recoils = new Map()
recoils.set(453432689, 0.3) // PISTOL
recoils.set(3219281620, 0.3) // PISTOL MK2
recoils.set(1593441988, 0.2) // COMBAT PISTOL
recoils.set(584646201, 0.1) // AP PISTOL
recoils.set(2578377531, 0.6) // PISTOL .50
recoils.set(324215364, 0.2) // MICRO SMG
recoils.set(736523883, 0.1) // SMG
recoils.set(2024373456, 0.1) // SMG MK2
recoils.set(4024951519, 0.1) // ASSAULT SMG
recoils.set(3220176749, 0.2) // ASSAULT RIFLE
recoils.set(961495388, 0.2) // ASSAULT RIFLE MK2
recoils.set(2210333304, 0.1) // CARBINE RIFLE
recoils.set(4208062921, 0.1) // CARBINE RIFLE MK2
recoils.set(2937143193, 0.1) // ADVANCED RIFLE
recoils.set(2634544996, 0.1) // MG
recoils.set(2144741730, 0.1) // COMBAT MG
recoils.set(3686625920, 0.1) // COMBAT MG MK2
recoils.set(487013001, 0.4) // PUMP SHOTGUN
recoils.set(1432025498, 0.4) // PUMP SHOTGUN MK2
recoils.set(2017895192, 0.7) // SAWNOFF SHOTGUN
recoils.set(3800352039, 0.4) // ASSAULT SHOTGUN
recoils.set(2640438543, 0.2) // BULLPUP SHOTGUN
recoils.set(911657153, 0.1) // STUN GUN
recoils.set(100416529, 0.5) // SNIPER RIFLE
recoils.set(205991906, 0.7) // HEAVY SNIPER
recoils.set(177293209, 0.7) // HEAVY SNIPER MK2
recoils.set(856002082, 1.2) // REMOTE SNIPER
recoils.set(2726580491, 1.0) // GRENADE LAUNCHER
recoils.set(1305664598, 1.0) // GRENADE LAUNCHER SMOKE
recoils.set(2982836145, 0.0) // RPG
recoils.set(1752584910, 0.0) // STINGER
recoils.set(1119849093, 0.01) // MINIGUN
recoils.set(3218215474, 0.2) // SNS PISTOL
recoils.set(2009644972, 0.25) // SNS PISTOL MK2
recoils.set(1627465347, 0.1) // GUSENBERG
recoils.set(3231910285, 0.2) // SPECIAL CARBINE
recoils.set(-1768145561, 0.25) // SPECIAL CARBINE MK2
recoils.set(3523564046, 0.5) // HEAVY PISTOL
recoils.set(2132975508, 0.2) // BULLPUP RIFLE
recoils.set(-2066285827, 0.25) // BULLPUP RIFLE MK2
recoils.set(137902532, 0.4) // VINTAGE PISTOL
recoils.set(-1746263880, 0.4) // DOUBLE ACTION REVOLVER
recoils.set(2828843422, 0.7) // MUSKET
recoils.set(984333226, 0.2) // HEAVY SHOTGUN
recoils.set(3342088282, 0.3) // MARKSMAN RIFLE
recoils.set(1785463520, 0.35) // MARKSMAN RIFLE MK2
recoils.set(1672152130, 0) // HOMING LAUNCHER
recoils.set(1198879012, 0.9) // FLARE GUN
recoils.set(171789620, 0.2) // COMBAT PDW
recoils.set(3696079510, 0.9) // MARKSMAN PISTOL
recoils.set(1834241177, 2.4) // RAILGUN
recoils.set(3675956304, 0.3) // MACHINE PISTOL
recoils.set(3249783761, 0.6) // REVOLVER
recoils.set(-879347409, 0.65) // REVOLVER MK2
recoils.set(4019527611, 0.7) // DOUBLE BARREL SHOTGUN
recoils.set(1649403952, 0.3) // COMPACT RIFLE
recoils.set(317205821, 0.2) // AUTO SHOTGUN
recoils.set(125959754, 0.5) // COMPACT LAUNCHER
recoils.set(3173288789, 0.1) // MINI SMG		



alt.setInterval(() => {
    let ped = native.getPlayerPed(alt.Player.local)
	if (native.isPedShooting(ped) && !(native.isPedDoingDriveby(ped))) {
		let _,wep = native.getCurrentPedWeapon(ped)
			//_,cAmmo = native.getAmmoInClip(ped, wep)
			if (recoils.has(wep) && recoils.get(wep) != 0) {
				tv = 0
				while (tv <= recoils.get(wep)) {
                    p = native.getGameplayCamRelativePitch()
					if (native.getFollowPedCamViewMode() != 4 )
                    native.setGameplayCamRelativePitch(p+0.1, 0.2)
					tv = tv+0.1
                }
            }
    }
}, 0)
}