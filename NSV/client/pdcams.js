/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client'
import * as native from 'natives'
import * as NativeUI from './includes/NativeUI/NativeUI'

export const cams = [
    { name: "Shop 1", pos: {x:381.6630859375,y:322.9450988769531,z:104.8264389038086}, rot: 0.897736132144928},
    { name: "Shop 2", pos: {x:34.27988052368164,y:-1348.4041748046875,z:31.323535919189453}, rot: 1.058943271636963},
    { name: "Shop 3", pos: {x:2558.921142578125,y:390.2834777832031,z:110.0068359375}, rot: 2.626312494277954},
    { name: "Shop 4", pos: {x:2683.726318359375,y:3287.304931640625,z:56.81611633300781}, rot: 2.1976048946380615},
    { name: "Staatsbank Haupteingang", pos: {x:236.3387451171875,y:220.53009033203125,z:107.70213317871094}, rot: 2.6179399490356445},
    { name: "Staatsbank Nebeneingang", pos: {x:266.5757751464844,y:216.03761291503906,z:107.95414733886719}, rot: 2.5439541339874268},
    { name: "Staatsbank Tresorvorraum", pos: {x:262.4301452636719,y:222.50645446777344,z:103.65794372558594}, rot: 0.9455809593200684},
    { name: "Tresorraum", pos: {x:249.7371826171875,y:217.66258239746094,z:103.97296142578125}, rot: -1.7306969165802002},
    { name: "Mechaniker innen", pos: {x:-331.64031982421875,y:-145.6137237548828,z:41.764713287353516}, rot: 0.4059159457683563},
    { name: "Mechaniker Lobby", pos: {x:-354.44586181640625,y:-132.5463104248047,z:40.567718505859375}, rot: -0.7920467853546143},
    { name: "Mechaniker Hof", pos: {x:-396.6276550292969,y:-113.61366271972656,z:48.374916076660156}, rot: -1.9284632205963135},
    { name: "Rathaus Lobby", pos: {x:-552.438720703125,y:-191.75808715820312,z:40.58937454223633}, rot: -2.631340980529785},
    { name: "Rathaus Saal", pos: {x:-585.7184448242188,y:-213.92526245117188,z:40.30387878417969}, rot: -1.0171583890914917},
    { name: "Tresorraum", pos: {x:249.7371826171875,y:217.66258239746094,z:103.97296142578125}, rot: -1.7306969165802002}
]

export function enable() {

    var cam = null
    const menu = new NativeUI.Menu('LSPD | Kameras', '', new NativeUI.Point(50, 50))
    menu.GetTitle().Scale = 0.8
    menu.GetTitle().DropShadow = true
    menu.GetTitle().Font = NativeUI.Font.ChaletLondon
    for (let i=0; i<cams.length; i++) {
        menu.AddItem(new NativeUI.UIMenuItem(cams[i].name))
    }
    menu.ItemSelect.on((item, selectedItemIndex) => {
        if (!(item instanceof NativeUI.UIMenuItem)) return
        if (menu.MenuItems.includes(item)) {
            let c = cams[selectedItemIndex]
            alt.emitServer('Server:Camera:SetPlayerState', true, c.name)
            cam = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', c.pos.x, c.pos.y, c.pos.z , 0, 0, c.rot * 180 / Math.PI, 50, true, 2)
            menu.Close()
            native.setCamActive(cam, true)
            native.renderScriptCams(true, false, 0, true, false, 0)
            native.setFocusPosAndVel(c.pos.x, c.pos.y, c.pos.z, 0, 0, 0)
        }
    })

    alt.onServer('Client:Camera:OpenMenu', () => {
        menu.Open()
    })

    alt.on('keydown', key => {
        if (key === 8) { // Back
            if (cam != null) {
                native.destroyCam(cam, false)
                native.clearFocus()
                native.renderScriptCams(false, false, 0, false, false, 0)
                cam = null
                alt.emitServer('Server:Camera:SetPlayerState', false, '')
            }
        }
    })

}