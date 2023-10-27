import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Logout } from '../../auth/auth.actions';
import { AppState } from '../../reducers';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/authentication.service';
import { tap } from 'rxjs/operators';
import { settings } from '../../auth/auth.selectors';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission?: any;
}

export const ROUTES1: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', permission: ['dashboard-view'] },

  //  { path: '/member', title: 'Dashboard',  icon: 'dashboard', class: '', permission: ['member'] },
    { path: '/member-loans', title: 'Active Loans',  icon: 'business', class: '', permission: ['member'] },
    { path: '/member-loan-applications', title: 'Loan Applications',  icon: 'business', class: '', permission: ['member'] },
    { path: '/member-payments', title: 'Payments',  icon: 'attach_money', class: '', permission: ['member'] },
    // { path: '/member-withdrawals', title: 'Withdrawals',  icon: 'attach_money', class: '', permission: ['member'] },
    { path: '/member-profile', title: 'Profile',  icon: 'person', class: '', permission: ['member'] },
    { path: '/member-reports', title: 'Reports',  icon: 'account_tree', class: '', permission: ['member'] }
];

export const ROUTES2: RouteInfo[] = [
    { path: '/members', title: 'Members',  icon: 'people', class: '', permission: ['members-add'] },
    { path: '/loans', title: 'Active Loans',  icon: 'business', class: '', permission: ['loans-view'] },
    { path: '/loan-applications', title: 'Pending Applications',  icon: 'business', class: '', permission: ['loan-applications-add'] }
];

export const ROUTES3: RouteInfo[] = [
    { path: '/payments', title: 'Payment',  icon: 'attach_money', class: '', permission: ['payments-add'] },
    { path: '/withdrawals', title: 'Withdrawal',  icon: 'attach_money', class: '', permission: ['withdrawals-add'] },
];

//     { path: '/mpesa', title: 'Mpesa',  icon: 'phonelink_lock', class: '', permission: ['settings-general'] },

export const ROUTES4: RouteInfo[] = [
    { path: '/settings', title: 'Setting',  icon: 'settings', class: '', permission: ['settings-general'] },
    { path: '/reports', title: 'Reports',  icon: 'account_tree', class: '', permission: ['reports-view'] },
    { path: '/expenses', title: 'Expenses',  icon: 'local_airport', class: '', permission: ['expenses-add'] },
    { path: '/user-profile', title: 'Profile',  icon: 'person', class: '', permission: ['profile-me'] }
];

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', permission: ['dashboard-view'] },
    { path: '/expenses', title: 'Expenses',  icon: 'local_airport', class: '', permission: ['expenses-add'] },
    { path: '/members', title: 'Members',  icon: 'people', class: '', permission: ['members-add'] },
    { path: '/loans', title: 'Loans -  Active',  icon: 'business', class: '', permission: ['loans-view'] },
    { path: '/loan-applications', title: 'Loan Applications',  icon: 'attach_file', class: '', permission: ['loan-applications-add'] },
    { path: '/payments', title: 'Payment',  icon: 'attach_money', class: '', permission: ['payments-add'] },
    { path: '/withdrawals', title: 'Withdrawal',  icon: 'attach_money', class: '', permission: ['withdrawals-add'] },
    { path: '/mpesa', title: 'Mpesa',  icon: 'attach_money', class: '', permission: ['settings-general'] },
    { path: '/settings', title: 'Setting',  icon: 'settings', class: '', permission: ['settings-general'] },
    { path: '/reports', title: 'Reports',  icon: 'account_tree', class: '', permission: ['reports-view'] },
    { path: '/user-profile', title: 'Profile',  icon: 'person', class: '', permission: ['profile-me'] }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems1: any[];
  menuItems2: any[];
  menuItems3: any[];
  menuItems4: any[];

  menuItems: any[];
  loading = false;

  businessName: string;

  currentSettings$: any;

  constructor(private auth: AuthenticationService, private router: Router, private store: Store<AppState>) {
      this.currentSettings$ = this.store.pipe(select(settings));
  }

  ngOnInit() {
    this.menuItems1 = ROUTES1.filter(menuItem => menuItem);
    this.menuItems2 = ROUTES2.filter(menuItem => menuItem);
    this.menuItems3 = ROUTES3.filter(menuItem => menuItem);
    this.menuItems4 = ROUTES4.filter(menuItem => menuItem);

    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  logout() {
      this.loading = true;
      this.auth.logout()
          .pipe(tap(
              user => {
                  this.loading = false;
                  this.store.dispatch(new Logout());
              }
          ))
          .subscribe(
              () => {},
              (error) => {
                  this.store.dispatch(new Logout());
                  if (error.error.message) {
                  } else {
                  }
                  this.loading = false;
              });
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
