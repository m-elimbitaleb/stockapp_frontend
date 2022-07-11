import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[alphanumeric]'
})
export class AlphanumericDirective {

  constructor(private _el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const inp = event.data;
    if (!(/[a-zA-Z0-9]/.test(inp))) {
      this._el.nativeElement.value = this._el.nativeElement.value.slice(0, -1)
      event.stopPropagation();
      return false;
    }
  }

}
