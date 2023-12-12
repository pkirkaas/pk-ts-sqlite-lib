/**
 * Tests for pk-ts-sqlite-lib
 */

import { openDb, tableExists, createTbl, ColDef, getSqliteTables, runCli, emptySqliteTables, } from '../index.js';

const tblName = `tstTbl`;
const cdefs: ColDef = {
	name: 'string not null',
	yrs_exp_gen: 'int not null', // Years experience general
	yrs_exp_sig: 'int not null', //  Years experience 
	skill: 'string',
	email: 'string',
};

let iStr = `INSERT INTO ${tblName} ( name, skill, yrs_exp_gen, yrs_exp_sig, email) VALUES 
  ( 'TIME MACHINE', 'Passages', 3, 2, 'joe@end.dog' ), ( 'YESTERDAY', 'Unskilled', 7, 3, 'mary@ex.com') ; `;

let tQ = `SELECT * FROM ${tblName}`;

let tstFncs = {
	here: async () => {
		console.log("Here in tst");
	},

	getTbls: async () => {
		let tbls = await getSqliteTables();
		//let tblKeys = Object.keys(tbls);
		//let tblVals = Object.values(tbls);
		//console.log("GetTables", { tbls, tblKeys, tblVals });
		console.log("GetTables", { tbls,});
	},

	mkTbl: async () => {
		const db = await openDb();
		await createTbl(db, tblName, cdefs);
		let iRes = await db.exec(iStr);
		let res = await db.all(tQ);
		console.log({ res });
	},

	emptyTbls: async () => {
		let done = await emptySqliteTables();
	},

};

/*
await (async () => {
	const db = await openDb();
	await createTbl(db, tblName, cdefs);
	let iRes = await db.exec(iStr);
	let res = await db.all(tQ);
	console.log({ res });
	//let te = await tableExists(db, tblName);
})();
*/

runCli(tstFncs);