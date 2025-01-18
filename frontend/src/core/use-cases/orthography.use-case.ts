import type { OrthographyResponse } from "../../interfaces";

export const orthographyUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/orthography-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        if (!resp.ok) {
            return {
                error: true,
                userScore: 0,
                errors: [],
                message: 'No se pudo completar la operación de corrección de ortografía'

            }
        }
        const data: OrthographyResponse = await resp.json();
        return {
            error: false,
            ...data
        }
    } catch (error) {
        return {
            error: true,
            userScore: 0,
            errors: [],
            message: 'No se pudo completar la operación de corrección de ortografía'
        }
    }
}