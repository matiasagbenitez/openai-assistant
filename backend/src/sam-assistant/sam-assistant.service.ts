import { Injectable } from '@nestjs/common';
import { checkRunStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase, getNewMessagesUseCase } from './use-cases';
import OpenAI from 'openai';
import { UserQuestionDto } from './dto/user-question.dto';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async createThread() {
        return await createThreadUseCase(this.openai);
    }

    async userQuestion(dto: UserQuestionDto) {
        const { threadId, question } = dto;
        const message = await createMessageUseCase(this.openai, { threadId, question });

        const run = await createRunUseCase(this.openai, { threadId });

        await checkRunStatusUseCase(this.openai, { threadId, runId: run.id });

        const messages = await getNewMessagesUseCase(this.openai, { messageId: message.id, threadId });

        return messages;
    }

    async reloadThread(threadId: string) {
        const messages = getMessageListUseCase(this.openai, { threadId });

        return messages;
    }
}
