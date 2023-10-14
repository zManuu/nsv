/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client'
import * as native from 'natives'

export function enable() {
    let webview = new alt.WebView()
    alt.setInterval(function () {
        let pos = alt.Player.local.pos
        let zoneKey = native.getNameOfZone(pos.x, pos.y, pos.z)
        let zone = native.getLabelText(zoneKey)
        let streetName = native.getStreetNameAtCoord(pos.x, pos.y, pos.z)
        //alt.log(streetName)
        //alt.log(native.getStreetNameFromHashKey(streetName[1]))
        //alt.log(native.getStreetNameFromHashKey(streetName[2]))
        webview.emit('SetData', zone, native.getStreetNameFromHashKey(streetName[1]))
    }, 1000)
}
export function drawText2d( 
    msg,
    x,
    y,
    scale,
    fontType,
    r,
    g,
    b,
    a,
    useOutline = true,
    useDropShadow = true,
    layer = 0,
    align = 0
 ) {
    let hex = msg.match('{.*}');
    if (hex) {
        const rgb = hexToRgb(hex[0].replace('{', '').replace('}', ''));
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        msg = msg.replace(hex[0], '');
    }
 
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);
    native.setTextJustification(align);
 
    if (useOutline) {
        native.setTextOutline();
    }
 
    if (useDropShadow) {
        native.setTextDropShadow();
    }
 
    native.endTextCommandDisplayText(x, y, 0);
}