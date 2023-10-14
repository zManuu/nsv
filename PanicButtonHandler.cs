using AltV.Net;
using AltV.Net.Async;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.Resources.Chat.Api;
using Altv_Roleplay.Model;
using Altv_Roleplay.Utils;
using System.Linq;

namespace Altv_Roleplay.Handler
{
    class PanicButtonHandler : IScript
    {

        private Position panicPosition = new Position(0, -1000, 0);

        [ClientEvent("Client:PanicButton")]
        public void UsePanicButton(IPlayer player)
        {
            int charID = User.GetPlayerOnline(player);
            string charName = Characters.GetCharacterName(charID);
            if (ServerFactions.GetCharacterFactionId(charID) == 2 && ServerFactions.IsCharacterInFactionDuty(charID))
            {
                // player is on duty and in pd faction

                var p = player.Position;
                panicPosition = p;
                HUDHandler.SendNotification(player, 1, 5000, "Der Panicbutton wurde betätigt!");
                DiscordLogger.SendMessage(949362133429289041, "ffffff", "Panicbutton", $"Spieler: {Characters.GetCharacterName(charID)}\nx: {p.X}\ny: {p.Y}\nz: {p.Z}");


                // send notifications to all on-duty officers
                Alt.GetAllPlayers().ToList().ForEach(onlinePlayer =>
                {
                    int oCharID = User.GetPlayerOnline(onlinePlayer);
                    if (ServerFactions.IsCharacterInFactionDuty(oCharID) && ServerFactions.GetCharacterFactionId(oCharID) == 2)
                    {
                        // onlinePlayer is on duty and in pd faction and not player
                        HUDHandler.SendNotification(onlinePlayer, 3, 5000, $"Ein Officer hat den Panicbutton betätigt ({charName})! GPS-Punkt setzen: '/pb'!");
                        onlinePlayer.Emit("Server:Audio:Play", "./audio/panicbutton.mp3", 0.75);
                    }
                });
            } else
            {
                HUDHandler.SendNoPermsNotification(player);
            }
        }

        [Command("panicbutton", false, new string[] { "pb" })]
        public void OnPanicbuttonCMD(IPlayer player)
        {
            int charID = User.GetPlayerOnline(player);
            if (ServerFactions.GetCharacterFactionId(charID) == 2 && ServerFactions.IsCharacterInFactionDuty(charID))
            {
                // player is on duty and in pd faction

                if (panicPosition.X == 0 && panicPosition.Y == -1000 && panicPosition.Z == 0)
                {
                    HUDHandler.SendNotification(player, 1, 4000, "Es wurde noch kein Panicbutton gedrückt!");
                    return;
                }

                player.EmitLocked("Server:HUD:SetWaypoint", panicPosition.X, panicPosition.Y);
                HUDHandler.SendNotification(player, 1, 3000, "Die Position wurde in das GPS gesetzt!");
            } else {
                HUDHandler.SendNoPermsNotification(player);
            }

        }
    }
}
