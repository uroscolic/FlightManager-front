import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableResponse } from '../models/pageableResponse.model';
import { OptionViewModel } from '../models/option.model';
import { CouponViewModel } from '../models/coupon.model';

const OPTION = "/option";
const PACKAGE = "/package";
const COUPON = "/coupon";

@Injectable({
  providedIn: 'root'
})
export class FlightBookingService {

  private url: string = environment.flightBookingServiceUrl;

  constructor(private http: HttpClient) { }


  getOptions() : Observable<PageableResponse<OptionViewModel[]>> {

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });


    return this.http.get<PageableResponse<OptionViewModel[]>>(
      this.url + OPTION,
      { headers }
    );
  }

  getCoupons() : Observable<PageableResponse<CouponViewModel[]>> {

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<PageableResponse<CouponViewModel[]>>(
      this.url + COUPON,
      { headers }
    );
    
  }

  toggleCouponStatus(request: CouponViewModel) : Observable<CouponViewModel> {
      
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
      const headers = new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : ''
      });

      request.active = !request.active;
      console.log(request);

      return this.http.put<CouponViewModel>(
        this.url + COUPON + `/${request.couponCode}`,
        request,
        { headers }
      );
  }

  addCoupon(request: CouponViewModel) : Observable<CouponViewModel> {
      
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.post<CouponViewModel>(
      this.url + COUPON,
      request,
      { headers }
    );
  }
}
