import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-view-loan-loan-application',
    templateUrl: './member-area-view-loan-loan-applications.component.html',
    styleUrls: ['./member-area-view-loan-loan-applications.component.css']
})
export class MemberAreaViewLoanLoanApplicationsComponent implements OnInit {
    form: FormGroup;
    formErrors: any;
    reports: any;
    constructor(private fb: FormBuilder) {

    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {
    }

}
