using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using Altv_Roleplay.Factories;
using Altv_Roleplay.Model;
using Altv_Roleplay.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altv_Roleplay.Handler
{
    class CameraHandler : IScript
    {

        public IColShape PDCol = Alt.CreateColShapeSphere(new Position(837.1675415039062F, -1290.5068359375F, 27.233169555664062F), 3);
        private List<IPlayer> PlayersInCam = new List<IPlayer>();

        [ScriptEvent(ScriptEventType.ColShape)]
        public void OnColshape(IColShape colShape, IEntity targetEntity, bool state)
        {
            if (!state) return;
            if (!typeof(IPlayer).IsInstanceOfType(targetEntity)) return;

            var player = (ClassicPlayer)(targetEntity);
            if (colShape.Equals(PDCol))
            {
                player.SendNotification(1, 5000, "Um auf die Kameras zu zugreifen, drücke E.");
                return;
            }

        }

        [ClientEvent("Server:Keydown:E")]
        public void OnEPressed(IPlayer player)
        {
            if (PDCol.IsPlayerIn(player) && !PlayersInCam.Contains(player))
            {
                var charID = User.GetPlayerOnline(player);
                if (ServerFactions.GetCharacterFactionId(charID) == 2 && ServerFactions.IsCharacterInFactionDuty(charID))
                    player.Emit("Client:Camera:OpenMenu");
                else
                    player.SendNotification(3, 5000, "Keine Berechtigung!");
            }
        }


        [ClientEvent("Server:Camera:SetPlayerState")]
        public void OnPlayerEntersCam(IPlayer player, bool state, string camName)
        {
            if (state)
            {
                PlayersInCam.Add(player);
                DiscordLogger.SendMessage(949362133429289041, "#ffffff", "LSPD-Kameras", $"{Characters.GetCharacterName(User.GetPlayerOnline(player))} die Kamera {camName} betreten.");
            }
            else
            {
                PlayersInCam.Remove(player);
                DiscordLogger.SendMessage(949362133429289041, "#ffffff", "LSPD-Kameras", $"{Characters.GetCharacterName(User.GetPlayerOnline(player))} hat eine Kamera verlassen.");
            }
        }

    }
}
