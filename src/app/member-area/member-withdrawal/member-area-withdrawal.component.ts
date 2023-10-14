import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MemberAreaWithdrawalService } from './data/member-area-withdrawal.service';
import { MemberAreaWithdrawalModel } from './models/member-area-withdrawal-model';
import { MemberAreaWithdrawalDataSource } from './data/member-area-withdrawal-data.source';
import { MemberAreaWithdrawalDetailComponent } from './details/member-area-withdrawal-detail.component';
import { ConfirmationDialogComponent } from '../../shared/delete/confirmation-dialog-component';
import { NotificationService } from '../../shared/notification.service';
import { MemberService } from '../../members/data/member.service';
import { PaymentModel } from '../../payments/models/payment-model';
import { WithdrawalCancelComponent } from '../../withdrawals/withdrawal-cancel/withdrawal-cancel.component';

@Component({
    selector: 'app-withdrawal',
    templateUrl: './member-area-withdrawal.component.html',
    styleUrls: ['./member-area-withdrawal.component.css']
})
export class MemberAreaWithdrawalComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'member_id',
        'amount',
        'withdrawal_date',
        'withdrawal_number',
        'withdrawal_status',
        'actions',
    ];

    approvePermissions = ['withdrawals-approve'];
    cancelPermissions = ['withdrawals-cancel'];

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
    dataSource: MemberAreaWithdrawalDataSource;

    members: any;

    constructor(private service: MemberAreaWithdrawalService, private notification: NotificationService,
                private dialog: MatDialog, private memberService: MemberService) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new MemberAreaWithdrawalDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'updated_at', 'desc');

        this.memberService.list(['first_name', 'middle_name', 'last_name', 'id_number', 'phone'])
            .subscribe((res) => this.members = res,
                () => this.members = []
            );
    }

    /**
     * withdrawalDetails dialog launch
     */
    withdrawalDetails(data: MemberAreaWithdrawalModel) {

        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(MemberAreaWithdrawalDetailComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                }
            }
        );
    }

    /**
     *
     * @param data
     */
    approveWithdrawal(data: PaymentModel) {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true,
            data: {
                'title' : 'Approve Withdrawal? Confirm permanent action.'
            }
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.service.approve({id: data.id}).subscribe((data) => {
                        this.loader = false;
                        this.notification.showNotification('success', 'Success !! Withdrawal has been Approved.');
                        this.loadData();
                    },
                    (error) => {
                        this.notification.showNotification('danger', 'Error !! Could not approve Withdrawal.');
                    }
                );
            }
            this.dialogRef = null;
        });
    }

    /**
     *
     * @param data
     */
    cancelWithdrawal(data: MemberAreaWithdrawalModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};
        const dialogRef = this.dialog.open(WithdrawalCancelComponent, dialogConfig);
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
     * Open Edit form
     * @param lead
     */
    openConfirmationDialog(lead: MemberAreaWithdrawalModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(lead);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param lead
     */
    delete(lead: MemberAreaWithdrawalModel) {
        this.loader = true;
        this.service.delete(lead)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Lead has been deleted.');
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


