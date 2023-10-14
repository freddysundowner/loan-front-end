import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaPaymentModel } from '../models/member-area-payment-model';
import { MemberAreaPaymentService } from './member-area-payment.service';
import { MemberAreaPaymentDataSource } from './member-area-payment-data.source';

@Injectable({ providedIn: 'root' })
export class MemberAreaPaymentResolverService implements Resolve<MemberAreaPaymentModel> {

    dataSource: MemberAreaPaymentDataSource;

    constructor(private service: MemberAreaPaymentService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | MemberAreaPaymentModel {
        return this.service.getAll('', 0, 0);
    }
}
