import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanChargesSettingModel } from '../model/loan-charges-setting.model';
import { LoanChargesSettingService } from '../data/loan-charges-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-tax-status',
    styles: [],
    templateUrl: './add-loan-charges.component.html'
})
export class AddLoanChargesComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    status: LoanChargesSettingModel;

    loader = false;

    chargeTypes: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private statusService: LoanChargesSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddLoanChargesComponent>) {
        this.chargeTypes = row.chargeTypes;
    }

    ngOnInit() {
        this.form = this.fb.group({
            charge_name: ['', [Validators.required,
                Validators.minLength(3)]],
            charge_value: ['', [Validators.required,
                Validators.minLength(1)]],
            loan_extra_charge_type_id: ['', [Validators.required,
                Validators.minLength(3)]],
            charge_description: [''],
        });
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Create a resource
     */
    createStatus() {

        const body = Object.assign({}, this.status, this.form.value);

        this.loader = true;

        this.statusService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New status created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.status === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
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
