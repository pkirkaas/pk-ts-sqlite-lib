/**
 * Building a library of enhanced TypeORM Entities
 */
import "reflect-metadata";
import { BaseEntity } from "typeorm";
export declare class PkBaseEntity extends BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=to-entities.d.ts.map