/**
 * TypeORM library convenient functions
 */

import "reflect-metadata";
export * from './to-entities.js';

//import "reflect-metadata";

import { GenObj, typeOf, isEmpty, PkError, } from './index.js';

//import { PkBaseEntity } from './to-entities.js';

import { DataSource, DataSourceOptions } from "typeorm";

export let AppDataSource = null;

let defaultToConfig:DataSourceOptions = { //The default for SQLite
    type: 'sqlite',
		database: process.env.TO_SQLITE || './tmp/def-to-sqlite.db',
		synchronize: true,

};

/**
 * Initializes TO DB connection - provides default config that can be overridden by ToConfig arg
 * @param ToConfig 
 * @returns connected ToDataSource
 */
export async function getToDataSource(ToConfig:GenObj = {}) {
  let config:DataSourceOptions = {...defaultToConfig, ...ToConfig};
  if (AppDataSource === null) {
    console.log(`Trying to initialze DA w.`, {config});
    AppDataSource = new DataSource(config);
    await AppDataSource.initialize();
  }
  if (!AppDataSource.isInitialized) {
    throw new PkError("TO DataSource not initialized, w. config:", {config});
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
export async function resetToDataSource(ToConfig:GenObj = {}) {
  let config:DataSourceOptions = {...defaultToConfig, ...ToConfig};
  let lentities = config.entities;
  // @ts-ignore
  config.entities = [];
  if (AppDataSource === null) {
    console.log(`Trying to initialze DA w.`, {config});
    AppDataSource = new DataSource(config);
    await AppDataSource.initialize();
    await AppDataSource.synchronize(true);
    await AppDataSource.destroy();
    AppDataSource.setOptions({entities:lentities});
    await AppDataSource.initialize();
  }
  if (!AppDataSource.isInitialized) {
    throw new PkError("TO DataSource not initialized, w. config:", {config});
  }

  return AppDataSource;
}
//export const AppDataSource = new DataSource(getTOConfig());

//await AppDataSource.initialize();










