import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanTypeSettingModel } from '../model/loan-type-setting.model';
import { LoanTypeSettingService } from '../data/loan-type-setting.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-tax-type',
    styles: [],
    templateUrl: './edit-loan-type.component.html'
})
export class EditLoanTypeComponent implements OnInit  {

    form: FormGroup;
    chargeFields: FormArray;

    formErrors: any;

    type: LoanTypeSettingModel;

    loader = false;

    interestTypes: any = [];
    paymentFrequencies: any = [];

    penaltyTypes: any = [];
    penaltyFrequencies: any = [];
    loanCharges: any = [];
    chargeTypes: any = [];

    chargeValue: any;
    chargeTypeId: any;
    extraCharges: [];

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private typeService: LoanTypeSettingService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditLoanTypeComponent>) {

        this.type = row.type;
        this.extraCharges = this.type?.extra_charges;

        this.interestTypes = row.interestTypes;
        this.paymentFrequencies = row.paymentFrequencies;
        this.penaltyTypes = row.penaltyTypes;
        this.penaltyFrequencies = row.penaltyFrequencies;
        this.loanCharges = row.loanCharges;
        this.chargeTypes = row.chargeTypes;

        this.form = fb.group({
            name: [this.type.name, [Validators.required,
                Validators.minLength(3)]],
            description: [this.type.description],
            repayment_period: [this.type.repayment_period],
            interest_rate: [this.type.interest_rate],
            interest_type_id: [this.type.interest_type_id],
            payment_frequency_id: [this.type.payment_frequency_id],
            active_status: [this.type.active_status],
            penalty_type_id: [this.type.penalty_type_id],
            penalty_value: [this.type.penalty_value],
            penalty_frequency_id: [this.type.penalty_frequency_id],
            chargeFields: this.setExtraCharges(this.extraCharges)
        });
    }

    ngOnInit() {
    }

    /**
     * Set existing values for loan extra charges
     * @param extraCharges
     */
    setExtraCharges(extraCharges: any) : FormArray {

        const formArray =  new FormArray([]);
        extraCharges.forEach(charge => {
            formArray.push(this.fb.group({
                loan_extra_charge_id: charge.id,
                loan_extra_charge_type_id: charge.loan_extra_charge_type_id,
                loan_extra_charge_value: charge.charge_value
            }))
        });
        return formArray;
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

    close() {
        this.dialogRef.close();
    }

    updateType() {
        const body = Object.assign({}, this.type, this.form.value);

        this.loader = true;
        this.typeService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Loan Type has been updated.');

                },
                (error) => {
                    this.loader = false;

                    if (error.type === 0) {
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
