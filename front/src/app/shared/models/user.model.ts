export interface UserViewModel {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    roleType : UserRole;
    token: string;
    banned: boolean;
}

export class ClientViewModel implements UserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleType: UserRole;
    banned: boolean;
    numberOfBookings: number;
    token: string;
    
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string, banned: boolean, numberOfBookings: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.banned = banned;
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
    banned: boolean;
    token: string;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string, banned: boolean) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.banned = banned;
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
    banned: boolean;
    
    constructor(id: number, firstName: string, lastName: string, email: string, password: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roleType = UserRole.Admin
        this.banned = false;
    }
}

export class UserChangePasswordModel {
    id: number;
    oldPassword: string;
    newPassword: string;
}


export enum UserRole {
    Admin = 'ROLE_ADMIN',
    Manager = 'ROLE_MANAGER',
    Client = 'ROLE_CLIENT'
}