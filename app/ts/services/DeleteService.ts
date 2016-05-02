import {Injectable} 	from "angular2/core";

import {Cell} 			from "../components/Cell";
import {Renderer} 		from "../classes/Renderer";
import {GenericService} 		from "./GenericService";
import {Headquarter} 			from "./Headquarter";

@Injectable()
export class DeleteService extends GenericService {

	originCell : Cell;
	currentCell : Cell;
	
	highlightedCells : Cell[];
	deleteOngoing : boolean;
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		super(HQ, renderer);
		this.highlightedCells = [];
		this.deleteOngoing = false;
		this.originCell = null;
		this.currentCell = null;
		this.name = "DeleteService";
		this.type = "delete";

	}
	
	init( args? : string[] ) :void {
		console.log(`DeleteService initialized`);
	}
	
	alertCellMouseEvent($event, action :string, cell :Cell) :void {
		try {
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
				console.log(`Error, unknown action ${action} for provider DeleteService`);
			}
		} catch (err) {
			this.HQ.log(err);
		}
	}
	
	reset() :void {
		
		this.highlightedCells.forEach(
			(cell) => {cell.highlight(null)}
		);
		this.renderer.removeHightlightZone(this.highlightedCells);
		this.highlightedCells = [];
		this.originCell = null;
		this.currentCell = null;
		this.deleteOngoing = false;
	}
	
	alertOnEnter($event, cell : Cell) :void {
		this.currentCell = cell;
		if(!this.deleteOngoing){
			this.originCell = cell;
		}
		this.highlightCells();
	}
	
	alertOnMouseUp($event, cell : Cell) :void {
		if($event.button == 0){
			//left click
			if(cell){
				this.highlightedCells.forEach(
					(hlCell) => {
						this.renderer.deleteBuilding(hlCell);
					}
				);
			}
			this.reset();
		} else if($event.button == 1){
			this.reset();
		}
	}
	
	alertOnMouseDown($event, cell : Cell) :void {
		if($event.button == 0){
			this.originCell = cell;
			this.deleteOngoing = true;
			this.highlightCells();
		}
	}
	
	highlightCells() :void {
		
		
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
						cell.highlight("red");
					} else {
						cell.highlight("green");
					}
				}
			);

			this.renderer.renderHightlightZone(this.highlightedCells, 'square');
		}
	}
	
}