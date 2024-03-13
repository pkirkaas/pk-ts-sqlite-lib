/**
 * Experimenting with 3 kinds of table/entity inheritance
 */
import "reflect-metadata";
import { PkBaseEntity } from '../../typeorm/index.js';
export declare class MtUser extends PkBaseEntity {
    uname: string;
    mtbases: MtChild1[];
}
export declare abstract class MtBase extends PkBaseEntity {
    eName: string;
    eInt: number;
}
export declare class MtChild1 extends MtBase {
    c1Name: string;
    c1Int: any;
    user?: MtUser;
}
export declare class MtChild2 extends MtBase {
    c2Name: any;
    c2Int: any;
}
export declare function mkMtTests(): Promise<void>;
export declare class stUser extends PkBaseEntity {
    uname: string;
    contents: Content[];
}
export declare class Content extends PkBaseEntity {
    title: string;
    description: string;
    user?: stUser;
}
export declare class Photo extends Content {
    size: string;
}
export declare class Question extends Content {
    answersCount: number;
}
export declare function mkStTests(): Promise<void>;
export declare function fetchStUsr(): Promise<stUser[]>;
//# sourceMappingURL=to-inheritance.d.ts.map