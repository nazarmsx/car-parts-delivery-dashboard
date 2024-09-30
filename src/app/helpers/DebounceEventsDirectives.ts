import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceMouseEnter]'
})
export class DebounceMouseEnterDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 250;
  @Output() debounceEnterEvent = new EventEmitter();
  private mouseEnterEvents = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.mouseEnterEvents.pipe(
      debounceTime(this.debounceTime)
    ).subscribe((e:any) => this.debounceEnterEvent.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('mouseenter', ['$event'])
  clickEvent(event:any) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseEnterEvents.next(event);
  }
}