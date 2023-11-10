/**
 * Prisma support functions - but to use, need to set up prisma in the implementing app
 */
import { isObject, isPrimitive, PkError, isSubset, isEmpty, mergeAndConcat, asEnumerable, isSimpleObject, isJsonStr, } from './init.js';
import _ from "lodash";
import { Prisma, PrismaClient, } from '@prisma/client';
export let prisma = {};
/**
 * Singleton for getSchema
 */
let schema = {};
/**
 * Returns the hidden dmmf datamodel from Prisma, to get the schema
 */
export function getDatamodel(lPrisma = Prisma) {
    let aePrisma = asEnumerable(lPrisma);
    try {
        return aePrisma?.dmmf?.datamodel;
    }
    catch (e) {
        console.error(`Error in getDatamodel on Prisma`, e);
        return null;
    }
}
/**
 * Returns details of model fields, properties, relationships, etc, in friendly form.
 * @return GenObj of the form:
 * {
 *   [ModelName]: {
 *     allFields: { // All fields, relationship & model fields
 *       [fieldName] : [fieldSpec]
 *     },
 *     modelFields : { // Subset of all fields that are direct - like table fields
 *       [fieldName] : [fieldSpec]
 *     },
 *    relationFields : { //  fields that are relationships -
 *       [fieldName] : [fieldSpec]
 *     },
 *   }
 * }
 *
 * The fieldSpec for relationship fields has:
 * kind: 'object',
 * isList: true/false (true for one-to-many or many-to-many
 * relationpName : "PostToUser",
 * type: 'Post',
 *
 */
export function getSchema(lPrisma = Prisma) {
    if (isEmpty(schema)) {
        let datamodel = getDatamodel(lPrisma);
        let models = datamodel.models;
        let modelValues = Object.values(models);
        let ret = {};
        for (let key in models) { //Each el is an object
            let modelEl = models[key];
            if (!isObject(modelEl)) {
                //console.error(`No modelEl! for model key: [${key}]`);
                continue;
            }
            let modelName = modelEl.name;
            //ret[modelName] = modelEl; //
            let rawFields = modelEl.fields;
            let fieldInfo = {};
            let allFields = {};
            let modelFields = {};
            let relationFields = {};
            //for (let fieldSpec of Object.values(rawFields) as GenObj[]) { // Again, array of field objects
            for (let fieldKey in rawFields) { // Again, array of field objects
                let fieldSpec = rawFields[fieldKey];
                if ((fieldKey === 'undefined') || !isObject(fieldSpec)) {
                    continue;
                }
                let fieldName = fieldSpec.name;
                allFields[fieldName] = fieldSpec;
                if (fieldSpec.relationName) {
                    relationFields[fieldName] = fieldSpec;
                }
                else { //It's a table field? 
                    modelFields[fieldName] = fieldSpec;
                }
            }
            ret[modelName] = { allFields, relationFields, modelFields };
        }
        schema = ret;
    }
    return schema;
}
/**
 * Common enhancements/extensions to prisma client, to be merged
 * with custom extensions per implementing app
 */
