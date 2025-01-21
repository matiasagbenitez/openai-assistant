import OpenAI from "openai";

interface Options {
    messageId: string;
    threadId: string;
}

export const getNewMessagesUseCase = async (openai: OpenAI, options: Options) => {
    const { messageId, threadId } = options;

    const list = await openai.beta.threads.messages.list(threadId, {
        before: messageId,
        limit: 100
    });

    const messages = list.data.map(message => ({
        role: message.role,
        content: message.content.map(content => (content as any).text.value)
    }));

    return messages.reverse();
};