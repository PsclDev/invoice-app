import { Route } from '@modules/routes';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { capitalizeString } from '@utils';

import { AiDescriptioInputnDto, AiGeneratedDescriptionDto } from './ai.dto';
import { AiService } from './ai.service';

@ApiTags(capitalizeString(Route.AI))
@Controller(Route.AI)
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post()
  async generateDescription(
    @Body() body: AiDescriptioInputnDto,
  ): Promise<AiGeneratedDescriptionDto> {
    this.logger.log(`Generate description form input: ${body.input}`);
    return await this.aiService.generateDescription(body.input);
  }
}
