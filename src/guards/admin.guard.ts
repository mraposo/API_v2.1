import { CanActivate, ExecutionContext } from "@nestjs/common";
import { request } from "http";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if(!request.currentUser) {
            return false;
        }
        
        return request.currentUser.admin;
    }
}