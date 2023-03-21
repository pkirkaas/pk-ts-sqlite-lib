/**
 * Tests for pk-ts-sqlite-lib
 */
import { openDb, createTbl } from '../index.js';
const tblName = `signifliers3`;
const cdefs = {
    name: 'string not null',
    yrs_exp_gen: 'int not null',
    yrs_exp_sig: 'int not null',
    skill: 'string',
};
let iStr = `INSERT INTO ${tblName} ( name, skill, yrs_exp_gen, yrs_exp_sig) VALUES 
  ( 'TIME MACHINE', 'Passage', 3, 2), ( 'YESTERDAY', 'Unskilled', 7, 3) ; `;
let tQ = `SELECT * FROM ${tblName}`;
(async () => {
    const db = await openDb();
    await createTbl(db, tblName, cdefs);
    let iRes = await db.exec(iStr);
    let res = await db.all(tQ);
    console.log({ res });
    //let te = await tableExists(db, tblName);
    /*
    let te = await tableExists(db, 'kaka');
    console.log({ te });
    let aTbl = await db.exec(ctblStr);
    console.log({ aTbl });

    let iRes = await db.exec(iStr);
    console.log({ iRes });
    let res = await db.all(tQ);
    console.log({ res });
    */
})();
//# sourceMappingURL=test.js.map