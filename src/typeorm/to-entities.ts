/**
 * Building a library of enhanced TypeORM Entities 
 */

import "reflect-metadata";
import {
	Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
	BaseEntity, 
	OneToMany, ManyToOne, JoinColumn, JoinTable,

} from "typeorm";

export class PkBaseEntity extends BaseEntity { //All entities should extend this  
	@PrimaryGeneratedColumn() id: string;
	@CreateDateColumn() createdAt: Date;
	@UpdateDateColumn() updatedAt: Date;
	static getTableName():string {
		return this.getRepository().metadata.tableName;
	}

	//static aQueryBuilder():QueryBuilder {
	static newQueryBuilder():any {
		let tableName = this.getTableName();
		return this.createQueryBuilder(tableName);
	}
}