/**
 * Building a library of enhanced TypeORM Entities 
 */

import "reflect-metadata";
import {
	Entity, PrimaryGeneratedColumn, DeleteDateColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity,  Point, QueryBuilder, VirtualColumn, AfterLoad, FindOptions, 
	OneToMany, ManyToOne, JoinColumn, JoinTable,

} from "typeorm";

import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, validate, ValidatorOptions,} from "class-validator";

export const rules =  { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, validate, };



import {GenObj, typeOf,} from 'pk-ts-common-lib';
/**
 * Enhanced BaseEntity 
 */
export abstract class PkBaseEntity extends BaseEntity { //All entities should extend this  
	@PrimaryGeneratedColumn() id: number;
	@CreateDateColumn() createdAt: Date;
	@UpdateDateColumn() updatedAt: Date;
	@DeleteDateColumn() deletedAt: Date;
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
	//static newQueryBuilder(findOpts?:FindOptions):any {
	static newQueryBuilder(findOpts?:any):any {
	//static newQueryBuilder():QueryBuilder<any> {
		let tableName = this.getTableName();
		// @ts-ignore
		let qb = this.createQueryBuilder(tableName);
		if (findOpts) {
			qb.setFindOptions(findOpts);
		}
		return qb;
	}
	/**
	 * Validate the current instance according to class-validator rules
	 * @param vOpts:ValidatorOptions - opts for the validator library
	 * @param opts:GenObj - optional params for this function
	 * 
	 */

	/**
	 * Takes proposed instance data object, creates a new instance, validates it,
	 * and returns result
	 *  - an array of validation errors, or 
	 */
	static async  errors(data:any, vOpts?:ValidatorOptions, opts?:GenObj) {
		try {
		//@ts-ignore
		let instance = this.create(data);
		//@ts-ignore
		let res = await instance.errors(vOpts, opts);
		return res;
		} catch (err) {
			return err;
		}
	};

	async errors(vOpts?:ValidatorOptions, opts?:GenObj) {
		let errors = await validate(this,vOpts);
		if (errors.length) {
			return errors;
		}
		return false; // ?? what should success return?
	}
}


export abstract class PkBaseUser extends PkBaseEntity {
	@Column({ nullable: true, unique: true, }) @IsEmail() email: string;
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
















