import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
        inject:[ConfigService],
        useFactory: (cs:ConfigService)=>
        {
            return {
                type:'postgres',
                database:cs.getOrThrow('POSTGRES_DB'),
                host:cs.getOrThrow('HOST'),
                password:cs.getOrThrow('POSTGRES_PASSWORD'),
                username:cs.getOrThrow('POSTGRES_USER'),
                synchronize:true,
                autoLoadEntities:true 
            }
        }
    })]
})

export class DatabaseModule {
    static forFeature(models:EntityClassOrSchema[])
    {
        return TypeOrmModule.forFeature(models);
    }
}
