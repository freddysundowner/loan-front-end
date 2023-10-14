import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MemberAreaLoanService } from '../../data/member-area-loan.service';
import { NotificationService } from '../../../../shared/notification.service';
import { MemberAreaApplicationGuarantorService } from
        '../../../loan-application/view/guarantor/data/member-area-application-guarantor.service';

@Component({
    selector: 'app-view-loan-adjustment',
    templateUrl: './member-area-view-loan-adjustment.component.html',
    styleUrls: ['./member-area-view-loan-adjustment.component.css']
})
export class MemberAreaViewLoanAdjustmentComponent implements OnInit {
    loanData: any;
    loanId = '';
    loanData$: any;

    constructor(private service: MemberAreaApplicationGuarantorService, private notification: NotificationService,
                private dialog: MatDialog, private loanService: MemberAreaLoanService) {}

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
