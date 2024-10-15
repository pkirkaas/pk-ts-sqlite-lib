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

// NPM Imports
import "reflect-metadata";

import fs from "fs-extra";
import path from 'path';

import { getConnection, Entity, DataSource, BaseEntity, DataSourceOptions, Point, } from "typeorm";



// PK Lib imports
import { isSubclassOf, isObject, typeOfEach, firstToUpper, 
 GenObj, typeOf, isEmpty, PkError, slashPath, mkDirForPath, 
} from 'pk-ts-node-lib';

//import { GenObj, typeOf, isEmpty, PkError, slashPath, mkDirForPath, } from './index.js';

//import { PkBaseEntity } from './to-entities.js';

export * from './to-entities.js';
export class PkDataSource extends DataSource {
  static DataSources:GenObj = {};
  static mkDbId(opts:GenObj) { // Makes unique ID from DS opts
    let dbId:string = opts.type;
    if(opts.type === 'mysql') {
      dbId += ':' + path.resolve(opts.database);
    } else {
      dbId+=':' + opts.port + ':' + opts.host + ':' + opts.database;
    }
    return dbId;
  }
  static async getToDataSource(ToConfig: GenObj = {}, type: string = 'sqlite') {
    let config: DataSourceOptions = getToConfig(type, ToConfig);
    let dbId = this.mkDbId(config);
    if (this.DataSources[dbId]) {
      return this.DataSources[dbId];
    }
    if (config.type === 'sqlite') {
      let filename = config.database;
      if (filename !== ":memory") {
        mkDirForPath(path.resolve(filename));
      }
    }
    let ds = new PkDataSource(config);

    if (!ds.isInitialized) {
      await ds.initialize();
    }
    if (!ds.isInitialized) {
      throw new PkError("TO DataSource not initialized, w. config:", { config });
    }
    return ds;
  }
  dbId:string;
  constructor(config) {
    //@ts-ignore
    super(config);
    //@ts-ignore
    let dbId = this.constructor.mkDbId(config);
    this.dbId = dbId;
    //@ts-ignore
    this.constructor.DataSources[dbId]=this;
  }

  getEntities(): GenObj {
    let entities = this.options.entities;
    return entities;
  }
  getEntity(entity: any): BaseEntity | null | boolean {
    if (typeof entity === 'string') {
      let entities = this.options.entities;
      let entityName = firstToUpper(entity);
      //console.log({entity, entityName})
      entity = entities[entityName];
    }
    let toEnt = typeOf(entity);
    //console.log({toEnt});
    if (isEntityClass(entity)) {
      return entity;
    }
    throw new PkError(`Oh, bad entity!`, { entity });
  }
}

export let AppDataSource = null;

export let sqliteToConfig: DataSourceOptions = { //The default for SQLite
  type: 'sqlite',
  database: process.env.TO_SQLITE || './tmp/def-to-sqlite.db',
  synchronize: true,

};

export let mySqlToConfig: DataSourceOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST || 'localhost',
  port: 3306,
  username:  process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PWD || '', 
  database: process.env.MYSQL_DB,
  synchronize: true,
};

export let postgresToConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PWD,
  database: process.env.PG_DB,
  synchronize: true,
};

export const toDbConfigs = {
  postgres: postgresToConfig,
  mysql: mySqlToConfig,
  sqlite: sqliteToConfig,
};

export function getToConfig(type: string = 'sqlite', custom: GenObj = {}) {
  let config = {...toDbConfigs[type], ...custom };
  return config;
}

/**
 * Returns an entity class from a string|Entity object of entites - {User, Post, ...}
 * @param entity string|Entity - if string, key to entity class in entities
 * @param src? DataSource, object of entities, or empty for default data source
 *  
 */
export function getEntity(entity: string | typeof Entity, src?: any) {
  if (isEntityClass(entity)) {
    return entity;
  }
  let entities: GenObj;
  if (!src) {
    src = AppDataSource;
  }

  if (src instanceof DataSource) {
    entities = src.options.entities;
  } else if (isObject(src)) {
    entities = src;
  } else {
    throw new PkError(`Invalid source for entities:`, { src });
  }
  if (typeof entity === "string") {
    let entityName = firstToUpper(entity);
    entity = this.options.entities[entityName];
  }
  return false;
}
//let defaultToConfig:DataSourceOptions = mySqlToConfig;
export let defaultToConfig: DataSourceOptions = postgresToConfig;
/**
 * Initializes TO DB connection - provides default config that can be overridden by ToConfig arg
 * CHANGE: 8 Oct 24 - no global AppDataSource - to support multiple connections
 * @param ToConfig 
 * @returns connected ToDataSource
 */