export let commonExtends = {
    query: {
        $allModels: {
            // Convert all keys ending in JSON with object types into JSON strings
            create({ model, operation, args, query }) {
                //console.log(`in Query Extension, before JSONMod:`, { model, operation, args, });
                args = stringifyJSONfields(args);
                //console.log(`in Query Extension, AFTER JSONMod:`, { model, operation, args, });
                // your custom logic for modifying all operations on all models here
                return query(args);
            },
            update({ model, operation, args, query }) {
                args = stringifyJSONfields(args);
                return query(args);
            },
            /*
            findMany({ model, operation, args, query }) {
                console.log(`in query findMany, args:`, { args });
                return query(args)
            },
            */
        },
    },
    /*
    */
    result: {},
    model: {
        $allModels: {
            // Returns first matching instance, else null. Useless but code example
            async exists(where
            //): Promise<boolean> {
            ) {
                // Get the current model at runtime
                const context = Prisma.getExtensionContext(this);
                const result = context.findFirst({ where });
                //return result !== null
                return result; // Null or the instance
            },
            /**  Returns the findMany query with JSON string fields parsed to Objects
             * NOT chainable because awaits
             */
            async findManyParsed(args) {
                const context = Prisma.getExtensionContext(this);
                let res = await context.findMany(args);
                let ret = res.map((el) => {
                    return el.parsed();
                });
                return ret;
            },
            /**
             * Return the model field specifications as an object,
             * or just an array of their names
             */
            getAllFields(namesOnly = false) {
                let lSchema = getSchema();
                const context = Prisma.getExtensionContext(this);
                let modelName = context.name;
                let fieldSpecs = lSchema[modelName]['allFields'];
                if (namesOnly) {
                    return Object.keys(fieldSpecs);
                }
                return fieldSpecs;
            },
            getModelFields(namesOnly = false) {
                let lSchema = getSchema();
                const context = Prisma.getExtensionContext(this);
                let modelName = context.name;
                let fieldSpecs = lSchema[modelName]['modelFields'];
                if (namesOnly) {
                    return Object.keys(fieldSpecs);
                }
                return fieldSpecs;
            },
            getRelationFields(namesOnly = false) {
                let lSchema = getSchema();
                const context = Prisma.getExtensionContext(this);
                let modelName = context.name;
                let fieldSpecs = lSchema[modelName]['relationFields'];
                if (namesOnly) {
                    return Object.keys(fieldSpecs);
                }
                return fieldSpecs;
            },
            /*
            */
            /**
             * Returns an instance or refreshed instanced based on id, or null
             * So can add include relations if missing from orig result
             * @param idOrInstance - a model instance or ID
             * @param string|string[]|GenObj include - relations to include.
             *   string or array of strings to convert into object {[relName]:true}
            */
            async byId(idOrInstance, include = {}) {
                if (isObject(idOrInstance)) {
                    idOrInstance = idOrInstance.id;
                }
                if (typeof include === 'string') {
                    include = { [include]: true };
                }
                else if (Array.isArray(include)) {
                    let res = {};
                    for (let rel of include) {
                        res[rel] = true;
                    }
                    include = res;
                }
                let id = parseInt(idOrInstance);
                let query = {
                    where: { id }, include
                };
                //console.log({ query });
                const context = Prisma.getExtensionContext(this);
                //const result = (context as any).findFirst({ where: { id }, include });
                const result = context.findFirst(query);
                return result;
            },
            getFields() {
                const context = Prisma.getExtensionContext(this);
                let fields = asEnumerable(context.fields);
                return fields;
            },
            //Returns just the ids for instances - if where, matching, else all 
            async getIds(where) {
                //console.log(where);
                const context = Prisma.getExtensionContext(this);
                const result = await context.findMany({ select: { id: true }, where });
                let ids = result.map((el) => el.id);
                return ids;
            }
        },
    },
};
/**
 * Get just the tableFields of an instance, which may also contain computed fields
 * Should be moved into a chain of "extends"
 * @param model - the Prisma Model
 * @param instance - the prisma model instance
 * @param data - Optional - the data to merge
 * @return object with just the table values
 */
export function getMergedData(instance, data = {}) {
    let tableFields = Object.keys(instance.getModelClass().getFields());
    let instanceFields = _.pick(instance, tableFields);
    data = mergeAndConcat(instanceFields, data);
    return data;
}
/**
 * Takes an argument and returns an array of objects of {id:id}
 * For connect/disconnect/set
 * TODO: Arrays work for one-to-many, but not required - consider the other side - maybe only return array if input is array?
 * @param arg - instance ID or instance object, or array of ids or instances
 * @return {id:id}[]
 */
