/**
 * Building a library of enhanced TypeORM Entities 
 */

import "reflect-metadata";
import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity, 
	OneToMany, ManyToOne, JoinColumn, JoinTable,

} from "typeorm";

/**
 * Enhanced BaseEntity 
 */
export abstract class PkBaseEntity extends BaseEntity { //All entities should extend this  
	@PrimaryGeneratedColumn() id: string;
	@CreateDateColumn() createdAt: Date;
	@UpdateDateColumn() updatedAt: Date;

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
}