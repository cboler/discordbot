import { Message } from "discord.js";
import { http } from "http";

import { BotCommand } from "./command.abstract";
import { IBotMessage, IBot } from "../domains";


/**
 * @api {GET} /commands/echo Echo Command
 * @apiName Echo Command
 * @apiGroup Commands
 * @apiVersion 0.1.0
 */
export default class GetRandomSSTMember extends BotCommand {

    prefix: string = super.prefix;
    bot: IBot = super.bot;

    aliases: string[] = [
      "winner", "randomSST", "SSTRandom", "scapegoat"
    ];

    helpDesc: string = `This gives you a random member of SST according to the discord.gg api.\n`;
    guildId: number = 34645;

    private GetSSTMembers(): void {

        http.get("https://swgoh.gg/api/guild/" + this.guildId + "/", (resp: any) => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", (chunk: any) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
            console.log(JSON.parse(data).explanation);
        });

        }).on("error", (err: any) => {
        console.log("Error: " + err.message);
        });
    }

    public async process(msg: Message, answer: IBotMessage): Promise<void> {
      const args = msg.cleanContent.slice(this.prefix.length).trim().split(/ +/g);
      args.shift();
      answer.setTextOnly(args.join(" "));
    }
  }