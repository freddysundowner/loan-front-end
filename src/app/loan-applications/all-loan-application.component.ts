import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../shared/delete/confirmation-dialog-component';
import { LoanApplicationService } from './data/loan-application.service';
import { AddLoanApplicationComponent } from './add/add-loan-application.component';
import { LoanApplicationModel } from './models/loan-application-model';
import { EditLoanApplicationComponent } from './edit/edit-loan-application.component';
import { LoanApplicationDataSource } from './data/loan-application-data.source';
import { NotificationService } from '../shared/notification.service';
import { MemberService } from '../members/data/member.service';
import { LoanService } from '../loans/data/loan.service';
import { LoanTypeSettingService } from '../settings/loan/type/data/loan-type-setting.service';
import { UserSettingService } from '../settings/user/data/user-setting.service';
import { CalculatorComponent } from './calculator/calculator.component';
import { AccountingService } from '../accounting/data/accounting.service';
import { DashboardService } from '../dashboard/data/dashboard.service';
import { FinanceStatementModel } from '../accounting/models/finance-statement.model';

@Component({
    selector: 'app-loan-applications',
    templateUrl: './all-loan-application.component.html',
    styleUrls: ['./loan-application.component.css']
})
export class LoanApplicationComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'application_date',
        'loan_officer',
        'amount_applied',
        'member_id',
        'loan_type_id',
        'repayment_period',
        'status',
        'actions',
    ];

    loader = false;
    form: FormGroup;

    loanStatus: any;
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search') search: ElementRef;

    // pagination
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Data for the list table display
    dataSource: LoanApplicationDataSource;

    selectedRowIndex = '';
    financeStatement: FinanceStatementModel;

    members: any = [];
    users: any = [];
    loanTypes: any = [];

    constructor(private service: LoanApplicationService, private fb: FormBuilder, private notification: NotificationService,
        private dialog: MatDialog, private membersService: MemberService,
        private loansService: LoanService, private memberService: MemberService, private userService: UserSettingService,
        private loanTypeService: LoanTypeSettingService, private accountingService: AccountingService,
        private dashboardService: DashboardService) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new LoanApplicationDataSource(this.service);
        this.loanStatus = [
            // { "name": "Active", "key": "active" },
            { "name": "All Due Loans", "key": "due" }
        ]
        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        // this.dataSource.load('', 0, 0, 'updated_at', 'desc', 'reviewed_on');
        this.dataSource.load('', 0, 0, 'updated_at', 'desc',);

        this.memberService.list(['first_name', 'middle_name', 'last_name', 'id_number', 'phone'])
            .subscribe((res) => this.members = res,
                () => this.members = []
            );

        this.userService.list(['first_name', 'last_name', 'role_id'])
            .subscribe((res) => this.users = res,
                () => this.users = []
            );

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

        this.form = this.fb.group({
            start_date: [''],
            end_date: [moment()],
            report_type_id: ['', [Validators.required,
            Validators.minLength(1)]],
        });

    }


    /**
     *
     */
    downloadReport() {

        this.loader = true;

        const body = Object.assign({}, this.financeStatement, this.form.value);
        console.log(body);
        this.dashboardService.downloadOverDueStatement(body)
            .subscribe((res) => {
                this.loader = false;
                console.log(res)
                this.showExcelFile(res, 'loans_due1.xlsx');
            },
                () => {
                    this.loader = false;
                    this.notification.showNotification('danger', 'Error Downloading File!');
                }
        );

    }


    private showExcelFile(blob: Blob, fileName: string): void {
        const newBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        link.click();
        setTimeout(function () {
            window.URL.revokeObjectURL(data);
        }, 100);
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
            users: this.users,
            loanTypes: this.loanTypes
        };

        const dialogRef = this.dialog.open(AddLoanApplicationComponent, dialogConfig);
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
        dialogConfig.data = {
            loanApplication,
            members: this.members,
            users: this.users,
            loanTypes: this.loanTypes
        };

        const dialogRef = this.dialog.open(EditLoanApplicationComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    downloadStatement(row: any) {

        this.loader = true;
        this.accountingService.downloadLoanAccountStatement({ id: row.id, pdf: true })
            .subscribe((res) => {
                this.loader = false;
                this.showFile(res);
            },
                () => {
                    this.loader = false;
                    this.notification.showNotification('danger', 'Error Downloading File!');
                }
            );
    }

    /**
     *
     * @param blob
     */
    showFile(blob) {
        let newBlob = new Blob([blob], { type: "application/pdf" });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download = "statement.pdf";
        link.click();
        setTimeout(function () {
            window.URL.revokeObjectURL(data);
        }, 100);
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
            this.sort.direction,
            ''
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
            tap(() => this.loadData())
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


