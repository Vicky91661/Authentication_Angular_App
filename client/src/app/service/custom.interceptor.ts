import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { UserService } from './user.service';
import { inject } from '@angular/core';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService) 
  let loggedUserData :any; 
  const localData = localStorage.getItem('User');
  if(localData!=null){
    console.log("data is there ",localData)
    loggedUserData = JSON.parse(localData);
  }

  const cloneRequest = req.clone({
    setHeaders:{
      authorization:`Bearer ${loggedUserData.token}`
    }
  });


  return next(cloneRequest).pipe(
    catchError((error:HttpErrorResponse)=>{
      if(error.status===401){
        const isRefresh = confirm("Your Session got Expired. Do You want to Continue")
        if(isRefresh){
          userService.$refreshToken.next(true)
        }
      }
      return throwError(error)
    })
  );
};
