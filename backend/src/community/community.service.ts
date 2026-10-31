import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class CommunityService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService
  ) {}

  async listPosts() {
    return this.prisma.post.findMany({
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, avatarUrl: true } } } },
        comments: { include: { user: { select: { id: true, email: true, profile: { select: { firstName: true, avatarUrl: true } } } } } },
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPost(userId: string, content: string) {
    const post = await this.prisma.post.create({
      data: {
        userId,
        content
      }
    });

    // Fire and forget simulation: AI Reply and Fake Likes
    this.simulateCommunityInteraction(post.id, content);

    return post;
  }

  private async simulateCommunityInteraction(postId: string, postContent: string) {
    // 1. Give it 2 seconds so the user experiences a "real-time" notification feel
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Fetch an AI response
    const aiReply = await this.aiService.generateSocialReply(postContent);

    // 3. Pick a random persona
    const personas = ["Alex Strong 💪", "Jordan Fitness", "Taylor Runner 🏃‍♂️", "Sam The Lifter"];
    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    const fakeEmail = `${randomPersona.split(' ')[0].toLowerCase()}@healthcare.ai`;

    let replier = await this.prisma.user.findFirst({ where: { email: fakeEmail } });
    if (!replier) {
      replier = await this.prisma.user.create({
        data: {
          email: fakeEmail,
          passwordHash: 'ai-no-login',
          profile: {
            create: {
              firstName: randomPersona,
              lastName: ''
            }
          }
        }
      });
    }

    // 4. Post the comment!
    await this.prisma.comment.create({
      data: {
        postId,
        userId: replier.id,
        content: aiReply
      }
    });

    // 4.5 Make the replier like the post too
    await this.prisma.like.create({
      data: { userId: replier.id, postId }
    }).catch(() => {}); // ignore if already liked

    // 5. Add 3-5 random likes from fake users
    const numLikes = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 likes
    for (let i = 0; i < numLikes; i++) {
      let fan = await this.prisma.user.findFirst({ where: { email: `fan${i}@healthcare.ai` } });
      if (!fan) {
        fan = await this.prisma.user.create({
          data: {
            email: `fan${i}@healthcare.ai`,
            passwordHash: 'ai-no-login',
            profile: { create: { firstName: `Member ${i}`, lastName: '' } }
          }
        });
      }
      
      // Avoid unique constraint errors if fan already liked
      const existingLike = await this.prisma.like.findUnique({
        where: { userId_postId: { userId: fan.id, postId } }
      });
      if (!existingLike) {
        await this.prisma.like.create({
          data: { userId: fan.id, postId }
        });
      }
    }
  }

  async addComment(userId: string, postId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        userId,
        postId,
        content
      }
    });
  }

  async deleteComment(userId: string, commentId: string) {
    // In a real app we'd check if the comment belongs to userId or if they are admin
    // For demo simplicity, we just delete it.
    return this.prisma.comment.delete({
      where: { id: commentId }
    });
  }

  async deletePost(userId: string, postId: string) {
    return this.prisma.post.delete({
      where: { id: postId }
    });
  }
}
