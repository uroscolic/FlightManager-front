export interface UserViewModel {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    role : UserRole;
}

export class ClientViewModel implements UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    isBanned: boolean;
    numberOfBookings: number;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string, isBanned: boolean, numberOfBookings: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isBanned = isBanned;
        this.numberOfBookings = numberOfBookings;
        this.role = UserRole.Client
    }
}
  
export class ManagerViewModel implements UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    isBanned: boolean;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string, isBanned: boolean) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isBanned = isBanned;
        this.role = UserRole.Manager
    }
}

export class AdminViewModel implements UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = UserRole.Admin
    }
}


export enum UserRole {
    Admin = 'ROLE_ADMIN',
    Manager = 'ROLE_MANAGER',
    Client = 'ROLE_CLIENT'
}