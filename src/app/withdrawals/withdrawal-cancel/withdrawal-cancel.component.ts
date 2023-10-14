import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PaymentMethodSettingService } from '../../settings/payment/method/data/payment-method-setting.service';
import { TransactionDataSource } from '../../transactions/data/transaction-data.source';
import { TransactionService } from '../../transactions/data/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { WithdrawalModel } from '../models/withdrawal-model';
import { WithdrawalStatusModel } from '../models/withdrawal-status.model';
import { WithdrawalService } from '../data/withdrawal.service';

@Component({
    selector: 'app-payment-detail',
    styles: [],
    templateUrl: './withdrawal-cancel.component.html'
})
export class WithdrawalCancelComponent implements OnInit, AfterViewInit  {

    form: FormGroup;
    formErrors: any;

    transactionColumns = [
        'loan_id',
        'amount',
        'transaction_date',
        'transaction_type'
    ];

    // Data for the list table display
    transactionDataSource: TransactionDataSource;
    // pagination
    @ViewChild(MatPaginator, {static: true }) paginator: MatPaginator;

    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    withdrawal: WithdrawalModel;

    withdrawalStatus: WithdrawalStatusModel;
    loader = false;
    paymentMethods: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private withdrawalService: WithdrawalService,
                private notification: NotificationService,
                private transactionService: TransactionService,
                private paymentMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<WithdrawalCancelComponent>) {

        this.withdrawal = row.data;
    }

    ngOnInit() {
        this.form = this.fb.group({
            cancel_notes: ['', [Validators.required,
                Validators.minLength(2)]]
        });

        this.paymentMethodService.list('name')
            .subscribe((res) => this.paymentMethods = res,
                () => this.paymentMethods = []
            );
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {
    }

    /**
     *
     */
    cancelWithdrawal() {

        const body = Object.assign({}, this.withdrawalStatus, this.form.value);
        body.id = this.withdrawal.id;

        this.loader = true;

        this.withdrawalService.cancel(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! Withdrawal has been Cancelled.');
                },
                (error) => {
                    this.loader = false;
                    // User has no loan
                    if (error.error && error.error.status_code === 404) {
                        this.notification.showNotification('danger', error.error.message);
                        return;
                    }
                    if (error.payment === 0) {
                        this.notification.showNotification('danger', 'Connection Error !!.' +
                            ' Check your connection and retry.');
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            if (this.form) {
                                this.form.controls[prop]?.markAsTouched();
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }

                });
    }

    /**
     *
     */
    public onSaveComplete(): void {
        this.loader = false;
        this.form.reset();
        this.dialogRef.close(this.form.value);
    }

}
