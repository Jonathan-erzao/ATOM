import { Directive, ElementRef, Input, Renderer2, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appShowHide]'
})
export class ShowHideDirective implements OnInit, OnChanges {
  @Input('appShowHide') isVisible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.toggleVisibility();
  }

  ngOnChanges() {
    this.toggleVisibility();
  }

  private toggleVisibility() {
    if (this.isVisible) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}

