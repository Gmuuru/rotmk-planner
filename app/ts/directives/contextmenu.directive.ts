import {Component,Directive,Input} from 'angular2/core';
import {Headquarter} 			from "../services/Headquarter";

@Directive({
  selector:'[context-menu]',
  host:{'(contextmenu)':'rightClicked($event)'}
})
export class ContextMenuDirective{

  private data :any;

  @Input('context-menu') source;
  @Input() set contextData(data:any){
    this.data = data;
  }

  constructor(public HQ:Headquarter){
  }

  rightClicked(event:MouseEvent){
  	this.HQ.openContextMenu(event, this.source, this.data);
    event.preventDefault();
  }
}