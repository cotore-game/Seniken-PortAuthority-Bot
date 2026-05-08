import fs from "fs";
import path from "path";

export const ENV = {
  token: process.env.DISCORD_TOKEN ?? "",
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID ?? "",
  reportChannelId: process.env.REPORT_CHANNEL_ID ?? "",
  reportCron: process.env.REPORT_CRON ?? "0 23 * * *",
} as const;

interface BotConfig {
  welcomeMessage: { template: string; comment: string };
  dailyReport: { template: string; comment: string };
}

const CONFIG_PATH = path.join(__dirname, "../data/config.json");

export function loadConfig(): BotConfig {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(raw) as BotConfig;
}

export function buildWelcomeMessage(userMention: string): string {
  const config = loadConfig();
  return config.welcomeMessage.template.replace("{user}", userMention);
}

export function buildReportMessage(count: number): string {
  const config = loadConfig();
  const date = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return config.dailyReport.template
    .replace("{date}", date)
    .replace("{count}", String(count));
}
