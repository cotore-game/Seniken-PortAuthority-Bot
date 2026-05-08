import cron from "node-cron";
import { Client, TextChannel } from "discord.js";
import { ENV, buildReportMessage } from "../config";
import { getTodayJoinCount, resetJoinCount } from "../events/guildMemberAdd";

export function scheduleDailyReport(client: Client): void {
  console.log(`[遷移通行管理局Bot] 日次レポートスケジュール設定: ${ENV.reportCron}`);

  cron.schedule(
    ENV.reportCron,
    async () => {
      const count = getTodayJoinCount();
      const message = buildReportMessage(count);

      console.log(`[遷移記録] 日次レポート送信 (本日の遷移抜け: ${count}人)`);

      try {
        if (!ENV.reportChannelId) {
          console.warn("[警告] REPORT_CHANNEL_ID が未設定です");
          return;
        }

        const channel = client.channels.cache.get(ENV.reportChannelId);
        if (!channel?.isTextBased()) {
          console.warn("[警告] レポートチャンネルが見つかりません");
          return;
        }

        await (channel as TextChannel).send(message);
      } catch (err) {
        console.error("[エラー] 日次レポート送信失敗:", err);
      } finally {
        // 送信の成功・失敗に関わらずカウントをリセット
        resetJoinCount();
      }
    },
    { timezone: "Asia/Tokyo" }
  );
}
