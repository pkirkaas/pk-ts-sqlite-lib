/**
 * Building a library of enhanced TypeORM Entities
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
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, } from "typeorm";
/**
 * Enhanced BaseEntity
 */
export class PkBaseEntity extends BaseEntity {
    /**
     *  Returns the table name for this entity type
     * @returns string - table name of the entity
     */
    static getTableName() {
        // @ts-ignore
        return this.getRepository().metadata.tableName;
    }
    /**
     * A new query builder for this entity, without needing the table name
     * CAN USE JUST andWhere, don't need to start w. where
     * @returns queryBulder for this entity
     */
    static newQueryBuilder() {
        let tableName = this.getTableName();
        // @ts-ignore
        let qb = this.createQueryBuilder(tableName);
        return qb;
    }
}
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], PkBaseEntity.prototype, "id", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], PkBaseEntity.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], PkBaseEntity.prototype, "updatedAt", void 0);
export class PkBaseUser extends PkBaseEntity {
}
__decorate([
    Column({ nullable: true, unique: true, }),
    __metadata("design:type", String)
], PkBaseUser.prototype, "email", void 0);
__decorate([
    Column({ nullable: true, default: "Default Name" }),
    __metadata("design:type", String)
], PkBaseUser.prototype, "name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], PkBaseUser.prototype, "pwd", void 0);
__decorate([
    Column({ nullable: true, type: "json" }),
    __metadata("design:type", Object)
], PkBaseUser.prototype, "udata", void 0);
//Experiment w. embedded entity props
/**
 * Until further investigation, Entities that include this embedded should define it as:
 *	@Column(() => Location) loc:Location;
 * Idea is to automatically create the geopont from lat, lon, and add "distance" query
 */
export class Location {
    static getWhats() {
        return "That's what";
    }
}
__decorate([
    Column({ nullable: true, }),
    __metadata("design:type", Number)
], Location.prototype, "lat", void 0);
__decorate([
    Column({ nullable: true, }),
    __metadata("design:type", Number)
], Location.prototype, "lon", void 0);
__decorate([
    Column('geometry', { srid: 4326, nullable: true, }),
    __metadata("design:type", Object)
], Location.prototype, "geopt", void 0);
//# sourceMappingURL=to-entities.js.map