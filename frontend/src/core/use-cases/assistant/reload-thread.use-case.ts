import { QuestionResponse } from "../../../interfaces";

export const reloadThreadUseCase = async (threadId: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/reload-thread/${threadId}`);
        const replies = await resp.json() as QuestionResponse[];
        return replies;
    } catch (error) {
        console.log(error);
        return null;
    }
}