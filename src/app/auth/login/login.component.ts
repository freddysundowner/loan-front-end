import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { Login, Logout } from '../auth.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { tap } from 'rxjs/operators';
import { selectorScopes } from '../auth.selectors';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    returnUrl: string;
    loginError = '';
    loader = false;

    loginScopes: any;

    constructor(private fb: FormBuilder, private store: Store<AppState>, private route: ActivatedRoute,
        private router: Router, private authenticationService: AuthenticationService) {
        this.loginForm = fb.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required]
        });
        console.log("this.password", this.password);

    }

    ngOnInit() {
        this.store.dispatch(new Logout());
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.returnUrl = '/otp';
    }

    /**
     * Fetch email field
     */
    get email() {
        return this.loginForm.get('email');
    }

    /**
     * Fetch password field
     */
    get password() {
        return this.loginForm.get('password');
    }

    /**
     * Login user against api
     */


    adminAuth() {
        this.loginError = '';
        this.loader = true;

        this.authenticationService.setKeySecret(this.password.value);
        this.authenticationService.adminAuth(this.email.value, this.password.value)
            .pipe(tap(
                user => {
                    this.loader = false;
                    console.log(user);

                    // this.store.dispatch(new Login({user}));

                    // this.store.pipe(select(selectorScopes)).subscribe(scopes => {
                    //     this.loginScopes = scopes;
                    //     // We have a member
                    //     if (scopes?.find(x => x === 'member')) {
                    //         this.returnUrl = '/member-loans';
                    //     } else {
                    //         //
                    //     }
                    // });
                    console.log(this.returnUrl);

                    this.router.navigate([this.returnUrl], { queryParams: user });
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