/**
 * @Deprecated - use static PkDataSource.getToDataSource instead
 */
export async function getToDataSource(ToConfig: GenObj = {}, type: string = 'sqlite') {
  //let config: DataSourceOptions = { ...defaultToConfig, ...ToConfig };
  let config: DataSourceOptions = getToConfig(type, ToConfig);
  let ds;
  //if (AppDataSource === null) {
    if (config.type === 'sqlite') {
      let filename = config.database;
      if (filename !== ":memory") {
        if (!path.isAbsolute(filename)) {
          filename = slashPath(process.cwd(), filename);
        }
        mkDirForPath(filename);
      }
    }
    ds = new PkDataSource(config);
    if (!ds.isInitialized) {
      await ds.initialize();
    }
  if (!ds.isInitialized) {
    throw new PkError("TO DataSource not initialized, w. config:", { config });
  }
  //AppDataSource = ds;
  return ds;
}

/**
 * Deletes/empties all given entities/tables 
 * @param entities - array of entities to delete/empty
 * @param dataSource - data source, null for default
 */
export async function clearEntities(entities: any[], dataSource: any = null) {
  if (!dataSource) {
    //dataSource = AppDataSource;
    dataSource = await getToDataSource();;
  }
  await dataSource.query("PRAGMA foreign_keys = OFF;");
  let repoMetadata = [];
  let results = [];
  let manager = dataSource.manager;
  for (let entity of entities) {
    try {
      let entityName = entity.name;
      let result: GenObj = { entityName };
      let exists = await manager.exists(entity);
      if (!exists) {
        result.satus = "Entity not initialized - skipping";
      } else {

        let repository = dataSource.getRepository(entity);
        await repository.clear();
        repoMetadata.push(await repository.metadata);
        result.status = "Cleared Entity!";
      }
      results.push(result);
    } catch (e) {
      console.error(`OH - caught an exception!`, { e });
    }
  }
  await dataSource.query("PRAGMA foreign_keys = ON;");
  console.log({ results });
  return repoMetadata;
}

/**
 * Creates a TypeORM GeoPont object column data 
 * @param GenObj w. keys of lon, lat 
 * @returns TypeORM Geo Point object
 */
export function mkPoint(src: GenObj): Point {
  let point: Point = {
    type: "Point",
    coordinates: [src.lon, src.lat],
  };
  return point;
}

/**
 * Is the arg an Entity class (not instance)
 * @param obj 
 */
export function isEntityClass(obj: any): boolean {
  let res = isSubclassOf(obj, BaseEntity);
  return res;
}

/** Returns the entity class of an entity instance, or false
 * @param obj
 */
export function isEntityInstance(obj: any): boolean | BaseEntity {
  if (obj instanceof BaseEntity) {
    return Object.getPrototypeOf(obj).constructor;
  }
  return false;
}

// Test if dropSchema works as expected
export async function resetToDataSource(ToConfig: GenObj = {}) {
  let config: DataSourceOptions = { ...defaultToConfig, ...ToConfig, synchronize: true, dropSchema: true, };
  // @ts-ignore
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

export function getEntities(ds?: DataSource) {
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
export async function origResetToDataSource(ToConfig: GenObj = {}) {
  let config: DataSourceOptions = { ...defaultToConfig, ...ToConfig };
  let lentities = config.entities;
  // @ts-ignore
  config.entities = [];
  if (AppDataSource === null) {
    //console.log(`Trying to initialze DA w.`, {config});
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


export default {
  resetToDataSource, isEntityInstance, AppDataSource, sqliteToConfig, mySqlToConfig, postgresToConfig,
  getEntity, PkDataSource, defaultToConfig, getToDataSource, clearEntities, mkPoint, isEntityClass, getEntities,

};









