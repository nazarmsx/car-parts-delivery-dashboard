import {Component, ViewChild, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../services';
import {first} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Location} from "@angular/common";
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, Subject, merge, of} from 'rxjs';
import {HttpHandledErrorDescription} from '../../../../helpers'
import {Route, RouteStatus, Driver, RouteUpdateLog} from '../../../../models'
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.scss']
})

export class RouteDetailsComponent implements OnInit {
  public _route: Route;
  public routeUpdateLog: RouteUpdateLog[] = [];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  public statusNames:any={};
  public statusesForSelect: { name: string, value: string }[] = [];
  private statusUpdateMessage: string;

  public editMode = false;
  routeForm: FormGroup;

  constructor (private formBuilder: FormBuilder, private apiService: ApiService, private toastr: ToastrService, private location: Location, private route: ActivatedRoute, private router: Router, private httpErrorDesc: HttpHandledErrorDescription,public translate: TranslateService) {
    translate.get('STATUS_NAMES').subscribe((res)=>{
      this.statusNames = res;
      this.statusesForSelect = Object.keys(res).map((key: string) => ({name: res[key], value: key.toLowerCase()}));
    })
    translate.get('STATUS_UPDATED').subscribe((res)=>{
      this.statusUpdateMessage =res;
    })


  }
  get routeId(){
    return this.route.snapshot.paramMap.get('id');
  }

  ngOnInit () {
    this.galleryOptions = [
      { "image": false, "thumbnailsRemainingCount": true, "height": "100px" },
      { "breakpoint": 500, "width": "100%", "thumbnailsColumns": 2 }
    ];

    this.routeForm = this.formBuilder.group({
          status: ['', Validators.required],
        }
    );

    const routeId: string = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.apiService.getRouteInfo(routeId)
        .pipe(first())
        .subscribe(
          (data: Route) => {
            this._route = data;
            this.routeForm.controls.status.setValue(data.status);

            if(data && data.images){
              this.galleryImages=data.images.map(e=>{
                return new NgxGalleryImage({big:e,small:e,medium:e});
              })
            }
          });
      this.apiService.getRouteUpdateLog(routeId)
        .pipe(first())
        .subscribe(
          (data: RouteUpdateLog[]) => {
            this.routeUpdateLog = data;

          })
    }
  }

  edit() {
    this.editMode = true;
  }

  save() {
    this.editMode = false;

    this.apiService.updateRouteStatus({status: this.routeForm.controls.status.value, id: this._route._id})
        .pipe(first())
        .subscribe(
            (data: any) => {
              if (data.status === 'OK') {
                this.toastr.success(this.statusUpdateMessage, 'Success!');
                this._route = data.data;
              }
            },
            (error: any) => {
              this.toastr.error(JSON.stringify(error, null, 4), 'Something went wrong!');
            });
  }

  cancel() {
    this.editMode = false;
  }

}