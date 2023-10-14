import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { MemberAreaInterestTransactionComponent } from './transactions/member-area-interest-transaction.component';
import { MemberAreaPrincipalTransactionComponent } from './transactions/principal/member-area-principal-transaction.component';
import { MemberAreaPenaltyTransactionComponent } from './transactions/penalty/member-area-penalty-transaction.component';
import { MemberAreaPenaltyAdjustmentComponent } from './adjustment/penalty/member-area-penalty-adjustment.component';
import { LoanPenaltyDataSource } from '../../../../loans/data/penalty/loan-penalty-data.source';
import { LoanInterestDataSource } from '../../../../loans/data/interest/loan-interest-data.source';
import { LoanPrincipalDataSource } from '../../../../loans/data/principal/loan-principal-data.source';
import { TransactionDataSource } from '../../../../transactions/data/transaction-data.source';
import { PaymentModel } from '../../../../payments/models/payment-model';
import { MemberAreaApplicationGuarantorService } from '../../../loan-application/view/guarantor/data/member-area-application-guarantor.service';
import { TransactionService } from '../../../../transactions/data/transaction.service';
import { LoanPenaltyService } from '../../../../loans/data/penalty/loan-penalty.service';
import { LoanPrincipalService } from '../../../../loans/data/principal/loan-principal.service';
import { LoanService } from '../../../../loans/data/loan.service';
import { LoanInterestService } from '../../../../loans/data/interest/loan-interest.service';
import { NotificationService } from '../../../../shared/notification.service';
import { LoanPrincipalModel } from '../../../../loans/data/principal/loan-principal-model';
import { LoanInterestModel } from '../../../../loans/data/interest/loan-interest-model';
import { LoanPenaltyModel } from '../../../../loans/data/penalty/loan-penalty-model';

@Component({
    selector: 'app-view-loan-payment',
    templateUrl: './member-area-view-loan-payments.component.html',
    styleUrls: ['./member-area-view-loan-payments.component.css']
})
export class MemberAreaViewLoanPaymentsComponent implements OnInit, AfterViewInit {

    penaltiesColumns = [
        'loan_id',
        'amount',
        'balance',
        'due_date',
        'actions'
    ];

    interestColumns = [
        'loan_id',
        'amount',
        'balance',
        'due_date',
        'actions'
    ];

    principalColumns = [
        'loan_id',
        'amount',
        'balance',
        'due_date',
        'actions'
    ];

    penaltiesDataSource: LoanPenaltyDataSource;
    interestDataSource: LoanInterestDataSource;
    principalDataSource: LoanPrincipalDataSource;


    // Data for the list table display
    transactionDataSource: TransactionDataSource;
    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;

    penaltyMeta: any;
    interestMeta: any;
    principalMeta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    payment: PaymentModel;
    loader = false;

    loanData: any;
    loanId = '';
    loanData$: any;

    constructor(private service: MemberAreaApplicationGuarantorService,  private transactionService: TransactionService,
                private notification: NotificationService, private penaltyService: LoanPenaltyService,
                private interestService: LoanInterestService, private principalService: LoanPrincipalService,
                private dialog: MatDialog, private loanService: LoanService) {}

    ngOnInit() {

        this.loanData$ = this.loanService.selectedLoanChanges$;
        this.loanService.selectedLoanChanges$.subscribe(data => {

            if (data) {
                this.loanData = data;
                this.loanId = data.id;
            }
        });

        // Penalties
        this.penaltiesDataSource = new LoanPenaltyDataSource(this.penaltyService);
        this.penaltiesDataSource.meta$.subscribe((res) => this.penaltyMeta = res);
        this.penaltiesDataSource.load('', 0, 0, 'due_date', 'desc', 'loan_id', this.loanId);

        // Interest
        this.interestDataSource = new LoanInterestDataSource(this.interestService);
        this.interestDataSource.meta$.subscribe((res) => this.interestMeta = res);
        this.interestDataSource.load('', 0, 0, 'due_date', 'desc', 'loan_id', this.loanId);

        // Principal
        this.principalDataSource = new LoanPrincipalDataSource(this.principalService);
        this.principalDataSource.meta$.subscribe((res) => this.principalMeta = res);
        this.principalDataSource.load('', 0, 0, 'due_date', 'desc', 'loan_id', this.loanId);
    }

    /**
     * Fetch data from data lead
     */
    loadData() {
        this.transactionDataSource.load(
            '',
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction,
            'loan_id', this.loanId
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
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
     *
     * @param data
     */
    principalTransactionDetails(data: LoanPrincipalModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(MemberAreaPrincipalTransactionComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

    /**
     *
     * @param data
     */
    interestTransactionDetails(data: LoanInterestModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(MemberAreaInterestTransactionComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

    /**
     *
     * @param data
     */
    penaltyTransactionDetails(data: LoanPenaltyModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(MemberAreaPenaltyTransactionComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

    /**
     *
     * @param data
     */
    penaltyAdjustment(data: LoanPenaltyModel) {
        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(MemberAreaPenaltyAdjustmentComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    //  this.loadData();
                }
            }
        );
    }

}
