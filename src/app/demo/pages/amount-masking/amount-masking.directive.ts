import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAmountMasking]',
  standalone: true
})
export class AmountMaskingDirective implements OnChanges {

  @Input() propertyName: string;
  @Input() dataValue: any;  // <-- New input to pass actual value

  private isVisible: boolean = false;
  private originalValue: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataValue']) {
      this.originalValue = this.dataValue?.toString() || '';
      this.updateView();
    }
  }

  @HostListener('click') onClick() {
    this.isVisible = !this.isVisible;
    this.updateView();
  }

  private updateView() {
    const element = this.el.nativeElement;
    const displayValue = this.isVisible
      ? this.originalValue
      : '*'.repeat(this.originalValue.length);
    this.renderer.setProperty(element, 'innerText', displayValue);
  }
}
