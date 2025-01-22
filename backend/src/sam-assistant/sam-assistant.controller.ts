import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { UserQuestionDto } from './dto/user-question.dto';
import { Response } from 'express';

@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistantService: SamAssistantService) { }

  @Post('create-thread')
  async createThread() {
    return await this.samAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() dto: UserQuestionDto) {
    return await this.samAssistantService.userQuestion(dto);
  }

  @Post('user-question-stream')
  async userQuestionStream(
    @Body() dto: UserQuestionDto,
    @Res() res: Response
  ) {
    const runStream = await this.samAssistantService.userQuestionStream(dto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of runStream) {
      if (chunk.event === 'thread.message.delta') {
        const delta = chunk.data.delta;
        if (delta && delta.content) {
          const messagePart = delta.content.map((item: any) => item.text.value).join('');
          res.write(messagePart);
        }
      }
    }

    res.end();
  }


  @Get('reload-thread/:threadId')
  async reloadThread(@Param('threadId') threadId: string) {
    return await this.samAssistantService.reloadThread(threadId);
  }
}
