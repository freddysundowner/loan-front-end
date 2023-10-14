import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../shared/base-service';
import { MemberGroupModel } from '../model/member-group.model';

@Injectable({ providedIn: 'root' })
export class MemberGroupService extends BaseService<MemberGroupModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'member_groups');
    }
}