function toIdArray(arg) {
    if (!Array.isArray(arg)) {
        arg = [arg];
    }
    let ret = [];
    // @ts-ignore
    for (let el of arg) {
        if (isSimpleObject(el) && el.id) {
            ret.push({ id: el.id });
        }
        else if (isPrimitive(el)) {
            ret.push({ id: el });
        }
        else {
            throw new PkError(`Invalid arg to [toIdArr] - `, arg, el);
        }
    }
    return ret;
}
/**
 * Get key field names ending in JSON
 */
export function getJSONkeys(data) {
    let keys = Object.keys(data);
    let jsonKeys = keys.filter((key) => {
        return key.endsWith('JSON');
    });
    return jsonKeys;
}
/**
 * If data contains keys ending in *JSON, stringify the data value
 */
export function stringifyJSONfields(data) {
    if (isEmpty(data)) {
        return data;
    }
    let keys = Object.keys(data);
    let jKeys = getJSONkeys(data);
    for (let key of keys) {
        let val = data[key];
        //if (!isEmpty(val) && key.endsWith('JSON') && !isJson5Str(data[key])) {
        if (!isEmpty(val) && key.endsWith('JSON') && !isJsonStr(data[key])) {
            //data[key] = JSON5Stringify(data[key]);
            data[key] = JSON.stringify(data[key]);
        }
        else if (isObject(val)) {
            data[key] = stringifyJSONfields(data[key]);
            //data[key] = JSON5Stringify(data[key]);
        }
        /*
        for (let jKey of jKeys) {
            let val = data[jKey];
            if (!isJson5Str(val)) {
                data[jKey] = JSON5Stringify(data[jKey]);
            }
            */
        /*
        if (typeof val !== 'string') {
            data[jKey] = JSON.stringify(data[jKey]);
        }
        */
    }
    return data;
}
/**
 * If data contains keys ending in *JSON, JSON parse the data string value
 */
export function parseJSONfields(data) {
    if (isEmpty(data)) {
        return data;
    }
    let keys = Object.keys(data);
    for (let key of keys) {
        let val = data[key];
        //if (key.endsWith('JSON') && isJson5Str(data[key])) {
        if (key.endsWith('JSON') && isJsonStr(data[key])) {
            data[key] = JSON.parse(data[key]);
        }
        else if (isObject(val)) {
            data[key] = parseJSONfields(data[key]);
        }
    }
    return data;
}
/** Orig, non-recursive
export function parseJSONfields(data) {
    if (isEmpty(data)) {
        return data;
    }
    let jKeys = getJSONkeys(data);
    for (let jKey of jKeys) {
        let val = data[jKey];
        if (isJson5Str(val)) {
            data[jKey] = JSON5Parse(data[jKey]);
        }
    }
    return data;
}
*/
/**
 * Singleton implementation of PrismaClient, with some default extensions if you want it
 * Adds some generic methods to all Models & Instances
 * Opinionated (primary keys always integers, named id)
 * Not robust - it's on you
 */
