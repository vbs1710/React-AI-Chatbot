import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export class Assistant {
    #client;
    #model;

    constructor(model = "gpt-4.1", client = openai) {
        this.#client = client;
        this.#model = model;
    }

    #parseError(error) {
        return error;
    }

    async chat(content, history) {
        try {
            const result = await openai.responses.create({
                model: this.#model,
                input: [...history, { content, role: "user" }]
            });

            return result.output_text;
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    async *chatStream(content, history) {
        try {
            const result = await this.#client.responses.create({
                model: this.#model,
                input: [...history, { content, role: "user" }],
                stream:true
            })

            for await (const chunk of result) {
                yield chunk.output_text.delta || "";
            }
        } catch (error) {
            throw this.#parseError(error);
        }
    }
}