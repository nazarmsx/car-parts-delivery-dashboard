import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../../../../services';
import {first} from 'rxjs/operators';
import {Location} from "@angular/common";
import {Route, RouteStatus, RouteUpdateLog} from '../../../../models'
import {map} from 'rxjs/operators';
import * as L from 'leaflet';
import {TranslateService} from '@ngx-translate/core';

const Icon = require("../../../../../assets/images/gps.png");
const ActiveMarker = require("../../../../../assets/images/active-marker.png");

@Component({
  selector: 'route-history',
  templateUrl: './route-history.component.html',
  styleUrls: ['./route-history.component.scss']
})

export class RouteHistoryComponent {
  public routeUpdateLog: RouteUpdateLog[] = [];
  @Input() route: Route;
  @Input() routeId: string;
  @Input() statusNames: any;
  @ViewChild("map")

  public mapElement: ElementRef;
  public readonly platform: any;
  public map: any;
  public markers:any[]=[];
  private previousActiveMarkerIndex:number=null;
  public routeChangedTranslation:string='';

  constructor (private formBuilder: FormBuilder, private apiService: ApiService, private location: Location,public translate: TranslateService) {
    translate.get('STATUS_CHANGED').subscribe((res)=>{
      this.routeChangedTranslation=res;
    })
  }

  ngOnInit () {

    const routeId: string = this.routeId;
    if (routeId) {
      this.apiService.getRouteUpdateLog(routeId)
        .pipe(first()).pipe(map((logs) => {
        logs = logs.map((e, index, arr) => {
          if (e.updateFields.status) {
            if (index < logs.length-1 && arr[index + 1].updateFields.status) {
              e.oldStatus = arr[index +1].updateFields.status;
            }
            if (index === logs.length-1) {
              e.oldStatus = RouteStatus.New;
            }
            e.newStatus = e.updateFields.status;
          }
          return e;
        });
        return logs;
      })).subscribe((data: RouteUpdateLog[]) => {this.routeUpdateLog = data; this.addMarkersToMap();})
    }
  }

  public addMarkersToMap(){
    const iconOptions: any = {
      iconUrl: Icon,
      iconSize: [32, 32],
      iconAnchor: [16, 31]
    };
    const customIcon = L.icon(iconOptions);
    this.routeUpdateLog.forEach(route=>{
      let marker = L.marker([route.lat,route.lon], {icon: customIcon}).addTo(this.map);
      this.markers.push(marker);
      marker.bindPopup(`<b>${this.routeChangedTranslation}:</b> <i>${route.oldStatus?this.statusNames[route.oldStatus.toUpperCase()]:''}</i> → <i>${route.newStatus?this.statusNames[route.newStatus.toUpperCase()]:''}</i>`);
    })
  }
  onLogItemHover(item:RouteUpdateLog,index:number){
    if(this.previousActiveMarkerIndex!==null){
      const marker=this.markers[this.previousActiveMarkerIndex];
      marker.setIcon(this.getMarkerIcon(false));
      marker.setZIndexOffset(0);
    }
    this.markers[index].setIcon(this.getMarkerIcon(true));
    this.markers[index].setZIndexOffset(1);

    this.map.setView(new L.LatLng(item.lat, item.lon),14)
    this.previousActiveMarkerIndex=index;
  }
  public getMarkerIcon(active:boolean=false){
    const iconOptions: any = {
      iconUrl: active?ActiveMarker:Icon,
      iconSize: [32, 32],
      iconAnchor: [16, 31]
    };
    return L.icon(iconOptions);
  }

  public ngAfterViewInit () {

    this.map = L.map('map', {
      center: [50.44107, 30.523],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }

}