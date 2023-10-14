import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberGroupModel } from '../model/member-group.model';
import { MemberGroupService } from '../data/member-group.service';
import { NotificationService } from '../../../../shared/notification.service';

@Component({
    selector: 'app-edit-branch',
    styles: [],
    templateUrl: './edit-member-group.component.html'
})

export class EditMemberGroupComponent implements OnInit  {

    form: FormGroup;

    formErrors: any;

    group: MemberGroupModel;

    loader = false;

    constructor(@Inject(MAT_DIALOG_DATA) row: any,
                private fb: FormBuilder,
                private branchService: MemberGroupService,
                private notification: NotificationService,
    private dialogRef: MatDialogRef<EditMemberGroupComponent>) {

        this.group = row.group;
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: [this.group.name, [Validators.required,
                Validators.minLength(2)]],
            description: [this.group.description, [Validators.required,
                Validators.minLength(2)]],
        });
    }

    close() {
        this.dialogRef.close();
    }

    updateBranch() {
        const body = Object.assign({}, this.group, this.form.value);

        this.loader = true;
        this.branchService.update(body)
            .subscribe((data) => {
                    this.loader = false;

                    this.dialogRef.close(this.form.value);

                    // notify success
                    this.notification.showNotification('success', 'Success !! Group has been updated.');
                },
                (error) => {
                    this.loader = false;

                    if (error.branch === 0) {
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
