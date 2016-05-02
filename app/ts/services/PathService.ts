import {Injectable} 		from "angular2/core";

import {Cell} 				from "../components/Cell";
import {Renderer} 			from "../classes/Renderer";
import {GenericService} 	from "./GenericService";
import {Headquarter} 				from "./Headquarter";

@Injectable()
export class PathService extends GenericService {

	currentCell : Cell;
	originCell : Cell;
	pathOK : boolean;
	tracingOngoing :boolean;
	lineOnly : boolean;
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		super(HQ, renderer);
		this.highlightedCells = [];
		this.pathOK = false;
		this.tracingOngoing = false;
		this.name = "PathService";
		this.type = "path";
	}
	

	init( args? : any ) :void {
		try {
			if(args && args.name){
				var name = args.name;
				this.building = Cell.getBuildingData(Cell.getCharFromName(name));
				this.lineOnly = false;
				if(this.building.name.indexOf("improad") == 0 || this.building.name.indexOf("grandroad") == 0){
					this.lineOnly = true;
				}
				console.log(`${this.name} initialized with ${name} (${this.building.name})`);
			}
		} catch (err) {
			this.HQ.log(err);
		}
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
				console.log(`Error, unknown action ${action} for provider RoadService`);
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
		this.tracingOngoing = false;
	}
	
	alertOnEnter($event, cell : Cell) :void {
		this.currentCell = cell;
		if(!this.tracingOngoing){
			this.originCell = cell;
		}
		this.pathOK = this.highlightCells();
	}
	
	alertOnMouseUp($event, cell : Cell) :void {
		if($event.button == 0){
			//left click
			if(cell && this.pathOK){
				this.highlightedCells.forEach(
					(hlCell) => {
						this.renderer.updateCell(hlCell, this.building, true);
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
			this.tracingOngoing = true;
			this.pathOK = this.highlightCells();
		}
	}
	
	highlightCells() :boolean {

		if(!this.originCell || !this.currentCell){
			return false;
		}

		var pathOK = true;
		var startX = this.originCell.lineIndex;
		var startY = this.originCell.colIndex;
		var endX = this.currentCell.lineIndex;
		var endY = this.currentCell.colIndex;
		
		this.highlightedCells.forEach(
			(cell) => {cell.highlight(null)}
		);
		this.renderer.removeHightlightZone(this.highlightedCells);
		this.highlightedCells = [];
		var cells = [];
		var oobDetected = false;
		if(!this.lineOnly){
			cells = this.renderer.getCellsInPath(
				this.originCell.lineIndex,
				this.originCell.colIndex,
				this.currentCell.lineIndex,
				this.currentCell.colIndex );
		} else {
			var direction = this.building.name.split('-').pop();

			if(direction == 's' || direction == 'n' || direction == 'v'){
				cells = this.renderer.getCellsInLine(
					this.originCell.lineIndex,
					this.originCell.colIndex,
					this.currentCell.colIndex,
					this.building.height );
			} else if(direction == 'e' || direction == 'w' || direction == 'h'){
				cells = this.renderer.getCellsInCol(
					this.originCell.colIndex,
					this.originCell.lineIndex,
					this.currentCell.lineIndex,
					this.building.width );
			} else {
				console.log("unknown direction : "+direction);
			}
			oobDetected = this.renderer.detectOOBForLargeRoads(this.originCell, this.building);
		}
		cells.forEach(
			(cell) => {
				this.highlightedCells.push(cell);
				if(cell.isEmpty() && !oobDetected){
					cell.highlight("green", this.building.getOrientation());
				} else {
					cell.highlight("red", this.building.getOrientation());
					pathOK = false;
				}
			}
		);
		this.renderer.renderHightlightZone(this.highlightedCells, 'path');
		this.HQ.sendMessage(`${this.highlightedCells.length} cells`);
		return pathOK;
	}

	
}