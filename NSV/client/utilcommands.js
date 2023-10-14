import alt from 'alt-client'
import native from 'natives'

export function enable() {
    let potentialCount = 0;
    let hudState = true;
    alt.onServer('Client:Util:ToggleCursor', value => {
        if (!value) {
            while(potentialCount >= 1) {
                try {
                    alt.showCursor(false);
                } catch(err) {}
                potentialCount -= 1;
            }
            return;
        }  

        try {
            alt.showCursor(true);
        } catch(err) {}
        potentialCount += 1;
    })

    alt.onServer('Client:Util:ToggleHUD', () => {
        hudState = !hudState
        alt.emit('ToggleHUD', hudState)
        native.displayRadar(hudState)
        if (!alt.Player.local.vehicle) { // player is not in a vehicle
            native.displayRadar(false)
        }
    })
}