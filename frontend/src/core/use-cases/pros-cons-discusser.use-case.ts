import type { ProsConsDiscusserResponse } from "../../interfaces";

export const prosConsDiscusserUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        if (!resp.ok) {
            return {
                error: true,
                content: 'No se pudo completar la operación'
            }
        }
        const data: ProsConsDiscusserResponse = await resp.json();
        return {
            error: false,
            ...data
        }
    } catch (error) {
        return {
            error: true,
            content: 'No se pudo completar la operación'
        }
    }
}