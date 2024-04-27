/**
 * TypeORM library convenient functions
 */
import "reflect-metadata";
export * from './to-entities.js';
//import "reflect-metadata";
import { PkError, } from './index.js';
//import { PkBaseEntity } from './to-entities.js';
import { DataSource, } from "typeorm";
export let AppDataSource = null;
export let sqliteToConfig = {
    type: 'sqlite',
    database: process.env.TO_SQLITE || './tmp/def-to-sqlite.db',
    synchronize: true,
};
export let mySqlToConfig = {
    type: "mysql",
    host: process.env.MYSQL_HOST || 'localhost',
    port: 3306,
    username: 'root', //process.env.MYSQL_USER,
    password: '', //process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
    synchronize: true,
};
export let postgresToConfig = {
    type: "postgres",
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PWD,
    database: process.env.PG_DB,
    synchronize: true,
};
//let defaultToConfig:DataSourceOptions = mySqlToConfig;
export let defaultToConfig = postgresToConfig;
/**
 * Initializes TO DB connection - provides default config that can be overridden by ToConfig arg
 * @param ToConfig
 * @returns connected ToDataSource
 */
export async function getToDataSource(ToConfig = {}) {
    let config = { ...defaultToConfig, ...ToConfig };
    if (AppDataSource === null) {
        //console.log(`Trying to initialze DA w.`, {config});
        AppDataSource = new DataSource(config);
        await AppDataSource.initialize();
    }
    if (!AppDataSource.isInitialized) {
        throw new PkError("TO DataSource not initialized, w. config:", { config });
    }
    return AppDataSource;
}
/**
 * Creates a TypeORM GeoPont object column data
 * @param GenObj w. keys of lon, lat
 * @returns TypeORM Geo Point object
 */
export function mkPoint(src) {
    let point = {
        type: "Point",
        coordinates: [src.lon, src.lat],
    };
    return point;
}
// Test if dropSchema works as expected
export async function resetToDataSource(ToConfig = {}) {
    let config = { ...defaultToConfig, ...ToConfig, synchronize: true, dropSchema: true, };
    // @ts-ignore
    if (AppDataSource === null) {
        console.log(`Trying to initialze DA w.`, { config });
        AppDataSource = new DataSource(config);
        await AppDataSource.initialize();
    }
    if (!AppDataSource.isInitialized) {
        throw new PkError("TO DataSource not initialized, w. config:", { config });
    }
    return AppDataSource;
}
/**
 * ONLY FOR TEST/DEV !!!!
 * DELETES ALL EXISTING ENTITIES FROM DB!!!
 * Then creates new entities from the config entities key
 * @param ToConfig
 * @returns empty, initialized datasource
 */
export async function origResetToDataSource(ToConfig = {}) {
    let config = { ...defaultToConfig, ...ToConfig };
    let lentities = config.entities;
    // @ts-ignore
    config.entities = [];
    if (AppDataSource === null) {
        console.log(`Trying to initialze DA w.`, { config });
        AppDataSource = new DataSource(config);
        await AppDataSource.initialize();
        await AppDataSource.synchronize(true);
        await AppDataSource.destroy();
        AppDataSource.setOptions({ entities: lentities });
        await AppDataSource.initialize();
    }
    if (!AppDataSource.isInitialized) {
        throw new PkError("TO DataSource not initialized, w. config:", { config });
    }
    return AppDataSource;
}
//export const AppDataSource = new DataSource(getTOConfig());
//await AppDataSource.initialize();
//# sourceMappingURL=typeorm-lib.js.map