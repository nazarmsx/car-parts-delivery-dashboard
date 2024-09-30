import {Component} from '@angular/core';
import {ApiService} from '../../../../services';
import {Subscription, forkJoin} from 'rxjs';
import {Admin} from '../../../../models'
import {Router, ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {
    constructor(private apiService: ApiService, private router: Router, public translate: TranslateService, private toastr: ToastrService) {
    }

    ngOnInit() {
    }

    resetData() {
        this.translate.get('RESET_TEST_DATA_CONFIRM').subscribe((result) => {
            let res = confirm(result);
            if (res) {
                this.apiService.clearTestData().subscribe((results) => {
                        this.translate.get('RESET_DONE').subscribe((text) => {
                            this.toastr.success("", text);
                        })
                    },
                    (error: any) => {
                        this.toastr.error(JSON.stringify(error, null, 4), 'Something went wrong!');
                    })
            }
        });
    }
}