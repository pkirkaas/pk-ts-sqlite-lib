/**
 * Tests for pk-ts-sqlite-lib
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield openDb();
    yield createTbl(db, tblName, cdefs);
    let iRes = yield db.exec(iStr);
    let res = yield db.all(tQ);
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
}))();
//# sourceMappingURL=test.js.map