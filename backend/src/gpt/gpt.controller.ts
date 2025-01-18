import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { GptService } from './gpt.service';
import { OrthographyDto, TranslateDto } from './dtos';

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
}
