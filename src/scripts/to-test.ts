/**
 * Testing TypeORM implementation
 */

import {runCli, getToDataSource, PkBaseEntity, typeOf, AppDataSource,emptySqliteTables, } from '../typeorm/index.js';

import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity, TableInheritance,ChildEntity,
	OneToMany, ManyToOne, JoinColumn, JoinTable,
   Tree,   TreeChildren, TreeParent, TreeLevelColumn,
} from "typeorm";

import { faker } from '@faker-js/faker';

// Creating Entities


@Entity() export class User extends PkBaseEntity {
	@Column({ unique: true, }) email: string;
	@Column() firstName: string;
	@Column({ nullable: true }) pwd: string;
	@OneToMany(() => Post, (post) => post.user) posts: Post[];
}

@Entity() export class Post extends PkBaseEntity {
	@Column() title: string;
	@Column() content: string;
	@ManyToOne(() => User, (user) => user.posts) user?: User; //Weirdly had to make this optional for TS to compile
}

await getToDataSource({entities:[User, Post]});

async function mkUsers(cnt=3) {
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
	console.log(`Got pk:`, { pk, pkId, toPk });

	let tstPostDatum = {title:"Manual Post Title4", content: "Manual Post Content4",user:pk,};
	let tstPost = Post.create(tstPostDatum);
	await tstPost.save();
	//pk.posts.push(Post.create(tstPostDatum));
	pk.posts = [tstPost,];
	await pk.save();

	// The below works after making the user in Post relationship optional
	// let tstPostDatum = {title:"Manual Post Title1", content: "Manual Post Content1",user:pk,};
	// let tstPost = Post.create(tstPostDatum);
	// await tstPost.save();

//	let tstPosts = Post.create([tstPostDatum]);
	//await Post.save(tstPosts);
	//await tstPost.save();

}

function mkUserData(cnt = 4) {
	let defUsrData = {
		firstName: "Paul",
		email: "p@b.com",
		pwd: "abcd",
		posts: [
			//{ title: "My First Post Title", content: "My First Post Content in Data", },
			Post.create({ title: "My First Post Title", content: "My First Post Content in Data", }),
		],
	};
	//let data:GenObj[] = [defUsrData];
	let data:any[] = [defUsrData];
	for (let i = 0; i < cnt; i++) {
		data.push({
			firstName: faker.person.firstName(),
			email: faker.internet.email(),
			pwd: 'tstpwd3',
	//		detailsJSON: { somDetails: faker.company.name() },
	//		posts: { create: mkPostData() },

		});
	}
	return data;
}
let fncs = {
  async tstInit() {
    console.log({AppDataSource});
  },
  async tstMkUsers() {
    let res = await mkUsers();
    console.log({res});
  },
}

runCli(fncs);