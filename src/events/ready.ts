import { Client, Events } from "discord.js";

export const readyEvent = {
  name: Events.ClientReady,
  once: true,

  execute(client: Client): void {
    console.log(`[遷移圏Bot] ${client.user?.tag} として起動完了`);
    console.log(`[遷移圏Bot] 遷移通信状況：良好 ▮▮▮▮▮`);
  },
};
