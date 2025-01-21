import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { UserQuestionDto } from './dto/user-question.dto';

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

  @Get('reload-thread/:threadId')
  async reloadThread(@Param('threadId') threadId: string) {
    return await this.samAssistantService.reloadThread(threadId);
  }
}
