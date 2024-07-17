
export interface ApiResponse{
    message:string;
    data:{
        firstName:string;
        lastName:string;
        token:string;
        refreshToken:string;
        
    }
}

export interface ErrorMessage {
    error: Error;
    headers: string;
    message: string;
    name: string;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
  }
interface Error {
    message: string[];
}
export class CreateUser {
   
    firstName: string;
    lastName: string;
    Email: string;
    Password: string;

    
    constructor(){
    
        this.firstName='';
        this.Email='';
        this.Password='';
        this.lastName='';
       
    }
}

export class LoginUser{
    Password: string;
    Email: string;
    constructor(){
        this.Password='';
        this.Email='';
    }
}