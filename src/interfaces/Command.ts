import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface Command {
  // スラッシュコマンドの定義データ
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  // 実行される処理
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
