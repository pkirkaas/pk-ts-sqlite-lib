/**
 * Test entities & seeds for exploring TypeORM
 */
import "reflect-metadata";
import { Point } from "typeorm";
import { GenObj, PkBaseEntity, PkBaseUser } from '../typeorm/index.js';
/**
 * US Locations based on zip code
 */
export declare class Place extends PkBaseEntity {
    name: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    lat: number;
    lon: number;
    lonlat: Point;
    ziprow: any;
    pdata: any;
    distance(place: GenObj): number;
    sayName(): string;
}
export declare class User extends PkBaseUser {
    lonlat: Point;
    zip: string;
    posts: Post[];
}
export declare class Post extends PkBaseEntity {
    title: string;
    content: string;
    user?: User;
}
export declare function mkPlaceData(state?: string): GenObj;
export declare function mkPlaces(cnt?: number): Promise<void>;
export declare function mkUsers(cnt?: number): Promise<void>;
export declare function mkUserData(cnt?: number): any[];
//# sourceMappingURL=to-seed.d.ts.map