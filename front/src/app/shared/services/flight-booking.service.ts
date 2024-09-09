import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableResponse } from '../models/pageableResponse.model';

import { UtilityService } from './utility.service';
import { AirportUpdateModel, FlightUpdateModel, FlightViewModel, LocationViewModel, OptionForPackageViewModel, OptionViewModel, PackageViewModel, PassengerViewModel, PlaneViewModel, TicketViewModel } from '../models/flight-booking.model';
import { CouponViewModel } from '../models/coupon.model';
import { AirportViewModel } from '../models/flight-booking.model';


const OPTION = "/option";
const PACKAGE = "/package";
const COUPON = "/coupon";
const PLANE = "/plane";
const AIRPORT = "/airport";
const LOCATION = "/location";
const OPTIONS_FOR_PACKAGES = "/options-for-packages";
const TICKET = "/ticket";
const PASSENGER = "/passenger";
const FLIGHT = "/flight";


@Injectable({
  providedIn: 'root'
})
export class FlightBookingService {

  private url: string = environment.flightBookingServiceUrl;


  constructor(private http: HttpClient, private utilityService: UtilityService) { }



  // GET requests


  getAirports(): Observable<PageableResponse<AirportViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<AirportViewModel[]>>(
      this.url + AIRPORT,
      { headers }
    );
  }

  getAirportById(id: number): Observable<AirportViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<AirportViewModel>(
      this.url + AIRPORT + `/${id}`,
      { headers }
    );
  }

  getFlightById(id: number): Observable<FlightViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<FlightViewModel>(
      this.url + FLIGHT + `/${id}`,
      { headers }
    );
  }

  getOptions(): Observable<PageableResponse<OptionViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<OptionViewModel[]>>(
      this.url + OPTION,
      { headers }
    );
  }

  getCoupons(): Observable<PageableResponse<CouponViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<CouponViewModel[]>>(
      this.url + COUPON,
      { headers }
    );

  }

  getPackages(): Observable<PageableResponse<PackageViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<OptionViewModel[]>>(
      this.url + PACKAGE,
      { headers }
    );
  }

  getLocations(): Observable<PageableResponse<LocationViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<LocationViewModel[]>>(
      this.url + LOCATION,
      { headers }
    );
  }

  getPlanes(): Observable<PageableResponse<PlaneViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<PlaneViewModel[]>>(
      this.url + PLANE,
      { headers }
    );
  }

  getOptionsForPackage(_package: PackageViewModel): Observable<PageableResponse<OptionForPackageViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    const params = new HttpParams().set('packageName', _package.name);

    return this.http.get<PageableResponse<OptionForPackageViewModel[]>>(
      this.url + OPTIONS_FOR_PACKAGES,
      { headers, params }
    );
  }


  getLocationByCityAndCountry(city: string, country: string): Observable<LocationViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<LocationViewModel>(
      this.url + LOCATION + `/${city}/${country}`,
      { headers }
    );
  }

  getPassengers(): Observable<PageableResponse<PassengerViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<PassengerViewModel[]>>(
      this.url + PASSENGER,
      { headers }
    );
  }

  getTickets(ownerEmail: string): Observable<PageableResponse<TicketViewModel[]>> {

    const headers = this.utilityService.getHeaders();
    const params = new HttpParams().set('ownerEmail', ownerEmail);

    return this.http.get<PageableResponse<TicketViewModel[]>>(
      this.url + TICKET,
      { headers, params }
    );
  }

  getFlights(): Observable<PageableResponse<FlightViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<FlightViewModel[]>>(
      this.url + FLIGHT,
      { headers }
    );
  }

  // PUT requests

  toggleCouponStatus(request: CouponViewModel): Observable<CouponViewModel> {

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

  addCoupon(request: CouponViewModel): Observable<CouponViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<CouponViewModel>(
      this.url + COUPON,
      request,
      { headers }
    );
  }

  addPackage(request: PackageViewModel): Observable<PackageViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<PackageViewModel>(
      this.url + PACKAGE,
      request,
      { headers }
    );
  }

  addOption(request: OptionViewModel): Observable<OptionViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<OptionViewModel>(
      this.url + OPTION,
      request,
      { headers }
    );
  }

  addOptionForPackage(request: OptionForPackageViewModel): Observable<OptionForPackageViewModel> {

    const headers = this.utilityService.getHeaders();
    return this.http.post<OptionForPackageViewModel>(
      this.url + OPTIONS_FOR_PACKAGES,
      request,
      { headers }
    );
  }
  addPlane(request: PlaneViewModel): Observable<PlaneViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<PlaneViewModel>(
      this.url + PLANE,
      request,
      { headers }
    );
  }

  addAirport(request: AirportViewModel): Observable<AirportViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<AirportViewModel>(
      this.url + AIRPORT,
      request,
      { headers }
    );
  }

  addFlight(request: FlightViewModel): Observable<FlightViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<FlightViewModel>(
      this.url + FLIGHT,
      request,
      { headers }
    );
  }

  addPassenger(request: PassengerViewModel): Observable<PassengerViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<PassengerViewModel>(
      this.url + PASSENGER,
      request,
      { headers }
    );
  }
  addLocation(request: LocationViewModel): Observable<LocationViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<LocationViewModel>(
      this.url + LOCATION,
      request,
      { headers }
    );
  }

  addTicket(request: TicketViewModel): Observable<TicketViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.post<TicketViewModel>(
      this.url + TICKET,
      request,
      { headers }
    );
  }

  // PUT requests

  updateAirport(request: AirportUpdateModel): Observable<AirportViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.put<AirportViewModel>(
      this.url + AIRPORT,
      request,
      { headers }
    );
  }

  updateFlight(id:number, request: FlightUpdateModel): Observable<FlightViewModel> {

    const headers = this.utilityService.getHeaders();

    return this.http.put<FlightViewModel>(
      this.url + FLIGHT + `/${id}`,
      request,
      { headers }
    );
  }

  allTickets(): Observable<PageableResponse<TicketViewModel[]>> {

    const headers = this.utilityService.getHeaders();

    return this.http.get<PageableResponse<TicketViewModel[]>>(
      this.url + TICKET,
      { headers }
    );
  }

  // DELETE requests

  cancelTicket(id: number): Observable<any> {

    const headers = this.utilityService.getHeaders();

    return this.http.delete<any>(
      this.url + TICKET + `/${id}`,
      { headers }
    );
  }

}
