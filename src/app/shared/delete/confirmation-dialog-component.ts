import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'sig-confirm-dialog',
    templateUrl: './confirmation-dialog-component.html',
})
export class ConfirmationDialogComponent {
    public confirmMessage: string;

    title: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
        if(data?.title)
            this.title = data?.title;
        else
            this.title = 'Confirm permanent action.';
    }

}
