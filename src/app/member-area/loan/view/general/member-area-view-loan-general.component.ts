import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MemberAreaApplicationGuarantorService } from
        '../../../loan-application/view/guarantor/data/member-area-application-guarantor.service';
import { NotificationService } from '../../../../shared/notification.service';
import { LoanService } from '../../../../loans/data/loan.service';
import { MemberAreaLoanService } from '../../data/member-area-loan.service';

@Component({
    selector: 'app-view-loan-general',
    templateUrl: './member-area-view-loan-general.component.html',
    styleUrls: ['./member-area-view-loan-general.component.css']
})
export class MemberAreaViewLoanGeneralComponent implements OnInit {
    loanData: any;
    loanId = '';
    loanData$: any;

    constructor(private notification: NotificationService, private dialog: MatDialog,
                private loanService: MemberAreaLoanService) {}

    ngOnInit() {

        this.loanData$ = this.loanService.selectedLoanChanges$;
        this.loanService.selectedLoanChanges$.subscribe(data => {

            if (data) {
                this.loanData = data;
                this.loanId = data.id;
            }
        });
    }

}
