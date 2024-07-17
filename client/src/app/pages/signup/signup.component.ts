import { Component, inject } from '@angular/core';
import { ApiResponse, CreateUser, ErrorMessage } from '../../model/model';
import { UserService } from '../../service/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  SignUpData:CreateUser = new CreateUser()
  userService = inject(UserService)
  router = inject(Router)
  onSignUp(){
    console.log("data while login is",this.SignUpData)
    this.userService.signUp(this.SignUpData).subscribe({next:(response:ApiResponse)=>{  
        alert('Signup in successfully')
        JSON.stringify(response.data)
        localStorage.setItem("User",JSON.stringify(response.data))
        this.router.navigateByUrl('/home')
     },
     error:(err:ErrorMessage)=>{
      console.log(err.error)
        alert(err.error.message[0])
     }
    })
}
}
