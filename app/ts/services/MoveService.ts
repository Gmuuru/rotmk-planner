import {Injectable} 	from "angular2/core";

import {Cell} 			from "../components/Cell";
import {Building} 			from "../components/Cell";
import {Renderer} 		from "../classes/Renderer";
import {GenericService} 		from "./GenericService";
import {Headquarter} 			from "./Headquarter";

@Injectable()
export class MoveService extends GenericService {

	currentCell : Cell;
	highlightedCells : Cell[];
	cellsToCopy : Cell[];
	width :number;
	height :number;
	isZoneOK :boolean;
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		super(HQ, renderer);
		this.highlightedCells = [];
		this.name = "MoveService";
		this.type = "move";
		this.width = 0;
		this.height = 0;
		this.isZoneOK = false;
		this.currentCell = null;
		this.cellsToCopy = null;

	}
	
	init( args? : any ) :void {
		try {
			if(args.data){
				this.cellsToCopy = args.data;
				this.computeDimensions(args.data);
				console.log(`${this.name} initialized with ${this.cellsToCopy.length} cells`);
			} else {
				console.log(`${this.name} initialized wrongly ! no input data !`);
				this.reset();
			}
		} catch (err) {
			this.HQ.log(err);
		}
	}

	computeDimensions(cells :Cell[]){
		this.width = cells[cells.length-1].colIndex - cells[0].colIndex + 1;
		this.height = cells[cells.length-1].lineIndex - cells[0].lineIndex + 1;
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
		
		this.clearCells();
		this.cellsToCopy = [];
		this.width = 0;
		this.height = 0;
	}
	
	alertOnEnter($event, cell : Cell) :void {
		this.currentCell = cell;
		this.highlightCells();
	}
	
	alertOnMouseUp($event, cell : Cell) :void {
		//this.reset();
	}
	
	alertOnMouseDown($event, cell : Cell) :void {
		if(this.isZoneOK){
			var defaultCell:Cell = new Cell(0, 0, " ");
			var buildingsList = [];
			for(var i = 0; i < this.cellsToCopy.length; i++){
				if(this.renderer.isBuildingEntirelyInSelection(this.cellsToCopy[i], this.cellsToCopy)){
					buildingsList[i] = this.cellsToCopy[i].getBuilding();
					this.renderer.deleteCell(this.cellsToCopy[i]);
				} else {
					buildingsList[i] = defaultCell.getBuilding();
				}
			}
			for(var i = 0; i < buildingsList.length; i++){
				var destination = this.highlightedCells[i];
				this.renderer.updateCell(destination, buildingsList[i], true);
			}
			this.HQ.reset();
		}
	}
	
	highlightCells() {

		this.clearCells();
		this.highlightedCells = this.renderer.getCellsInSquare(
			this.currentCell.lineIndex,
			this.currentCell.colIndex, 
			this.currentCell.lineIndex + this.height -1, 
			this.currentCell.colIndex + this.width -1
		);
		this.isZoneOK = !this.renderer.isOOB(
			this.currentCell.lineIndex,
			this.currentCell.colIndex, 
			this.currentCell.lineIndex + this.height -1, 
			this.currentCell.colIndex + this.width -1);

		var pathIsClear = true;

		this.highlightedCells.forEach(
			(cell) => {
				if((!cell.isEmpty() && !this.isCellInOriginalZone(cell)) || !this.isZoneOK){
					cell.highlight("red");
					pathIsClear = false;
				} else {
					cell.highlight("green");
				}
			}
		);
		this.renderer.renderHightlightZone(this.highlightedCells, 'square');
		this.isZoneOK = this.isZoneOK && pathIsClear;
	}

	isCellInOriginalZone(cell:Cell) :boolean{
		var minLine = this.cellsToCopy[0].lineIndex;
		var minCol = this.cellsToCopy[0].colIndex;
		var maxLine = this.cellsToCopy[this.cellsToCopy.length-1].lineIndex;
		var maxCol = this.cellsToCopy[this.cellsToCopy.length-1].colIndex;

		if(cell.lineIndex < minLine || cell.colIndex < minCol || 
			cell.lineIndex > maxLine || cell.colIndex > maxCol){
			//cell itself is not in selection
			return false;
		}
		// if building is not included in move, it becomes a blocking cell
		return this.renderer.isBuildingEntirelyInSelection(cell, this.cellsToCopy);
	}

	clearCells(){
		this.highlightedCells.forEach(
				(cell) => {cell.highlight(null)}
		);
		this.renderer.removeHightlightZone(this.highlightedCells);
		this.highlightedCells = [];
	}
	
}