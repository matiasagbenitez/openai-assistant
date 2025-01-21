export const textToAudioUseCase = async (prompt: string, voice: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, voice })
        });
        if (!resp.ok) throw new Error('No se pudo completar la operación de conversión de texto a audio');

        const audioFile = await resp.blob();
        const audioUrl = URL.createObjectURL(audioFile);
        
        return {
            error: false,
            message: prompt,
            audioUrl
        }
    } catch (error) {
        return {
            error: true,
            message: 'No se pudo completar la operación de conversión de texto a audio',
        }
    }
}