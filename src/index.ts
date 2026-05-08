import "dotenv/config";
import { Client, Events, GatewayIntentBits, GuildMember } from "discord.js";
import { ENV } from "./config";
import { readyEvent } from "./events/ready";
import { guildMemberAddEvent } from "./events/guildMemberAdd";
import { scheduleDailyReport } from "./tasks/dailyReport";

if (!ENV.token) {
  console.error("[エラー] DISCORD_TOKEN が設定されていません。.env を確認してください。");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, (c) => readyEvent.execute(c));
client.once(Events.ClientReady, () => scheduleDailyReport(client));

client.on(Events.GuildMemberAdd, (member) =>
  guildMemberAddEvent.execute(member as GuildMember)
);

client.login(ENV.token).catch((err) => {
  console.error("[エラー] ログイン失敗:", err);
  process.exit(1);
});
