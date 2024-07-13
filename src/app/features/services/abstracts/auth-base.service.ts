import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserForLoginRequest } from "../../models/requests/auth/user-for-login-request";
import { UserForRegisterRequest } from "../../models/requests/auth/user-for-register-request";
import { AccessTokenModel } from "../../models/responses/auth/access-token-model";
import { TokenModel } from "../../models/responses/auth/token-model";
import { UserForRegisterResponse } from "../../models/responses/auth/user-for-register-response";



@Injectable()
export abstract class AuthBaseService{
    abstract register(userforRegisterRequest:UserForRegisterRequest)
                     :Observable<UserForRegisterResponse>
    abstract login(userLoginRequest:UserForLoginRequest)
                        :Observable<AccessTokenModel<TokenModel>>;
    abstract getDecodedToken():void;
    abstract loggedIn():boolean;
    abstract getUserName():string;
    abstract getCurrentUserId():string;
    abstract logOut():void;
    abstract getRoles():string[];
    abstract isAdmin():boolean;
}