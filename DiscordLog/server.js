import alt from 'alt'
import * as Discord from 'discord.js'

const client = new Discord.Client()
const footerIMG = 'https://cdn.discordapp.com/attachments/825395077064556595/948592955160141835/VictoriaState.png'
const footerText = '© 2020-2022 VictoriaState'

var allLogChannel
var connectionLogChannel
var deathLogChannel
var chatLogChannel
var serverLogChannel
var adminLogChannel

var playersOnline = 0

client.on("ready", () => {
  console.log(`[Discord] Regestrierter Log-Bot: ${client.user.username}`)

  allLogChannel = client.channels.cache.get('949960677223694376')
	connectionLogChannel = client.channels.cache.get('949362133429289041')
  deathLogChannel = client.channels.cache.get('949362133429289041')
  chatLogChannel = client.channels.cache.get('949362780601983087')
  serverLogChannel = client.channels.cache.get('949960677223694376')
  adminLogChannel = client.channels.cache.get('949960800938897418')

	client.user.setStatus('dnd')
  client.user.setActivity({ type:'PLAYING', name:'VictoriaState auf Alt:V' })
})

// Join Log
alt.on('playerConnect', player => {
  let Embed = new Discord.MessageEmbed()
	.setTitle('PlayerConnect')
  .addField('Name', player.name, true)
	.addField('IP', player.ip, true)
  .addField('SocialID', player.socialID, true)
	.setColor('#00cc00')
  .setFooter(footerText, footerIMG)
	.setTimestamp()
  connectionLogChannel.send(Embed)
  allLogChannel.send(Embed)
  playersOnline++
})

// Leave Log
alt.on('playerDisconnect', (player, reason) => {
  let Embed = new Discord.MessageEmbed()
	.setTitle('PlayerDisconnect')
  .addField('Name', player.name, true)
	.addField('IP', player.ip, true)
  .addField('SocialID', player.socialID, true)
  .addField('Grund', reason, false)
	.setColor('#CC0000')
  .setFooter(footerText, footerIMG)
	.setTimestamp()
  connectionLogChannel.send(Embed)
  allLogChannel.send(Embed)
  playersOnline--
})

// Server-Stop Log
alt.on('resourceStop', () => {
  let Embed = new Discord.MessageEmbed()
	.setTitle('ServerStop')
  .setDescription(`VS wird heruntergefahren!`)
	.setColor('#CC0000')
  .setFooter(footerText, footerIMG)
	.setTimestamp()
  serverLogChannel.send(Embed)
  allLogChannel.send(Embed)
})

// Death Log
alt.on('playerDeath', (victim, killer, weaponHash) => {
  var Embed
  if (killer) {
    Embed = new Discord.MessageEmbed()
	  .setTitle('PlayerDeath')
    .addField('Victim', victim.name, true)
	  .addField('IP', victim.ip, true)
    .addField('SocialID', victim.socialID, true)
    .addField('\u200b', '\u200b')
    .addField('Killer', killer.name, true)
	  .addField('IP', killer.ip, true)
    .addField('SocialID', killer.socialID, true)
    .addField('Waffe', weaponHash, false)
	  .setColor('#CC0000')
    .setFooter(footerText, footerIMG)
	  .setTimestamp()
  }
  if (!Embed) {
    Embed = new Discord.MessageEmbed()
	  .setTitle('PlayerDeath')
	  .setColor('#0099ff')
    .addField('Victim', victim.name, true)
	  .addField('IP', victim.ip, true)
    .addField('SocialID', victim.socialID, true)
    .addField('Waffe', weaponHash, false)
	  .setColor('#CC0000')
    .setFooter(footerText, footerIMG)
	  .setTimestamp()
  }
  deathLogChannel.send(Embed)
  allLogChannel.send(Embed)
})

// Chat Log
alt.onClient('chat:message', (player, msg) => {
  if (msg == undefined || msg == null || msg == '') return

  try {
    let Embed = new Discord.MessageEmbed()
	  .setTitle('ChatMessage')
    .addField('Name', player.name, true)
	  .addField('IP', player.ip, true)
    .addField('SocialID', player.socialID, true)
    .addField('Nachricht', msg, false)
	  .setColor('#00cc00')
    .setFooter(footerText, footerIMG)
	  .setTimestamp()
    chatLogChannel.send(Embed)
    allLogChannel.send(Embed)
  } catch (e) {
    console.error(e)
  }
})

// Admin Log
alt.on('Server:Discord:AdminLog', (msg) => {
  let Embed = new Discord.MessageEmbed()
	.setTitle('AdminAction')
  .setDescription(msg)
	.setColor('#CC0000')
  .setFooter(footerText, footerIMG)
	.setTimestamp()
  adminLogChannel.send(Embed)
})

// commands
client.on('message', message => {
  let args = message.content.split(' ')
	if (message.content === '/status') {
    let embed = new Discord.MessageEmbed()
	  .setTitle('Server-Status')
    .setDescription(`Der Server ist momentan **online**.\nEs sind **${playersOnline}** Spieler auf dem Server.`)
	  .setColor('#00cc00')
    .setFooter(footerText, footerIMG)
	  .setTimestamp()
		message.channel.send(embed)
	} else if (args[0] == '/whitelist') {
    if (message.channel.id != '951093978953031700' ||  args.length < 2) return

    let name = args[1]
    if (args.length > 2) {
      for (let i = 2; i < args.length; i++) {
        name += " " + args[i]
      }
    }
    alt.emit('Server:RequestWhitelist', name)
  }
})

// other embeds (mostly used for logs)
alt.on('Discord:Logger:Send', (channel, hexColor, title, msg) => {
  let c = client.channels.cache.get(channel.toString())
  let embed = new Discord.MessageEmbed()
	.setTitle(title)
  .setDescription(msg)
	.setColor(hexColor)
  .setFooter(footerText, footerIMG)
	.setTimestamp()
  c.send(embed)
  allLogChannel.send(embed)
})


// login the client
client.login('OTQ5OTU4Nzg5NzYxNzQ0OTQ2.YiR8EA.q5me_bVyByIZhGg0qpdkZWh4-KU')