export class AirportViewModel{
    id: number;
    name: string;
    location: LocationViewModel;
}

export class LocationViewModel{
    id: number;
    country: string;
    city: string;
    shortName: string;
    imagePath: string;
}

export class PlaneViewModel{
    id: number;
    name: string;
    economySeats: number;
    businessSeats: number;
    firstClassSeats: number;
}

export class OptionViewModel{
    id: number;
    name: string;
    price: number;
}

export class PackageViewModel{
    id: number;
    name: string;
    price: number;
}

export class OptionForPackageViewModel{
    option: OptionViewModel;
    _package: PackageViewModel;
}

export enum Class {
    Economy = "Economy",
    Business = "Business",
    FirstClass = "FirstClass"
}

export class PassengerViewModel{
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
}

export class FlightViewModel{
    id: number;
    plane: PlaneViewModel;
    origin: AirportViewModel;
    destination: AirportViewModel;
    gate: string;
    departureTime: Date;
    arrivalTime: Date;
    price: number;
    availableEconomySeats: number;
    availableBusinessSeats: number;
    availableFirstClassSeats: number;
}

export class TicketViewModel{
    id: number;
    owner: PassengerViewModel;
    passenger: PassengerViewModel;
    seatNumber: number;
    class: Class;
    isReturn: boolean;
    package: PackageViewModel;
    flight: FlightViewModel;
    returnFlight?: FlightViewModel;
    totalPrice: number;

}