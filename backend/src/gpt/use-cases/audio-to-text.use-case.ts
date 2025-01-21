import * as fs from "fs";
import OpenAI from "openai";

interface Options {
    file: Express.Multer.File;
    prompt?: string;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
    const { file, prompt } = options;

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(file.path),
        prompt,
        language: 'es',
        response_format: 'verbose_json',
    });
    
    return response;
};