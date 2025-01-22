import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
}

export const createRunStreamUseCase = async (openai: OpenAI, options: Options) => {
    const { threadId, assistantId = process.env.OPENAI_ASSISTANT_ID } = options;

    return await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        stream: true
    });

}