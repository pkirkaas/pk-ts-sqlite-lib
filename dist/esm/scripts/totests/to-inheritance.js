/**
 * Experimenting with 3 kinds of table/entity inheritance
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
import { Entity, Column, TableInheritance, ChildEntity, OneToMany, ManyToOne, } from "typeorm";
import { PkBaseEntity, resetToDataSource, getToDataSource, typeOf, typeOfEach, } from '../../typeorm/index.js';
// Multi-table / concrete inheritance
let MtUser = class MtUser extends PkBaseEntity {
    //@Column({ default:"DefU2Name"}) uName : string;
    uname;
    //@OneToMany(() => MtBase, (mtbase) => mtbase.user) mtbases: MtBase[];
    mtbases;
};
__decorate([
    Column(),
    __metadata("design:type", String)
], MtUser.prototype, "uname", void 0);
__decorate([
    OneToMany(() => MtChild1, (mtbase) => mtbase.user),
    __metadata("design:type", Array)
], MtUser.prototype, "mtbases", void 0);
MtUser = __decorate([
    Entity()
], MtUser);
export { MtUser };
export class MtBase extends PkBaseEntity {
    eName;
    ;
    //@Column({type:"int", default: 7}) eInt :integer;
    eInt;
}
__decorate([
    Column({ default: "DefBName" }),
    __metadata("design:type", String)
], MtBase.prototype, "eName", void 0);
__decorate([
    Column({ default: 7 }),
    __metadata("design:type", Number)
], MtBase.prototype, "eInt", void 0);
let MtChild1 = class MtChild1 extends MtBase {
    c1Name;
    c1Int;
    user;
};
__decorate([
    Column({ default: "DefC1Name" }),
    __metadata("design:type", String)
], MtChild1.prototype, "c1Name", void 0);
__decorate([
    Column({ type: "int", default: 9 }),
    __metadata("design:type", Object)
], MtChild1.prototype, "c1Int", void 0);
__decorate([
    ManyToOne(() => MtUser, (user) => user.mtbases),
    __metadata("design:type", MtUser)
], MtChild1.prototype, "user", void 0);
MtChild1 = __decorate([
    Entity()
], MtChild1);
export { MtChild1 };
let MtChild2 = class MtChild2 extends MtBase {
    c2Name;
    c2Int;
};
__decorate([
    Column({ type: "text", default: "DefC2Name" }),
    __metadata("design:type", Object)
], MtChild2.prototype, "c2Name", void 0);
__decorate([
    Column({ type: "int", default: 12 }),
    __metadata("design:type", Object)
], MtChild2.prototype, "c2Int", void 0);
MtChild2 = __decorate([
    Entity()
], MtChild2);
export { MtChild2 };
export async function mkMtTests() {
    let entities = [MtChild1, MtChild2, MtUser];
    let ds = await resetToDataSource({ entities }); //
    let uData = { uname: "JoeC" };
    let user = MtUser.create(uData);
    //@ts-ignore
    //await user.save();
    //let user =  MtUser.create([uData]); 
    await MtUser.save(user);
    //return user;
    //return "What?";
}
// Single table inheritance
let stUser = class stUser extends PkBaseEntity {
    //@Column({ default:"DefU2Name"}) uName : string;
    uname;
    //@OneToMany(() => MtBase, (mtbase) => mtbase.user) mtbases: MtBase[];
    contents;
};
__decorate([
    Column(),
    __metadata("design:type", String)
], stUser.prototype, "uname", void 0);
__decorate([
    OneToMany(() => Content, (content) => content.user),
    __metadata("design:type", Array)
], stUser.prototype, "contents", void 0);
stUser = __decorate([
    Entity()
], stUser);
export { stUser };
let Content = class Content extends PkBaseEntity {
    title;
    description;
    user;
};
__decorate([
    Column(),
    __metadata("design:type", String)
], Content.prototype, "title", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Content.prototype, "description", void 0);
__decorate([
    ManyToOne(() => stUser, (user) => user.contents),
    __metadata("design:type", stUser)
], Content.prototype, "user", void 0);
Content = __decorate([
    Entity(),
    TableInheritance({ column: { type: "varchar", name: "type" } })
], Content);
export { Content };
let Photo = class Photo extends Content {
    size;
};
__decorate([
    Column(),
    __metadata("design:type", String)
], Photo.prototype, "size", void 0);
Photo = __decorate([
    ChildEntity()
], Photo);
export { Photo };
let Question = class Question extends Content {
    answersCount;
};
__decorate([
    Column(),
    __metadata("design:type", Number)
], Question.prototype, "answersCount", void 0);
Question = __decorate([
    ChildEntity()
], Question);
export { Question };
export async function mkStTests() {
    let entities = [Content, Photo, Question, stUser];
    //let entities = [  Photo, Question,  stUser];
    let ds = await resetToDataSource({ entities }); //
    //let uData: any = { uname: "JoeSingle" };
    let uData = { uname: "JoeSingle" };
    let user = stUser.create(uData);
    //@ts-ignore
    //await user.save();
    //let user =  MtUser.create([uData]); 
    await user.save(user);
    let photoData = {
        description: "A Photo Description",
        title: "My photo title",
        size: 74,
    };
    let photo = Photo.create(photoData);
    await photo.save();
    let qData = {
        description: "A Question Description",
        title: "My Question title",
        answersCount: 99,
    };
    let question = Question.create(qData);
    await question.save();
    user.contents = [photo, question];
    await user.save();
}
export async function fetchStUsr() {
    let entities = [Content, Photo, Question, stUser];
    let ds = await getToDataSource({ entities });
    let usrs = await stUser.find({
        relations: {
            contents: true,
        },
    });
    let usr = usrs[0];
    let c1 = usr.contents[0];
    let c2 = usr.contents[1];
    let toUsr = typeOf(usr);
    let toC1 = typeOf(c1);
    let toC2 = typeOf(c2);
    console.log(typeOfEach({ usr, c1, c2, }));
    console.log({ toUsr, toC1, toC2 });
    return usrs;
}
//# sourceMappingURL=to-inheritance.js.map