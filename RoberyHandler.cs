using AltV.Net;
using AltV.Net.Async;
using AltV.Net.Data;
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
    class RoberyHandler : IScript
    {

        private Position startPoint = new Position(256.1012878417969F, 217.55764770507812F, 106.28685760498047F);
        private Position cutPosition = new Position(261.69293212890625F, 221.93772888183594F, 106.28364562988281F);
        private Position hackPosition = new Position(253.21209716796875F, 228.309326171875F, 101.68325805664062F);
        private Position moneyPosition = new Position(263.78021240234375F, 214.51683044433594F, 101.68345642089844F);

        private Dictionary<IPlayer, int> moneyTaken = new();
        private List<IPlayer> inMoneyCoolown = new();
        private Dictionary<IPlayer, Position> nextInteraction = new();
        private List<IPlayer> inRobery = new();

        private bool bankRobed = false;

        [AsyncClientEvent("Server:BankRobery:PressE")]
        public void OnPressE(IPlayer player)
        {
            if (!inRobery.Contains(player))
            {
                Start(player);
                return;
            }
            Position playerNextInteraction = nextInteraction[player];



            // CUT
            if (playerNextInteraction == cutPosition)
            {
                if (!player.Position.IsInRange(cutPosition, 0.75f))
                {
                    player.SendNotification(3, 5000, "Du bist zuweit entfernt!");
                    return;
                }
                player.EmitLocked("Client:BankRobery:PlayWeldScenario");
                player.SendNotification(1, 5000, "Du schweißt die Tür auf...");
                Main.Invoke(() =>
                {
                    player.Emit("emote:stop");
                    nextInteraction[player] = hackPosition;
                    UpdateColshape(player);
                    Alt.EmitAllClients("Client:BankRobery:OpenFirstDoor");
                    player.SendNotification(1, 5000, "Du hast die Tür aufgeschweißt.");
                    player.SendNotification(1, 5000, "Begebe dich zum nächsten Punkt (orangener Zylinder) und starte die 'Bankraub-Hack' App auf deinem Hackerlaptop.");
                }, 5000);
            }


            // GRAB_MONEY
            else if (playerNextInteraction == moneyPosition)
            {
                if (!player.Position.IsInRange(moneyPosition, 0.75f))
                {
                    player.SendNotification(3, 5000, "Du bist zuweit entfernt!");
                    return;
                }
                if (!moneyTaken.ContainsKey(player))
                {
                    moneyTaken.Add(player, 0);
                }

                if (!inMoneyCoolown.Contains(player))
                {
                    inMoneyCoolown.Add(player);
                    player.EmitLocked("emote:play", "Grab");
                    Main.Invoke(() =>
                    {
                        inMoneyCoolown.Remove(player);
                        CharactersInventory.AddCharacterItem(User.GetPlayerOnline(player), "Schwarzgeld", 2000, "inventory");
                        player.SendNotification(1, 1500, "+2000$");
                        moneyTaken[player] += 2000;
                        if (moneyTaken[player] >= 20000)
                        {
                            player.Emit("Client:BankRobery:End");
                            player.SendNotification(1, 5000, "Du hast alles Geld eingesammelt!");
                            player.SendNotification(1, 5000, "Der Raub ist beendet, jetzt aber schnell raus hier!");
                            inRobery.Remove(player);
                            nextInteraction.Remove(player);
                        }
                    }, 2000);
                }
            }
        }

        [AsyncClientEvent("Server:BankRobery:RequestHack")]
        public void OnBankRoberyHackRequest(IPlayer player)
        {
            if (!nextInteraction.ContainsKey(player)) return;
            if (nextInteraction[player] == hackPosition)
            {
                if (!player.Position.IsInRange(hackPosition, 0.75f))
                {
                    player.SendNotification(3, 5000, "Du bist zuweit entfernt!");
                    return;
                }
                player.Emit("Client:BankRobery:StartHack");
                player.EmitLocked("emote:play", "type");
            }
        }

        [AsyncClientEvent("Server:BankRobery:HackResult")]
        public void OnBankRoberyHackResult(IPlayer player, bool success)
        {
            if (!nextInteraction.ContainsKey(player)) return;
            player.Emit("emote:stop");
            Alt.Log("BANKROBBERY HACK: " + success);
            if (!success)
            {
                nextInteraction[player] = moneyPosition;
                UpdateColshape(player);
                Alt.EmitAllClients("Client:BankRobery:OpenVault");
                player.SendNotification(1, 5000, "Der Tresor wurde geöffnet. Du kannst jetzt Geld sammeln.");
            } else
            {
                player.SendNotification(3, 10000, "Du hast den Hack nicht geschafft! Verschwinde so schnell wie möglich, die Cops sind auf dem Weg!");
                nextInteraction.Remove(player);
                inRobery.Remove(player);
            }
        }

        private void Start(IPlayer player)
        {
            if (!player.Position.IsInRange(startPoint, 0.75f))
            {
                return;
            }
            if (bankRobed)
            {
                player.SendNotification(3, 5000, "Die Bank wurde bereits ausgeraubt! Nach dem nächsten Server-Restart ist er wieder verfügbar.");
                return;
            }
            if (CarStealHandler.GetCopsOnDuty() < 4)
            {
                player.SendNotification(3, 5000, "Es müssen 4 Cops online sein!");
                return;
            }
            int charID = User.GetPlayerOnline(player);
            if (!(CharactersInventory.ExistCharacterItem(charID, "Hacker laptop", "inventory") || CharactersInventory.ExistCharacterItem(charID, "Hacker laptop", "backpack")))
            {
                player.SendNotification(3, 5000, "Du benötigst einen Hackerlaptop, um den Raub zu starten.");
                return;
            }

            bankRobed = true;
            player.SendNotification(1, 5000, "Du hast den Raub gestartet!");
            player.SendNotification(1, 5000, "Begebe dich zum nächsten Punkt (orangener Zylinder) und drücke E.");
            nextInteraction.Add(player, cutPosition);
            UpdateColshape(player);

            // cop notifications
            Alt.GetAllPlayers().ToList().ForEach(onlinePlayer =>
            {
                int charID = User.GetPlayerOnline(onlinePlayer);
                if (ServerFactions.IsCharacterInFactionDuty(charID) && ServerFactions.GetCharacterFactionId(charID) == 2)
                {
                    // onlinePlayer is on duty and in pd faction
                    HUDHandler.SendNotification(onlinePlayer, 3, 10000, "In der Staatsbank wurde ein stiller Alarm ausgelöst!");
                }
            });

            inRobery.Add(player);
        }

        private void UpdateColshape(IPlayer player)
        {
            Position pos = nextInteraction[player];
            player.Emit("Client:BankRobery:DrawColshape", pos.X, pos.Y, pos.Z);
        }

    }
}
