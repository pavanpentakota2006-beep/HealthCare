import { CommunityService } from './community.service';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    getPosts(): Promise<({
        user: {
            id: string;
            email: string;
            profile: {
                firstName: string;
                avatarUrl: string | null;
            } | null;
        };
        comments: ({
            user: {
                id: string;
                email: string;
                profile: {
                    firstName: string;
                    avatarUrl: string | null;
                } | null;
            };
        } & {
            id: string;
            userId: string;
            content: string;
            createdAt: Date;
            postId: string;
        })[];
        _count: {
            comments: number;
            likes: number;
        };
    } & {
        id: string;
        userId: string;
        content: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createPost(req: any, content: string): Promise<{
        id: string;
        userId: string;
        content: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addComment(req: any, body: any): Promise<{
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        postId: string;
    }>;
    deleteComment(req: any, id: string): Promise<{
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        postId: string;
    }>;
    deletePost(req: any, id: string): Promise<{
        id: string;
        userId: string;
        content: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
