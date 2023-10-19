"use strict";
/**
 * SQLite implementation for Signifly Case Assignment for Paul Kirkaas
 * Paul Kirkaas, March 2023
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableExists = exports.createTbl = exports.openDb = void 0;
const init_js_1 = require("./init.js");
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
sqlite3_1.default.verbose();
;
// you would have to import / invoke this in another file
async function openDb(filename = './tmp/signifly.db') {
    return (0, sqlite_1.open)({
        filename,
        driver: sqlite3_1.default.Database
    });
}
exports.openDb = openDb;
/**
 * create table in DB if not exists - create id by default
 */
async function createTbl(db, tblName, colDefs) {
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
exports.createTbl = createTbl;
async function tableExists(db, tblName) {
    let teStr = ` SELECT EXISTS ( SELECT 'name' FROM 'sqlite_schema' WHERE 
        type='table' AND name='${tblName}'
    );`;
    let row = await db.get(teStr);
    if (!row || (0, init_js_1.isEmpty)(row) || !(0, init_js_1.isObject)(row)) {
        return false;
    }
    let vals = Object.values(row);
    if (!Array.isArray(vals) || !vals.length) {
        return false;
    }
    return vals[0];
}
exports.tableExists = tableExists;
//# sourceMappingURL=db-lib.js.map