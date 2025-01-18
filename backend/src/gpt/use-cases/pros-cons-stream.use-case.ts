import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsStreamUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt } = options;

    return await openai.chat.completions.create({
        stream: true,
        messages: [
            {
                role: 'system',
                content: `
                    Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                    la respuesta debe de ser en formato markdown,
                    los pros y contras deben de estar en una lista. Debes ser bastante conciso y claro.
                `
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        model: 'gpt-4o',
        temperature: 0.5,
        max_tokens: 500,
    });

};