export async function getPrisma(pextends = {}) {
    if (isEmpty(prisma)) {
        prisma = await new PrismaClient();
        // Internal functions to avoid copy/paste
        /**
         * Make data for connect/disconnect/set, also saving instance changes
         */
        function mkRelUpdate(instance, relname, rels, operation) {
            let modelClass = instance.getModelClass();
            let relArr = toIdArray(rels);
            let id = instance.id;
            let data = getMergedData(instance, { [relname]: { [operation]: relArr } });
            return modelClass.update({
                where: { id },
                data,
            });
        }
        let fieldDefs = {
            // TODO: Make work with instance data that has been locally modified.
            // Saves changes to instance data, and any data passed as data arg
            save: {
                needs: { id: true, },
                //compute: async function (instance) {
                compute: function (instance) {
                    let modelClass = instance.getModelClass();
                    let id = instance.id;
                    //console.log("Enter save; instance:", { instance });
                    return (data = {}) => {
                        // Experiment with this - check edge cases
                        data = getMergedData(instance, data);
                        //EXPERIMENT TO CONVERT fields with xxxJSON to JSON stringify
                        let dataKeys = Object.keys(data);
                        //console.log({ data, tableFields, instanceFields });
                        let res = modelClass.update({
                            where: { id },
                            data,
                        });
                        return res;
                    };
                }
            },
            /**
             * Connect/disconnect/set one-to-many relationships
             * Also saves instance changes
             * Fragile - depends on calling with appropriate relationship name
             */
            connect: {
                needs: { id: true, },
                compute: function (instance) {
                    return (relname, rels) => {
                        return mkRelUpdate(instance, relname, rels, 'connect');
                    };
                }
            },
            disconnect: {
                needs: { id: true, },
                compute: function (instance) {
                    return (relname, rels) => {
                        return mkRelUpdate(instance, relname, rels, 'disconnect');
                    };
                }
            },
            set: {
                needs: { id: true, },
                compute: function (instance) {
                    return (relname, rels) => {
                        return mkRelUpdate(instance, relname, rels, 'set');
                    };
                }
            },
            parsed: {
                //compute(instance) {
                needs: { id: true, },
                compute: function (instance) {
                    //console.log(`In pre-parsed, instance:`, { instance });
                    //instance =  parseJSONfields(instance);
                    //console.log(`In post-parsed, instance:`, { instance });
                    return () => {
                        return parseJSONfields(instance);
                    };
                }
            },
            tstArg: {
                //compute(instance) {
                needs: { id: true, },
                compute: function (instance) {
                    return (it) => {
                        return it;
                    };
                }
            },
        };
        //let tstRes = await addFieldsToAllResults({ silly: fieldDef });
        let tstRes = await addFieldsToAllResults(fieldDefs);
        let resExtensions = await addModelNameToAllResults();
        commonExtends.result = mergeAndConcat(commonExtends.result, resExtensions);
        let mExtends = mergeAndConcat(commonExtends, pextends);
        prisma = await prisma.$extends(mExtends).$extends(tstRes);
    }
    return prisma;
}
/** Returns the model names known to Prisma
 *  Can be Model names or Table names
 * @param boolean key : true - return the keys or values
 * @return string[] = the model or table names
// { User: 'User', Post: 'Post', Category: 'Category' }
 * Maps model names to table names - not sure which is which...
 */
export function getModelNames(key = true) {
    let modelNames = Prisma.ModelName; //Simple object
    if (key) {
        return Object.keys(modelNames);
    }
    else {
        return Object.values(modelNames);
    }
}
export async function getModelIds(modelName) {
    //@ts-ignore
    let info = await prisma[modelName].findMany({ select: { id: true } });
    let ids = info.map((el) => el.id);
    //let info = await prisma.customer.findMany();
    return ids;
}
/**
 * Empty tables
 * @param string|array|null tables:
 *   table name, array of table names, or empty for all
 */
export async function clearTables(tables) {
    if (tables && !Array.isArray(tables)) {
        tables = [tables];
    }
    let tableNames = getModelNames();
    if (!tables) {
        tables = tableNames;
    }
    if (!isSubset(tableNames, tables)) { //Bad table name in tables
        throw new PkError(`Invalid table name for clearTables:`, { tables, tableNames });
    }
    //console.log({ tables });
    for (let table of tables) {
        //console.log(`Trying to delete [${table}]`);
        try {
            //@ts-ignore
            await prisma[table].deleteMany();
        }
        catch (e) {
            console.error(`Problem emptying table: [${table}]:`, e);
        }
    }
}
/**
 * Gotta be a better way - but adds modelName & lcModelName to all results
 * @return object to be merged to result key of $extends
 */
