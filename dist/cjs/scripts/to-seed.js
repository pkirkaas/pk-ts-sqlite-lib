/**
 * Test entities & seeds for exploring TypeORM
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import "reflect-metadata";
import { Entity, Column, OneToMany, ManyToOne, } from "typeorm";
//import { PkBaseEntity } from "../typeorm/to-entities.js";
import { PkBaseEntity, typeOf, haversine, } from '../typeorm/index.js';
import { faker } from '@faker-js/faker';
import { pkfaker, } from '../pkfaker/index.js';
// Create Test Entities
let Place = class Place extends PkBaseEntity {
    distance(place) {
        return Math.floor(haversine(this, place) / 1000);
    }
    sayName() {
        return this.name;
    }
};
__decorate([
    Column(),
    __metadata("design:type", String)
], Place.prototype, "name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Place.prototype, "city", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Place.prototype, "state", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Place.prototype, "zip", void 0);
__decorate([
    Column('float'),
    __metadata("design:type", Number)
], Place.prototype, "lat", void 0);
__decorate([
    Column('float'),
    __metadata("design:type", Number)
], Place.prototype, "lon", void 0);
__decorate([
    Column("geometry", { srid: 4326 }),
    __metadata("design:type", Object)
], Place.prototype, "lonlat", void 0);
__decorate([
    Column({ nullable: true, type: "json" }),
    __metadata("design:type", Object)
], Place.prototype, "ziprow", void 0);
Place = __decorate([
    Entity()
], Place);
export { Place };
let User = class User extends PkBaseEntity {
    ;
};
__decorate([
    Column({ unique: true, }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ default: "Default Name" }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    Column({ nullable: true, type: "json" }),
    __metadata("design:type", Object)
], User.prototype, "udata", void 0);
__decorate([
    Column({ nullable: true, type: "geometry" }),
    __metadata("design:type", Object)
], User.prototype, "lonlat", void 0);
__decorate([
    Column({ nullable: true, }),
    __metadata("design:type", String)
], User.prototype, "zip", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "pwd", void 0);
__decorate([
    OneToMany(() => Post, (post) => post.user),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
User = __decorate([
    Entity()
], User);
export { User };
let Post = class Post extends PkBaseEntity {
};
__decorate([
    Column(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.posts),
    __metadata("design:type", User)
], Post.prototype, "user", void 0);
Post = __decorate([
    Entity()
], Post);
export { Post };
export function mkPoint(src) {
    let point = {
        type: "Point",
        coordinates: [src.lon, src.lat],
    };
    return point;
}
export function mkPlaceData(state = 'CA') {
    let ziprow = pkfaker.randUsZip(state);
    let placeData = {
        name: faker.person.firstName(),
        city: ziprow.city,
        zip: ziprow.zip,
        state: ziprow.state,
        lat: ziprow.lat,
        lon: ziprow.lon,
        ziprow,
        lonlat: mkPoint(ziprow),
    };
    return placeData;
}
export async function mkUsers(cnt = 3) {
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
    let usrs = User.create(userData);
    //await usrs.save();
    await User.save(usrs);
    console.log("Saved users - now fetch one");
    let pk = await User.findOne({ where: { email: "p@b.com" }, relations: ["posts"] });
    let toPk = typeOf(pk);
    let pkId = pk.id;
    let userId = pk.id;
    //let tstPostDatum = {title:"Manual Post Title4", content: "Manual Post Content4",user:pk,};
    //let tstPostDatum = {title:"Manual Post Title4", content: "Manual Post Content4",user:pk,};
    let tstPostDatum = { title: "Opt Manual Post Title4", content: "Manual Post Content4",
        // userId , user_id:userId,
        user: pk, };
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
}
export function mkUserData(cnt = 4) {
    let defUsrData = {
        firstName: "Paul",
        email: "p@b.com",
        pwd: "abcd",
        udata: { akey: "astr", intKey: 9, },
        posts: [
            //{ title: "My First Post Title", content: "My First Post Content in Data", },
            Post.create({ title: "My First Post Title", content: "My First Post Content in Data", }),
        ],
    };
    //let data:GenObj[] = [defUsrData];
    let data = [defUsrData];
    for (let i = 0; i < cnt; i++) {
        let ziprow = pkfaker.randUsZip();
        data.push({
            firstName: faker.person.firstName(),
            email: faker.internet.email(),
            pwd: 'tstpwd3',
            udata: { strKey: "Here", intKey: i },
            zip: ziprow.zip,
            //		detailsJSON: { somDetails: faker.company.name() },
            //		posts: { create: mkPostData() },
        });
    }
    return data;
}
//# sourceMappingURL=to-seed.js.map