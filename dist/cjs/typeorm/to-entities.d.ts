/**
 * Building a library of enhanced TypeORM Entities
 */
import "reflect-metadata";
import { BaseEntity } from "typeorm";
/**
 * Enhanced BaseEntity
 */
export declare abstract class PkBaseEntity extends BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    /**
     *  Returns the table name for this entity type
     * @returns string - table name of the entity
     */
    static getTableName(): string;
    /**
     * A new query builder for this entity, without needing the table name
     * CAN USE JUST andWhere, don't need to start w. where
     * @returns queryBulder for this entity
     */
    static newQueryBuilder(): any;
}
export declare abstract class PkBaseUser extends PkBaseEntity {
    email: string;
    name: string;
    pwd: string;
    udata: any;
}
//# sourceMappingURL=to-entities.d.ts.map