async function addModelNameToAllResults() {
    let modelNames = getModelNames();
    let res = {};
    for (let name of modelNames) {
        let lcName = name.toLowerCase();
        res[lcName] = {
            modelName: {
                needs: {},
                compute() {
                    return name;
                }
            },
            lcModelName: {
                needs: {},
                compute() {
                    return lcName;
                }
            },
            getModelClass: {
                needs: {},
                compute(instance) {
                    return () => prisma[name];
                }
            },
        };
    }
    return res;
}
/**
 * To add methods/computed properties to ALL model instances.
 * THOUGHT the $extends.result key accepted $allInstances, like
 * model $allModels, but not?
 * @param object {fieldName:fieldDef - like: {needs:{}, compute: function (instance) {
 *   return something;
 * }
 */
//async function addFieldsToAllResults(fieldName:string, fieldDef:GenObj) {
async function addFieldsToAllResults(fieldDefs) {
    let modelNames = getModelNames();
    let res = {};
    let fieldNames = Object.keys(fieldDefs);
    for (let fieldName of fieldNames) {
        let fieldDef = fieldDefs[fieldName];
        for (let name of modelNames) {
            let lcName = name.toLowerCase();
            if (!res[lcName]) {
                res[lcName] = {};
            }
            //res[lcName] = { fieldName: fieldDef }; 
            res[lcName][fieldName] = fieldDef;
        }
    }
    return { result: res };
}
/*
async function addCompFieldToAllResults() {
    let modelNames = getModelNames();
    let res: GenObj = {};
    for (let name of modelNames) {
        let lcName = name.toLowerCase();
        res[lcName] = {
            modelName: {
                compute() {
                    return name;
                }
            },
            lcModelName: {
                compute() {
                    return lcName;
                }
            },
            modelClass: {
                compute(instance) {
                    return prisma[lcName];
                }
            },
        };
    }
    return res;
}
*/
// Kind of caching of table map...
export let tableMap = {};
/**
 * Gets table/field defs from the DB - for mapping JSON data to strings
 */
/*
export async function getTableMap() {
    if (isEmpty(tableMap)) {
        let systbles = ['sqlite_sequence', '_prisma_migrations',];
        let nonFields = ['CONSTRAINT', 'CREATE'];
        let schme: GenObj[] = await prisma.$queryRawUnsafe('SELECT * FROM sqlite_schema');
        let tables: GenObj = {};
        for (let ent of schme) {
            if ((ent.type !== 'table') || systbles.includes(ent.name)) {
                continue;
            }
            let sql = ent.sql;
            let sqlArr = sql.split('\n');
            let fieldMap: GenObj = {};
            for (let fieldDef of sqlArr) {
                if (strIncludesAny(fieldDef, nonFields) || (fieldDef === ')')) {
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
        tableMap = tables;
    }
    return tableMap;
};
*/
/**
 * Get a model instance by id.
 * @param include - optional - string, array or object for complex includes
 */
/*
export async function getById(model, id, include: any = null) {
    id = parseInt(id);
    let query: GenObj = { where: { id } };
    let origInclude = include;
    //console.log("Entery getById - include:", { include });
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
        if (!isObject(include)) {
            throw new PkError(`in getById - invalid arg for 'include':`, { origInclude, include });
        }
        if (!('include' in include)) {
            include = { include };
        }
        query.include = include.include;
    }
    //console.log('Debugging getById include:', { include, query });

    //@ts-ignore
    return await prisma[model].findUnique(query);
}
*/
/*
export async function addRelated(from: GenObj, to: GenObj) {
    let fromName = from.model;
    let toName = to.model;
    let toNameId = toName + 'Id';
    let updateQuery =
    {
        where: { id: from.id },
        data: {
            [toNameId]: to.id,
        }
    };

    let updateQuery2 =
    {
        where: { id: from.id },
        data: {
            [toName]: {
                connect: [{ id: to.id }],
            }
        }
    };
    //console.log(`Executing update query on [${fromName}]:`, { updateQuery });
    //@ts-ignore
    let res = await prisma[fromName].update(updateQuery);
    return res;
}
*/
//# sourceMappingURL=prisma-lib.js.map