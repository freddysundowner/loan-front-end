import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MemberAreaPaymentService } from '../data/member-area-payment.service';
import { MemberAreaAddPaymentComponent } from './add/member-area-add-payment.component';
import { MemberAreaPaymentModel } from '../models/member-area-payment-model';
import { MemberAreaPaymentDataSource } from '../data/member-area-payment-data.source';
import { MemberAreaPaymentDetailComponent } from '../details/member-area-payment-detail.component';
import { MemberAreaPaymentStatusModel } from '../models/member-area-payment-status.model';
import { error } from 'selenium-webdriver';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { NotificationService } from '../../../shared/notification.service';
import { MemberService } from '../../../members/data/member.service';
import { StatusChangeComponent } from '../../../payments/status-change/status-change.component';

@Component({
    selector: 'app-payments',
    templateUrl: './general-payment.component.html',
    styleUrls: ['./member-area-general-payment.component.css']
})
export class MemberAreaGeneralPaymentComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'member_id',
        'amount',
        'payment_date',
        'receipt_number',
        'payment_status',
        'actions',
    ];

    approvePermissions = ['payments-approve'];
    cancelPermissions = ['payments-cancel'];

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
    dataSource: MemberAreaPaymentDataSource;

    members: any;

    constructor(private service: MemberAreaPaymentService, private notification: NotificationService,
                private dialog: MatDialog, private memberService: MemberService) {
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new MemberAreaPaymentDataSource(this.service);

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
     * Add dialog launch
     */
    addDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            members: this.members
        };


        const dialogRef = this.dialog.open(MemberAreaAddPaymentComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * paymentDetails dialog launch
     */
    paymentDetails(data: MemberAreaPaymentModel) {

        const id = data.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};

        const dialogRef = this.dialog.open(MemberAreaPaymentDetailComponent, dialogConfig);
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
    approveDeposit(data: MemberAreaPaymentModel) {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true,
            data: {
                'title' : 'Approve Payment? Confirm permanent action.'
            }
        });
        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.service.approve({id: data.id}).subscribe((data) => {
                        this.loader = false;
                        this.notification.showNotification('success', 'Success !! Payment has been Approved.');
                        this.loadData();
                    },
                    (error) => {
                        this.notification.showNotification('danger', 'Error !! Could not approve payment.');
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
    cancelComment(data: MemberAreaPaymentModel) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {data};
        const dialogRef = this.dialog.open(StatusChangeComponent, dialogConfig);
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
    openConfirmationDialog(lead: MemberAreaPaymentModel) {

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
    delete(lead: MemberAreaPaymentModel) {
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


