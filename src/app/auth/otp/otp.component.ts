import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { Login, Logout } from '../auth.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { tap } from 'rxjs/operators';
import { selectorScopes } from '../auth.selectors';

@Component({ templateUrl: 'otp.component.html' })
export class OtpComponent implements OnInit {

    otpForm: FormGroup;
    returnUrl: string;
    loginError = '';
    loader = false;
    uid = '';

    loginScopes: any;
    keySecret: any;

    constructor(private fb: FormBuilder, private store: Store<AppState>, private route: ActivatedRoute,
        private router: Router, private authenticationService: AuthenticationService) {
        this.otpForm = fb.group({
            otp: ['', [Validators.required]],
            userId: ['', Validators.required]
        });        
        this.keySecret = this.authenticationService.getKeySecret();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.uid = params.id;
            this.otpForm.get('userId').setValue(this.uid);

        });
        this.returnUrl = '/';
    }

    /**
     * Fetch email field
     */
    get otp() {
        return this.otpForm.get('otp');
    }

    /**
     * Fetch password field
     */
    get userId() {
        return this.otpForm.get('userId');
    }

    /**
     * Login user against api
     */
    login() {
        this.loginError = '';
        this.loader = true;
        console.log(this.keySecret);
        
        this.authenticationService.login(this.otp.value, this.userId.value, this.keySecret)
            .pipe(tap(
                user => {
                    this.loader = false;
                    console.log(user);
                    if (user.status == false) {
                        this.loginError = user.message
                    } else {
                        this.store.dispatch(new Login({ user }));

                        this.store.pipe(select(selectorScopes)).subscribe(scopes => {
                            this.loginScopes = scopes;
                            // We have a member
                            if (scopes?.find(x => x === 'member')) {
                                this.returnUrl = '/member-loans';
                            } else {
                                //
                            }
                        });
                        console.log(this.returnUrl);

                        this.router.navigate([this.returnUrl]);
                    }


                }
            ))
            .subscribe(
                () => { },
                (error) => {
                    console.log(error);
                    if (error.error.message) {
                        this.loginError = error.error.message;
                    } else {
                        this.loginError = 'Server Error. Please try again later.';
                    }
                    this.loader = false;
                });
    }


}
