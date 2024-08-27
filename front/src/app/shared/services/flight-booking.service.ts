import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableResponse } from '../models/pageableResponse.model';
import { OptionViewModel } from '../models/option.model';
import { CouponViewModel } from '../models/coupon.model';
import { PlaneViewModel } from '../models/plane.model';
import { UtilityService } from './utility.service';

const OPTION = "/option";
const PACKAGE = "/package";
const COUPON = "/coupon";
const PLANE = "/plane";

@Injectable({
  providedIn: 'root'
})
export class FlightBookingService {

  private url: string = environment.flightBookingServiceUrl;
  

  constructor(private http: HttpClient, private utilityService: UtilityService) { }


  getOptions() : Observable<PageableResponse<OptionViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<OptionViewModel[]>>(
      this.url + OPTION,
      { headers }
    );
  }

  getCoupons() : Observable<PageableResponse<CouponViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<CouponViewModel[]>>(
      this.url + COUPON,
      { headers }
    );
    
  }

  toggleCouponStatus(request: CouponViewModel) : Observable<CouponViewModel> {
      
    const headers = this.utilityService.getHeaders();

    request.active = !request.active;
    console.log(request);

    return this.http.put<CouponViewModel>(
      this.url + COUPON + `/${request.couponCode}`,
      request,
      { headers }
    );
  }
  getPlanes() : Observable<PageableResponse<PlaneViewModel[]>> {
      
    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<PlaneViewModel[]>>(
      this.url + PLANE,
      { headers }
    );
  }

  addCoupon(request: CouponViewModel) : Observable<CouponViewModel> {
      
    const headers = this.utilityService.getHeaders();

    return this.http.post<CouponViewModel>(
      this.url + COUPON,
      request,
      { headers }
    );
  }
}
