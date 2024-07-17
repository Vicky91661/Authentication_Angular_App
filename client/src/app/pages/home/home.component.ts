import { Component, inject } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  message :string='';

  userService = inject(UserService);

  constructor(){
    this.getMess();
    this.userService.$refreshTokenReceived.subscribe((response:any)=>{
      this.getMess
    })
  }

  getMess(){
    this.userService.getMessage().subscribe((res:any)=>{
      this.message=res.message
    })
  }
}


