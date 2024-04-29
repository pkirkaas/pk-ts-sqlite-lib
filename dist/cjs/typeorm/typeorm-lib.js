/**
 * TypeORM library convenient functions
 */
/**
 * Every app using this should export an entities object: export const entities = {User, Post, Comment,...}
 */
import "reflect-metadata";
export * from './to-entities.js';
//import "reflect-metadata";
import { isSubclassOf, isObject, firstToUpper } from 'pk-ts-common-lib';
import { typeOf, PkError, } from './index.js';
//import { PkBaseEntity } from './to-entities.js';
import { DataSource, BaseEntity, } from "typeorm";
export class PkDataSource extends DataSource {
    getEntities() {
        let entities = this.options.entities;
        return entities;
    }
    getEntity(entity) {
        if (typeof entity === 'string') {
            let entities = this.options.entities;
            let entityName = firstToUpper(entity);
            //console.log({entity, entityName})
            entity = entities[entityName];
        }
        let toEnt = typeOf(entity);
        console.log({ toEnt });
        if (isEntityClass(entity)) {
            return entity;
        }
        throw new PkError(`Oh, bad entity!`, { entity });
    }
}
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
/**
 * Returns an entity class from a string|Entity object of entites - {User, Post, ...}
 * @param entity string|Entity - if string, key to entity class in entities
 * @param src? DataSource, object of entities, or empty for default data source
 *
 */
export function getEntity(entity, src) {
    if (isEntityClass(entity)) {
        return entity;
    }
    let entities;
    if (!src) {
        src = AppDataSource;
    }
    if (src instanceof DataSource) {
        entities = src.options.entities;
    }
    else if (isObject(src)) {
        entities = src;
    }
    else {
        throw new PkError(`Invalid source for entities:`, { src });
    }
    if (typeof entity === "string") {
        let entityName = firstToUpper(entity);
        entity = this.options.entities[entityName];
    }
    return false;
}
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
        AppDataSource = new PkDataSource(config);
        await AppDataSource.initialize();
    }
    if (!AppDataSource.isInitialized) {
        throw new PkError("TO DataSource not initialized, w. config:", { config });
    }
    return AppDataSource;
}
/**
 * Deletes/empties all given entities/tables
 * @param entities - array of entities to delete/empty
 * @param dataSource - data source, null for default
 */
export async function clearEntities(entities, dataSource = null) {
    if (!dataSource) {
        //dataSource = AppDataSource;
        dataSource = await getToDataSource();
        ;
    }
    let repoMetadata = [];
    for (let entity of entities) {
        let repository = dataSource.getRepository(entity);
        await repository.clear();
        repoMetadata.push(await repository.metadata);
    }
    return repoMetadata;
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
/**
 * Is the arg an Entity class (not instance)
 * @param obj
 */
export function isEntityClass(obj) {
    let res = isSubclassOf(obj, BaseEntity);
    return res;
}
/** Returns the entity class of an entity instance, or false
 * @param obj
 */
export function isEntityInstance(obj) {
    if (obj instanceof BaseEntity) {
        return Object.getPrototypeOf(obj).constructor;
    }
    return false;
}
// Test if dropSchema works as expected
export async function resetToDataSource(ToConfig = {}) {
    let config = { ...defaultToConfig, ...ToConfig, synchronize: true, dropSchema: true, };
    // @ts-ignore
    if (AppDataSource === null) {
        console.log(`Trying to initialze DA w.`, { config });
        AppDataSource = new PkDataSource(config);
        await AppDataSource.initialize();
    }
    if (!AppDataSource.isInitialized) {
        throw new PkError("TO DataSource not initialized, w. config:", { config });
    }
    return AppDataSource;
}
export function getEntities(ds) {
    if (!ds) {
        ds = AppDataSource;
    }
    let entities = ds.options.entities;
    return entities;
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
        AppDataSource = new PkDataSource(config);
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
export default { resetToDataSource, isEntityInstance, AppDataSource, sqliteToConfig, mySqlToConfig, postgresToConfig,
    getEntity, PkDataSource, defaultToConfig, getToDataSource, clearEntities, mkPoint, isEntityClass, getEntities,
};
//# sourceMappingURL=typeorm-lib.js.map