import { Component, Input, OnInit } from '@angular/core';
import { MemberAreaApplicationGuarantorService } from '../guarantor/data/member-area-application-guarantor.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NotificationService } from '../../../../shared/notification.service';
import { MemberAreaLoanApplicationService } from '../../data/member-area-loan-application.service';

@Component({
    selector: 'app-edit-application-general',
    templateUrl: './member-area-view-application-general.component.html',
    styleUrls: ['./member-area-view-application-general.component.css']
})
export class MemberAreaViewApplicationGeneralComponent implements OnInit {

    id: string;
    loanApplicationData: any;
    loanApplicationId = '';
    loanApplicationData$: any;

    step = 0;
    loader = false;
    applicationForm = false;

    constructor(private service: MemberAreaApplicationGuarantorService, private notification: NotificationService,
                private activeRoute: ActivatedRoute, private dialog: MatDialog,
                private memberAreaLoanApplicationService: MemberAreaLoanApplicationService, private router: Router) {
    }

    ngOnInit() {

        this.loanApplicationData$ = this.memberAreaLoanApplicationService.selectedLoanApplicationChanges$;

        this.memberAreaLoanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {

            if (data) {
                this.loanApplicationData = data;
                this.loanApplicationId = data.id;
                if(data.attach_application_form != null && data.attach_application_form != 'null' && data.attach_application_form != '')
                    this.applicationForm = true;
            }
        });

        this.id = this.activeRoute.snapshot.params['id'];
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    /**
     *
     */
    downloadForm() {
        this.getApplicationFomFromService();
    }

    /**
     *
     */
    getApplicationFomFromService() {
        this.loader = true;
        if (this.loanApplicationData && this.loanApplicationData.attach_application_form !== null) {
            this.memberAreaLoanApplicationService.fetchApplicationForm(this.loanApplicationData.attach_application_form).subscribe(res => {
                const fileURL = URL.createObjectURL(res);
                window.open(fileURL, '_blank');
                this.loader = false;
            }, error => {
                this.loader = false;
            });
        }
    }
}
