import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MemberAreaWithdrawalModel } from '../models/member-area-withdrawal-model';
import { MemberAreaWithdrawalService } from '../data/member-area-withdrawal.service';
import { TransactionDataSource } from '../../../transactions/data/transaction-data.source';
import { TransactionService } from '../../../transactions/data/transaction.service';
import { PaymentMethodSettingService } from '../../../settings/payment/method/data/payment-method-setting.service';

@Component({
    selector: 'app-payment-detail',
    styles: [],
    templateUrl: './member-area-withdrawal-detail.component.html'
})
export class MemberAreaWithdrawalDetailComponent implements OnInit  {

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

    withdrawal: MemberAreaWithdrawalModel;
    loader = false;
    paymentMethods: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private withdrawalService: MemberAreaWithdrawalService,
                private transactionService: TransactionService,
                private paymentMethodService: PaymentMethodSettingService,
                private dialogRef: MatDialogRef<MemberAreaWithdrawalDetailComponent>) {

        this.withdrawal = row.data;
    }

    ngOnInit() {
        this.paymentMethodService.list('name')
            .subscribe((res) => this.paymentMethods = res,
                () => this.paymentMethods = []
            );
    }

    close() {
        this.dialogRef.close();
    }

}
