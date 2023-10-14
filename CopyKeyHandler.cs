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
    class CopyKeyHandler : IScript
    {

        private IColShape Colshape = Alt.CreateColShapeSphere(new Position(173.4745330810547F, -1807.7852783203125F, 27.946741104125977F), 5);
        private int Price = 4133;

        [ScriptEvent(ScriptEventType.ColShape)]
        public void OnEntityColshapeHit(IColShape shape, IEntity entity, bool state)
        {
            if (!state) return;

            if (shape.Equals(Colshape))
            {
                if (entity.GetType() != typeof(IPlayer)) return;
                ((IPlayer)entity).SendNotification(1, 4000, "Um den Schlüssel deines Fahrzeugs zu kopieren, drücke E.");
            }
        }

        [ClientEvent("Server:Keydown:E")]
        public void OnKeyDownE(ClassicPlayer player)
        {
            var charId = player.CharacterId;
            if (!Colshape.IsPlayerIn(player)) return;
            if (!player.IsInVehicle)
            {
                player.SendWarningNotification("Du musst in einem Fahrzeug sein!");
                return;
            }
            ClassicVehicle veh = (ClassicVehicle) player.Vehicle;
            if (veh.GetVehicleId() == 0)
            {
                player.SendWarningNotification("Es scheint, als ob du den Schlüssel dieses Fahrzeuges nicht kopieren kannst!");
                return;
            }
            if (ServerVehicles.GetVehicleOwner(veh) != charId)
            {
                player.SendWarningNotification("Es scheint, als ob du nicht dieses Fahrzeug besitzt!");
                return;
            }
            if (ServerVehicleShops.ServerVehicleShopsItems_.FirstOrDefault(i => i.hash == veh.Model) == null)
            {
                player.SendWarningNotification("Es scheint, als ob du nicht dieses Fahrzeug besitzt!");
                return;
            }
            if (!CharactersInventory.ExistCharacterItem(charId, "Bargeld", "inventory") || CharactersInventory.GetCharacterItemAmount(charId, "Bargeld", "inventory") < Price) { HUDHandler.SendNotification(player, 4, 5000, $"Du hast nicht genügend Bargeld dabei ({Price}$)."); return; }
            CharactersInventory.RemoveCharacterItemAmount(charId, "Bargeld", Price, "inventory");

            CharactersInventory.AddCharacterItem(charId, $"Fahrzeugschluessel {veh.NumberplateText}", 1, "inventory");
            CharactersInventory.RemoveCharacterItemAmount(charId, "Bargeld", 4133, "inventory");
            DiscordLogger.SendMessage(949361939530793031, "Schlüssel Kopieren", $"Spieler: {player.GetName()}\nFahrzeug: {veh.NumberplateText}");
        }

    }
}
