import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss'],
})
export class NumberPickerComponent implements OnInit, AfterViewInit {
  @Input() initialValue!: number;
  @Input() increment!: number;
  @Input() maxValue!: number;
  @Input() minValue: number = 0;
  @Output() numberSelected: EventEmitter<number> = new EventEmitter();

  customValCtrl!: FormControl;
  value: number = 0;
  height = 48;
  addingCustomValue = false;
  usingCustomValue = false;
  items!: number[];

  canceled = false;

  @ViewChild('scrollable', { read: CdkScrollable }) scrollable!: CdkScrollable;
  @ViewChild('customValueInput', { read: ElementRef })
  customValueInput!: ElementRef<HTMLInputElement>;

  constructor(
    private sd: ScrollDispatcher,
    private zone: NgZone,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.items = this.assembleOptionsArray(
      this.minValue,
      this.maxValue,
      this.increment
    );
    this.customValCtrl = new FormControl(this.initialValue);
    this.customValCtrl.valueChanges.subscribe((val) => {
      this.value = val;
      this.numberSelected.emit(this.value);
    });
  }

  ngAfterViewInit(): void {
    this.sd.register(this.scrollable);
    this.sd
      .scrolled()
      .pipe(
        debounceTime(200),
        filter((scrolled) => {
          return !!scrolled
            ? Math.round(scrolled.measureScrollOffset('top')) % this.height ===
                0
            : false;
        }),
        map((scrolled) => {
          return !!scrolled
            ? Math.round(scrolled.measureScrollOffset('top')) / this.height
            : this.initialValue;
        })
      )
      .subscribe((val) => {
        this.numberSelected.emit(this.value);
        this.zone.run(() => {
          this.value = val * this.increment;
          this.customValCtrl.setValue(this.value);
        });
      });
    this.scrollTo(this.initialValue);
  }

  scrollTo(num: number): void {
    this.scrollable.scrollTo({
      top: (num / this.increment) * this.height,
    });
  }

  oneUp() {
    this.scrollable.scrollTo({
      top: (this.value / this.increment + 1) * this.height,
    });
  }

  oneDown() {
    this.scrollable.scrollTo({
      top: (this.value / this.increment - 1) * this.height,
    });
  }

  manualInput() {
    this.addingCustomValue = true;
    setTimeout(() => {
      // if (!this.platform.IOS) {
      this.customValueInput.nativeElement.focus();
      this.customValueInput.nativeElement.select();
      // }
    }, 100);
  }

  cancelManualEdit() {
    this.addingCustomValue = false;
    this.scrollTo(
      Math.round(this.customValCtrl.value / this.increment) * this.increment
    );
  }

  private assembleOptionsArray(
    minValue: number,
    maxValue: number,
    increment: number
  ): number[] {
    return [0].reduce((acc: number[]) => {
      for (let i = minValue; i <= maxValue; i += increment) {
        acc.push(i);
      }
      return acc;
    }, []);
  }
}
