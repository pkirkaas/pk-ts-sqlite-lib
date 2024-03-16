/**
 * Test entities & seeds for exploring TypeORM
 */
import "reflect-metadata";
import { Point } from "typeorm";
import { GenObj, PkBaseEntity } from '../typeorm/index.js';
export declare class Place extends PkBaseEntity {
    name: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lon: number;
    latlon: Point;
    ziprow: any;
    distance(place: GenObj): number;
    sayName(): string;
}
export declare class User extends PkBaseEntity {
    email: string;
    firstName: string;
    udata: any;
    latlon: Point;
    zip: string;
    pwd: string;
    posts: Post[];
}
export declare class Post extends PkBaseEntity {
    title: string;
    content: string;
    user?: User;
}
export declare function mkPoint(src: GenObj): Point;
export declare function mkPlaceData(state?: string): GenObj;
export declare function mkUsers(cnt?: number): Promise<void>;
export declare function mkUserData(cnt?: number): any[];
//# sourceMappingURL=to-seed.d.ts.map