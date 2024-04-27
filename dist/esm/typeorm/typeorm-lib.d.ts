/**
 * TypeORM library convenient functions
 */
import "reflect-metadata";
export * from './to-entities.js';
import { GenObj } from './index.js';
import { DataSourceOptions, Point } from "typeorm";
export declare let AppDataSource: any;
export declare let sqliteToConfig: DataSourceOptions;
export declare let mySqlToConfig: DataSourceOptions;
export declare let postgresToConfig: DataSourceOptions;
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
export declare function resetToDataSource(ToConfig?: GenObj): Promise<any>;
/**
 * ONLY FOR TEST/DEV !!!!
 * DELETES ALL EXISTING ENTITIES FROM DB!!!
 * Then creates new entities from the config entities key
 * @param ToConfig
 * @returns empty, initialized datasource
 */
export declare function origResetToDataSource(ToConfig?: GenObj): Promise<any>;
//# sourceMappingURL=typeorm-lib.d.ts.map