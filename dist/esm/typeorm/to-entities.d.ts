/**
 * Building a library of enhanced TypeORM Entities
 */
import "reflect-metadata";
import { BaseEntity, Point } from "typeorm";
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
/**
 * Until further investigation, Entities that include this embedded should define it as:
 *	@Column(() => Location) loc:Location;
 * Idea is to automatically create the geopont from lat, lon, and add "distance" query
 */
export declare class Location {
    lat: number;
    lon: number;
    geopt: Point;
    static getWhats(): string;
}
//# sourceMappingURL=to-entities.d.ts.map