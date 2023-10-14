import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { StatementComponent } from '../../accounting/statement/statement.component';
import { ConfirmationDialogComponent } from '../../shared/delete/confirmation-dialog-component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MemberDataSource } from '../../members/data/member-data.source';
import { MemberService } from '../../members/data/member.service';
import { BranchService } from '../../settings/branch/general/data/branch.service';
import { AccountingService } from '../../accounting/data/accounting.service';
import { NotificationService } from '../../shared/notification.service';
import { MemberGroupService } from '../../settings/borrower/group/data/member-group.service';
import { MemberModel } from '../../members/models/member-model';
import { MemberAreaStatementComponent } from '../accounts/statement/member-area-statement.component';
import { select, Store } from '@ngrx/store';
import { selectorUserId } from '../../auth/auth.selectors';
import { AppState } from '../../reducers';

@Component({
    selector: 'app-account-setting',
    templateUrl: './member-area-reports.component.html',
    styleUrls: ['./member-area-reports.component.css']
})
export class MemberAreaReportsComponent implements OnInit {

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Data for the list table display
    dataSource: MemberDataSource;
    selectedRowIndex = '';

    branches: any = [];
    groups: any = [];
    memberId: string;

    constructor(private service: MemberService, private branchService: BranchService, private accountingService: AccountingService,
                private notification: NotificationService, private dialog: MatDialog,
                private memberGroupService: MemberGroupService, private store: Store<AppState>) {
        this.store.pipe(select(selectorUserId)).subscribe(res => this.memberId = res);
    }

    /**
     * Initialize data lead
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {}

    onSelected(member: MemberModel): void {
        this.selectedRowIndex = member.id;
        this.service.changeSelectedMember(member);
    }

    /**
     *
     * @param row
     */
    viewStatement() {
        const id = this.memberId;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            id: id,
            type: 'member'
        };

        const dialogRef = this.dialog.open(MemberAreaStatementComponent, dialogConfig);
    }

    /**
     *
     * @param row
     */
    downloadStatement() {

        this.loader = true;
        this.accountingService.downloadMemberAccountStatement({id: this.memberId, pdf: true})
            .subscribe((res) => {
                    this.loader = false;
                    this.showFile(res);
                },
                () => {
                    this.loader = false;
                    this.notification.showNotification('danger', 'Error Downloading File!');
                }
            );
    }

    /**
     *
     * @param blob
     */
    showFile(blob){
        let newBlob = new Blob([blob], {type: "application/pdf"});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download="statement.pdf";
        link.click();
        setTimeout(function(){
            window.URL.revokeObjectURL(data);
        }, 100);
    }
}
