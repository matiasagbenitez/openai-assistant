import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
    const { threadId, assistantId = process.env.OPENAI_ASSISTANT_ID } = options;

    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId
    });

    return run;
}