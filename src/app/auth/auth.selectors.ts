import { createSelector } from '@ngrx/store';
import * as jwt_decode from 'jwt-decode';

export const selectAuthState = state => state.auth;

export const isLoggedIn = createSelector(
    selectAuthState,
    auth => auth.loggedIn
);

export const isLoggedOut = createSelector(
    isLoggedIn,
    loggedIn => !loggedIn
);

export const accessToken = createSelector(
    selectAuthState,
    auth => auth.user.access_token
);

export const allScopes = createSelector(
    selectAuthState,
    auth => {
        if (auth.user) {
            return auth.user.scope;
        }
    }
);

export const settings = createSelector(
    selectAuthState,
    auth => {
        if (auth.user) {
            return auth.user.settings;
        }
    }
);

export const branch = createSelector(
    selectAuthState,
    auth => {
        if (auth.user) {
            return auth.user.branch_id;
        }
    }
);

export const activeUser = createSelector(
    selectAuthState,
    auth => {
        if (auth.user) {
            return auth.user.first_name +' '+ auth.user.last_name;
        }
    }
);

export const selectorScopes = createSelector(
    selectAuthState,
    auth => {
        if (auth.user) {
            return jwt_decode(auth?.user?.access_token)?.scopes;
            //  return auth.user?.access_token;
        }
    }
);

export const selectorUserId = createSelector(
    selectAuthState,
    auth => {
        if (auth.user) {
            return jwt_decode(auth?.user?.access_token)?.sub;
        }
    }
);