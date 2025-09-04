import { GoogleGenAI } from "@google/genai";

const googleai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOGGLE_AI_API_KEY,
});

export class Assistant {
  #chat;

  constructor(model = "gemini-2.5-flash") {
    this.#chat = googleai.chats.create({ model: model, history: [] });
  }

  #parseError(error) {
    try {
      // Extract and parse the outer error JSON from the message string
      const [, outerErrorJSON] = error?.message?.split(" . ");
      const outerErrorObject = JSON.parse(outerErrorJSON);

      // Parse the nested stringified JSON from the outer error
      const innerErrorObject = JSON.parse(outerErrorObject?.error?.message);

      return innerErrorObject?.error;
    } catch (parseError) {
      return error;
    }
  }

  async chat(content) {
    try {
      const result = await this.#chat.sendMessage({ message: content });
      return result.text;
    } catch (error) {
      throw this.#parseError(error);
    }
  }

  async *chatStream(content) {
    try {
      const result = await this.#chat.sendMessageStream({ message: content });

      for await (const chunk of result) {
        yield chunk.text;
      }
    } catch (error) {
      throw this.#parseError(error);
    }
  }
}

// useEffect(()=>{
//   const googleai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOGGLE_AI_API_KEY });
//   const chat = googleai.chats.create({model: "gemini-2.5-flash",history:[]});
//   setGoogleAi(googleai)
//   setChat(chat)
// },[])

// const [googleai,setGoogleAi] = useState({})
// const [chat,setChat] = useState({})
