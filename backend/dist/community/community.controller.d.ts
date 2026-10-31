import { CommunityService } from './community.service';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    getPosts(): Promise<({
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
    createPost(req: any, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string;
    }>;
    addComment(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    }>;
    deleteComment(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    }>;
    deletePost(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string | null;
        userId: string;
        content: string;
    }>;
}
