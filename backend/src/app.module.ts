import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { SamAssistantModule } from './sam-assistant/sam-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    SamAssistantModule
  ]
})
export class AppModule { }
