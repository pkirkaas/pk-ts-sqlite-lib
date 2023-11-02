/**
 * SQLite implementation
 * Paul Kirkaas, March 2023
 */
import { isEmpty, isObject, slashPath, PkError, } from './index.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
sqlite3.verbose();
;
// you would have to import / invoke this in another file
//export async function openDb (filename ='./tmp/sqlite-tst.db' ) {
/**
 * Opens/creates  a sqlite file-based DB & returns it.
 * @param string|null filename
 * The absolute or relative (to invoking directory) path to the db file.
 * Creates if doesn't exist
 */
export async function openDb(filename) {
    if (!filename) {
        filename = process.env.SQLITE_DB;
    }
    if (!filename) {
        throw new PkError(`No fileName found in openDb`);
    }
    if ((filename !== ':memory') && !path.isAbsolute(filename)) {
        filename = slashPath(process.cwd(), filename);
    }
    console.log(`About to open [${filename}]`);
    return open({
        filename,
        driver: sqlite3.Database
    });
}
/**
 * create table in DB if not exists - create id by default
 */
export async function createTbl(db, tblName, colDefs) {
    if (!('id' in colDefs)) {
        //colDefs.id = "int primary key not null AUTOINCREMENT";
        colDefs.id = "INTEGER PRIMARY KEY AUTOINCREMENT";
    }
    let colDefArr = Object.entries(colDefs).map((entry) => {
        return entry.join(' ');
    });
    /*
    let colDefArr = colDefs.map((colDef) => {
        return Object.entries(colDef).join(' ');
    });
    */
    let colDefStr = colDefArr.join(', ');
    let cstr = `CREATE TABLE IF NOT EXISTS '${tblName}' (${colDefStr});`;
    console.log({ cstr });
    return db.exec(cstr);
}
export async function tableExists(db, tblName) {
    let teStr = ` SELECT EXISTS ( SELECT 'name' FROM 'sqlite_schema' WHERE 
        type='table' AND name='${tblName}'
    );`;
    let row = await db.get(teStr);
    if (!row || isEmpty(row) || !isObject(row)) {
        return false;
    }
    let vals = Object.values(row);
    if (!Array.isArray(vals) || !vals.length) {
        return false;
    }
    return vals[0];
}
//# sourceMappingURL=db-lib.js.map