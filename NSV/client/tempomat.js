/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import alt from 'alt-client'
import native from 'natives'
import * as NativeUI from './includes/NativeUI/NativeUI'

export function enable() {

    let menu = new NativeUI.Menu('', '', new NativeUI.Point(50, 50), 'banner', 'Tempomat')
    menu.GetTitle().Scale = 0.8
    menu.GetTitle().DropShadow = true
    menu.GetTitle().Font = NativeUI.Font.ChaletLondon
    let items = ['Zurücksetzen', '20', '30', '50', '80', '120', '160']
    for (var i=0; i<items.length; i++) {

        if (items[i] == 'Zurücksetzen')         menu.AddItem(new NativeUI.UIMenuItem(items[i], `Setze den Tempomat zurück`))
        else                                    menu.AddItem(new NativeUI.UIMenuItem(items[i], `Setze den Tempomat auf ${items[i]}KM/H`))

    }

    alt.on('keydown', key => {
        if (key === 117) {
            menu.Open()
        }
    })

    alt.onServer('Client:Tempomat:Set', (veh, value) => {
        native.setVehicleMaxSpeed(veh, value / 3.6);
    })

    menu.ItemSelect.on((item, selectedItemIndex) => {
        if (!(item instanceof NativeUI.UIMenuItem)) return

        if (items.includes(item.Text)) {
            alt.emitServer('Server:Tempomat:Set', item.Text.toString())
        }
    })

}