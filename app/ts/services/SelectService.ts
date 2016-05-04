import {Injectable} 	from "angular2/core";
import {Subject}    	from 'rxjs/Subject';

import {Cell} 			from "../components/Cell";
import {Renderer} 		from "../classes/Renderer";
import {GenericService} 		from "./GenericService";
import {Headquarter} 			from "./Headquarter";

export class SelectService extends GenericService {

	originCell : Cell;
	currentCell : Cell;
	
	highlightedCells : Cell[];
	selectOngoing : boolean;

	private _selectCellsSource = new Subject<any>();
	private _actionSource = new Subject<string>();
	selectChange$ = this._selectCellsSource.asObservable();
	action$ = this._actionSource.asObservable();
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		super(HQ, renderer);
		this.highlightedCells = [];
		this.selectOngoing = false;
		this.originCell = null;
		this.currentCell = null;
		this.name = "SelectService";
		this.type = "select";
		this.HQ.activateDefaultService(this);
		this.init();

	}
	
	init( args? : string[] ) :void {
		this.highlightedCells = [];
		console.log(`SelectService initialized`);
	}
	
	alertCellMouseEvent($event, action :string, cell :Cell) :void {
		try{
			if( action == "enter" ){
				this.alertOnEnter( $event , cell );
			}
			else if( action == "up" ){
				this.alertOnMouseUp( $event , cell );
			} 
			else if( action == "down" ){
				this.alertOnMouseDown( $event , cell );
			}
			else {
				console.log(`Error, unknown action ${action} for provider SelectService`);
			}
		} catch(err){
			console.log(err);
			this.HQ.log(err);
		}
	}
	
	reset() :void {
		
		if(this.selectOngoing == false){
			this._actionSource.next("reset");
		}
		this.highlightedCells.forEach(
			(cell) => {cell.highlight(null)}
		);
		this.highlightedCells = [];
		this.originCell = null;
		this.currentCell = null;
		this.selectOngoing = false;
	}
	
	alertOnEnter($event, cell : Cell) :void {

		this.currentCell = cell;
		if(!this.selectOngoing){
			this.originCell = cell;
		}

		if(this.selectOngoing){
			this.highlightCells();
			this._selectCellsSource.next($event);
		}
	}
	
	alertOnMouseUp($event, cell : Cell) :void {
		if($event.button == 0){
			//left click
			if(cell){
				this._selectCellsSource.next($event);
			}
			this.reset();
		} else if($event.button == 1){
			this.reset();
		}
	}
	
	alertOnMouseDown($event, cell : Cell) :void {
		if($event.button == 0){
			this.originCell = cell;
			this.selectOngoing = true;
			this.highlightCells();

			this._selectCellsSource.next($event);
		}
	}
	
	highlightCells() :void {
		
		if(!this.originCell || !this.currentCell){
			return;
		}
		
		var cells = this.renderer.getCellsInSquare(
			this.originCell.lineIndex,
			this.originCell.colIndex,
			this.currentCell.lineIndex,
			this.currentCell.colIndex);
		
		if(cells != null){
			//no out of bounds 
			this.highlightedCells.forEach(
				(cell) => {cell.highlight(null)}
			);
			this.renderer.removeHightlightZone(this.highlightedCells);
			this.highlightedCells = [];
			
			cells.forEach(
				(cell) => {
					this.highlightedCells.push(cell);
					if(!cell.isEmpty()){
						cell.highlight("green");
					}
				}
			);
			this.renderer.selectZone(this.highlightedCells);
		}
	}
}