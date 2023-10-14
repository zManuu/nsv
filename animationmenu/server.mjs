import * as alt from 'alt'
import * as chat from 'chat'

chat.registerCmd("e", (player, arg) => {
	var s = arg[0]
	for (var i=1; i<arg.length; i++) {
		s+=" "+arg[i]
	}
	alt.emitClient(player, "emote:play", s)
})

chat.registerCmd('testemote', (player, arg) => {
	alt.emitClient(player, 'emote:test', arg[0], arg[1])
})

chat.registerCmd('do', (player, args) => {
	var labelID = makeid(5)
	alt.emit('textLabel:Create', player, labelID, args.join(' '), 10, 1, 0.7, 255, 255, 255, 200)
	alt.setTimeout(() => {
		alt.emit('textLabel:Destroy', labelID)
	}, 5000);
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}