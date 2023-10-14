import * as alt from 'alt-client'
import * as game from 'natives'
import * as NativeUI from './includes/NativeUI/NativeUI'
import {AvailableDances, AvailableAnimations} from './includes/emotes.js'
import { WalkStyles } from './includes/walkstyles.js'
import { Scenarios } from './includes/scenarios.js'

let prop = null;
const menu = new NativeUI.Menu("", "", new NativeUI.Point(50, 50), 'banner', 'Emotes');
menu.GetTitle().Scale = 0.8;
menu.GetTitle().DropShadow = true;
menu.GetTitle().Font = NativeUI.Font.ChaletLondon;
menu.AddItem(new NativeUI.UIMenuItem("Stop", "Breche deinen Emote ab"));

let menuDanceItem = new NativeUI.UIMenuItem("Tänze", "Zeige alle verfügbaren Tänze");
menu.AddItem(menuDanceItem);

const DanceMenu = new NativeUI.Menu("", "Tanz:", new NativeUI.Point(50, 50), 'banner', 'Emotes');
DanceMenu.Visible = false;
DanceMenu.GetTitle().Scale = 0.8;
DanceMenu.GetTitle().Font = NativeUI.Font.ChaletLondon;
DanceMenu.GetTitle().DropShadow = true;

menu.AddSubMenu(DanceMenu, menuDanceItem);

AvailableDances.forEach(element => {
	let DanceItem = new NativeUI.UIMenuItem(element.name, "Zeige alle verfügbaren Tänze");
	DanceMenu.AddItem(DanceItem);
});

let menuAniamtionItem = new NativeUI.UIMenuItem("Animationen", "Zeige alle verfügbaren Animationen");
menu.AddItem(menuAniamtionItem);

const AnimationMenu = new NativeUI.Menu("", "Animation:", new NativeUI.Point(50, 50), 'banner', 'Emotes');
AnimationMenu.Visible = false;
AnimationMenu.GetTitle().Scale = 0.8;
AnimationMenu.GetTitle().Font = NativeUI.Font.ChaletLondon;
AnimationMenu.GetTitle().DropShadow = true;

menu.AddSubMenu(AnimationMenu, menuAniamtionItem);

AvailableAnimations.forEach(element => {
	let DanceItem = new NativeUI.UIMenuItem(element.name, "Zeige alle verfügbaren Animationen");
	AnimationMenu.AddItem(DanceItem);
});

menu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && item.Text == "Stop") {
		game.clearPedTasks(alt.Player.local.scriptID);
		if (!prop || prop == null) return;
		alt.setTimeout(() => {
			game.detachEntity(prop, true, false);
			game.deleteObject(prop);
			prop = null;
		}, 800);
	}
    else {

    }
});


DanceMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < AvailableDances.length) {
		
		let SelectedDance = AvailableDances[selectedItemIndex];
		
		
		playAnimation(SelectedDance.dict, SelectedDance.anim, 1, 300000);
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});

AnimationMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < AvailableAnimations.length) {
		
		let SelectedAnimation = AvailableAnimations[selectedItemIndex];

		playAnimation(SelectedAnimation.dict, SelectedAnimation.anim, 1, SelectedAnimation.EmoteDuration);
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text);
    }
});

//#region WALK STYLES

let menuWalkstylesItem = new NativeUI.UIMenuItem("Gehstile")
menu.AddItem(menuWalkstylesItem)
const WalkstyleMenu = new NativeUI.Menu("", '', new NativeUI.Point(50, 50), 'banner', 'Emotes')
WalkstyleMenu.Visible = false
WalkstyleMenu.GetTitle().Scale = 0.8
WalkstyleMenu.GetTitle().Font = NativeUI.Font.ChaletLondon
WalkstyleMenu.GetTitle().DropShadow = true
menu.AddSubMenu(WalkstyleMenu, menuWalkstylesItem)
WalkStyles.forEach(element => {
	let item = new NativeUI.UIMenuItem(element.name, "Setze den Gehstil auf " + element.name)
	WalkstyleMenu.AddItem(item)
})
WalkstyleMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < WalkStyles.length) {
		
		let SelectedWalkstyle = WalkStyles[selectedItemIndex].clipset

		game.requestAnimSet(SelectedWalkstyle)
		let tempInterval = alt.setInterval(() => {
			if (game.hasAnimSetLoaded(SelectedWalkstyle)) {
				game.setPedMovementClipset(alt.Player.local, SelectedWalkstyle, 1.0)
				alt.clearInterval(tempInterval)
				game.removeAnimSet(SelectedWalkstyle)
			}
		}, 1)
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text)
    }
})

