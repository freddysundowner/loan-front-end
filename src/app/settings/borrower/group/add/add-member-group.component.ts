import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberGroupModel } from '../model/member-group.model';
import { MemberGroupService } from '../data/member-group.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-add-branch',
    styles: [],
    templateUrl: './add-member-group.component.html'
})
export class AddMemberGroupComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    group: MemberGroupModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private groupService: MemberGroupService,
                private notification: NotificationService,
                private dialogRef: MatDialogRef<AddMemberGroupComponent>) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [Validators.required,
                Validators.minLength(2)]],
            description: ['', [Validators.required,
                Validators.minLength(2)]]
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
    createBranch() {

        const body = Object.assign({}, this.group, this.form.value);

        this.loader = true;

        this.groupService.create(body)
            .subscribe((data) => {
                    this.onSaveComplete();
                    this.notification.showNotification('success', 'Success !! New Group created.');
                },
                (error) => {
                    this.loader = false;
                    if (error.branch === 0) {
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
