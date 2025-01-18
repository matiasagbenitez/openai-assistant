export const prosConsStreamUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        const reader = resp.body?.getReader();
        if (!reader) return null;
        return reader;

        // const decoder = new TextDecoder();
        // let content = '';
        // while (true) {
        //     const { done, value } = await reader.read();
        //     if (done) break;
        //     content += decoder.decode(value, { stream: true });
        //     console.log(content);
        // }

    } catch (error) {
        console.log(error);
        return null;
    }
}