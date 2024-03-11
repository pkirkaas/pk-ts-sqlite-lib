/**
 * Test entities & seeds for exploring TypeORM
 */
import "reflect-metadata";
import { PkBaseEntity } from '../typeorm/index.js';
export declare class User extends PkBaseEntity {
    email: string;
    firstName: string;
    udata: any;
    pwd: string;
    posts: Post[];
}
export declare class Post extends PkBaseEntity {
    title: string;
    content: string;
    user?: User;
}
export declare function mkUsers(cnt?: number): Promise<void>;
export declare function mkUserData(cnt?: number): any[];
//# sourceMappingURL=to-seed.d.ts.map