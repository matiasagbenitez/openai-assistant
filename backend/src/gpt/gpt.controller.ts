import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { GptService } from './gpt.service';
import { AudioToTextDto, OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) { }

  @Post('orthography-check')
  orthographyCheck(@Body() dto: OrthographyDto) {
    return this.gptService.orthographyCheck(dto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() dto: OrthographyDto) {
    return this.gptService.prosConsDiscusser(dto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() dto: OrthographyDto,
    @Res() res: Response
  ) {
    const stream = await this.gptService.prosConsDiscusserStream(dto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() dto: TranslateDto) {
    return this.gptService.translate(dto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() dto: TextToAudioDto,
    @Res() res: Response
  ) {
    const filePath = await this.gptService.textToAudio(dto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:filename')
  async getGeneratedAudio(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    const filePath = await this.gptService.getGeneratedAudio(filename);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File size should be less than 5MB',
          }),
          new FileTypeValidator({
            fileType: 'audio/*',
          }),
        ]
      }),
    ) file: Express.Multer.File,
    @Body() dto: AudioToTextDto
  ) {
    return await this.gptService.audioToText(file, dto);
  }
}
