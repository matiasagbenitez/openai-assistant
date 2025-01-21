import * as fs from "fs";
import OpenAI from "openai";
import { saveImageAsPng } from "src/helpers";

interface Options {
    baseImage: string;
}

export const imageVariationUseCase = async (openai: OpenAI, options: Options) => {
    const { baseImage } = options;
    if (!baseImage) throw new Error("Base image is required");

    const pngImagePath = await saveImageAsPng(baseImage, true);

    const response = await openai.images.createVariation({
        model: "dall-e-2",
        image: fs.createReadStream(pngImagePath),
        n: 1,
        size: "1024x1024",
        response_format: "url",
    });

    const fileName = await saveImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: url,
        openAIUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
    }

};
