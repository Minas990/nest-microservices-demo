import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractEntity } from "./abstract.entity";
import { EntityManager, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

export abstract class AbstractRepository<T extends AbstractEntity<T>>
{
    protected readonly abstract logger:Logger;
    constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManaager: EntityManager
    )
    {

    }

    async create(entity:T): Promise<T>
    {
        return this.entityManaager.save(entity);
    }

    async findOne(
        where: FindOptionsWhere<T>,
        relations?:FindOptionsRelations<T>
    )
    {
        const entity = await this.entityRepository.findOne({where,relations});
        if(!entity)
        {
            this.logger.warn('no such entity');
            throw new NotFoundException('no such entity');
        }
        return entity;
    }



    async findOneAndUpdate(where: FindOptionsWhere<T> , partialEntity: QueryDeepPartialEntity<T>)
    {
        const entity =await this.entityRepository.update(where,partialEntity);
        if(!entity.affected)
        {
            this.logger.warn('no such entity where',where);
            throw new NotFoundException('no such entity');
        }
        return this.findOne(where);
    }

    async find(where : FindOptionsWhere<T> )
    {
        const entities = await this.entityRepository.findBy(where);
        return entities;
    }

    async findOneAndDelete(where: FindOptionsWhere<T>)
    {
        const entity = await this.entityRepository.delete(where);
        if(entity.affected==0)
        {
            this.logger.warn('no such entity');
            throw new NotFoundException('no such entity');
        }
        return entity;
    }

}