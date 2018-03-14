import {
  Component,
  Directive,
  Renderer,
  ElementRef,
  NgModule,
  Input,
  Output,
  OnInit,
  EventEmitter
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective implements OnInit {

  constructor(public el: ElementRef, public renderer: Renderer) {
  }

  @Input() appScroll;

  ngOnInit() {
    // this.renderer.setElementStyle(this.el.nativeElement, 'background', 'pink');
  }

  public getElement() {
    return this.el;
  }
}

