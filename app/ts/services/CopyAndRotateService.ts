import {Injectable} 	from "angular2/core";

import {Cell} 			from "../components/Cell";
import {Building} 			from "../components/Cell";
import {Renderer} 		from "../classes/Renderer";
import {GenericService} 		from "./GenericService";
import {Headquarter} 			from "./Headquarter";

@Injectable()
export class CopyAndRotateService extends GenericService {

	currentCell : Cell;
	highlightedCells : Cell[];
	cellsToCopy : Cell[];
	originalCells : Cell[];
	rotation:string;
	width :number;
	height :number;
	isZoneOK :boolean;
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		super(HQ, renderer);
		this.highlightedCells = [];
		this.name = "CopyAndRotateService";
		this.type = "copyAndRotate";
		this.width = 0;
		this.height = 0;
		this.isZoneOK = true;
		this.currentCell = null;
		this.originalCells = null;
		this.cellsToCopy = null;
		this.rotation = null;

	}
	
	init( args? : any ) :void {
		try {
			if(args.data && args.data.cells){
				this.originalCells = args.data.cells;
				this.rotation = args.data.rotation;
				this.computeDimensions(args.data.cells);
				this.cellsToCopy = this.rotateSelection(this.originalCells, this.rotation);

				console.log(`${this.name} initialized with ${this.cellsToCopy.length} cells with ${this.rotation} symetry`);
			} else {
				console.log(`${this.name} initialized wrongly ! no input data !`);
				this.reset();
			}
		} catch (err) {
			this.HQ.log(err);
		}
	}

	computeDimensions(cells :Cell[]){
		this.width = cells[cells.length-1].colIndex - cells[0].colIndex+1;
		this.height = cells[cells.length-1].lineIndex - cells[0].lineIndex+1;
	}


	rotateSelection(cellsToRotate:Cell[], rotation:string) :Cell[] {

		var res:Cell[] = [];
		for(var i = 0; i < this.height; i++){
			for(var j = 0; j < this.width; j++){
				var cell = cellsToRotate[j + i*this.width];
				var newIndex = j + i*this.width;
				if(rotation == "vertical"){
					newIndex = (this.width-1-j) + i*this.width;
				} else if(rotation == "horizontal"){
					newIndex = j + (this.height -1-i)*this.width;
				}
				res[newIndex] = cell;
			}
		}
		if(res.length != cellsToRotate.length){
			console.log("Error in rotate ! "+res.length+" != "+cellsToRotate.length);
		}
		return res;
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
		this.originalCells = [];
		this.isZoneOK = true;
		this.rotation = null;
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
			for(var i = 0; i < this.cellsToCopy.length; i++){
				var sourceCell = this.cellsToCopy[i];
				var destCell = this.highlightedCells[i];
				if(this.renderer.isBuildingEntirelyInSelection(sourceCell, this.originalCells)){
					this.renderer.copyCell(sourceCell, destCell);
				} else {
					this.renderer.copyCell(defaultCell, destCell);
				}
			}
		}
	}
	
	highlightCells() {

		this.clearCells();
		this.highlightedCells = this.renderer.getCellsInSquare(
			this.currentCell.lineIndex,
			this.currentCell.colIndex, 
			this.currentCell.lineIndex + this.height -1, 
			this.currentCell.colIndex + this.width-1
		);
		this.isZoneOK = !this.renderer.isOOB(
			this.currentCell.lineIndex,
			this.currentCell.colIndex, 
			this.currentCell.lineIndex + this.height-1, 
			this.currentCell.colIndex + this.width-1);

		var pathIsClear = true;

		this.highlightedCells.forEach(
			(cell) => {
				if(!cell.isEmpty() || !this.isZoneOK){
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

	clearCells(){
		this.highlightedCells.forEach(
				(cell) => {cell.highlight(null)}
		);
		this.renderer.removeHightlightZone(this.highlightedCells);
		this.highlightedCells = [];
	}
	
}