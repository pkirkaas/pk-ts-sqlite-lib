/**
 * Testing TypeORM implementation
 */

import {runCli, resetToDataSource, getToDataSource, PkBaseEntity, typeOf, AppDataSource,emptySqliteTables, } from '../typeorm/index.js';

import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity, TableInheritance,ChildEntity,
	OneToMany, ManyToOne, JoinColumn, JoinTable,
   Tree,   TreeChildren, TreeParent, TreeLevelColumn,
} from "typeorm";

import {User, Post, mkUsers, mkUserData, } from "./to-seed.js";

//await getToDataSource({entities:[User, Post]});
//await getToDataSource();

let entities = {entities:[User, Post]}

//AppDataSource.setOptions(entities);

//await AppDataSource.synchronize(true);
//await AppDataSource.initialize();

let fncs = {
  async tstInit() {
    console.log({AppDataSource});
  },

  async dsTst(opt='empty') {
    console.log(`Testing clear DS w. opt: ${opt}`);
    if (opt === 'empty') {
      let ds = await getToDataSource();
    } else if (opt==='emptyent') {
      let ds = await getToDataSource({entities:[]});
      await ds.synchronize(true);
      await ds.destroy();
      ds.setOptions(entities);
      await ds.initialize();
      let res = await mkUsers();
      console.log({res});
      //await ds.synchronize(true);
    } else if (opt === 'users') {
        let ds = await getToDataSource(entities);
    } else {
      console.log(`Unhandled option: ${opt} !!!`);
    }

  },



  async tstReset() {
    await resetToDataSource({entities:[User, Post]});
    let res = await mkUsers();
    console.log({res});
  },


  async tstDriver() {
		let toDS = typeOf(AppDataSource);
		let driver = AppDataSource.driver;
		let toDR = typeOf(driver);
		let sqlite = driver.sqlite;
		let toSQL = typeOf(sqlite); 
	//	let db = sqlite.Database();
	//let teStr2 = `  SELECT * FROM 'sqlite_master' WHERE type='table' `;
	//let tables = await sqlite.all(teStr2);
    //console.log({toDS, toDR, toSQL, sqlite, AppDataSource });
    console.log({ AppDataSource });
  },
  async tstMkUsers() {
    let res = await mkUsers();
    console.log({res});
  },
}

runCli(fncs);