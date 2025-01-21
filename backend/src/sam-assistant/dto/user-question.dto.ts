import { IsString } from "class-validator";

export class UserQuestionDto {

    @IsString()
    readonly threadId: string;

    @IsString()
    readonly question: string;
}