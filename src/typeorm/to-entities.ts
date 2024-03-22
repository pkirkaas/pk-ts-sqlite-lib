/**
 * Building a library of enhanced TypeORM Entities 
 */

import "reflect-metadata";
import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity,  Point, QueryBuilder, VirtualColumn, AfterLoad,
	OneToMany, ManyToOne, JoinColumn, JoinTable,

} from "typeorm";

/**
 * Enhanced BaseEntity 
 */
export abstract class PkBaseEntity extends BaseEntity { //All entities should extend this  
	@PrimaryGeneratedColumn() id: string;
	@CreateDateColumn() createdAt: Date;
	@UpdateDateColumn() updatedAt: Date;
	@Column({nullable:true, type:"json"}) edata; //Whatever JSON data an entity wants...

	/**
	 *  Returns the table name for this entity type
	 * @returns string - table name of the entity
	 */
	static getTableName():string {
		// @ts-ignore
		return this.getRepository().metadata.tableName;
	}

	/**
	 * A new query builder for this entity, without needing the table name 
	 * CAN USE JUST andWhere, don't need to start w. where
	 * @returns queryBulder for this entity
	 */
	static newQueryBuilder():any {
	//static newQueryBuilder():QueryBuilder<any> {
		let tableName = this.getTableName();
		// @ts-ignore
		let qb = this.createQueryBuilder(tableName);
		return qb;
	}
}

export abstract class PkBaseUser extends PkBaseEntity {
	@Column({ nullable: true, unique: true, }) email: string;
	@Column({nullable: true, default:"Default Name"}) name: string;
	@Column({ nullable: true }) pwd: string;
	@Column({nullable:true, type:"json"}) udata;
	// @ts-ignore
	@AfterLoad() virtc() { this.virtne =  `NAMEEMAIL: ${this.email} ${this.name}`; }
	
	get namemail() {
		return `NAMEEMAIL: ${this.email} ${this.name}`; 
	}
}

//Experiment w. embedded entity props

/**
 * Until further investigation, Entities that include this embedded should define it as:
 *	@Column(() => Location) loc:Location;
 * Idea is to automatically create the geopont from lat, lon, and add "distance" query
 */
export class Location {
	@Column({nullable:true,}) lat: number;
	@Column({nullable:true,}) lon: number;
	@Column('geometry', {srid:4326, nullable:true,}) geopt: Point;
	static getWhats():string {
		return "That's what";
	}
}
















