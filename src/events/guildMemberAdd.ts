import { Events, GuildMember, TextChannel } from "discord.js";
import { ENV, buildWelcomeMessage } from "../config";

let joinCountToday = 0;
let lastResetDate = new Date().toDateString();

export function getTodayJoinCount(): number {
  return joinCountToday;
}

export function resetJoinCount(): void {
  joinCountToday = 0;
  lastResetDate = new Date().toDateString();
}

function checkAndResetIfNeeded(): void {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    resetJoinCount();
  }
}

export const guildMemberAddEvent = {
  name: Events.GuildMemberAdd,

  async execute(member: GuildMember): Promise<void> {
    checkAndResetIfNeeded();
    joinCountToday++;

    console.log(`[遷移記録] ${member.user.tag} が遷移抜けした (本日 ${joinCountToday} 人目)`);

    if (!ENV.welcomeChannelId) {
      console.warn("[警告] WELCOME_CHANNEL_ID が未設定です");
      return;
    }

    const channel = member.guild.channels.cache.get(ENV.welcomeChannelId);
    if (!channel?.isTextBased()) {
      console.warn("[警告] ウェルカムチャンネルが見つかりません");
      return;
    }

    const message = buildWelcomeMessage(member.toString());
    await (channel as TextChannel).send(message);
  },
};
