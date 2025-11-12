import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[MongooseModule.forRootAsync({
        inject:[ConfigService],
        useFactory: (cs:ConfigService)=>
        {
            return {
                uri:cs.get('DATABASE_URI')
            }
        }
    })]
})

export class DatabaseModule {
    static forFeature(models:ModelDefinition[])
    {
        return MongooseModule.forFeature(models);
    }
}
