import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';

import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import {
    orthographyCheckUseCase,
    prosConsDiscusserUseCase,
    prosConsStreamUseCase,
    textToAudioUseCase,
    translateUseCase,
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

    async translate(dto: TranslateDto) {
        const { prompt, lang } = dto;
        return await translateUseCase(this.openai, { prompt, lang });
    }

    async textToAudio(dto: TextToAudioDto) {
        const { prompt, voice } = dto;
        return await textToAudioUseCase(this.openai, { prompt, voice });
    }

    async getGeneratedAudio(filename: string) {
        const filePath = path.join(__dirname, '../../generated/audios', `${filename}.mp3`);
        if (!fs.existsSync(filePath)) throw new NotFoundException('File not found');
        return filePath;
    }

}
