/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as NativeUI from './includes/NativeUI/NativeUI'
import * as alt from 'alt-client'
import * as native from 'natives'

export function enable() {

    //#region DARKWEB HISTORY

    let darkwebHistoryMenu = new NativeUI.Menu('Darkweb-Verlauf', '', new NativeUI.Point(50, 50))
    darkwebHistoryMenu.GetTitle().Scale = 0.8
    darkwebHistoryMenu.GetTitle().DropShadow = true
    darkwebHistoryMenu.GetTitle().Font = NativeUI.Font.ChaletLondon

    alt.onServer('Darkweb:OpenHistory', () => {
        alt.emit("Client:Inventory:closeCEF")
        darkwebHistoryMenu.Open()
    })
    
    alt.onServer('Darkweb:AddHistoryEntry', newEntry => {
        var currentDate = new Date()
        darkwebHistoryMenu.AddItem(new NativeUI.UIMenuItem(newEntry, `Um ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()} Uhr`))
    })

    //#endregion

    let webview

    alt.onServer('Hackerlaptop:Open', () => {
        if (webview == undefined) {
            webview = new alt.WebView('http://resource/client/html/hackerlaptop/hackerlaptop.html', false)

            webview.on('Carstealaction', action => alt.emitServer('Server:CarSteal:MenuClick', action))
            webview.on('CloseLaptop', () => {
                webview.unfocus()
                webview.isVisible = false
                alt.showCursor(false)
                alt.toggleGameControls(true)
            })
            webview.on('StartHack', () =>  alt.emitServer('Server:BankRobery:RequestHack'))
            alt.on('HackingGame:Result', (result) => {
                /*	Result is a boolean
                 * 	true: Player finished the Hack
                 * 	false: Player failed the Hack
                 */
                alt.log('HACK RESULT: ' + result)
                alt.emitServer('Server:BankRobery:HackResult', alt.Player.local, result)
                alt.emitServer('Server:CarSteal:HackResult', alt.Player.local, result)
            })
        }

        alt.emit("Client:Inventory:closeCEF")
        webview.isVisible = true
        webview.focus()
        alt.showCursor(true)
        alt.toggleGameControls(false)
    })

    alt.onServer('Hackerlaptop:NewTwitterMessage', (author, text) => {
        if (webview == undefined) return

        var dateObj = new Date()
        var date = `${dateObj.getHours()}:${dateObj.getMinutes()}`
        var formatedText = `[${date}] ${author}: ${text} `
        webview.emit('AddTwitterMessage', formatedText)
    })

}