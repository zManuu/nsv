import * as NativeUI from './includes/NativeUI/NativeUI';
import * as alt from 'alt-client';

export function enable() {
    let inOpenCooldown = false

    let menu = new NativeUI.Menu('Straßen-Rennen', '', new NativeUI.Point(50, 50))
    menu.GetTitle().Scale = 0.8
    menu.GetTitle().DropShadow = true
    menu.GetTitle().Font = NativeUI.Font.ChaletLondon
    let items = ['Beenden', 'test1']
    for (var i=0; i<items.length; i++) { menu.AddItem(new NativeUI.UIMenuItem(items[i])) }

    menu.ItemSelect.on((item, selectedItemIndex) => {
        alt.log('1')
        if (!(item instanceof NativeUI.UIMenuItem)) return
        if (inOpenCooldown) return

        if (items.includes(item.Text)) {
            alt.log('2')
            alt.emitServer('Race:MenuClick', item.Text.toString())
        }
    })

    alt.onServer('Race:OpenMenu', () => {
        inOpenCooldown = true
        alt.setTimeout(() => { inOpenCooldown = false }, 100)
        menu.Open()
    })
} 