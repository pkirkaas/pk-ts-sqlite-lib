/**
 * Experimenting with 3 kinds of table/entity inheritance
 */

import "reflect-metadata";
import {
  Raw,
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  BaseEntity, TableInheritance, ChildEntity,
  OneToMany, ManyToOne, JoinColumn, JoinTable,
  Tree, TreeChildren, TreeParent, TreeLevelColumn,
} from "typeorm";

import {
  PkBaseEntity, resetToDataSource, AppDataSource, getToDataSource, typeOf, typeOfEach,
} from '../../typeorm/index.js';

// Multi-table / concrete inheritance

@Entity() export class MtUser extends PkBaseEntity {
  //@Column({ default:"DefU2Name"}) uName : string;
  @Column() uname: string;
  //@OneToMany(() => MtBase, (mtbase) => mtbase.user) mtbases: MtBase[];
  @OneToMany(() => MtChild1, (mtbase) => mtbase.user) mtbases: MtChild1[];

}

export abstract class MtBase extends PkBaseEntity {
  @Column({ default: "DefBName" }) eName: string;;
  //@Column({type:"int", default: 7}) eInt :integer;
  @Column({ default: 7 }) eInt: number;
  //@ManyToOne(() => MtUser, (user) => user.mtbases) user?: MtUser;
}

@Entity() export class MtChild1 extends MtBase {
  @Column({ default: "DefC1Name" }) c1Name: string;
  @Column({ type: "int", default: 9 }) c1Int;
  @ManyToOne(() => MtUser, (user) => user.mtbases) user?: MtUser;

}

@Entity() export class MtChild2 extends MtBase {
  @Column({ type: "text", default: "DefC2Name" }) c2Name;
  @Column({ type: "int", default: 12 }) c2Int;
}



export async function mkMtTests() {
  let entities = [MtChild1, MtChild2, MtUser];
  let ds = await resetToDataSource({ entities }); //
  let uData: any = { uname: "JoeC" };
  let user = MtUser.create(uData);
  //@ts-ignore
  //await user.save();
  //let user =  MtUser.create([uData]); 
  await MtUser.save(user);
  //return user;
  //return "What?";
}

// Single table inheritance

@Entity() export class stUser extends PkBaseEntity {
  //@Column({ default:"DefU2Name"}) uName : string;
  @Column() uname: string;
  //@OneToMany(() => MtBase, (mtbase) => mtbase.user) mtbases: MtBase[];
  @OneToMany(() => Content, (content) => content.user) contents: Content[];

}
@Entity() @TableInheritance({ column: { type: "varchar", name: "type" } })
export class Content extends PkBaseEntity {
  @Column() title: string
  @Column() description: string
  @ManyToOne(() => stUser, (user) => user.contents) user?: stUser;
}
@ChildEntity()
export class Photo extends Content {
  @Column() size: string
}
@ChildEntity()
export class Question extends Content {
  @Column() answersCount: number
}


export async function mkStTests() {
  let entities = [Content, Photo, Question, stUser];
  //let entities = [  Photo, Question,  stUser];
  let ds = await resetToDataSource({ entities }); //
  //let uData: any = { uname: "JoeSingle" };
  let uData: any = { uname: "JoeSingle" };
  let user = stUser.create(uData);
  //@ts-ignore
  //await user.save();
  //let user =  MtUser.create([uData]); 
  await user.save(user);

  let photoData: any = {
    description: "A Photo Description",
    title: "My photo title",
    size: 74,
  }
  let photo = Photo.create(photoData);
  await photo.save();
  let qData:any = {
    description: "A Question Description",
    title: "My Question title",
    answersCount: 99,
  }
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
  },
  );

  let usr = usrs[0];
  let c1 = usr.contents[0];
  let c2 = usr.contents[1];
  let toUsr = typeOf(usr);
  let toC1 = typeOf(c1);
  let toC2 = typeOf(c2);

  console.log(typeOfEach({usr, c1, c2,}));
  console.log({toUsr, toC1, toC2});
  
  return usrs;

}
