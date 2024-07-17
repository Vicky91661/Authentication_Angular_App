import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';

  isLogin:boolean = true;
  userName:string = '';

  ngOnInit(): void {
    this.checkLogin();
  }

  checkLogin(){
    const loginUser:string|null = localStorage.getItem("loginUser")
    if(loginUser){
      this.isLogin=true;
      this.userName = JSON.parse(loginUser).name;
    }else{
      this.isLogin=false;
    }
  }

  onLogout(){
    localStorage.removeItem("loginUser")
    this.userName='';
    this.isLogin=false;
  }
  onSignin(){
    
  }
  onSignup(){

  }


}
