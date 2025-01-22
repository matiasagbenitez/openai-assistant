export async function* assistantStreamGeneratorUseCase(threadId: string, question: string, abortSignal: AbortSignal) {
    try {
        const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/user-question-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ threadId, question }),
            signal: abortSignal
        });

        const reader = resp.body?.getReader();
        if (!reader) return null;

        const decoder = new TextDecoder();
        let content = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            content += decoder.decode(value, { stream: true });
            yield content;
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}