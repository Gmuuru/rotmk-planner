import { Directive, ElementRef, Input}	from "angular2/core";
import {NgClass} 						from 'angular2/common';

@Directive({
  selector: '[class-switch]',
  host: {
	'(mouseenter)': 'onMouseEnter()',
	'(mouseleave)': 'onMouseLeave()',
	'(mousedown)': 'onMouseDown()',
	'(mouseup)': 'onMouseUp()'
  }
})
export class HighlightDirective {
	private _el:HTMLElement;

	@Input('class-switch') selected;

	constructor(el: ElementRef) { 
		this._el = el.nativeElement;
	}
	
	onMouseEnter() { 
		this._el.parentElement.classList.add("panel-primary");
		this._el.parentElement.classList.remove("panel-primary-clicked");
		this._el.parentElement.classList.remove("panel-default");  
	}
	onMouseDown(){
		this._el.parentElement.classList.add("panel-primary");
		this._el.parentElement.classList.add("panel-primary-clicked");
		this._el.parentElement.classList.remove("panel-default"); 
	}
	onMouseUp(){
		this._el.parentElement.classList.add("panel-primary");
		this._el.parentElement.classList.remove("panel-primary-clicked");
		this._el.parentElement.classList.remove("panel-default"); 
	}
	onMouseLeave() { 
		if(!this.selected) {
			this._el.parentElement.classList.remove("panel-primary");
			this._el.parentElement.classList.remove("panel-primary-clicked");
			this._el.parentElement.classList.add("panel-default"); 
		}
	}
}