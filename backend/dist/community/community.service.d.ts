import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class CommunityService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AiService);
    listPosts(): Promise<({
        user: {
            profile: {
                firstName: string;
                avatarUrl: string | null;
            } | null;
            id: string;
            email: string;
        };
        comments: ({
            user: {
                profile: {
                    firstName: string;
                    avatarUrl: string | null;
                } | null;
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            content: string;
            postId: string;
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string;
    })[]>;
    createPost(userId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string;
    }>;
    private simulateCommunityInteraction;
    addComment(userId: string, postId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    }>;
    deleteComment(userId: string, commentId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    }>;
    deletePost(userId: string, postId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string;
    }>;
}
