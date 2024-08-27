import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableResponse } from '../models/pageableResponse.model';

import { UtilityService } from './utility.service';
import { OptionViewModel, PackageViewModel, PlaneViewModel } from '../models/flight-booking.model';
import { CouponViewModel } from '../models/coupon.model';
import { AirportViewModel } from '../models/flight-booking.model';


const OPTION = "/option";
const PACKAGE = "/package";
const COUPON = "/coupon";
const PLANE = "/plane";
const AIRPORT = "/airport";

@Injectable({
  providedIn: 'root'
})
export class FlightBookingService {

  private url: string = environment.flightBookingServiceUrl;
  

  constructor(private http: HttpClient, private utilityService: UtilityService) { }



  // GET requests


  getAirports() : Observable<PageableResponse<AirportViewModel[]>> {
        
    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<AirportViewModel[]>>(
      this.url + AIRPORT,
      { headers }
    );
  }

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

  getPackages() : Observable<PageableResponse<PackageViewModel[]>> {
        
    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<OptionViewModel[]>>(
      this.url + PACKAGE,
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

  // PUT requests

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

  // POST requests

  addCoupon(request: CouponViewModel) : Observable<CouponViewModel> {
      
    const headers = this.utilityService.getHeaders();

    return this.http.post<CouponViewModel>(
      this.url + COUPON,
      request,
      { headers }
    );
  }

  addPackage(request: PackageViewModel) : Observable<PackageViewModel> {
      
    const headers = this.utilityService.getHeaders();

    return this.http.post<PackageViewModel>(
      this.url + PACKAGE,
      request,
      { headers }
    );
  }

  addOption(request: OptionViewModel) : Observable<OptionViewModel> {
      
    const headers = this.utilityService.getHeaders();

    return this.http.post<OptionViewModel>(
      this.url + OPTION,
      request,
      { headers }
    );
  }
}
