using AltV.Net;
using AltV.Net.Async;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.Enums;
using Altv_Roleplay.Model;
using Altv_Roleplay.Utils;
using System;
using System.Collections.Generic;

namespace Altv_Roleplay.Handler
{
    class TruckerHandler : IScript
    {

        #region VARS

        private IColShape StartColshape = Alt.CreateColShapeSphere(new Position(1003.8782958984375F, -2529.2333984375F, 28.454124450683594F), 5.0f);
        private Position Spawn_Truck = new Position(973.9888305664062F, -2545.46044921875F, 28.301982879638672F);
        private Position Spawn_Load = new Position(983.7313842773438F, -2545.89404296875F, 30F);
        private Rotation Spawn_Rotation = new Rotation(0, 0, 45);
        private IColShape Deliver_Sandy = Alt.CreateColShapeSphere(new Position(1980.7576904296875F, 3778.255615234375F, 32.18092346191406F), 15.0f);

        private VehicleModel[] TrailerModels = new VehicleModel[]
        {
            VehicleModel.TvTrailer,
            VehicleModel.Tanker,
            VehicleModel.Tanker2,
            VehicleModel.TrailerLogs,
            VehicleModel.Trailers,
            VehicleModel.Trailers2,
            VehicleModel.Trailers3,
            VehicleModel.Trailers4
        };
        private Dictionary<IPlayer, IVehicle> TrucksInUse = new();
        private Dictionary<IPlayer, IVehicle> LoadsInUse = new();

        #endregion

        [ScriptEvent(ScriptEventType.ColShape)]
        public void OnEntityColshapeHit(IColShape shape, IEntity entity, bool state)
        {
            if (!state) return;
            

            if (shape.Equals(StartColshape))
            {
                if (entity.GetType() != typeof(IPlayer)) return;
                ((IPlayer)entity).SendNotification(1, 4000, "Um den Trucker-Job zu starten, drücke E.");
            } else if (shape.Equals(Deliver_Sandy))
            {
                if (entity.GetType() != typeof(IVehicle)) return;
                ((IVehicle)entity).Driver.SendNotification(1, 4000, "Um die Ware abzuliefern, drücke E.");
            }

        }

        [ClientEvent("Server:TruckerJob:PressE")]
        public void OnEPress(IPlayer player)
        {
            if (TrucksInUse.ContainsKey(player))
            {
                if (StartColshape.IsPlayerIn(player))
                {
                    IVehicle t = TrucksInUse[player];
                    IVehicle tr = LoadsInUse[player];
                    TrucksInUse.Remove(player);
                    LoadsInUse.Remove(player);
                    t.RemoveAsync();
                    tr.RemoveAsync();
                    player.SendNotification(1, 5000, "Du hast den Trucker Minijob abgebrochen. Du kannst ihn jederzeit wieder starten.");

                    return;
                }
                if (!Deliver_Sandy.IsPlayerIn(player)) return;
                if (!Deliver_Sandy.IsVehicleIn(TrucksInUse[player]))
                {
                    player.SendNotification(3, 5000, "Der Truck befindet sich nicht in der Ablade-Zone.");
                    Extensions.SetWaypoint(player, Deliver_Sandy.Position.X, Deliver_Sandy.Position.Y);
                    return;
                }
                if (!Deliver_Sandy.IsVehicleIn(LoadsInUse[player]))
                {
                    player.SendNotification(3, 5000, "Der Anhänger befindet sich nicht in der Ablade-Zone.");
                    Extensions.SetWaypoint(player, Deliver_Sandy.Position.X, Deliver_Sandy.Position.Y);
                    return;
                }

                player.SendNotification(1, 10000, "Die Ware wurde abgeliefert. Du bekommst 400$ als Lohn.");
                player.SendNotification(1, 10000, "Um zurück in die Stadt zu kommen, kannst du dir ein Motorrad mieten (/rent) oder per Twitter eine Mitfahrgelegenheit suchen (/twt).");
                CharactersInventory.AddCharacterItem(User.GetPlayerOnline(player), "Bargeld", 400, "inventory");

                IVehicle veh1 = TrucksInUse[player];
                IVehicle veh2 = LoadsInUse[player];
                TrucksInUse.Remove(player);
                LoadsInUse.Remove(player);
                veh1.RemoveAsync();
                veh2.RemoveAsync();

                return;
            }
            if (!StartColshape.IsPlayerIn(player)) return;

            Random r = new Random();
            string numberPlateText = r.Next(111, 99999).ToString();
            VehicleModel trailerModel = TrailerModels[r.Next(TrailerModels.Length)];
            IVehicle truck = Alt.CreateVehicle(VehicleModel.Packer, Spawn_Truck, Spawn_Rotation);
            IVehicle load = Alt.CreateVehicle(trailerModel, Spawn_Load, Spawn_Rotation);
            truck.NumberplateText = numberPlateText;
            load.NumberplateText = numberPlateText;

            player.SendNotification(1, 10000, "Steige in den Truck, kopple die Ladung an und fahre zum GPS-Signal.");
            Extensions.SetWaypoint(player, Deliver_Sandy.Position);

            TrucksInUse.Add(player, truck);
            LoadsInUse.Add(player, load);
        }


    }
}