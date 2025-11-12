import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDto } from "../dto";

const getCurrentUserByContext = (context:ExecutionContext):UserDto => 
    context.switchToHttp().getRequest().user

export const CurrentUser = createParamDecorator(
    (_data:unknown,context:ExecutionContext)=>getCurrentUserByContext(context)
)