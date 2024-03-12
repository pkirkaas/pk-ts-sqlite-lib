/**
 * Testing TypeORM implementation
 */
import { runCli, resetToDataSource, getToDataSource, typeOf, AppDataSource, } from '../typeorm/index.js';
import { User, Post, mkUsers, } from "./to-seed.js";
//await getToDataSource({entities:[User, Post]});
//await getToDataSource();
let entities = { entities: [User, Post] };
//AppDataSource.setOptions(entities);
//await AppDataSource.synchronize(true);
//await AppDataSource.initialize();
let fncs = {
    async tstInit() {
        console.log({ AppDataSource });
    },
    async dsTst(opt = 'empty') {
        console.log(`Testing clear DS w. opt: ${opt}`);
        if (opt === 'empty') {
            let ds = await getToDataSource();
        }
        else if (opt === 'emptyent') {
            let ds = await getToDataSource({ entities: [] });
            await ds.synchronize(true);
            await ds.destroy();
            ds.setOptions(entities);
            await ds.initialize();
            let res = await mkUsers();
            console.log({ res });
            //await ds.synchronize(true);
        }
        else if (opt === 'users') {
            let ds = await getToDataSource(entities);
        }
        else {
            console.log(`Unhandled option: ${opt} !!!`);
        }
    },
    async tstReset() {
        await resetToDataSource({ entities: [User, Post] });
        let res = await mkUsers();
        console.log({ res });
    },
    async tstQ(opt = null) {
        console.log(`Tst Query, opt: ${opt}`);
        let ds = await getToDataSource(entities);
        // Doesn't work w/o entities: let ds = await getToDataSource();
        let usrRepo = await ds.getRepository(User);
        let users = await usrRepo.find({
            where: {
                firstName: 'Ceasar',
                //udata : {intKey:1},
            }
        });
        console.log({ users });
    },
    async tstQB(opt = null) {
        console.log(`Tst Query Builder, opt: ${opt}`);
        let ds = await getToDataSource(entities);
        // Doesn't work w/o entities: let ds = await getToDataSource();
        let usrRepo = await ds.getRepository(User);
        let uQb = usrRepo.createQueryBuilder('user');
        let users = await uQb.where(
        //'user.firstName = :fname', {fname:'Ceasar'}).getMany();
        /* THIS WORKS !!!
        "json_extract(`udata`, :path) = :val", {
    path: `$.intKey`,
    val: 9
  }
    */
        "udata->>'$.intKey' = :val", { val: 2 })
            .getMany();
        /*
        let users = await usrRepo.find({
          where: {
            firstName:'Ceasar',
            //udata : {intKey:1},
          }
        });
        */
        console.log({ users });
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
        console.log({ res });
    },
};
try {
    runCli(fncs);
}
catch (e) {
    console.error(e);
}
//# sourceMappingURL=to-test.js.map