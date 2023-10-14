import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { LoanChargesSettingDataSource } from './data/loan-charges-setting-data.source';
import { LoanChargesSettingService } from './data/loan-charges-setting.service';
import { AddLoanChargesComponent } from './add/add-loan-charges.component';
import { LoanChargesSettingModel } from './model/loan-charges-setting.model';
import { EditLoanChargesComponent } from './edit/edit-loan-charges.component';
import { NotificationService } from '../../../shared/notification.service';
import { ChargeTypeService } from './data/charge-type.service';

@Component({
    selector: 'app-loan-status-setting',
    templateUrl: './loan-charges-setting.component.html',
    styleUrls: ['./loan-charges-setting.component.css']
})
export class LoanChargesSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'charge_name',
        'charge_value',
        'charge_type',
        'actions',
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;
    // pagination
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    dataSource: LoanChargesSettingDataSource;

    chargeTypes: any = [];

    constructor(private service: LoanChargesSettingService, private notification: NotificationService,
                private dialog: MatDialog, private chargeTypeService: ChargeTypeService) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new LoanChargesSettingDataSource(this.service);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'charge_name', 'asc');

        this.chargeTypeService.list(['name', 'display_name'])
            .subscribe((res) => this.chargeTypes = res,
                () => this.chargeTypes = []
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
            chargeTypes: this.chargeTypes
        };

        const dialogRef = this.dialog.open(AddLoanChargesComponent, dialogConfig);
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
    editDialog(status: LoanChargesSettingModel) {

        const id = status.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {status,
            chargeTypes: this.chargeTypes
        };

        const dialogRef = this.dialog.open(EditLoanChargesComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Fetch data from data source
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
     * @param status
     */
    openConfirmationDialog(status: LoanChargesSettingModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.delete(status);
            }
            this.dialogRef = null;
        });
    }

    /**
     * Remove resource from db
     * @param status
     */
    delete(status: LoanChargesSettingModel) {
        this.loader = true;
        this.service.delete(status)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Status has been deleted.');
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
