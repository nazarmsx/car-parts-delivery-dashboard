import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Admin,Route,Driver,RouteUpdateLog} from '../models';


@Injectable({providedIn: 'root'})
export class ApiService {
  constructor (private http: HttpClient) { }

  getAdmins(offset: number = 0, limit: number = 10) {
    return this.http.get<{ data: Admin[] }>(`${config.apiUrl}/api/v1/admins?offset=${offset}&limit=${limit}&dummy=${Date.now()}`);
  }

  getAdminsCount () {
    return this.http.get<{ total: number }>(`${config.apiUrl}/api/v1/admins?count=true&dummy=${Date.now()}`);
  }

  createAdmin (options:{login:string,password:string,claims:any}) {
    return this.http.post<{ status: string, data:Admin }>(`${config.apiUrl}/api/v1/admin`,options);
  }

  saveAdmin (user:Admin) {
    return this.http.put<{ status: string, data:Admin }>(`${config.apiUrl}/api/v1/admin`,user);
  }

  getAdmin(id:string) {
    return this.http.get<Admin>(`${config.apiUrl}/api/v1/admin/${id}`);
  }

  removeAdmin(id:string) {
    return this.http.delete<Admin>(`${config.apiUrl}/api/v1/admin/${id}`);
  }

  getRoutes(filter:{carLicensePlate?:string,driverCode?:string,status?:string[],orderField?:string,order?:string}={},offset: number = 0, limit: number = 10) {
    const filterStr=this.serializeObject(filter);
    return this.http.get<{ data: Route[] }>(`${config.apiUrl}/api/admin/v1/routes?offset=${offset}&limit=${limit}${filterStr}`);
  }

  getRoutesCount (filter:{carLicensePlate?:string,driverCode?:string,status?:string[],orderField?:string,order?:string}={}) {
    const filterStr=this.serializeObject(filter);
    return this.http.get<{ total: number }>(`${config.apiUrl}/api/admin/v1/routes?count=true${filterStr}`);
  }
  getDrivers(filter:{name?:string}={},offset: number = 0, limit: number = 50) {
    const filterStr=this.serializeObject(filter);
    return this.http.get<Driver[]>(`${config.apiUrl}/api/admin/v1/drivers?offset=${offset}&limit=${limit}${filterStr}`);
  }

  getRouteInfo(id:string) {
    return this.http.get<Route>(`${config.apiUrl}/api/admin/v1/route/${id}`);
  }
  getRouteUpdateLog(id:string) {
    return this.http.get<RouteUpdateLog[]>(`${config.apiUrl}/api/admin/v1/route/status-history/${id}`);
  }
  clearTestData() {
    return this.http.get<any>(`${config.apiUrl}/api/v1/clear-test-data`);
  }
  updateRouteStatus (data: { id: string, status: string}) {
    return this.http.put<{ status: string, data:Route }>(`${config.apiUrl}/api/admin/v1/route`, data);
  }

  private serializeObject(obj:any):string{
    let res="";
    for (let key in obj) {
      if (res != "") {
        res += "&";
      }
      res += key + "=" + encodeURIComponent(obj[key]);
    }
    if(res!==''){
      res='&'+res;
    }

    return res;
  }
}