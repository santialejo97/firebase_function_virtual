import "dotenv/config";
import { join } from "path";
import { readFileSync } from "fs";
import * as chatgpt from "chatgpt";

export class chatGptClass {
  private openia: any;

  constructor() {
    this.init();
  }

  async init() {
    console.log("chatgpt!!!");
    console.log(process.env.CHATGPT_API_TOKEN);
    this.openia = new chatgpt.ChatGPTAPI({
      apiKey: process.env.CHATGPT_API_TOKEN || "",
    });
    console.log("openia", this.openia);
  }

  async chatGpt(body: string) {
    console.log(body);
    console.log("openia", this.openia);
    const interracionChatGPT = await this.openia.sendMessage(body);
    return interracionChatGPT;
  }
}

export async function getPrompt() {
  const pathPrompt = join(process.cwd(), "prompts");
  const text = readFileSync(join(pathPrompt, "MAIN_PROMP.txt"), "utf-8");
  return text;
}
