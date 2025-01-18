import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

import {
    orthographyCheckUseCase,
    prosConsDiscusserUseCase,
    prosConsStreamUseCase,
} from './use-cases';

@Injectable()
// El servicio solamente llamará a casos de uso
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async orthographyCheck(dto: OrthographyDto) {
        const { prompt } = dto;
        return await orthographyCheckUseCase(this.openai, { prompt });
    }

    async prosConsDiscusser(dto: ProsConsDiscusserDto) {
        const { prompt } = dto;
        return await prosConsDiscusserUseCase(this.openai, { prompt });
    }

    async prosConsDiscusserStream(dto: ProsConsDiscusserDto) {
        const { prompt } = dto;
        return await prosConsStreamUseCase(this.openai, { prompt });
    }

}
