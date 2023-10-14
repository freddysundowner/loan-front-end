import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanChargesSettingModel } from '../model/loan-charges-setting.model';
import { LoanChargesSettingService } from '../data/loan-charges-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-loan-status',
    styles: [],
    templateUrl: './edit-loan-charges.component.html'
})
export class EditLoanChargesComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    status: LoanChargesSettingModel;

    loader = false;
    chargeTypes: any = [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private statusService: LoanChargesSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditLoanChargesComponent>) {

        this.status = row.status;
        this.chargeTypes = row.chargeTypes;

        this.form = fb.group({
            charge_name: [this.status.charge_name, [Validators.required,
                Validators.minLength(3)]],
            charge_value: [this.status.charge_value, [Validators.required,
                Validators.minLength(1)]],
            charge_type_id: [this.status.charge_type_id, [Validators.required,
                Validators.minLength(3)]],
            charge_description: [this.status.charge_description]
        });
    }

    ngOnInit() {
        //
    }

    close() {
        this.dialogRef.close();
    }

    updateStatus() {
        const body = Object.assign({}, this.status, this.form.value);

        this.loader = true;
        this.statusService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Status has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.status === 0) {
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

}
