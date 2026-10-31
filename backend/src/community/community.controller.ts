import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  async getPosts() {
    return this.communityService.listPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  async createPost(@Request() req, @Body('content') content: string) {
    return this.communityService.createPost(req.user.id, content);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments')
  async addComment(@Request() req, @Body() body: any) {
    return this.communityService.addComment(req.user.id, body.postId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  async deleteComment(@Request() req, @Param('id') id: string) {
    return this.communityService.deleteComment(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  async deletePost(@Request() req, @Param('id') id: string) {
    return this.communityService.deletePost(req.user.id, id);
  }
}
