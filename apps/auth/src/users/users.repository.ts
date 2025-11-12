import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { UserDocument } from "./models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument>
{
    protected logger: Logger = new Logger(UsersRepository.name);
    
    constructor(@InjectModel(UserDocument.name) private userModel:Model<UserDocument>)
    {
        super(userModel);
    }

}