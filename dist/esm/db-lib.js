/**
 * SQLite implementation for Signifly Case Assignment for Paul Kirkaas
 * Paul Kirkaas, March 2023
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
import { isEmpty, isObject } from './init.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
sqlite3.verbose();
;
// you would have to import / invoke this in another file
export function openDb(filename = './tmp/signifly.db') {
    return __awaiter(this, void 0, void 0, function* () {
        return open({
            filename,
            driver: sqlite3.Database
        });
    });
}
/**
 * create table in DB if not exists - create id by default
 */
export function createTbl(db, tblName, colDefs) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
export function tableExists(db, tblName) {
    return __awaiter(this, void 0, void 0, function* () {
        let teStr = ` SELECT EXISTS ( SELECT 'name' FROM 'sqlite_schema' WHERE 
        type='table' AND name='${tblName}'
    );`;
        let row = yield db.get(teStr);
        if (!row || isEmpty(row) || !isObject(row)) {
            return false;
        }
        let vals = Object.values(row);
        if (!Array.isArray(vals) || !vals.length) {
            return false;
        }
        return vals[0];
    });
}
//# sourceMappingURL=db-lib.js.map