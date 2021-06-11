import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformModule } from '@angular/cdk/platform';
@NgModule({
  declarations: [NumberPickerComponent],
  exports: [NumberPickerComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    PlatformModule,
  ],
})
export class NumberPickerModule {}
