import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArticleService } from './article.service';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('analyze')
  @ApiOperation({ summary: 'Analyze a Medium article to determine AI-written percentage' })
  @ApiResponse({ status: 200, description: 'The AI-written percentage of the article' })
  async analyze(@Query('url') url: string): Promise<{ aiWrittenPercentage: string }> {
    const aiWrittenPercentage = await this.articleService.analyzeArticle(url);
    return { aiWrittenPercentage };
  }
}
