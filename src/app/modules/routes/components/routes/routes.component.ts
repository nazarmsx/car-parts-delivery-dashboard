import {Component, ViewChild} from '@angular/core';
import {ApiService} from '../../../../services';
import {Subscription, forkJoin} from 'rxjs';
import {Route, RouteStatus, Driver} from '../../../../models'
import {Router, ActivatedRoute, Params} from '@angular/router';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {debounceTime, map,take ,distinctUntilChanged} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})

export class RoutesComponent {
  public routesCount: number;
  public page: number = 1;
  public routes: Route[] = [];
  public filter: {
    carLicensePlate?: string, driverCode?: string, status?: string[], orderField: string, order: string, createdAtTo?: string, createdAtFrom?: string
    updatedAtTo?: string, updatedAtFrom?: string, docNo?: string
  } = {
    orderField: 'createdAt',
    order: 'desc'
  };
  drivers$: Observable<Driver[]>;
  public statusNames: any = {};
  private queryParams:any;

  public filterForm: FormGroup;

  constructor (private apiService: ApiService, private formBuilder: FormBuilder, private router: Router, public translate: TranslateService, private activeRoute: ActivatedRoute,) {
    translate.get('STATUS_NAMES').subscribe((res) => {this.statusNames = res;})
  }

  ngOnInit () {

    this.activeRoute.queryParams.pipe(take(1)).subscribe((next:any)=>{
      this.queryParams=next;
      this.activeRoute.queryParams.subscribe((next:any)=>{
        this.queryParams=next;
      });

      this.deserializeQueryParamsToFilter(next);
      this.filterForm = this.formBuilder.group({
        driverCode: [this.filter.driverCode?this.filter.driverCode:''],
        docNo: [this.filter.docNo ? this.filter.docNo : ''],
        carLicensePlate: [this.filter.carLicensePlate ? this.filter.carLicensePlate : ''],
        status: this.buildRouteStatuses()
      });
      this.setupFilterListeners();
      this.loadRoutes();
    });
    this.drivers$ = this.apiService.getDrivers().pipe(map((drivers) => {
      drivers = drivers.map(e => {
        e.fullName = e.driverSurname + ' ' + e.driverName;
        return e;
      });
      return drivers;
    }));
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get('STATUS_NAMES').subscribe((res) => {this.statusNames = res;})
    });


  }

  get statuses () {
    // @ts-ignore: Unreachable code error
    return this.filterForm.get('status').controls;
  };

  private loadRoutes () {

    let routeCount = this.apiService.getRoutesCount(this.filter);
    let routes = this.apiService.getRoutes(this.filter);

    forkJoin([routeCount, routes]).subscribe(results => {
      this.routesCount = results[0].total;
      this.routes = results[1].data;
    })
  }

  edit (user: Route) {
    this.router.navigate([`/edit-route/${user._id}`])
  }

  public onPageChange (pageNum: number) {
    this.loadRoutesPage(pageNum)
  }

  private loadRoutesPage (pageNumber: number) {
    this.apiService.getRoutes(this.filter, (pageNumber - 1) * 10, 10).pipe(first()).subscribe((routes: any) => {
      this.routes = routes.data;
    });
  }

  private setupFilterListeners () {

    this.filterForm.get('carLicensePlate').valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      this.filter.carLicensePlate = val;
      this.addFilterValueToRouteParams('carLicensePlate',val);
      this.loadRoutes();
    });
    this.filterForm.get('status').valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((val: boolean[]) => {
      this.filter.status = val.map((isSelected, index) => (isSelected ? this.routeStatuses[index].id : false)).filter(e => e) as any;
      this.loadRoutes();
      this.addFilterValueToRouteParams('status',this.filter.status.toString());

    });

    this.filterForm.get('driverCode').valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      this.filter.driverCode = val;
      if (this.filter.driverCode === null) {
        delete this.filter.driverCode;
      }
      this.addFilterValueToRouteParams('driverCode',val);
      this.loadRoutes();
    });

    this.filterForm.get('docNo').valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
    ).subscribe(val => {
      this.filter.docNo = val;
      if (this.filter.docNo === null) {
        delete this.filter.docNo;
      }
      this.addFilterValueToRouteParams('docNo',val);
      this.loadRoutes();
    });
  }

  showDetails (route: Route) {
    this.router.navigate([`/route/${route._id}`])
  }

  private get routeStatuses () {
    return [
      {name: this.statusNames.NEW, selected: false, id: RouteStatus.New, cssClass: 'badge-secondary'},
      {name: this.statusNames.READY, selected: false, id: RouteStatus.Ready, cssClass: 'badge-info'},
      {name: this.statusNames.STARTED, selected: false, id: RouteStatus.Started, cssClass: 'badge-secondary'},
      {name: this.statusNames.ARRIVED, selected: false, id: RouteStatus.Arrived, cssClass: 'badge-info'},
      {name: this.statusNames.DELAYED, selected: false, id: RouteStatus.Delayed, cssClass: 'badge-warning'},
      {name: this.statusNames.COMPLETED, selected: false, id: RouteStatus.Completed, cssClass: 'badge-success'},
      {name: this.statusNames.REJECTED, selected: false, id: RouteStatus.Rejected, cssClass: 'badge-danger'},
    ];
  }

  public get statusName () {
    return this.statusNames;
  }

  private buildRouteStatuses (): any {

    const arr = this.routeStatuses.map(status => {
      let isSelected=this.filter&& this.filter.status && this.filter.status.indexOf(status.id)!==-1;
      return this.formBuilder.control(isSelected);
    });
    return this.formBuilder.array(arr);
  }

  public toggleOrder (field: string) {
    if (this.filter.orderField !== field) {
      this.filter.orderField = field;
      this.filter.order = 'desc';
      this.addFilterValueToRouteParams('orderField',this.filter.orderField).then((_)=>{
        this.addFilterValueToRouteParams('order',this.filter.order);
      });

      this.loadRoutes();
      return;
    }
    if (this.filter.order === 'asc') {
      this.filter.order = 'desc';
      this.loadRoutes();
      this.addFilterValueToRouteParams('order',this.filter.order);
      return;
    }
    if (this.filter.order === 'desc') {
      this.filter.order = 'asc';
      this.addFilterValueToRouteParams('order',this.filter.order);
    }
    this.loadRoutes();
  }

  onCreatedAtRangeSelected (data: { to: string, from: string }) {
    if (data.to && data.from) {
      this.filter.createdAtTo = data.to;
      this.filter.createdAtFrom = data.from;
    } else {
      delete this.filter.createdAtTo;
      delete this.filter.createdAtFrom;
    }
    this.addFilterValueToRouteParams('createdAtTo',this.filter.createdAtTo).then((_)=>{
      this.addFilterValueToRouteParams('createdAtFrom',this.filter.createdAtFrom);
    });

    this.loadRoutes();
  }

  onUpdatedAtRangeSelected (data: { to: string, from: string }) {
    if (data.to && data.from) {
      this.filter.updatedAtTo = data.to;
      this.filter.updatedAtFrom = data.from;
    } else {
      delete this.filter.updatedAtTo;
      delete this.filter.updatedAtFrom;
    }
    this.addFilterValueToRouteParams('updatedAtTo',this.filter.updatedAtTo).then((_)=>{
      this.addFilterValueToRouteParams('updatedAtFrom',this.filter.updatedAtFrom);
    });


    this.loadRoutes();
  }

  public addFilterValueToRouteParams (key:any,value:any) {
    let copy=Object.assign({},this.queryParams);

    if(!value || value===''){
      delete copy[key];
    }else{
      copy[key]=value;
    }

    return this.router.navigate(
      [],
      {
        relativeTo: this.activeRoute,
        queryParams: copy,
        // queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }
  private deserializeQueryParamsToFilter(queryParams:{
    carLicensePlate?: string, driverCode?: string, status?: any, orderField: string, order: string, createdAtTo?: string, createdAtFrom?: string
    updatedAtTo?: string, updatedAtFrom?: string
  }){
    this.filter=Object.assign({},queryParams);
    if(queryParams.status && queryParams.status.split){
      this.filter.status=queryParams.status.split(',')
    }

  }
}