//#endregion

//#region SCENARIOS

let menuScenariosItem = new NativeUI.UIMenuItem("Scenarios")
menu.AddItem(menuScenariosItem)
const ScenarioMenu = new NativeUI.Menu("", '', new NativeUI.Point(50, 50), 'banner', 'Emotes')
ScenarioMenu.Visible = false
ScenarioMenu.GetTitle().Scale = 0.8
ScenarioMenu.GetTitle().Font = NativeUI.Font.ChaletLondon
ScenarioMenu.GetTitle().DropShadow = true
menu.AddSubMenu(ScenarioMenu, menuScenariosItem)
Scenarios.forEach(element => {
	let item = new NativeUI.UIMenuItem(element.name)
	ScenarioMenu.AddItem(item)
})
ScenarioMenu.ItemSelect.on((item, selectedItemIndex) => {
	if (item instanceof NativeUI.UIMenuItem && selectedItemIndex < Scenarios.length) {
		if (alt.Player.local.vehicle) return
		let SelectedScenario = Scenarios[selectedItemIndex].clipset
		game.taskStartScenarioInPlace(alt.Player.local, SelectedScenario, 0, true)
	}
    else {
        alt.log("[ItemSelect] " + selectedItemIndex, selectedItem.Text)
    }
})

//#endregion


var radioAnimPlayed
var reachAnimPlaying

alt.on('keydown', (key) => {
	if (key === 78) { // N
		playAnimation('random@arrests', 'generic_radio_chatter', 49, 300000);
		radioAnimPlayed = true;
	}
});

alt.on('keyup', (key) => {
    if (key === 114) { // F3
        if (menu.Visible || DanceMenu.Visible || AnimationMenu.Visible)
		{
            menu.Close();
			DanceMenu.Close();
			AnimationMenu.Close();
        }
		else
		{
			menu.Open();
		}
    } else if (key === 78) { // N
		if (radioAnimPlayed) {
			game.clearPedTasks(alt.Player.local.scriptID);
			radioAnimPlayed = false;
		}
	} else if (key === 18) { // ALT
		if (reachAnimPlaying) {
			game.clearPedTasks(alt.Player.local.scriptID);
			reachAnimPlaying = false;
		} else {
			playAnimation('move_m@intimidation@cop@unarmed', 'idle', 49, 300000);
			reachAnimPlaying = true;
		}
	} else if (key === 89) { // Y
		if (!alt.gameControlsEnabled()) return

		game.clearPedTasks(alt.Player.local.scriptID);
		if (!prop || prop == null) return;
		alt.setTimeout(() => {
			game.detachEntity(prop, true, false);
			game.deleteObject(prop);
			prop = null;
		}, 800);
	}
});

alt.onServer("emote:play", (emoteName, flag = 1) => {
	var a = getAnimByName(emoteName)
	playAnimation(a.dict, a.anim, flag, a.EmoteDuration)
});
alt.on("emote:play", (emoteName, flag = 1) => {
	var a = getAnimByName(emoteName)
	playAnimation(a.dict, a.anim, flag, a.EmoteDuration)
});
alt.onServer('emote:test', (dict, name) => {
	playAnimation(dict, name, 1, 300000)
})
alt.onServer('emote:stop', () => { game.clearPedTasks(alt.Player.local) })
alt.onServer('emote:playscenario', scenario => game.taskStartScenarioInPlace(alt.Player.local, scenario, 0, true))

function getAnimByName(emoteName) {
	let returnValue;
	AvailableDances.forEach(dance => {
		if (dance.name.toLowerCase() == emoteName.toLowerCase()) {
			returnValue = dance;
			return;
		}
	});
	AvailableAnimations.forEach(animation => {
		if (animation.name.toLowerCase() == emoteName.toLowerCase()) {
			returnValue = animation;
			return;
		}
	});
	return returnValue;
};

function playAnimation(animDict, animName, animFlag, animDuration) {
    if (animDict == undefined || animName == undefined || animFlag == undefined || animDuration == undefined) return;
    game.requestAnimDict(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, animDuration, animFlag, 1, false, false, false);
        }
    }, 0);
}