export const createThreadUseCase = async () => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/create-thread`, {
            method: 'POST',
        });

        const { id } = await resp.json() as { id: string };
 
        return id;
    } catch (error) {
        console.log(error);
        return null;
    }
}