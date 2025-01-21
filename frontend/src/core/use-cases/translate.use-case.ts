export const translateUseCase = async (prompt: string, lang: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, lang })
        });
        if (!resp.ok) throw new Error('No se pudo traducir el texto');
        const data: { content: string } = await resp.json();
        return {
            error: false,
            message: data.content
        }
    } catch (error) {
        return {
            error: true,
            message: 'No se pudo traducir el texto'
        }
    }
}