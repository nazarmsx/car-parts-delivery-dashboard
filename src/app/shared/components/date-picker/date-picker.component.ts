import {Component, ViewChild, Output, Injectable,Input,SimpleChange,SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../modules/auth/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService,LangChangeEvent} from '@ngx-translate/core';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import {EventEmitter} from '@angular/core';

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  public weekdays: string[];
  public months: string[];

  constructor (public translate: TranslateService) {
    super();
    this.loadTranslations();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.loadTranslations()
    });
  }

  private loadTranslations(){
    this.translate.get('WEEKDAYS').subscribe((res) => {
      this.weekdays = Object.keys(res).map(key=>res[key]);
    });
    this.translate.get('MONTHS').subscribe((res) => {
      this.months = Object.keys(res).map(key=>res[key]);
    })
  }

  getWeekdayShortName (weekday: number): string {
    return this.weekdays[weekday - 1];
  }

  getMonthShortName (month: number): string {
    return this.months[month - 1];
  }

  getMonthFullName (month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel (date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class DatePickerComponent {
  @ViewChild("datepicker")
  public datepicker: any;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public hoveredDate: NgbDate;

  @Input()startDate: string;
  @Input()endDate: string;

  @Output() rangeSelected = new EventEmitter();

  constructor (private router: Router, private authenticationService: AuthenticationService, private formBuilder: FormBuilder, private calendar: NgbCalendar, public translate: TranslateService, public formatter: NgbDateParserFormatter) {
  }


  ngOnInit () {
  }
  ngOnChanges(changes: SimpleChanges) {

    if(changes.startDate && changes.startDate.currentValue){
      const parsed = this.formatter.parse(changes.startDate.currentValue);
      if(parsed && this.calendar.isValid(NgbDate.from(parsed))){
        this.fromDate=NgbDate.from(parsed);
      }
    }
    if(changes.endDate && changes.endDate.currentValue){
      const parsed = this.formatter.parse(changes.endDate.currentValue);
      if(parsed && this.calendar.isValid(NgbDate.from(parsed))){
        this.toDate=NgbDate.from(parsed);
      }
    }
  }

  onDateSelection (date: NgbDate) {

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date;
      this.datepicker.toggle();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      this.rangeSelected.emit({to: this.formatter.format(this.toDate), from: this.formatter.format(this.fromDate)})
    }
  }

  isHovered (date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside (date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange (date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  validateInput (currentValue: NgbDate, input: string): NgbDate {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  clearDateFilter () {
    this.fromDate = null;
    this.toDate = null;
    this.rangeSelected.emit({to: null, from: null})
  }

}