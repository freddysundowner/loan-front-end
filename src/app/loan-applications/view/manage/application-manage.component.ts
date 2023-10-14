import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { ApplicationManageModel } from './model/application-manage.model';
import { NotificationService } from '../../../shared/notification.service';
import { LoanApplicationService } from '../../data/loan-application.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanModel } from '../../../loans/models/loan-model';
import { LoanService } from '../../../loans/data/loan.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UserSettingService } from '../../../settings/user/data/user-setting.service';
import { PaymentMethodSettingService } from '../../../settings/payment/method/data/payment-method-setting.service';
import { ChargeTypeService } from '../../../settings/loan/other-charges/data/charge-type.service';
import { LoanChargesSettingService } from '../../../settings/loan/other-charges/data/loan-charges-setting.service';

@Component({
    selector: 'app-application-manage',
    templateUrl: './application-manage.component.html',
    styleUrls: ['./application-manage.component.css']
})
export class ApplicationManageComponent implements OnInit, OnDestroy {
    form: FormGroup;
    chargeFields: FormArray;

    formErrors: any;

    method: ApplicationManageModel;
    dialogRef: MatDialogRef<ConfirmationDialogComponent>;


    loader = false;
    isMpesa = false;

    users: any = [];
    methods: any = [];

    loanApplicationData: any;
    loanApplicationId = '';
    loanApplicationData$: any;

    loanAmountValue: string;
    public loanAmountModelChanged: Subject<string> = new Subject<string>();
    public loanAmountModelChangeSubscription: Subscription;

    repaymentPeriodValue: string;
    public repaymentPeriodModelChanged: Subject<string> = new Subject<string>();
    public repaymentPeriodModelChangeSubscription: Subscription;

    interestRateValue: string;
    public interestRateModelChanged: Subject<string> = new Subject<string>();
    public interestRateModelChangeSubscription: Subscription;

    periodicPayments: number;

    loan: LoanModel;
    convertingToLoan = false;

    loanCharges: any = [];
    chargeTypes: any = [];

    chargeValue: any;
    chargeTypeId: any;
    extraCharges: [];

    constructor(private fb: FormBuilder,  private dialog: MatDialog, private router: Router, private userService: UserSettingService,
                private loanService: LoanService, private methodService: PaymentMethodSettingService,
                private notification: NotificationService, private loanApplicationService: LoanApplicationService,
                private chargeTypeService: ChargeTypeService, private loanChargesSettingService: LoanChargesSettingService) {

        this.loanApplicationData$ = this.loanApplicationService.selectedLoanApplicationChanges$;
        this.loanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {
            if (data) {
                this.loanApplicationData = data;
                this.loanApplicationId = data.id;

                this.extraCharges = this.loanApplicationData?.loanType?.extra_charges;
            }
        });
    }

    ngOnInit() {

        this.loanChargesSettingService.list(['charge_name', 'charge_value', 'loan_extra_charge_type_id'])
            .subscribe((res) => this.loanCharges = res,
                () => this.loanCharges = []
            );

        this.chargeTypeService.list(['name', 'display_name'])
            .subscribe((res) => this.chargeTypes = res,
                () => this.chargeTypes = []
            );

        this.userService.list(['first_name', 'last_name', 'role_id'])
            .subscribe((res) => this.users = res,
                () => this.users = []
            );

        this.methodService.list(['name','display_name'])
            .subscribe((res) => {
                    this.methods = res;
                    this.onPaymentMethodItemChange(this.loanApplicationData?.disburse_method_id);
                },
                () => this.methods = []
            );

        this.form = this.fb.group({
            amount_applied: [{value: this.loanApplicationData?.amount_applied_display, disabled: true}],
           // processing_fee_value: [{value: this.loanApplicationData.processing_fee_value, disabled: true}],
           // processing_fee_type: [{value: this.loanApplicationData?.processing_fee_type?.display_name, disabled: true}],
            loan_type: [{value: this.loanApplicationData?.loanType?.name, disabled: true}],
            interest_type: [{value: this.loanApplicationData?.loanType?.interestType?.display_name, disabled: true}],
            interest_rate: [{value: this.loanApplicationData?.interest_rate, disabled: true}],
            repayment_period: [{value: this.loanApplicationData?.repayment_period, disabled: false}	],
            start_date: [moment(), Validators.required],
            loan_officer_id: [this.loanApplicationData?.loan_officer_id],
            review_notes: [''],
            disburse_method_id: [this.loanApplicationData?.disburse_method_id],
            collateral_check: ['', Validators.required],
            guarantor_check: ['', Validators.required],

            mpesa_fields: this.fb.group({
                mpesa_number: [this.loanApplicationData?.mpesa_number],
                mpesa_first_name: [this.loanApplicationData?.mpesa_first_name]
            }),
            chargeFields: this.setExtraCharges(this.extraCharges)

        });
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

    onPaymentMethodItemChange(value) {
        const paymentMethod = this.methods.find((item: any) => item.id === value).name;
        this.isMpesa = paymentMethod === 'MPESA';
    }

    /**
     * @param lead
     */
    openConfirmationDialog() {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.rejectLoanApplication();
            }
            this.dialogRef = null;
        });
    }

    covertToLoan() {
        this.convertingToLoan = true;

        const body = Object.assign({}, this.loan, this.form.value);

        body.loan_application_id = this.loanApplicationData.id;
        body.member_id = this.loanApplicationData.member_id;
        body.interest_rate = this.loanApplicationData.interest_rate;
        body.interest_type_id = this.loanApplicationData.interest_type_id;
        body.repayment_period = this.loanApplicationData.repayment_period;
        body.amount_approved = this.loanApplicationData.amount_applied;
        body.payment_frequency_id = this.loanApplicationData.payment_frequency_id;
        body.loan_type_id = this.loanApplicationData.loan_type_id;

        body.penalty_type_id = this.loanApplicationData.penalty_type_id;
        body.penalty_value = this.loanApplicationData.penalty_value;
        body.penalty_frequency_id = this.loanApplicationData.penalty_frequency_id;
        body.reduce_principal_early = this.loanApplicationData.reduce_principal_early;

        this.loader = true;

        this.loanService.create(body)
            .subscribe((data) => {
                    this.convertingToLoan = false;
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New loan created.');
                    this.router.navigate(['/loans']);
                },
                (error) => {
                    this.loader = false;
                    this.convertingToLoan = false;
                    if (error.member === 0) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing created.' +
                            ' Check your connection and retry.');
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            if (prop === 'member_id') {
                                this.notification.showNotification('danger', error.member_id[0]);
                            }
                            if (this.form) {
                                this.form.controls[prop]?.markAsTouched();
                                this.form.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }

                });
    }

    rejectLoanApplication() {
        this.convertingToLoan = true;
        const body = Object.assign({}, this.loan, this.loanApplicationData);

        body.review = true;
        body.rejection_notes = this.form.value.review_notes;
        body.member_id = this.loanApplicationData.member_id;
        body.id = this.loanApplicationData.id;

        this.loader = true;
        this.loanApplicationService.update(body)
            .subscribe((data) => {
                    this.convertingToLoan = false;
                    this.loader = false;
                    // notify success
                    this.notification.showNotification('info', 'Success !! Loan Application rejected !');
                    this.router.navigate(['/loan-applications']);
                },
                (error) => {
                    this.loader = false;
                    this.convertingToLoan = false;
                    if (error.member === 0) {
                        // notify error
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
    }

    ngOnDestroy() {
    }
}
