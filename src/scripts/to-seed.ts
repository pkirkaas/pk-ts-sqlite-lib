/**
 * Test entities & seeds for exploring TypeORM
 */

import { Place, User, Post, mkUsers,  mkPlaces,
} from '../typeorm/to-test-e-s.js';

import {
	runCli,
} from 'pk-ts-node-lib';

import {
	resetToDataSource,
} from '../typeorm/typeorm-lib.js';


let sfncs = {
	default() {
		console.log("The default seed function");
	},
	another() {
		console.log("The another, non-default function");
	},
	async seedPlaces() {
		let entities = [Place, User, Post];
		let ds = await resetToDataSource({entities});
		//let ds = await resetToDataSource(entities);
		//let ds = await origResetToDataSource(entities);
		await mkUsers();
		await mkPlaces();
		console.log(`Done seeding places and users`);
	},
};

runCli(sfncs);