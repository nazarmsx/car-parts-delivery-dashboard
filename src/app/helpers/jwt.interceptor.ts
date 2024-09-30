import { Injectable ,Injector} from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor ,HttpErrorResponse} from '@angular/common/http';
import { Observable,Subject,pipe,throwError} from 'rxjs';
import { Router, ActivatedRoute,  } from '@angular/router';
import { tap,catchError ,switchMap} from 'rxjs/operators';

import { AuthenticationService } from '../modules/auth/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.access_token) {
            request = request.clone({
                setHeaders: {
                    "x-access-token": `${currentUser.access_token}`,
                    'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                        'Pragma': 'no-cache',
                'Expires': '0'
                }
            });
        }


        return next.handle(request);
    }
}
