import { Client, Events } from "discord.js";

export const readyEvent = {
  name: Events.ClientReady,
  once: true,

  execute(client: Client): void {
    console.log(`[遷移通行管理局Bot] ${client.user?.tag} 起動完了`);
  },
};
