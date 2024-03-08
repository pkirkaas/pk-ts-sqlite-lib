/**
 * Seed the test prisma tables - clear them first
 * Use faker, etc to generate data
 */
import { Prisma, PrismaClient } from '@prisma/client'

import {
	getPrisma, clearTables, runCli,
	isObject, dtFmt, isPrimitive, GenObj, PkError, isSubset, strIncludesAny, isEmpty, mergeAndConcat, asEnumerable,
	isNumeric, asNumeric, isSimpleObject, dbgWrt,  JSON5Stringify, JSON5Parse,
	isJson5Str, isJsonStr,keysToJson, keysFromJson, stringifyJSONfields, parseJSONfields, jsonClone,

} from '../prisma/index.js';

import { faker } from '@faker-js/faker';

let usrCnt = 8;
let pstCnt = 3;

const prisma = await getPrisma();

function mkPostData(cnt = pstCnt) {
	let data = [];
	for (let i = 0; i < cnt; i++) {
		data.push({
			published: true,
			title: faker.company.catchPhrase(),
			content:faker.lorem.paragraph(), 
			postJSON: { post: "More JSON" },
		});
	}
	return data;
}

function mkUsrData(cnt = usrCnt) {
	let data = [];
	for (let i = 0; i < cnt; i++) {
		data.push({
			name: faker.person.firstName(),
			email: faker.internet.email(),
			pwd: 'tstpwd',
			tstDataJSON: { good: "day" },
			posts: { create: mkPostData() },

		});
	}
	return data;
}

async function mkUsers(cnt = usrCnt) {
	let dataArr = mkUsrData(cnt);
	let users = [];
	for (let data of dataArr) {
		users.push(await prisma.user.create({ data }));
	}
	return users;
}


/** New main seed
 * 
 */

async function tstJson() {
	let usrData = mkUsrData(3);
	let origData = jsonClone(usrData);
	let parsedData = stringifyJSONfields(usrData);
	//dbgWrt({ usrData, origData, parsedData });
	dbgWrt({  parsedData });
	console.log({ origData, parsedData });

}
async function main() {
	try {
		await clearTables();
		let users = await mkUsers();
		return users;
	} catch (e) {
		console.error(`Error in seeding:`, e);
	}
}



async function mainOrig() {
//	const prisma = await getPrisma();
	try {
		await clearTables();
		const alice = await prisma.user.upsert({
			where: { email: 'alice@prisma.io' },
			update: {},
			create: {
				email: 'alice@prisma.io',
				name: 'Alice',
				posts: {
					create: {
						title: 'Check out Prisma with Next.js',
						content: 'https://www.prisma.io/nextjs',
						published: true,
					},
				},
			},
		})
		const bob = await prisma.user.upsert({
			where: { email: 'bob@prisma.io' },
			update: {},
			create: {
				email: 'bob@prisma.io',
				name: 'Bob',
				posts: {
					create: [
						{
							title: 'Follow Prisma on Twitter',
							content: 'https://twitter.com/prisma',
							published: true,
						},
						{
							title: 'Follow Nexus on Twitter',
							content: 'https://twitter.com/nexusgql',
							published: true,
						},
					],
				},
			},
		})
		console.log({ alice, bob })
	} catch (e) {
		console.error(`Error in seeding:`, e);
	}

}

let tstFncs = {
	main: function() {
		return main();
	},
	tstJson: function () {
		return tstJson();
	},
};
//await main();
//await tstJson();

runCli(tstFncs);