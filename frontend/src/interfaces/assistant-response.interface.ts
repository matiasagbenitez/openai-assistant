export interface QuestionResponse {
    role: Role;
    content: string[];
}

export enum Role {
    Assistant = "assistant",
    User = "user",
}
