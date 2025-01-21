import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import { downloadBase64ImageAsPng, saveImageAsPng } from "src/helpers";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt, originalImage, maskImage } = options;
    if (!prompt) throw new Error("Prompt is required");

    // Verificar originalImage y maskImage
    if (!originalImage || !maskImage) {
        const response = await openai.images.generate({
            prompt,
            model: "dall-e-3",
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url',
        });
        const fileName = await saveImageAsPng(response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
        return {
            url: url,
            openAIUrl: response.data[0].url,
            revisedPrompt: response.data[0].revised_prompt,
        }
    }

    // originalImage=https://localhost:3000/gpt/image-generation/1754504545541.png
    const pngImagePath = await saveImageAsPng(originalImage, true);

    // maskImage=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABKklEQVR42mL8//8/AyUYII
    const maskPngImagePath = await downloadBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
        prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPngImagePath),
        model: 'dall-e-2',
        size: '1024x1024',
        n: 1,
        response_format: 'url',
    });

    const fileName = await saveImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: url,
        openAIUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
        fileName: fileName,
    };
};
