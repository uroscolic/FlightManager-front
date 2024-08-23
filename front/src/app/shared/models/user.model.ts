export interface UserViewModel {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    roleType : UserRole;
    token: string;
}

export class ClientViewModel implements UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleType: UserRole;
    isBanned: boolean;
    numberOfBookings: number;
    token: string;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string, isBanned: boolean, numberOfBookings: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isBanned = isBanned;
        this.numberOfBookings = numberOfBookings;
        this.roleType = UserRole.Client
    }
}
  
export class ManagerViewModel implements UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleType: UserRole;
    isBanned: boolean;
    token: string;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string, isBanned: boolean) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isBanned = isBanned;
        this.roleType = UserRole.Manager
    }
}

export class AdminViewModel implements UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleType: UserRole;
    token: string;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roleType = UserRole.Admin
    }
}


export enum UserRole {
    Admin = 'ROLE_ADMIN',
    Manager = 'ROLE_MANAGER',
    Client = 'ROLE_CLIENT'
}