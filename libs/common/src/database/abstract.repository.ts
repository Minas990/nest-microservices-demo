import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractDocument } from "./abstract.schema";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<TDocument extends AbstractDocument>
{
    protected readonly abstract logger:Logger;
    constructor(protected readonly model: Model<TDocument>){}

    async create(document:Omit<TDocument,'_id'>)
    {
        const doc = new this.model({
            ...document,
            _id: new Types.ObjectId()
        });
        return (await doc.save()).toJSON() as unknown as TDocument;
    }

    async findOne(filterQuery:FilterQuery<TDocument>)
    {
        const doc = await this.model.findOne(filterQuery,{},{lean:true});
        if(!doc)
        {
            this.logger.warn('no such doc');
            throw new NotFoundException('no such doc');
        }
        return doc as unknown as TDocument; 
    }

    async find(filterQuery:FilterQuery<TDocument>)
    {
        const docs = await this.model.find(filterQuery,{},{lean:true});
        return docs as unknown as TDocument[];
    }

    async findOneAndUpdate(filterQuery:FilterQuery<TDocument>,updateQuery:UpdateQuery<TDocument>)
    {
        const doc =await this.model.findOneAndUpdate(filterQuery,updateQuery,{lean:true,new:true});
        if(!doc)
        {
            this.logger.warn('no such doc');
            throw new NotFoundException('no such doc');
        }
        return doc as unknown as TDocument; 
    }

    async findOneAndDelete(filterQuery:FilterQuery<TDocument>)
    {
        const doc =await this.model.findOneAndDelete(filterQuery,{lean:true});
        if(!doc)
        {
            this.logger.warn('no such doc');
            throw new NotFoundException('no such doc');
        }
        return doc as unknown as TDocument; 
    }

}