import "dotenv/config";
import { Client, Events, GatewayIntentBits, GuildMember } from "discord.js";
import { ENV } from "./config";
import { readyEvent } from "./events/ready";
import { guildMemberAddEvent } from "./events/guildMemberAdd";
import { scheduleDailyReport } from "./tasks/dailyReport";

import { Interaction } from "discord.js";
import { editConfigCommand } from "./commands/editConfig";

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

// コマンドのリスト（コマンドが増えたらMapで管理するとO(1)で検索できます）
const commands = [editConfigCommand];

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(c => c.data.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    // 既にリプライ済みの場合は followUp を使うとか？
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "エラーが発生しました。", ephemeral: true });
    } else {
      await interaction.reply({ content: "エラーが発生しました。", ephemeral: true });
    }
  }
});