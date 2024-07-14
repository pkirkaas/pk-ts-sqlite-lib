/**
 * Building a library of enhanced TypeORM Entities
 */
import "reflect-metadata";
import { ObjectLiteral, WhereExpressionBuilder, BaseEntity, Point } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, validate, ValidatorOptions } from "class-validator";
export declare const rules: {
    Contains: typeof Contains;
    IsInt: typeof IsInt;
    Length: typeof Length;
    IsEmail: typeof IsEmail;
    IsFQDN: typeof IsFQDN;
    IsDate: typeof IsDate;
    Min: typeof Min;
    Max: typeof Max;
    validate: typeof validate;
};
import { GenObj } from 'pk-ts-common-lib';
/**
 * Enhanced BaseEntity
 */
export declare abstract class PkBaseEntity extends BaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    edata: any;
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
    static newQueryBuilder(findOpts?: any): any;
    /**
     * Validate the current instance according to class-validator rules
     * @param vOpts:ValidatorOptions - opts for the validator library
     * @param opts:GenObj - optional params for this function
     *
     */
    /**
     * Takes proposed instance data object, creates a new instance, validates it,
     * and returns result
     *  - an array of validation errors, or
     */
    static errors(data: any, vOpts?: ValidatorOptions, opts?: GenObj): Promise<any>;
    errors(vOpts?: ValidatorOptions, opts?: GenObj): Promise<false | import("class-validator").ValidationError[]>;
    loadRelation<T extends BaseEntity>(this: T, relationName: string, options?: {
        where?: ObjectLiteral | ((qb: WhereExpressionBuilder) => void);
        order?: {
            [key: string]: 'ASC' | 'DESC';
        };
        limit?: number;
        offset?: number;
    }): Promise<T>;
}
export declare abstract class PkBaseUser extends PkBaseEntity {
    email: string;
    name: string;
    pwd: string;
    udata: any;
    virtc(): void;
    get namemail(): string;
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