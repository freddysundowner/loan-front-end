import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../shared/base-service';
import { GeneralJournalModel } from '../../../accounting/models/general-journal.model';

@Injectable({ providedIn: 'root' })
export class MemberAreaGeneralJournalService extends BaseService<GeneralJournalModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'journals');
    }
}
