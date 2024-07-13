import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, catchError } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { UserForLoginRequest } from "../../models/requests/auth/user-for-login-request";
import { UserForRegisterRequest } from "../../models/requests/auth/user-for-register-request";
import { AccessTokenModel } from "../../models/responses/auth/access-token-model";
import { TokenModel } from "../../models/responses/auth/token-model";
import { UserForRegisterResponse } from "../../models/responses/auth/user-for-register-response";
import { AuthBaseService } from "../abstracts/auth-base.service";
import { LocalStorageService } from "./local-storage.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService extends AuthBaseService {
  fullname!:string;
  userId!:string;
  token:any;
  jwtHelper:JwtHelperService = new JwtHelperService;
  claims:string[]=[]


  private readonly apiUrl:string = `${environment.API_URL}/auth`
  constructor(private httpClient:HttpClient,private storageService:LocalStorageService) {super() }

  override register(userforRegisterRequest: UserForRegisterRequest)
      :Observable<UserForRegisterResponse> {
    return this.httpClient.post<UserForRegisterResponse>(`${this.apiUrl}/register`,userforRegisterRequest)
  }

  login(userLoginRequest:UserForLoginRequest)
                        :Observable<AccessTokenModel<TokenModel>>

  {
    return this.httpClient.post<AccessTokenModel<TokenModel>>(`${this.apiUrl}/login`,userLoginRequest)
    .pipe(map(response=>{
        this.storageService.setToken(response.accessToken.token);
        return response;
      }
     
    ),catchError(responseError=>{
      throw responseError;
    })
    )
  }


  getDecodedToken(){
    try{
      this.token=this.storageService.getToken();
      return this.jwtHelper.decodeToken(this.token)
    }
    catch(error){
      return error;
    }
  }

  loggedIn():boolean{
    this.token=this.storageService.getToken();
    let isExpired = this.jwtHelper.isTokenExpired(this.token);
    return !isExpired;
    
  }

  getUserName():string{
    var decoded = this.getDecodedToken();
    var propUserName = Object.keys(decoded).filter(x=>x.endsWith("/name"))[0]
    return this.fullname=decoded[propUserName];
  }

  // getUserName():string{
  //   console.log(this.fullname)
  //   return this.fullname;
  // }
  

  getCurrentUserId():string{
    var decoded = this.getDecodedToken();
    var propUserId = Object.keys(decoded).filter(x=>x.endsWith("/nameidentifier"))[0]
    return this.userId=decoded[propUserId]
  }


  logOut(){
    this.storageService.removeToken();
  }

  getRoles():string[]{
    if(this.storageService.getToken()){
      var decoded = this.getDecodedToken()
      var role = Object.keys(decoded).filter(x=>x.endsWith("/role"))[0]
      this.claims=decoded[role]
    }
    return this.claims;
  }

  isAdmin():boolean{
    this.getRoles();
    if(this.claims.includes("Admin")){
      return true;
    }
    return false;
  }
  
}