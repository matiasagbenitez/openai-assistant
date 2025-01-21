import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { InternalServerErrorException } from "@nestjs/common";

export const saveImageAsPng = async (url: string, fullPath: boolean = false) => {
    const response = await fetch(url);
    if (!response.ok) throw new InternalServerErrorException('Error fetching image');

    const folderPath = path.join(__dirname, '../../generated/images');
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const fileName = `${new Date().getTime()}.png`;
    const buffer = Buffer.from(await response.arrayBuffer());

    // fs.writeFileSync(path.join(folderPath, fileName), buffer);
    const filePath = path.join(folderPath, fileName);

    await sharp(buffer)
        .png()
        .ensureAlpha()
        .toFile(filePath);

    return fullPath ? filePath : fileName;
};