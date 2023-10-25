import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { BaseService } from '../shared/base-service';
import { User } from './model/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService<User>{

    storageKey = 'be3295963d1091720c8513f78f83c216332190ff714a5239c8b49190443be288';
    private key_secret: any;

    constructor(private http: HttpClient, private router: Router) {
        super(http, '');
    }


    setKeySecret(data: any) {
        this.key_secret = data;
    }

    getKeySecret() {
        return this.key_secret;
    }


    adminAuth(username: string, password: string) {
        return this.http.post<any>(`${super.getApiUrl()}/adminauth`, { email: username, password })
            .pipe(map((user) => {
                // const decodedToken = jwt_decode(user.access_token);
                // user.scope = decodedToken.scopes;
                return { auth: user.authenticated, id: user.id };
            }));
    }

    /**
     * Login api user and setup token for future use
     * @param username
     * @param password
     */
    login(otp: string, uid: string, keySecret: string) {
        console.log({ otp, uid, keySecret });
        
        return this.http.post<any>(`${super.getApiUrl()}/login`, { otp, uid, keySecret })
            .pipe(map((user) => {
                console.log(user);
                if (user.access_token) {
                    const decodedToken = jwt_decode(user.access_token);
                    user.scope = decodedToken.scopes;
                }
                return user;
            }));
    }

    /**
     *  Logout API level
     */
    logout() {
        return this.http.get<any>(`${super.getApiUrl()}/logout`)
            .pipe(map((data) => {
            }));
    }
}
