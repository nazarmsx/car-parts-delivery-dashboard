import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';


export class HandledErrorsDescription{
  public getErrorDescription(error:Error):string{
    return JSON.stringify(error,null,4);
  }
}
@Injectable({
  providedIn: 'root'
})
export class HttpHandledErrorDescription  extends  HandledErrorsDescription{
  public getErrorDescription(error:HttpErrorResponse){
    if(error.error && error.error.error==='USER_ALREADY_EXIST'){
      return `User with such e-mail already exist.`;
    }
    if(error.error && error.error.error==='USER_NOT_FOUND'){
      return `User not found.`;
    }

    return super.getErrorDescription(error);
  }
}


