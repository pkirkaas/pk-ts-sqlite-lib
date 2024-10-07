/**
 * Building a library of enhanced TypeORM Entities
 * Exports:
 * PkBaseEntity: Extends TypeOrm BaseEntity with columns:
 *   automatic ID, CreateDate, UpdateDate, DeleteDate, and JSON edata column
 * Methods: findById, newQueryBuilder, loadRelations, & errors validation methods
 *
 * PkBaseUser: Adds email, name, etc to PkBaseEntity
 *
 * Location: Implements location functionality
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
import { PrimaryGeneratedColumn, DeleteDateColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, AfterLoad, } from "typeorm";
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, validate, } from "class-validator";
export const rules = { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, validate, };
/**
 * Enhanced BaseEntity
 */
export class PkBaseEntity extends BaseEntity {
    id;
    createdAt;
    updatedAt;
    deletedAt;
    edata; //Whatever JSON data an entity wants...
    /**
     *  Returns the table name for this entity type
     * @returns string - table name of the entity
     */
    static getTableName() {
        // @ts-ignore
        return this.getRepository().metadata.tableName;
    }
    /** FindOneById() annoyingly deprecated by TypeOrm - re-implement
     * @param id - the id of the entity to find
     * @returns the entity found, or null if not found
     */
    static findById(
    //this: { new (): T } & typeof <T>,
    id) {
        // @ts-ignore
        return this.getRepository().findOneBy({ id });
    }
    /*
    static findById(id:number):Promise<PkBaseEntity> {
        return this.findOne({id});
    }
        */
    /**
     * A new query builder for this entity, without needing the table name
     * CAN USE JUST andWhere, don't need to start w. where
     * @returns queryBulder for this entity
     */
    //static newQueryBuilder(findOpts?:FindOptions):any {
    static newQueryBuilder(findOpts) {
        //static newQueryBuilder():QueryBuilder<any> {
        //let tableName = this.getTableName();
        // @ts-ignore
        //let qb = this.createQueryBuilder(tableName);
        // NEW - the above works, but if below works, it's cleaner...
        let qb = this.getRepository().createQueryBuilder();
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
    static async errors(data, vOpts, opts) {
        try {
            //@ts-ignore
            let instance = this.create(data);
            //@ts-ignore
            let res = await instance.errors(vOpts, opts);
            return res;
        }
        catch (err) {
            return err;
        }
    }
    ;
    async errors(vOpts, opts) {
        let errors = await validate(this, vOpts);
        if (errors.length) {
            return errors;
        }
        return false; // ?? what should success return?
    }
    // Try with options
    /**
     * If an entity was loaded without relations but wants them later,
     * this method will load them into the current entity - with options
     * @param relationName - name of the relation
     * @param options?:GenObj - where conditions, limit, order, etc
     * TODO: Investigate how to specify relationships within the relationship
     */
    async loadRelation(relationName, options = {}) {
        const metadata = this.constructor.getRepository().metadata;
        const relation = metadata.findRelationWithPropertyPath(relationName);
        if (!relation) {
            throw new Error(`Relation ${relationName} not found in ${metadata.name}`);
        }
        const queryBuilder = this.constructor.getRepository()
            .createQueryBuilder()
            .relation(metadata.target, relationName)
            .of(this);
        if (options.where) {
            if (typeof options.where === 'function') {
                options.where(queryBuilder);
            }
            else {
                queryBuilder.where(options.where);
            }
        }
        if (options.order) {
            queryBuilder.orderBy(options.order);
        }
        if (options.limit) {
            queryBuilder.limit(options.limit);
        }
        if (options.offset) {
            queryBuilder.offset(options.offset);
        }
        const relatedEntities = await queryBuilder.loadMany();
        this[relationName] = relation.isManyToOne ? relatedEntities[0] : relatedEntities;
        return this;
    }
}
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PkBaseEntity.prototype, "id", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], PkBaseEntity.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], PkBaseEntity.prototype, "updatedAt", void 0);
__decorate([
    DeleteDateColumn(),
    __metadata("design:type", Date)
], PkBaseEntity.prototype, "deletedAt", void 0);
__decorate([
    Column({ nullable: true, type: "json" }),
    __metadata("design:type", Object)
], PkBaseEntity.prototype, "edata", void 0);
export class PkBaseUser extends PkBaseEntity {
    email;
    name;
    pwd;
    udata;
    // @ts-ignore
    virtc() { this.virtne = `NAMEEMAIL: ${this.email} ${this.name}`; }
    get namemail() {
        return `NAMEEMAIL: ${this.email} ${this.name}`;
    }
}
__decorate([
    Column({ nullable: true, unique: true, }),
    IsEmail(),
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
__decorate([
    AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PkBaseUser.prototype, "virtc", null);
//Experiment w. embedded entity props
/**
 * Until further investigation, Entities that include this embedded should define it as:
 *	@Column(() => Location) loc:Location;
 * Idea is to automatically create the geopont from lat, lon, and add "distance" query
 */
export class Location {
    lat;
    lon;
    geopt;
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