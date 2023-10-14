using AltV.Net;
using AltV.Net.Elements.Entities;
using Altv_Roleplay.Model;
using Altv_Roleplay.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altv_Roleplay.Handler
{
    class SeatbeltHandler : IScript
    {

        private static HashSet<IVehicle> registeredVehicles = new();
        private static Dictionary<IVehicle, int> healthMap = new();

        public static void Start()
        {
            Main.InvokeRepeating(() =>
            {
                //Alt.Log(registeredVehicles.Count.ToString());
                IEnumerator<IVehicle> enumerator = registeredVehicles.GetEnumerator();
                while (enumerator.MoveNext())
                {
                    IVehicle veh = enumerator.Current;
                    if (veh == null || !veh.Exists || veh.IsDestroyed)
                    {
                        registeredVehicles.Remove(veh);
                        healthMap.Remove(veh);
                        return;
                    }

                    if (veh.Driver == null) return;

                    healthMap.TryGetValue(veh, out int vehLastHealth);
                    int vehCurrentHealth = veh.EngineHealth;
                    int diff = vehCurrentHealth - vehLastHealth;

                    //if (diff != 0) Alt.Log($"[VEHICLE CRASH] {Characters.GetCharacterName(User.GetPlayerOnline(veh.Driver))}: {diff}");

                    if (diff < -60) // In dem Fall ist -60 die "Stärke", mit dem der Spieler sein Auto crashen muss.
                    {
                        veh.Driver.Emit("Server:Seatbelt:Crash");
                    }

                    healthMap[veh] = vehCurrentHealth;

                }
            }, 100);
        }

        [ScriptEvent(ScriptEventType.PlayerEnterVehicle)]
        public void HandlePlayerEnterVehicleEvent(IVehicle vehicle, IPlayer client, byte seat)
        {
            if (registeredVehicles.Contains(vehicle) || healthMap.ContainsKey(vehicle)) return;
            registeredVehicles.Add(vehicle);
            healthMap.Add(vehicle, vehicle.EngineHealth);
        }

        [ScriptEvent(ScriptEventType.PlayerLeaveVehicle)]
        public void HandlePlayerLeaveVehicleEvent(IVehicle vehicle, IPlayer player, byte seat)
        {
            registeredVehicles.Remove(vehicle);
            healthMap.Remove(vehicle);
        }

    }
}
