/**
 * Tests for Prisma DB
 * Assumes Prisma has been initialized
 */
import { dbgWrt, runCli, getPrisma, allProps, getProps, asEnumerable, } from '../index.js';
let prisma = await getPrisma();
import { typeOf } from 'pk-ts-common-lib';
let testsFs = {
    doesRun: function () {
        console.log("Yes, does Run!!");
    },
    tstDMMF: async function () {
        let pmx = await getPrisma();
        let dmmf = asEnumerable(pmx);
        //let pmxProps = allProps(pmx, 'tpv', 4);
        //let fields = asEnumerable(pmx.user.fields);
        dbgWrt(dmmf);
        //console.log({ pmxProps });
        console.log("Done");
    },
    tstClient: async function () {
        let pmx = await getPrisma();
        let pmxProps = allProps(pmx, 'tpv', 4);
        let fields = asEnumerable(pmx.user.fields);
        dbgWrt(pmxProps);
        //console.log({ pmxProps });
        console.log("Done", { fields });
    },
    tstFields: async function () {
        //let pmx = await getPrisma();
        let uModel = await prisma.user;
        let pModel = await prisma.post;
        let uFields = uModel.getFields();
        let pFields = pModel.getFields();
        console.log({ uFields, pFields });
    },
    tstUsrs: async function () {
        let pmx = await getPrisma();
        let uModel = await prisma.user;
        //let UMProps = allProps(uModel,'tv',2);
        //let UMProps = uModel.name;
        //let UMProps = allProps(uModel,'tpv',2);
        let UMProps = allProps(uModel, 'tpv', 1);
        //let uFields = await uModel.fields;
        // @ts-ignore
        //let uFields = pmx.DMMF;
        //let uFields = uModel['fields'];
        let uFields = uModel.fields;
        let uFieldProps = allProps(uFields, 'tpv', 2);
        let uFieldReal = allProps(uFields, 'v', 1);
        let uFieldGet = getProps(uFields);
        let uFieldKeys = Object.getOwnPropertyNames(uFields);
        let fieldsObj = {};
        for (let fKey of uFieldKeys) {
            fieldsObj[fKey] = uFields[fKey];
        }
        //let uFields = await pmx.introspection; //.modelFields[uModel.name];
        //let uFields =  pmx._dmmf.modelFields[uModel.name];
        //let PrismaProps = allProps(Prisma,'tpv',1);
        //let ModelName = Prisma.ModelName;
        //let pmxProps = allProps(pmx,'tpv',3);
        //	let 
        //let PCProps = getProps(pmx);
        //let UMPropsT = allPropsWithTypes(uModel);
        let toUM = typeOf(uModel);
        let user = await prisma.user.findFirst({
            include: { posts: false }
        });
        //let toUsr = typeOf(user);
        //let MCfromUsr = await user.getModelClass();
        //dbgWrt(pmxProps);
        dbgWrt(fieldsObj);
        console.log({
            user,
            uFieldReal,
            uFieldGet,
            uFieldKeys,
            fieldsObj,
            //MCfromUsr,
            //toUsr,
            //toUM,
            //	UMProps,
            //		uFields,
            //		uFieldProps,
            //PrismaProps,
            //PCProps,
            //	pmxProps,
            //ModelName,
            //UMPropsT,
        });
    }
};
runCli(testsFs);
//# sourceMappingURL=ptest.js.map