/**
 * Testing TypeORM implementation
 */

import {runCli, resetToDataSource, getToDataSource, PkBaseEntity, typeOf, AppDataSource,emptySqliteTables, writeData, haversine,
  saveData, JSON5Stringify, allProps, allPropsWithTypes, getObjDets, objInfo, 
} from '../typeorm/index.js';

import {
  Raw, Point,
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity, TableInheritance,ChildEntity,
	OneToMany, ManyToOne, JoinColumn, JoinTable,
   Tree,   TreeChildren, TreeParent, TreeLevelColumn,
} from "typeorm";

import {User, Post, mkUsers, mkUserData, Place, mkPlaceData, } from "../typeorm/to-test-e-s.js";

import {pkfaker ,} from '../pkfaker/index.js';

import { //MtBase, MtChild1, MtChild2, MtUser,
  mkMtTests,mkStTests,fetchStUsr,
} from './totests/to-inheritance.js';

//await getToDataSource({entities:[User, Post]});
//await getToDataSource();

let entities = {entities:[User, Post]}

//AppDataSource.setOptions(entities);

//await AppDataSource.synchronize(true);
//await AppDataSource.initialize();

let tfncs = {
  async insEnt() {
    let ds = await getToDataSource({entities:[Place]});
    //let placeRepo =  await ds.getRepository(Place);
    let placeRepo =  await Place.getRepository();
    let pTN = Place.getTableName();
    let nqb = Place.newQueryBuilder();
    console.log({pTN, nqb});
    /*
    let repoMetadata = placeRepo.metadata;
    let tableName = repoMetadata.tableName;
    let repoDets =  allProps(placeRepo, 'tvp', 3);
    //console.log({Place, placeRepo});
    let placeJS = JSON5Stringify(Place);
    //let placeDets = allPropsWithTypes(Place);
    //let placeDets = objInfo(Place);
    let placeDets = allProps(Place, 'tvp', 3);
    saveData(placeDets,{fname:'PlaceData'});
    saveData(repoDets,{fname:'RepoData'});
    //console.log({Place});
    console.log({placeJS, repoMetadata, tableName});
    */
  },
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

  async tstStUsr() {
    let ts = await fetchStUsr();
    console.log({ts});
  },

  async tstUsr() {
    let ds = await getToDataSource({entities:[User,Post]});
    let usrs = await User.newQueryBuilder().getMany();
    let usrsJ = JSON.stringify(usrs,null,2);
    let usrsP = JSON.parse(usrsJ);
    //let ts = await fetchStUsr();
    let nameemail = usrs[0].namemail;
    console.log({usrs, nameemail, usrsJ, usrsP});
  },

  async tstSt() {
    let ts = await mkStTests();
    console.log({ts});
  },

  async tstMt() {
    let ts = await mkMtTests();
    console.log({ts});
  },



  async tstReset() {
    await resetToDataSource({entities:[User, Post]});
    let res = await mkUsers();
    console.log({res});
  },

  async tstQ(opt = null) {
    console.log(`Tst Query, opt: ${opt}`);
    let ds = await getToDataSource(entities);
    // Doesn't work w/o entities: let ds = await getToDataSource();
    let usrRepo = await ds.getRepository(User);
    let users = await usrRepo.find({
      where: {
        //firstName:'Ceasar',
        //udata : {intKey:1},
//        "udata->>'$.intKey'" : 9,
        udata: Raw((alias) => "udata->>'$.intKey' = 2"),
      }
    });
    console.log({users});
  },
  async tstQB(opt = null) { //Test Query Bulder

    console.log(`Tst Query Builder, opt: ${opt}`);
    let ds = await getToDataSource(entities);
    // Doesn't work w/o entities: let ds = await getToDataSource();
    let usrRepo = await ds.getRepository(User);
    let uQb = usrRepo.createQueryBuilder('user');
    let users = await uQb.where(
      //'user.firstName = :fname', {fname:'Ceasar'}).getMany();
      // THIS WORKS for SQLite!!!
      /*
      "json_extract(`udata`, :path) = :val", {
  path: '$.intKey',
  val: '2'
}
  */
  //(SQLIte): "udata->>'$.intKey' = :val", {val: '2'}
  //Postgres
  "udata->>'intKey' = :val", {val: 2}

)
.getMany();

    /*
    let users = await usrRepo.find({
      where: {
        firstName:'Ceasar',
        //udata : {intKey:1},
      }
    });
    */
    console.log({users});
  },
  async initPlaces() {
    let ts = await getToDataSource({entities:[Place], dropSchema:true});
    let bulkData = [];
    for (let i = 0 ; i < 300; i++){
      let placeData = mkPlaceData();
      bulkData.push(placeData);

    }
    //console.log({placeData});
    let places = Place.create(bulkData);
    //await place.save();
    await Place.save(places);
    //console.log({place});
    console.log("Done Making Places!");
  },
  async tstDist(dist=500) {
    let ds = await getToDataSource({entities:[Place]});
    //let placeRepo =  await ds.getRepository(Place);
    let placeRepo = Place.getRepository();
    //let pQb = placeRepo.createQueryBuilder();
    //let pQb = Place.createQueryBuilder('place');
    let pQb = Place.newQueryBuilder();
    let venice = pkfaker.getZipRow('90291');
    //let qStr =  'ST_Dwithin(place.lonlat, ST_MakePoint(:lon, :lat)::geography, :distance)';
    //let qStr =  'ST_DWithin(place.lonlat, ST_MakePoint(:lon, :lat)::geography, :distance)';
    //let qStr =  'ST_DWithin(place.lonlat, ST_MakePoint(:lon, :lat)::geography, :distance)';
    let qStr =  'ST_DWithin(lonlat, ST_MakePoint(:lon, :lat)::geography, :distance)';
    let qParams = {lon:venice.lon, lat:venice.lat, distance: dist * 1000};
    //let sql = await pQb.where( qStr , qParams) .getSql();
    //let res = await pQb.where( qStr , qParams) .getMany();
     //pQb.where("1=1");
     pQb.andWhere( qStr , qParams);
     //pQb.andWhere('place.city = :city', {city:'Pasadena'});
    let res = await pQb.getMany();
    let cnt = res.length;
    let short = res.map((place) => ({zip:place.zip, city:place.city, distance:place.distance(venice),}));
    //.printSql()
    //.getMany();
    console.log({ short, cnt, qStr, qParams});
    
  },

  async tstDist2(dist=1000) {
    let ds = await getToDataSource({entities:[Place]});
    let placeRepo =  await ds.getRepository(Place);
    let venice = pkfaker.getZipRow('90291');
    let vPoint:Point = {
      type:"Point",
      coordinates: [venice.lon, venice.lat],
    };
    let pQb = placeRepo.createQueryBuilder('place');
    //let qStr =  'ST_Dwithin(place.lonlat, ST_MakePoint(:lon, :lat)::geography, :distance)';
    /*
    let qStr =  'ST_DWithin(place.lonlat, ST_MakePoint(:lon, :lat)::geography, :distance)';
    let qParams = {lon:venice.lon, lat:venice.lat, distance: dist * 1000};
    */
   /*
   let qStr = ''
    let sql = await pQb.where( qStr , qParams) .getSql();
    let res = await pQb.where( qStr , qParams) .getMany();
    //.printSql()
    //.getMany();
    console.log({sql, res, qStr, qParams});
    */
    
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

try {

runCli(tfncs);
} catch (e) {
  console.error(e);
}