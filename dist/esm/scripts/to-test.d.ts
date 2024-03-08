/**
 * Testing TypeORM implementation
 */
import { PkBaseEntity } from '../typeorm/index.js';
export declare class User extends PkBaseEntity {
    email: string;
    firstName: string;
    pwd: string;
    posts: Post[];
}
export declare class Post extends PkBaseEntity {
    title: string;
    content: string;
    user?: User;
}
//# sourceMappingURL=to-test.d.ts.map