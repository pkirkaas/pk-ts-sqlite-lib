/**
 * TypeORM test entities and seed functions
 */


import "reflect-metadata";
import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity,  Point,
	OneToMany, ManyToOne, JoinColumn, JoinTable,
} from "typeorm";

//import { PkBaseEntity } from "../typeorm/to-entities.js";

import {runCli, GenObj, getToDataSource, PkBaseEntity, typeOf, AppDataSource,emptySqliteTables,
	haversine, PkBaseUser, mkPoint, resetToDataSource, origResetToDataSource, Location,
} from '../typeorm/index.js';


import { faker } from '@faker-js/faker';
import {pkfaker ,} from '../pkfaker/index.js';

// Create Test Entities

/**
 * US Locations based on zip code 
 */
@Entity() export class Place extends PkBaseEntity {
	//@Column({ unique: true, }) email: string;
	@Column() name: string;
	@Column() city: string;
	@Column() state: string;
	@Column() zip: string;
	@Column({nullable:true}) address: string;
	@Column(() => Location) loc:Location;
	@Column('float') lat: number;
	@Column('float') lon: number;
	@Column("geometry",{srid:4326}) lonlat:Point;
	@Column({nullable:true, type:"json"}) ziprow; // The zip row content
	@Column({nullable:true, type: "json",}) pdata; //Whatever optional place data  
	distance(place:GenObj) { // Testing DB distance queries with JS Haversine distance calc, in KM
		return Math.floor(haversine(this, place)/1000);
	}
	sayName() {
		return this.name;
	}
}
@Entity() export class User extends PkBaseUser {
	@Column({nullable:true, type:"geometry"}) lonlat:Point;
	@Column({nullable:true,}) zip:string;;
	@OneToMany(() => Post, (post) => post.user) posts: Post[];
}

/*
@Entity() export class User extends PkBaseEntity {
	@Column({ unique: true, }) email: string;
	@Column({default:"Default Name"}) firstName: string;
	//@Column("simple-json") udata;
	@Column({nullable:true, type:"json"}) udata;
	@Column({nullable:true, type:"geometry"}) lonlat:Point;
	@Column({nullable:true,}) zip:string;;
	@Column({ nullable: true }) pwd: string;
	@OneToMany(() => Post, (post) => post.user) posts: Post[];
}
*/

@Entity() export class Post extends PkBaseEntity {
	@Column() title: string;
	@Column() content: string;
	@ManyToOne(() => User, (user) => user.posts) user?: User; //Weirdly had to make this optional for TS to compile
}


export function mkPlaceData(state:string = 'CA') {
	let ziprow = pkfaker.randUsZip(state);
	let placeData:GenObj = {
		name:faker.person.firstName(),
		city:ziprow.city,
		zip:ziprow.zip,
		state:ziprow.state,
		lat:ziprow.lat,
		lon:ziprow.lon,
		ziprow,
		lonlat : mkPoint(ziprow),
	};
	return placeData;
};

export async function mkPlaces(cnt=900) {
    let bulkData = [];
    for (let i = 0 ; i < cnt; i++){
      let placeData = mkPlaceData();
      bulkData.push(placeData);

    }
    //console.log({placeData});
    let places = Place.create(bulkData);
    //await place.save();
    await Place.save(places);
    //console.log({place});
    console.log("Done Making Places!");

};

export async function mkUsers(cnt=3) {
//	await emptySqliteTables(litePath);
	let userData = mkUserData(cnt);
	console.log("About to create users w. data:", { userData });
	/*
	for (let ud of userData) {
		let usr =  User.create(ud);
		//await AppDataSource.manager.save(usr);
		await usr.save();
	}
	*/
	let usrs =  User.create(userData);
	//await usrs.save();
	await User.save(usrs);
	console.log("Saved users - now fetch one");
	let pk = await User.findOne({ where: { email: "p@b.com" }, relations: ["posts"] });
	let toPk = typeOf(pk)
	let pkId = pk.id;
	let userId = pk.id;

	//let tstPostDatum = {title:"Manual Post Title4", content: "Manual Post Content4",user:pk,};
	//let tstPostDatum = {title:"Manual Post Title4", content: "Manual Post Content4",user:pk,};
	let tstPostDatum = {title:"Opt Manual Post Title4", content: "Manual Post Content4",
	// userId , user_id:userId,
	 user:pk,};
	console.log(`Got pk:`, { pk, pkId, toPk, userId, tstPostDatum });
	let tstPost = Post.create(tstPostDatum);
	await tstPost.save();
	//pk.posts.push(Post.create(tstPostDatum));
	//pk.posts = [tstPost,];
	////await pk.save();

	// The below works after making the user in Post relationship optional
	// let tstPostDatum = {title:"Manual Post Title1", content: "Manual Post Content1",user:pk,};
	// let tstPost = Post.create(tstPostDatum);
	// await tstPost.save();

//	let tstPosts = Post.create([tstPostDatum]);
	//await Post.save(tstPosts);
	//await tstPost.save();
	console.log(`Done making seed users`);

}

export function mkUserData(cnt = 4) {
	let defUsrData = {
		name: "Paul",
		email: "p@b.com",
		pwd: "abcd",
		udata: {akey:"astr", intKey: 9,},
		posts: [
			//{ title: "My First Post Title", content: "My First Post Content in Data", },
			Post.create({ title: "My First Post Title", content: "My First Post Content in Data", }),
		],
	};
	//let data:GenObj[] = [defUsrData];
	let data:any[] = [defUsrData];
	for (let i = 0; i < cnt; i++) {
		let ziprow = pkfaker.randUsZip();
		data.push({
			name: faker.person.firstName(),
			email: faker.internet.email(),
			pwd: 'tstpwd3',
			udata: {strKey:"Here", intKey:i},
			zip: ziprow.zip,
	//		detailsJSON: { somDetails: faker.company.name() },
	//		posts: { create: mkPostData() },

		});
	}
	return data;
}