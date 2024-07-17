import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiResponse, ErrorMessage, LoginUser } from '../../model/model';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginData:LoginUser = new LoginUser()
  userService = inject(UserService)
  router = inject(Router)

  onLogin(){
    console.log("data while login is",this.LoginData)
    this.userService.loginUser(this.LoginData).subscribe({next:(response:ApiResponse)=>{
      
      alert('Loged in successfully')
      JSON.stringify(response.data)
      localStorage.setItem("User",JSON.stringify(response.data))
      this.router.navigateByUrl('/home')
      
     },
     error:(err:ErrorMessage)=>{
        console.log("error message inside the login is ",err)
        alert(err.error.message[0])
     }
    
    })
  }
}
