import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';

import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import {
    audioToTextUseCase,
    imageGenerationUseCase,
    orthographyCheckUseCase,
    prosConsDiscusserUseCase,
    prosConsStreamUseCase,
    textToAudioUseCase,
    translateUseCase,
    imageVariationUseCase
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

    async audioToText(audioFile: Express.Multer.File, { prompt }: AudioToTextDto) {
        return await audioToTextUseCase(this.openai, { file: audioFile, prompt });
    }

    async imageGeneration(dto: ImageGenerationDto) {
        return await imageGenerationUseCase(this.openai, { ...dto });
    }

    async getGeneratedImage(filename: string) {
        const filePath = path.join(__dirname, '../../generated/images', `${filename}`);
        if (!fs.existsSync(filePath)) throw new NotFoundException('File not found');
        return filePath;
    }

    async imageVariation(dto: ImageVariationDto) {
        return await imageVariationUseCase(this.openai, { ...dto });
    }
}
