import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import {catchError, map, Observable, of, tap} from 'rxjs';
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "../constants";
import { Reflector } from "@nestjs/core";
import { Role, User } from "../models";

@Injectable()
export class JwtAuthGuard implements CanActivate
{
    private readonly logger = new Logger(JwtAuthGuard.name);
    constructor(@Inject(AUTH_SERVICE) private readonly authClient : ClientProxy,
    private readonly reflector:Reflector
)
    {

    }

    canActivate(context:ExecutionContext):boolean|Promise<boolean>|Observable<boolean>
    {
        const jwt  = context.switchToHttp().getRequest().cookies?.Authentication;
        if(!jwt)
            return false;
        
        const roles = this.reflector.get<string[]>('roles',context.getHandler());

    

        return this.authClient.send<User>('authenticate',{
            Authentication:jwt
        })
        .pipe(
            tap((res) => {
                if(roles)
                {
                    for(const role of roles)
                    {
                        if(!res.roles?.map( role => role.name).includes(role)) 
                        {
                            this.logger.error('user has no valid role')
                            throw new UnauthorizedException()
                        }
                    }
                }
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true),
            catchError((err) => {
                this.logger.error(err);
                return of(false);
            })
        )
    }
}