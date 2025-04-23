import { Component, Input, Self, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';


@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements ControlValueAccessor {

  //@Input() label= '';
  @Input() type= 'text';
  @Input() value= '';
  @Input() activation=false;


  constructor(
    @Self() public ngControl: NgControl,
    private elementRef: ElementRef // Inyecta ElementRef correctamente
  ) {
    this.ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit(): void {}

  get control(): FormControl{
    return this.ngControl.control as FormControl
  }

  focus(): void {
    const inputElement = this.elementRef.nativeElement.querySelector('input');
    if (inputElement) {
      inputElement.focus();
    }
  }



}
