using AltV.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altv_Roleplay.Utils
{
    public class DiscordLogger : IScript
    {

        public static void SendMessage(long channel, string hexColor, string title, string msg) => Alt.Emit("Discord:Logger:Send", channel, hexColor, title, msg);
        public static void SendMessage(long channel, string title, string msg) => SendMessage(channel, "#ffffff", title, msg);

    }

    public class DiscordChannels
    {

        public static long CARSTEAL = 883685155108159488;

    }

}
