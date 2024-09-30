import {Component} from '@angular/core';
import {ApiService} from '../../../../services';
import { Subscription,forkJoin } from 'rxjs';
import {Admin} from '../../../../models'
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent {
  public userCount:number;
  public page:number=1;
  public users:Admin[]=[];
  constructor (private apiService: ApiService,    private router: Router) {

  }

  ngOnInit () {
    this.initialLoad();
  }
  private initialLoad(){
    let adminCount=this.apiService.getAdminsCount();
    let admins=this.apiService.getAdmins();

    forkJoin([adminCount, admins]).subscribe(results => {
      this.userCount=results[0].total;
      this.users  =results[1].data;
    })
  }


  edit(user:Admin){
    this.router.navigate([`/edit-user/${user._id}`])
  }
  remove(user:Admin){

    const shouldDeleteUser=confirm("Are you sure tou want delete user ?");
    if(shouldDeleteUser){
      this.apiService.removeAdmin(user._id).subscribe((results)=>{
        this.initialLoad();
      })
    }
  }
  onPageChange(pageNum: number){

  }
}