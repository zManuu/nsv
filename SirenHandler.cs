using AltV.Net;
using AltV.Net.Elements.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altv_Roleplay.Handler
{
    class SirenHandler : IScript
    {

        private List<IVehicle> mutedVehicles = new();

        [ClientEvent("Client:ToggleSiren")]
        public void ToggleSiren(IPlayer player, IVehicle vehicle)
        {
            if (mutedVehicles.Contains(vehicle))
            {
                // siren is now unmuted
                mutedVehicles.Remove(vehicle);
                Alt.EmitAllClients("Server:ToggleSiren", vehicle, false);
            } else
            {
                // siren is now muted
                mutedVehicles.Add(vehicle);
                Alt.EmitAllClients("Server:ToggleSiren", vehicle, true);
            }
        }

    }
}
