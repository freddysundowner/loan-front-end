import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanTypeSettingModel } from '../model/loan-type-setting.model';
import { LoanTypeSettingService } from '../data/loan-type-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-tax-type',
    styles: [],
    templateUrl: './add-loan-type.component.html'
})
export class AddLoanTypeComponent implements OnInit  {

    form: FormGroup;
    chargeFields: FormArray;

    formErrors: any;

    type: LoanTypeSettingModel;

    loader = false;

    interestTypes: any;
    paymentFrequencies: any;

    penaltyTypes: any = [];
    penaltyFrequencies: any = [];
    loanCharges: any = [];
    chargeTypes: any = [];

    chargeValue: any;
    chargeTypeId: any;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private typeService: LoanTypeSettingService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddLoanTypeComponent>) {
        this.interestTypes = row.interestTypes;
        this.paymentFrequencies = row.paymentFrequencies;
        this.penaltyTypes = row.penaltyTypes;
        this.penaltyFrequencies = row.penaltyFrequencies;
        this.loanCharges = row.loanCharges;
        this.chargeTypes = row.chargeTypes;
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [Validators.required,
                Validators.minLength(2)]],
            repayment_period: ['', [Validators.required]],
            interest_rate: ['', [Validators.required]],
            interest_type_id: ['', [Validators.required]],
            payment_frequency_id: ['', [Validators.required]],
            description: [''],
            active_status: [''],
            penalty_type_id: [''],
            penalty_value: [''],
            penalty_frequency_id: [''],
            chargeFields: this.fb.array([ this.createChargeField() ])
        });
    }

    /**
     *
     */
    createChargeField(): FormGroup {
        return this.fb.group({
            loan_extra_charge_id: '',
            loan_extra_charge_type_id: '',
            loan_extra_charge_value: ''
        });
    }

    /**
     *
     */
    addChargeField(): void {
        this.chargeFields = this.form.get('chargeFields') as FormArray;
        this.chargeFields.push(this.createChargeField());
    }

    /**
     *
     */
    removeChargeField(i): void {
        this.chargeFields = this.form.get('chargeFields') as FormArray;
        this.chargeFields.removeAt(i);
    }

    /**
     *
     * @param i
     * @param value
     */
    onChargeTypeItemChange(i, value) {
        this.chargeValue = this.loanCharges.find((item: any) => item.id === value).charge_value;
        this.chargeTypeId = this.loanCharges.find((item: any) => item.id === value).loan_extra_charge_type_id;

        this.chargeFields = this.form.get('chargeFields') as FormArray;

        this.chargeFields.at(i).patchValue({
            loan_extra_charge_value: this.chargeValue,
            loan_extra_charge_type_id: this.chargeTypeId
        });
    }

    /**
     *
     */
    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    /**
     * Create a resource
     */
    createType() {

        const body = Object.assign({}, this.type, this.form.value);

        this.loader = true;

        this.typeService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Loan Type created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.type === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
                            ' Check your connection and retry.');
                        return;
                    }
                    console.log(error);
                    
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
