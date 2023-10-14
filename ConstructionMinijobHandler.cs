using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using Altv_Roleplay.Factories;
using Altv_Roleplay.Model;
using Altv_Roleplay.models;
using Altv_Roleplay.Utils;
using System.Collections.Generic;

namespace Altv_Roleplay.Handler
{
    class ConstructionMinijobHandler : IScript
    {

        private List<IPlayer> PlayersInMinijob = new();
        private Dictionary<IPlayer, int> PlayerProgress = new();
        private IColShape StartColshape = Alt.CreateColShapeSphere(new Position(1155.1669921875F, 2111.60791015625F, 54.74633026123047F), 5);
        private Server_Minijobs_Construction_Spots[] Spots = new Server_Minijobs_Construction_Spots[]
        {
            new Server_Minijobs_Construction_Spots()
            {
                Colshape = Alt.CreateColShapeSphere(new Position(1105.7288818359375F, 2198.6201171875F, 47.809959411621094F), 2),
                Animation = "mechanic",
                Time = 6000
            },
            new Server_Minijobs_Construction_Spots()
            {
                Colshape = Alt.CreateColShapeSphere(new Position(1069.75146484375F, 2293.781494140625F, 50.91432571411133F), 2),
                Animation = "mechanic 4",
                Time = 6000
            },
            new Server_Minijobs_Construction_Spots()
            {
                Colshape = Alt.CreateColShapeSphere(new Position(1042.406494140625F, 2495.873291015625F, 48.44255828857422F), 2),
                Animation = "push",
                Time = 15000
            },
            new Server_Minijobs_Construction_Spots()
            {
                Colshape = Alt.CreateColShapeSphere(new Position(1095.9765625F, 2395.300048828125F, 52.909446716308594F), 2),
                Animation = "think",
                Time = 3000
            },
            new Server_Minijobs_Construction_Spots()
            {
                Colshape = Alt.CreateColShapeSphere(new Position(1005.6410522460938F, 2370.8203125F, 54.566898345947266F), 2),
                Animation = "knock 2",
                Time = 10000
            },
            new Server_Minijobs_Construction_Spots()
            {
                Colshape = Alt.CreateColShapeSphere(new Position(1004.3673095703125F, 2351.144775390625F, 54.566898345947266F), 2),
                Animation = "out of breath",
                Time = 7000
            }
        };

        [ScriptEvent(ScriptEventType.ColShape)]
        public void OnColshape(IColShape colShape, IEntity targetEntity, bool state)
        {
            if (!state) return;
            if (!typeof(IPlayer).IsInstanceOfType(targetEntity)) return;

            var player = (ClassicPlayer)(targetEntity);
            if (colShape.Equals(StartColshape))
            {
                player.SendNotification(1, 5000, "Um den Minijob zu starten (/ihn abzubrechen), drücke E.");
                return;
            }

            if (!PlayersInMinijob.Contains(player)) return;

            var currentSpot = Spots[PlayerProgress[player]];
            if (currentSpot.Colshape.IsPlayerIn(player))
            {
                // player entered his work colshape
                player.ToggleGameControls(false);
                player.PlayAnimation(currentSpot.Animation);
                player.SendNotification(1, currentSpot.Time, "Du führst einen Arbeitsauftrag aus...");

                Main.Invoke(() =>
                {
                    player.ToggleGameControls(true);
                    player.ClearAnimation();

                    if (PlayerProgress[player] == Spots.Length - 1)
                    {
                        player.SendNotification(1, 5000, "Du hast den Minijob abgeschlossen und erhälst deinen Lohn.");
                        CharactersInventory.AddCharacterItem(User.GetPlayerOnline(player), "Bargeld", 100, "inventory");
                        return;
                    }

                    PlayerProgress[player] += 1;
                    RefreshTask(player);
                }, currentSpot.Time);
            }

        }

        [ClientEvent("Server:Keydown:E")]
        public void OnEPress(IPlayer player)
        {
            if (!StartColshape.IsPlayerIn(player)) return;

            if (PlayersInMinijob.Contains(player))
            {
                // player stops minijob
                PlayersInMinijob.Remove(player);
                PlayerProgress.Remove(player);
                player.SendNotification(1, 5000, "Du hast den Minijob abgebrochen.");
                return;
            }

            PlayersInMinijob.Add(player);
            PlayerProgress.Add(player, 0);
            player.SendNotification(1, 5000, "Du hast den Minijob gestartet.");
            RefreshTask(player);
        }

        private void RefreshTask(IPlayer player)
        {
            var stage = Spots[PlayerProgress[player]];
            player.SetWaypoint(stage.Colshape.Position.X, stage.Colshape.Position.Y);
            player.SendNotification(1, 5000, "Bitte begebe dich zur nächsten Arbeitsstelle.");
        }

    }
}
