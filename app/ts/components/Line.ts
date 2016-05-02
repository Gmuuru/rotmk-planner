import { Component } from "angular2/core";
import {Cell} from "./Cell";
import {CellComponent} from "./CellComponent";

export class Line {

	index : number;
	size : number;
	cells : Cell[];
	
	constructor(index: number, size : number){
		this.index = index;
		this.size = size;
		this.cells = [];
	}
	
	push(cell : Cell): void {
		this.cells.push(cell);
	}
	
	setCells(cells : Cell[]) : void {
		this.cells = cells;
	}
	
	complete():void {
		while(this.cells.length < this.size){
			this.cells.push(new Cell(this.index, this.cells.length, ""));
		}
	}
	
	getWidth() :number {
		return this.cells.length * 16;
	}
}

@Component(
{
	selector: 'line-block',
	inputs:['line'],
	directives:[CellComponent],
	template: `
	<cell-block *ngFor="#cell of line.cells" [cell]="cell" title="{{cell.getTitle()}}">
	</cell-block>
	`
}
)
export class LineComponent {

	line : Line;
	
	constructor(){
	}
}