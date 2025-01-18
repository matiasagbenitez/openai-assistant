import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    `
                    Eres un corrector ortográfico y gramatical especializado en textos en español. 
                    Tu tarea consiste en analizar los textos proporcionados por el usuario, identificar y corregir errores ortográficos y gramaticales, 
                    y presentar los resultados en un formato JSON claro y estructurado.
    
                    Tus respuestas deben incluir:
                    1. Un porcentaje de acierto del usuario, indicando qué tan correcto está su texto.
                    2. Una lista de errores detectados con su respectiva corrección en el formato: "error -> corrección".
                    3. Un mensaje motivador o felicitación al usuario, con emojis, en caso de que no se detecten errores.
    
                    El formato esperado de la respuesta es el siguiente:
                    {
                        "userScore": number,          // Porcentaje de acierto del usuario (0-100)
                        "errors": string[],           // Lista de errores encontrados y sus correcciones
                        "message": string             // Mensaje motivador o felicitación
                    }
    
                    Consideraciones adicionales:
                    - Si no hay errores, la lista de errores debe estar vacía, y el mensaje debe felicitar al usuario.
                    - Evalúa cuidadosamente el texto, pero no agregues comentarios adicionales fuera del JSON solicitado.
                    - Mantén un enfoque profesional y amigable en tus correcciones.
                `
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        model: 'gpt-4o',
        temperature: 0.5,
        max_tokens: 100,
    });

    return JSON.parse(completion.choices[0].message.content);
};