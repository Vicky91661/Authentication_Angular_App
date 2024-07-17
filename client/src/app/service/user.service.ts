import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, CreateUser, LoginUser } from '../model/model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl:string ='http://localhost:3000/api/v1/';


  public $refreshToken = new Subject<boolean>;
  public $refreshTokenReceived = new Subject<boolean>;

  constructor(private http:HttpClient) {
    this.$refreshToken.subscribe((res:any)=>{
      this.getTokenAgain()
    })
   }


  loginUser(obj:LoginUser){
    return this.http.post<ApiResponse>(`${this.baseUrl}user/signin`,obj)
  }
  signUp(obj:CreateUser){
    return this.http.post<ApiResponse>(`${this.baseUrl}user/signup`,obj)
  }

  getTokenAgain(){
    let loggedUserData :any; 
    const localData = localStorage.getItem('User');
    if(localData!=null){
      loggedUserData = JSON.parse(localData);
    }else{
      return
    }
    const obj ={
      refreshToken : loggedUserData.refreshToken
    }
    this.http.post(`${this.baseUrl}/user/refresh`,obj).subscribe((response:any)=>{
      JSON.stringify(response.data)
      localStorage.setItem("User",JSON.stringify(response.data))
      this.$refreshTokenReceived.next(true);
    })

  }

  getMessage(){
    return this.http.get(`${this.baseUrl}user/message`)
  }
  
}
