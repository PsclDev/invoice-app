import { ConfigService } from '@config';
import { GptKey, SettingService, SettingType } from '@modules/setting';
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import { AiGeneratedDescriptionDto } from './ai.dto';

@Injectable()
export class AiService {
  private readonly openAi: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly settingsService: SettingService,
  ) {
    this.openAi = new OpenAI({
      apiKey: this.configService.gpt.apiKey,
    });
  }

  async generateDescription(input: string): Promise<AiGeneratedDescriptionDto> {
    const model = await this.settingsService.findByTypeAndKey(
      SettingType.GPT,
      GptKey.MODEL,
    );

    const prePrompt = await this.settingsService.findByTypeAndKey(
      SettingType.GPT,
      GptKey.PRE_PROMPT,
    );

    this.logger.debug(`Using model: ${model.value}`);
    this.logger.debug(`Using pre promt: ${prePrompt.value}`);

    const completion = await this.openAi.chat.completions.create({
      messages: [
        { role: 'system', content: prePrompt.value },
        {
          role: 'user',
          content: input,
        },
      ],
      model: model.value,
      temperature: this.configService.gpt.temperature,
    });

    return {
      input,
      output: completion.choices[0].message.content,
    };
  }
}
