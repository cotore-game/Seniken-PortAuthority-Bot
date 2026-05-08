// src/commands/editConfig.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../interfaces/Command";
import { loadConfig, saveConfig, BotConfig } from "../config";

export const editConfigCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("edit-config")
    .setDescription("Botのメッセージ設定を変更します")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // 管理者限定
    .addStringOption(option =>
      option.setName("target")
        .setDescription("変更するメッセージ")
        .setRequired(true)
        .addChoices(
          { name: "ウェルカムメッセージ", value: "welcomeMessage" },
          { name: "日次レポート", value: "dailyReport" }
        )
    )
    .addStringOption(option =>
      option.setName("text")
        .setDescription("新しいメッセージ（\\n と入力すると改行されます）")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getString("target", true) as keyof BotConfig;
    // Discordの入力文字列 "A\nB" を実際の改行コードに変換o
    const text = interaction.options.getString("text", true).replace(/\\n/g, "\n");

    try {
      const config = loadConfig();
      config[target].template = text;
      saveConfig(config);

      await interaction.reply({ content: `設定を更新しました。\n**${target}**:\n${text}`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "設定の保存中にエラーが発生しました。", ephemeral: true });
    }
  }
};
