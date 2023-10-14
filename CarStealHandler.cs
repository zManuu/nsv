using AltV.Net;
using AltV.Net.Async;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.Enums;
using AltV.Net.Resources.Chat.Api;
using Altv_Roleplay.Factories;
using Altv_Roleplay.Model;
using Altv_Roleplay.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Altv_Roleplay.Handler
{
    class CarStealHandler : IScript
    {

        #region VARS

        private Dictionary<IPlayer, Position> lastSeen = new();
        private Dictionary<IPlayer, List<IPlayer>> inPursiut = new();
        private List<IPlayer> gpsDisabled = new();
        private List<IPlayer> carStolen = new();
        private List<IPlayer> inCooldown = new();
        private Random randomGenerator;
        private Dictionary<IPlayer, IVehicle> stealMap = new();
        private Dictionary<IPlayer, Position> submitMap = new();
        private Position lastReported = new(0, -1000, 0);
        private Dictionary<uint, int> carMap = new()
        {
            // LOWER CLASS
            { (uint) VehicleModel.Sultan, 3000 },
            { (uint) VehicleModel.Kanjo, 3000 },
            { (uint) VehicleModel.Bagger, 3000 },
            { (uint) VehicleModel.Enduro, 3000 },
            { (uint) VehicleModel.Lectro, 3000 },
            { (uint) VehicleModel.Vindicator, 3000 },
            { (uint) VehicleModel.Blade, 3000 },
            { (uint) VehicleModel.Dukes, 3000 },
            { (uint) VehicleModel.Faction, 3000 },
            { (uint) VehicleModel.Impaler, 3000 },
            { (uint) VehicleModel.Picador, 3000 },
            { (uint) VehicleModel.SlamVan, 3000 },
            { (uint) VehicleModel.Yosemite, 3000 },
            { (uint) VehicleModel.Voodoo, 3000 },
            { (uint) VehicleModel.BfInjection, 3000 },
            { (uint) VehicleModel.Rebel2, 3000 },
            { (uint) VehicleModel.Mesa, 3000 },
            { (uint) VehicleModel.Fugitive, 3000 },
            { (uint) VehicleModel.Surge, 3000 },
            { (uint) VehicleModel.Blista2, 3000 },
            { (uint) VehicleModel.Tailgater, 3000 },
            { (uint) VehicleModel.Warrener, 3000 },
            { (uint) VehicleModel.Brioso, 3000 },
            { (uint) VehicleModel.Prairie, 3000 }

            // SUPER
        };
        private Position[] startPositions = new Position[]
        {
            new Position(-7.637840270996094F, 5.571832180023193F, 71.14166259765625F),
            new Position(-961.5670166015625F, 109.93437194824219F, 56.30821228027344F),
            new Position(-1047.31103515625F, 220.4989471435547F, 63.76625061035156F),
            new Position(-1015.4293212890625F, 359.74237060546875F, 70.63660430908203F),
            new Position(-979.814208984375F, 516.177734375F, 81.47128295898438F),
            new Position(-1111.70458984375F, 478.6293640136719F, 82.16075897216797F),
            new Position(-7.637840270996094F, 5.571832180023193F, 71.14166259765625F),
            new Position(-1246.5380859375F, 384.0397644042969F, 75.40141296386719F),
            new Position(-1567.7987060546875F, -76.83351135253906F, 54.134315490722656F),
            new Position(-1894.7451171875F, -336.4112548828125F, 49.24070358276367F),
            new Position(-1881.36572265625F, -306.9451599121094F, 49.22087478637695F),
            new Position(-1857.020751953125F, 326.0598449707031F, 88.68722534179688F),
            new Position(-1793.8748779296875F, 350.25933837890625F, 88.5594482421875F),
            new Position(-1666.54296875F, 389.8608703613281F, 89.24454498291016F),
            new Position(-1541.6475830078125F, 428.1636657714844F, 109.35243225097656F),
            new Position(-1284.37060546875F, 647.22216796875F, 139.54833984375F),
            new Position(-888.7146606445312F, 367.46337890625F, 85.03223419189453F),
            new Position(-806.463623046875F, 424.73309326171875F, 91.57854461669922F),
            new Position(-688.7713012695312F, 499.5205383300781F, 110.00486755371094F),
            new Position(-409.3690185546875F, 559.0043334960938F, 124.25543975830078F),
            new Position(-77.21819305419922F, 496.8675842285156F, 144.42662048339844F),
            new Position(174.08619689941406F, 482.39544677734375F, 142.2759246826172F),
            new Position(227.47079467773438F, 681.3739013671875F, 189.54368591308594F),
            new Position(-676.9500732421875F, 903.7945556640625F, 230.5780029296875F),
            new Position(-1982.7847900390625F, 602.5406494140625F, 118.30412292480469F),
            new Position(-1565.880126953125F, -1017.2599487304688F, 13.018213272094727F),
            new Position(-1558.8223876953125F, -1000.8607788085938F, 13.018074035644531F),
            new Position(-1548.68994140625F, -997.0536499023438F, 13.017810821533203F),
            new Position(-733.1211547851562F, -285.6160583496094F, 36.94873046875F),
            new Position(-788.7092895507812F, -198.12889099121094F, 37.2836799621582F),
            new Position(-834.072998046875F, -396.3326110839844F, 31.325252532958984F),
            new Position(-727.039794921875F, -410.8553771972656F, 35.05056381225586F),
            new Position(-12.3599271774292F, -314.33111572265625F, 45.4385871887207F)
        };
        private Position[] submitPositions = new Position[]
        {
            new Position(-274.2611999511719F, 199.81703186035156F, 85.6835708618164F),
            new Position(-1207.40478515625F, -1067.370849609375F, 8.292211532592773F),
            new Position(-1180.27783203125F, -1121.4654541015625F, 5.689668655395508F),
            new Position(-1157.38037109375F, -1125.2227783203125F, 2.388742685317993F),
            new Position(-1110.7252197265625F, -1241.7354736328125F, 2.406102418899536F),
            new Position(-1127.06103515625F, -1611.250732421875F, 4.398576259613037F),
            new Position(-1148.487548828125F, -1563.9212646484375F, 4.402756214141846F),
            new Position(-625.6549682617188F, -1647.072265625F, 25.825016021728516F),
            new Position(-454.6228942871094F, -1721.3740234375F, 18.695255279541016F),
            new Position(-345.4862976074219F, -1571.7685546875F, 25.228391647338867F),
            new Position(-222.002197265625F, -1360.7037353515625F, 31.258445739746094F),
            new Position(-52.49543762207031F, -1417.889404296875F, 29.32630729675293F),
            new Position(828.690673828125F, -805.156982421875F, 26.236858367919922F),
            new Position(676.05224609375F, -843.565185546875F, 23.506959915161133F),
            new Position(856.5738525390625F, -890.1773681640625F, 25.41322898864746F),
            new Position(849.8390502929688F, -957.7094116210938F, 26.282434463500977F),
            new Position(893.8228149414062F, -1048.996337890625F, 32.828033447265625F),
            new Position(717.8501586914062F, -1063.398193359375F, 22.1567440032959F),
            new Position(727.4536743164062F, -1288.2073974609375F, 26.28382682800293F),
            new Position(828.9442138671875F, -1410.318359375F, 26.159730911254883F),
            new Position(839.011962890625F, -2185.921630859375F, 30.307828903198242F),
            new Position(521.542724609375F, -2121.325927734375F, 5.985125541687012F),
            new Position(186.3231201171875F, -2186.472412109375F, 6.708795070648193F),
            new Position(157.14805603027344F, -1694.945556640625F, 29.449153900146484F)
        };

        #endregion

        [ClientEvent("Server:CarSteal:MenuClick")]
        public void OnMenuClick(IPlayer player, string text)
        {
            try
            {
                if (randomGenerator == null)
                {
                    randomGenerator = new Random();
                    Main.InvokeRepeating(() =>
                    {

                        IEnumerator<IPlayer> enumerator = stealMap.Keys.GetEnumerator();
                        while(enumerator.MoveNext())
                        {
                            IPlayer crntPlayer = enumerator.Current;
                            if (!gpsDisabled.Contains(crntPlayer))
                            {
                                lastSeen[crntPlayer] = stealMap[crntPlayer].Position;
                            }
                            inPursiut.Keys.ToList().ForEach(cop => Extensions.SetWaypoint(cop, lastSeen[crntPlayer]));
                        }

                    }, 1000);
                }
                switch (text)
                {
                    case "Starten":
                        Start(player);
                        break;
                    case "Beenden":
                        Stop(player);
                        break;
                    case "Abliefern":
                        Submit(player);
                        break;
                    case "GpsHack":
                        HackGps(player);
                        break;
                }
            } catch (Exception e) { Console.Out.Write(e.Message); }
        }

        [Command("carsteal")]
        public void OnCarstealCommand(IPlayer player)
        {
            CopInfo(player);
        }

        private async Task Start(IPlayer player)
        {
            if (!stealMap.ContainsKey(player))
            {
                if (inCooldown.Contains(player))
                {
                    HUDHandler.SendNotification(player, 3, 5000, "Du kannst nur alle 30 Minuten einen Raub starten!");
                    return;
                }

                gpsDisabled.Remove(player);
                inCooldown.Add(player);
                Main.Invoke(() => { inCooldown.Remove(player); }, 1800000); // 1800000ms = 30min

                int carIndex = randomGenerator.Next(carMap.Count);
                int startIndex = randomGenerator.Next(startPositions.Length);
                int submitIndex = randomGenerator.Next(submitPositions.Length);
                var altVeh = await AltAsync.CreateVehicle(carMap.Keys.ElementAt(carIndex), startPositions[startIndex], Rotation.Zero);
                altVeh.LockState = VehicleLockState.LockedCanBeDamaged;
                altVeh.NumberplateText = new Random().Next(111, 99999).ToString();
                stealMap.Add(player, altVeh);
                submitMap.Add(player, submitPositions[submitIndex]);
                lastSeen.Add(player, altVeh.Position);
                Extensions.SetWaypoint(player, startPositions[startIndex]);
                HUDHandler.SendNotification(player, 1, 5000, "Das Auto wurde auf dem GPS makiert!");
                lastReported = startPositions[startIndex];

                string charName = Characters.GetCharacterName(User.GetPlayerOnline(player));
                DiscordLogger.SendMessage(DiscordChannels.CARSTEAL, "#40DC48", "CarSteal", $"{charName} hat einen CarSteal gestartet!");

                Alt.GetAllPlayers().ToList().ForEach(onlinePlayer =>
                {
                    int charID = User.GetPlayerOnline(onlinePlayer);
                    if (ServerFactions.IsCharacterInFactionDuty(charID) && ServerFactions.GetCharacterFactionId(charID) == 2)
                    {
                        // onlinePlayer is on duty and in pd faction
                        HUDHandler.SendNotification(onlinePlayer, 1, 10000, $"Autodiebe haben es auf das Auto mit dem Nummernschild '{altVeh.NumberplateText}' abgesehen! Nutze '/carsteal', um die Position als GPS zu setzen!");
                    }
                });
            }
            else
            {
                HUDHandler.SendNotification(player, 3, 5000, "Du bist bereits in der Mission! Nutze '/stopcarsteal', um den Raub abzubrechen!");
            }
        }

        private void CopInfo(IPlayer player)
        {
            int charID = User.GetPlayerOnline(player);
            if (ServerFactions.IsCharacterInFactionDuty(charID) && ServerFactions.GetCharacterFactionId(charID) == 2)
            {
                // player is on duty and in pd faction

                if (lastReported.X == 0 && lastReported.Y == -1000 && lastReported.Z == 0)
                {
                    HUDHandler.SendNotification(player, 3, 5000, "Es ist noch kein Autodiebstahl gemeldet worden!");
                    return;
                }

                Extensions.SetWaypoint(player, lastReported);
            } else
            {
                HUDHandler.SendNoPermsNotification(player);
            }
        }

        private void Stop(IPlayer player)
        {
            try
            {
                if (!stealMap.ContainsKey(player))
                {
                    HUDHandler.SendNotification(player, 3, 3000, "Du bist nicht in der Mission! ('/carsteal')");
                    return;
                }

                IVehicle vehicle;
                stealMap.TryGetValue(player, out vehicle);

                if (vehicle != null && vehicle.Exists)
                {
                    vehicle.RemoveAsync();
                }

                stealMap.Remove(player);
                submitMap.Remove(player);
                player.EmitLocked("Server:CarSteal:RemoveColshape");
                HUDHandler.SendNotification(player, 1, 5000, "Der Raub wurde abgebrochen!");

                string charName = Characters.GetCharacterName(User.GetPlayerOnline(player));
                DiscordLogger.SendMessage(DiscordChannels.CARSTEAL, "#C44444", "CarSteal", $"{charName} hat einen CarSteal gestoppt!");

            } catch (Exception e) { Alt.LogError(e.Message); }
        }

        [ScriptEvent(ScriptEventType.PlayerEnterVehicle)]
        public void HandleVehicleEnter(IVehicle vehicle, IPlayer player, byte seat)
        {
            try
            {
                if (!stealMap.ContainsKey(player)) return;

                IVehicle playerMissionVeh;
                stealMap.TryGetValue(player, out playerMissionVeh);

                if (vehicle == playerMissionVeh)
                {
                    if (!carStolen.Contains(player))
                    {

                        carStolen.Add(player);
                        Main.Invoke(() =>
                        {
                            if (stealMap.ContainsKey(player))
                            {
                                // Player still is in mission
                                playerMissionVeh.RemoveAsync();
                                carStolen.Remove(player);
                                gpsDisabled.Remove(player);
                                stealMap.Remove(player);
                                submitMap.Remove(player);
                                player.EmitLocked("Server:CarSteal:RemoveColshape");
                                HUDHandler.SendNotification(player, 1, 5000, "Deine Zeit für die Ablieferung ist abgelaufen!");

                                string charName = Characters.GetCharacterName(User.GetPlayerOnline(player));
                                DiscordLogger.SendMessage(DiscordChannels.CARSTEAL, "#C44444", "CarSteal", $"{charName} hat den CarSteal nicht geschafft!");
                            }
                        }, 300000);
                        HUDHandler.SendNotification(player, 1, 7000, "Du hast 5 Minuten, um das Auto abzuliefern!");

                        string charName = Characters.GetCharacterName(User.GetPlayerOnline(player));
                        DiscordLogger.SendMessage(DiscordChannels.CARSTEAL, "#40DC48", "CarSteal", $"{charName} hat das Auto betreten!");
                    }

                    Position submitPos;
                    submitMap.TryGetValue(player, out submitPos);

                    Extensions.SetWaypoint(player, submitPos);
                    player.EmitLocked("Server:CarSteal:CreateColshape", submitPos.X, submitPos.Y, submitPos.Z);
                    HUDHandler.SendNotification(player, 1, 5000, "Der Abgabeort wurde auf dem GPS makiert!");
                }
            } catch (Exception e) { Alt.LogError(e.Message); }
        }

        private void Submit(IPlayer player)
        {
            try
            {
                if (!stealMap.ContainsKey(player)) return;

                IVehicle playerMissionVeh;
                stealMap.TryGetValue(player, out playerMissionVeh);

                Position submitPos;
                submitMap.TryGetValue(player, out submitPos);
                if (player.Vehicle != null && player.Vehicle.Exists && player.Vehicle == playerMissionVeh && player.Position.Distance(submitPos) < 10)
                {
                    int take;
                    carMap.TryGetValue(playerMissionVeh.Model, out take);
                    if (GetCopsOnDuty() < 1)
                    {
                        take /= 2; // When there is only 1 or no cop on duty, the take is the half or the normal take
                    }
                    CharactersInventory.AddCharacterItem(User.GetPlayerOnline(player), "Schwarzgeld", take, "inventory");
                    HUDHandler.SendNotification(player, 1, 4000, "Du hast " + take + "$ für das Auto bekommen!");

                    player.Vehicle.RemoveAsync();
                    stealMap.Remove(player);
                    submitMap.Remove(player);
                    gpsDisabled.Remove(player);
                    player.EmitLocked("Server:CarSteal:RemoveColshape");

                    string charName = Characters.GetCharacterName(User.GetPlayerOnline(player));
                    DiscordLogger.SendMessage(DiscordChannels.CARSTEAL, "#40DC48", "CarSteal", $"{charName} hat den CarSteal erfolgreich beendet!");
                }
            } catch (Exception e) { Alt.LogError(e.Message); }
        }

        private void HackGps(IPlayer player)
        {
            if (gpsDisabled.Contains(player))
            {
                player.SendNotification(3, 5000, "Das Auto hat kein GPS-Signal.");
                return;
            }
            player.Emit("Client:CarSteal:StartHack");
        }

        [ClientEvent("Server:CarSteal:HackResult")]
        public void OnHackResult(IPlayer player, bool result)
        {
            if (!stealMap.ContainsKey(player)) return;

            if (result)
                gpsDisabled.Add(player);
        }

        [ScriptEvent(ScriptEventType.PlayerDisconnect)]
        public void OnPlayerDisconnect(IPlayer player, string reason)
        {
            if (stealMap.ContainsKey(player))
            {
                stealMap.TryGetValue(player, out var veh);
                veh.RemoveAsync();
                stealMap.Remove(player);
                submitMap.Remove(player);
                carStolen.Remove(player);
                gpsDisabled.Remove(player);
                inPursiut.Remove(player);

                string charName = Characters.GetCharacterName(User.GetPlayerOnline(player));
                DiscordLogger.SendMessage(DiscordChannels.CARSTEAL, "#C44444", "CarSteal", $"{charName} hat den Server während der Mission verlassen!");
            }
        }

        public static int GetCopsOnDuty()
        {
            int cops = 0;
            Alt.GetAllPlayers().ToList().ForEach(onlinePlayer =>
            {
                int charID = User.GetPlayerOnline(onlinePlayer);
                if (ServerFactions.IsCharacterInFactionDuty(charID) && ServerFactions.GetCharacterFactionId(charID) == 2)
                {
                    cops++;
                }
            });
            return cops;
        }

    }
}
