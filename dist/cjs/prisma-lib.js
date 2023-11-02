"use strict";
/**
 * Prisma support functions - but to use, need to set up prisma in the implementing app
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.getTableMap = exports.tableMap = exports.addRelated = exports.clearTables = exports.getModelIds = exports.getPrisma = exports.prisma = void 0;
const init_js_1 = require("./init.js");
const client_1 = require("@prisma/client");
exports.prisma = {};
async function getPrisma(pextends) {
    if ((0, init_js_1.isEmpty)(exports.prisma)) {
        exports.prisma = await new client_1.PrismaClient();
        if (!(0, init_js_1.isEmpty)(pextends)) {
            exports.prisma = await exports.prisma.$extends(pextends);
        }
    }
    return exports.prisma;
}
exports.getPrisma = getPrisma;
async function getModelIds(modelName) {
    //@ts-ignore
    let info = await exports.prisma[modelName].findMany({ select: { id: true } });
    let ids = info.map((el) => el.id);
    //let info = await prisma.customer.findMany();
    return ids;
}
exports.getModelIds = getModelIds;
/**
 * Empty tables
 * @param string|array|null tables:
 *   table name, array of table names, or empty for all
 */
async function clearTables(tables) {
    if (tables && !Array.isArray(tables)) {
        tables = [tables];
    }
    let tableMap = await getTableMap();
    let tableNames = Object.keys(tableMap);
    if (!tables) {
        tables = tableNames;
    }
    if (!(0, init_js_1.isSubset)(tableNames, tables)) { //Bad table name in tables
        throw new init_js_1.PkError(`Invalid table name for clearTables:`, { tables, tableNames });
    }
    console.log({ tables });
    for (let table of tables) {
        console.log(`Trying to delete [${table}]`);
        //@ts-ignore
        await exports.prisma[table].deleteMany();
    }
}
exports.clearTables = clearTables;
async function addRelated(from, to) {
    let fromName = from.model;
    let toName = to.model;
    let toNameId = toName + 'Id';
    let updateQuery = {
        where: { id: from.id },
        data: {
            [toNameId]: to.id,
        }
    };
    let updateQuery2 = {
        where: { id: from.id },
        data: {
            [toName]: {
                connect: [{ id: to.id }],
            }
        }
    };
    console.log(`Executing update query on [${fromName}]:`, { updateQuery });
    //@ts-ignore
    let res = await exports.prisma[fromName].update(updateQuery);
    return res;
}
exports.addRelated = addRelated;
// Kind of caching of table map...
exports.tableMap = {};
/**
 * Gets table/field defs from the DB - for mapping JSON data to strings
 */
async function getTableMap() {
    if ((0, init_js_1.isEmpty)(exports.tableMap)) {
        let systbles = ['sqlite_sequence', '_prisma_migrations',];
        let nonFields = ['CONSTRAINT', 'CREATE'];
        let schme = await exports.prisma.$queryRawUnsafe('SELECT * FROM sqlite_schema');
        let tables = {};
        for (let ent of schme) {
            if ((ent.type !== 'table') || systbles.includes(ent.name)) {
                continue;
            }
            let sql = ent.sql;
            let sqlArr = sql.split('\n');
            let fieldMap = {};
            for (let fieldDef of sqlArr) {
                if ((0, init_js_1.strIncludesAny)(fieldDef, nonFields) || (fieldDef === ')')) {
                    continue;
                }
                let fieldDefArr = fieldDef.trim().split(' ');
                let name = fieldDefArr[0].replaceAll('"', '');
                let baseName = name;
                let type = fieldDefArr[1];
                if (name.includes('JSON')) {
                    type = 'JSON';
                    baseName = name.replace('JSON', '');
                }
                fieldMap[name] = { name, type, baseName };
            }
            tables[ent.name] = fieldMap;
        }
        exports.tableMap = tables;
    }
    return exports.tableMap;
}
exports.getTableMap = getTableMap;
;
/**
 * Get a model instance by id.
 * @param include - optional - string, array or object for complex includes
 */
async function getById(model, id, include = null) {
    id = parseInt(id);
    let query = { where: { id } };
    let origInclude = include;
    console.log("Entery getById - include:", { include });
    if (include) {
        id = parseInt(id);
        if (typeof include === 'string') {
            include = [include];
        }
        if (Array.isArray(include)) {
            let includeArr = include;
            include = {};
            for (let key of includeArr) {
                include[key] = true;
            }
        }
        if (!(0, init_js_1.isObject)(include)) {
            throw new init_js_1.PkError(`in getById - invalid arg for 'include':`, { origInclude, include });
        }
        if (!('include' in include)) {
            include = { include };
        }
        query.include = include.include;
    }
    console.log('Debugging getById include:', { include, query });
    //@ts-ignore
    return await exports.prisma[model].findUnique(query);
}
exports.getById = getById;
//# sourceMappingURL=prisma-lib.js.map