import OpenAI from "openai";

interface Options {
    threadId: string;
}

export const getMessageListUseCase = async (openai: OpenAI, options: Options) => {
    const { threadId } = options;

    const list = await openai.beta.threads.messages.list(threadId, {
        limit: 100
    });

    const messages = list.data.map(message => ({
        role: message.role,
        content: message.content.map(content => (content as any).text.value)
    }));

    return messages.reverse();
};