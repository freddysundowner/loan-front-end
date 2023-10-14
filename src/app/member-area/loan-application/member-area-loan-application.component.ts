import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/delete/confirmation-dialog-component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../shared/notification.service';
import { MemberService } from '../../members/data/member.service';
import { LoanService } from '../../loans/data/loan.service';
import { UserSettingService } from '../../settings/user/data/user-setting.service';
import { LoanTypeSettingService } from '../../settings/loan/type/data/loan-type-setting.service';
import { LoanApplicationModel } from '../../loan-applications/models/loan-application-model';
import { CalculatorComponent } from '../../loan-applications/calculator/calculator.component';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MemberAreaLoanApplicationService } from './data/member-area-loan-application.service';
import { MemberAreaLoanApplicationDataSource } from './data/member-area-loan-application-data.source';
import { MemberAreaAddLoanApplicationComponent } from './add/member-area-add-loan-application.component';
import { MemberAreaEditLoanApplicationComponent } from './edit/member-area-edit-loan-application.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { selectorUserId } from '../../auth/auth.selectors';
import { MemberAreaLoanService } from '../loan/data/member-area-loan.service';

@Component({
    selector: 'app-account-setting',
    templateUrl: './member-area-loan-application.component.html',
    styleUrls: ['./member-area-loan-application.component.css']
})
export class MemberAreaLoanApplicationComponent {
    displayedColumns = [
        'application_date',
        'amount_applied',
        'member_id',
        'loan_type_id',
        'repayment_period',
        'status',
        'actions',
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search') search: ElementRef;

    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    dataSource: MemberAreaLoanApplicationDataSource;

    selectedRowIndex = '';

    members: any = [];
    users: any = [];
    loanTypes: any = [];

    loggedInUserId: string;

    constructor(private service: MemberAreaLoanApplicationService, private notification: NotificationService,
                private dialog: MatDialog,
                private loansService: MemberAreaLoanService,
                // private memberService: MemberService,
               //  private userService: UserSettingService,
                private store: Store<AppState>,
                private loanTypeService: LoanTypeSettingService) {
        this.store.pipe(select(selectorUserId)).subscribe(res => this.loggedInUserId = res);
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new MemberAreaLoanApplicationDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
      //  this.dataSource.load('', 0, 0, 'updated_at', 'desc', 'reviewed_on');
        this.dataSource.load('', 0, 0, 'updated_at', 'desc');

     /*   this.memberService.list(['first_name', 'middle_name', 'last_name', 'id_number', 'phone'])
            .subscribe((res) => this.members = res,
                () => this.members = []
            );*/

       /* this.userService.list(['first_name', 'last_name', 'role_id'])
            .subscribe((res) => this.users = res,
                () => this.users = []
            );*/

        this.loanTypeService.list([
            'name',
            'interest_rate',
            'interest_type_id',
            'payment_frequency_id',
            'repayment_period',
            'penalty_type_id',
            'penalty_value',
            'penalty_frequency_id',
            'reduce_principal_early'
        ])
            .subscribe((res) => this.loanTypes = res,
                () => this.loanTypes = []
            );

        this.dataSource.connect(null).subscribe(data => {
            if (data && data.length > 0) {
                this.selectedRowIndex = data[0].id;
                this.onSelected(data[0]);
            }
        });
    }

    onSelected(loanApplication: LoanApplicationModel): void {
        this.selectedRowIndex = loanApplication.id;
        this.service.changeSelectedLoanApplication(loanApplication);
    }

    /**
     * Add dialog launch
     */
    addDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            members: this.members,
            userId: this.loggedInUserId,
            users: this.users,
            loanTypes: this.loanTypes
        };

        const dialogRef = this.dialog.open(MemberAreaAddLoanApplicationComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    calculator() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            loanTypes: this.loanTypes
        };

        const dialogRef = this.dialog.open(CalculatorComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Edit dialog launch
     */
    editDialog(loanApplication: LoanApplicationModel) {

        const id = loanApplication.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {loanApplication,
            members: this.members,
            userId: this.loggedInUserId,
            users: this.users,
            loanTypes: this.loanTypes
        };

        const dialogRef = this.dialog.open(MemberAreaEditLoanApplicationComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.dataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {

        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadData();
                })
            ).subscribe();

        this.paginator.page.pipe(
            tap(() => this.loadData() )
        ).subscribe();

        // reset the paginator after sorting
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

    /**
     * @param loanApplication
     */
    openConfirmationDialog(loanApplication: LoanApplicationModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(loanApplication);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param loanApplication
     */
    delete(loanApplication: LoanApplicationModel) {
        this.loader = true;
        this.service.delete(loanApplication)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Loan Application has been deleted.');
                },
                (error) => {
                    this.loader = false;
                    if (!error.error['error']) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing deleted.' +
                            ' Check Connection and retry. ');
                    } else {
                        this.notification.showNotification('danger', 'Delete Error !! ');
                    }
                });
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
