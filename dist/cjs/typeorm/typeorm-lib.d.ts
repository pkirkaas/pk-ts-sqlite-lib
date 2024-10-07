/**
 * TypeORM library convenient functions
 * Assumes PkBaseEntity
 * Every app using this should export an entities object: export const entities = {User, Post, Comment,...}
 *
 * Exports:
 * class PkDataSource (extends TypeOrm DataSource)
 * functions:
 *   getToDataSource - Takes initialization params & returns PkDataSource instance
 */
import "reflect-metadata";
export * from './to-entities.js';
import { GenObj } from './index.js';
import { Entity, DataSource, BaseEntity, DataSourceOptions, Point } from "typeorm";
export declare class PkDataSource extends DataSource {
    getEntities(): GenObj;
    getEntity(entity: any): BaseEntity | null | boolean;
}
export declare let AppDataSource: any;
export declare let sqliteToConfig: DataSourceOptions;
export declare let mySqlToConfig: DataSourceOptions;
export declare let postgresToConfig: DataSourceOptions;
/**
 * Returns an entity class from a string|Entity object of entites - {User, Post, ...}
 * @param entity string|Entity - if string, key to entity class in entities
 * @param src? DataSource, object of entities, or empty for default data source
 *
 */
export declare function getEntity(entity: string | typeof Entity, src?: any): string | false | typeof Entity;
export declare let defaultToConfig: DataSourceOptions;
/**
 * Initializes TO DB connection - provides default config that can be overridden by ToConfig arg
 * @param ToConfig
 * @returns connected ToDataSource
 */
export declare function getToDataSource(ToConfig?: GenObj): Promise<any>;
/**
 * Deletes/empties all given entities/tables
 * @param entities - array of entities to delete/empty
 * @param dataSource - data source, null for default
 */
export declare function clearEntities(entities: any[], dataSource?: any): Promise<any[]>;
/**
 * Creates a TypeORM GeoPont object column data
 * @param GenObj w. keys of lon, lat
 * @returns TypeORM Geo Point object
 */
export declare function mkPoint(src: GenObj): Point;
/**
 * Is the arg an Entity class (not instance)
 * @param obj
 */
export declare function isEntityClass(obj: any): boolean;
/** Returns the entity class of an entity instance, or false
 * @param obj
 */
export declare function isEntityInstance(obj: any): boolean | BaseEntity;
export declare function resetToDataSource(ToConfig?: GenObj): Promise<any>;
export declare function getEntities(ds?: DataSource): import("typeorm").MixedList<string | Function | import("typeorm").EntitySchema<any>>;
/**
 * ONLY FOR TEST/DEV !!!!
 * DELETES ALL EXISTING ENTITIES FROM DB!!!
 * Then creates new entities from the config entities key
 * @param ToConfig
 * @returns empty, initialized datasource
 */
export declare function origResetToDataSource(ToConfig?: GenObj): Promise<any>;
declare const _default: {
    resetToDataSource: typeof resetToDataSource;
    isEntityInstance: typeof isEntityInstance;
    AppDataSource: any;
    sqliteToConfig: import("typeorm/driver/sqlite/SqliteConnectionOptions.js").SqliteConnectionOptions;
    mySqlToConfig: import("typeorm/driver/mysql/MysqlConnectionOptions.js").MysqlConnectionOptions;
    postgresToConfig: import("typeorm/driver/postgres/PostgresConnectionOptions.js").PostgresConnectionOptions;
    getEntity: typeof getEntity;
    PkDataSource: typeof PkDataSource;
    defaultToConfig: import("typeorm/driver/postgres/PostgresConnectionOptions.js").PostgresConnectionOptions;
    getToDataSource: typeof getToDataSource;
    clearEntities: typeof clearEntities;
    mkPoint: typeof mkPoint;
    isEntityClass: typeof isEntityClass;
    getEntities: typeof getEntities;
};
export default _default;
//# sourceMappingURL=typeorm-lib.d.ts.map