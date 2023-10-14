import * as NativeUI from './includes/NativeUI/NativeUI';
import * as alt from 'alt-client';

export function enable() {
    let inOpenCooldown = false;

    let menu = new NativeUI.Menu('Auto-Diebstahl', '', new NativeUI.Point(50, 50));
    menu.GetTitle().Scale = 0.8;
    menu.GetTitle().DropShadow = true;
    menu.GetTitle().Font = NativeUI.Font.ChaletLondon;
    let items = ['Starten', 'Beenden', 'Abliefern', 'Polizei-Meldungen'];
    let itemDescs = ['Starte einen Auto-Diebstahl.', 'Beende deinen momentanen Auto-Diebstahl.', 'Begebe dich zur Makierung und liefere das Auto mit dieser Option ab.', 'Setze den Ort des letzten Auto-Diebstahls als Wegpunkt.'];
    for (var i=0; i<items.length; i++) { menu.AddItem(new NativeUI.UIMenuItem(items[i], itemDescs[i])); }

    menu.ItemSelect.on((item, selectedItemIndex) => {
        if (!(item instanceof NativeUI.UIMenuItem)) return;
        if (inOpenCooldown) return;

        if (items.includes(item.Text) && itemDescs.includes(item.Description)) {
            alt.emitServer('Server:CarSteal:MenuClick', item.Text.toString());
        }
    });

    alt.onServer('Server:CarSteal:OpenMenu', () => {
        inOpenCooldown = true;
        alt.setTimeout(() => { inOpenCooldown = false; }, 100);
        menu.Open();
    });
} 