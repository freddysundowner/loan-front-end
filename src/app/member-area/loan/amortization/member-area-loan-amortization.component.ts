import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder } from '@angular/forms';
import { LoanModel } from '../../../loans/models/loan-model';
import { MemberAreaLoanService } from '../data/member-area-loan.service';
import { NotificationService } from '../../../shared/notification.service';

@Component({
    selector: 'app-loan-amortization',
    styleUrls: ['./member-area-loan-amortization.component.css'],
    templateUrl: './member-area-loan-amortization.component.html'
})
export class MemberAreaLoanAmortizationComponent implements OnInit  {

    loan: LoanModel;

    loanAmount: any;
    totalPeriods: any;
    interest: any;

    loader = false;

    table: any;

    @ViewChild('stepper', {static: true }) stepper: MatStepper;

    tableColumns = [
        'count',
        'due_date',
        'payment',
        'interest',
        'principal',
        'balance'
    ];

    dataSource: any;

    id: string;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private loanService: MemberAreaLoanService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<MemberAreaLoanAmortizationComponent>) {
        this.loan = row.loan;
        this.id = row.loan.id;
        this.loanAmount = this.loan.amount_approved;
        this.totalPeriods = this.loan.payment_period;
        this.interest = this.loan.interest_rate;
    }

    ngOnInit() {
        this.loader = true;
        this.amortizationStatement(this.id, false);
    }


    close() {
        this.dialogRef.close();
    }

    /**
     * Download amortization report
     */
    downloadPdf() {
        this.amortizationStatement(this.id, true);
    }

    /**
     *
     */
    private amortizationStatement(id: string, pdf: boolean){
        if(pdf == true){
            this.loader = true;
            this.loanService.downloadAmortizationStatement({id: id, pdf: pdf})
                .subscribe((res) => {
                        this.dialogRef.close();
                        this.showFile(res);
                    },
                    () => {
                        this.loader = false;
                        this.dialogRef.close();
                    }
                );
        }

        this.loanService.getAmortizationStatement({id: id, pdf: pdf})
            .subscribe((res) => {
                    this.loader = false;
                    this.loader = false;
                    this.dataSource = res.data.amortization;
                },
                () => {
                    this.loader = false;
                    this.dataSource = [];
                }
            );
    }

    /**
     *
     * @param blob
     */
    showFile(blob){
        let newBlob = new Blob([blob], {type: "application/pdf"});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download="amortization_statement.pdf";
        link.click();
        setTimeout(function(){
            window.URL.revokeObjectURL(data);
        }, 100);
    }

}
