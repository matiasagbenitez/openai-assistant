import * as path from "path";
import * as fs from "fs";
import OpenAI from "openai";

interface Options {
    prompt: string;
    voice?: string;
}

const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer'
};

export const textToAudioUseCase = async (openai: OpenAI, { prompt, voice }: Options) => {

    const selectedVoice = voices[voice] ?? 'nova';

    const folderPath = path.join(__dirname, '../../../generated/audios');
    const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);
    fs.mkdirSync(folderPath, { recursive: true });

    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: selectedVoice,
        input: prompt,
        response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(speechFile, buffer);

    return speechFile;
};