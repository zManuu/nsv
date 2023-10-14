using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.Resources.Chat.Api;
using Altv_Roleplay.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altv_Roleplay.Handler
{
    class DragHandler : IScript
    {

        private const float radius = 3.5f;
        private Dictionary<IPlayer, IPlayer> dragMap = new Dictionary<IPlayer, IPlayer>();

        [Command("drag", true, new string[] { "carry" })]
        public void OnDragCommand(IPlayer player)
        {
            if (!dragMap.ContainsKey(player))
            {
                IPlayer target = Alt.GetAllPlayers().FirstOrDefault(t => t != player && t.Position.Distance(player.Position) <= radius);
                if (target != null && target.Exists)
                {
                    target.AttachToEntity(player, 0, 0, new Position(0.5f, 0.5f, 0f), new Rotation(0, 0, 0), true, false);
                    dragMap.Add(player, target);
                    DiscordLogger.SendMessage(949362133429289041, "Carry", $"{player.GetName()} trägt jetzt {target.GetName()}.");
                }
            } else
            {
                IPlayer target;
                dragMap.TryGetValue(player, out target);
                if (target != null && target.Exists)
                {
                    target.Detach();
                    dragMap.Remove(player);
                    DiscordLogger.SendMessage(949362133429289041, "Carry", $"{player.GetName()} trägt jetzt nicht mehr {target.GetName()}.");
                }
            }
        }

        [ScriptEvent(ScriptEventType.PlayerDead)]
        public void OnPlayerDeath(IPlayer player, IPlayer killer, uint weaponHash)
        {
            if (dragMap.ContainsKey(player))
            {
                IPlayer target;
                dragMap.TryGetValue(player, out target);
                if (target != null && target.Exists)
                {
                    Alt.Log($"{player.Name} ist gestorben während er {target.Name} trug!");
                    target.Detach();
                    dragMap.Remove(player);
                }
            }
        }

    }
}
