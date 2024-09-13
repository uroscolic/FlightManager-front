export class AirportViewModel{
    id: number;
    name: string;
    location: LocationViewModel;

    constructor(id: number, name: string, location: LocationViewModel){
        this.id = id;
        this.name = name;
        this.location = location;
    }
}

export class AirportUpdateModel{
    oldName: string;
    newName: string;
    location: LocationViewModel;

    
}

export class LocationViewModel{
    id: number;
    country: string;
    city: string;
    shortName: string;

    constructor(id: number, country: string, city: string, shortName: string){
        this.id = id;
        this.country = country;
        this.city = city;
        this.shortName = shortName;
    }
}

export class PlaneViewModel{
    id: number;
    name: string;
    economySeats: number;
    businessSeats: number;
    firstClassSeats: number;

    constructor(id: number, name: string, economySeats: number, businessSeats: number, firstClassSeats: number){
        this.id = id;
        this.name = name;
        this.economySeats = economySeats;
        this.businessSeats = businessSeats;
        this.firstClassSeats = firstClassSeats;
    }
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

    constructor(id: number, name: string, price: number){
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

export class OptionForPackageViewModel{
    option: OptionViewModel;
    _package: PackageViewModel;
}

export enum Class {
    ECONOMY = "ECONOMY",
    BUSINESS = "BUSINESS",
    FIRST = "FIRST"
}

export class PassengerViewModel{
    id: number;
    firstName: string;
    lastName: string;
    email?: string;

    constructor(id: number, firstName: string, lastName: string, email?: string){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
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

    constructor(id: number, plane: PlaneViewModel, origin: AirportViewModel, destination: AirportViewModel, gate: string, departureTime: Date, arrivalTime: Date, price: number, availableEconomySeats: number, availableBusinessSeats: number, availableFirstClassSeats: number){
        this.id = id;
        this.plane = plane;
        this.origin = origin;
        this.destination = destination;
        this.gate = gate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
        this.availableEconomySeats = availableEconomySeats;
        this.availableBusinessSeats = availableBusinessSeats;
        this.availableFirstClassSeats = availableFirstClassSeats;
    }
}

export class FlightUpdateModel{
    newPrice: number;
    newDepartureTime: Date;
    newArrivalTime: Date;
    newGate: string;
}

export class TicketViewModel{
    id: number;
    owner: PassengerViewModel;
    passenger: PassengerViewModel;
    seatNumber: number;
    returnSeatNumber: number;
    ticketClass: Class;
    _return: boolean;
    _package: PackageViewModel;
    flight: FlightViewModel;
    returnFlight?: FlightViewModel;
    totalPrice: number;

}

export class FlightSearchModel{
    origin: AirportViewModel;
    destination: AirportViewModel;
    departureStart: Date | null;
    arrivalEnd: Date | null;
    flightClass: Class;
    passengers: number;
    
    constructor(origin: AirportViewModel, destination: AirportViewModel, departureStart: Date | null, flightClass: Class, passengers: number, arrivalEnd: Date| null){
        this.origin = origin;
        this.destination = destination;
        this.departureStart = departureStart;
        this.arrivalEnd = arrivalEnd;
        this.flightClass = flightClass;
        this.passengers = passengers;
    }
   

}