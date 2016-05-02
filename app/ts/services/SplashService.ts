import {Injectable} 	from "angular2/core";

import {Cell} 			from "../components/Cell";
import {Renderer} 		from "../classes/Renderer";
import {GenericService} from "./GenericService";
import {Headquarter} 			from "./Headquarter";

@Injectable()
export class SplashService extends GenericService {

	originCell : Cell;
	currentCell : Cell;
	
	highlightedCells : Cell[];
	splashOngoing : boolean;
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		super(HQ, renderer);
		this.highlightedCells = [];
		this.splashOngoing = false;
		this.originCell = null;
		this.currentCell = null;
		this.name = "SplashService";
		this.type = "splash";
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
		this.splashOngoing = false;
	}
	
	alertOnEnter($event, cell : Cell) :void {
		this.currentCell = cell;
		if(!this.splashOngoing){
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
						if(hlCell.hl == "green"){
							this.renderer.updateCell(hlCell, this.building, false);
						}
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
			this.splashOngoing = true;
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
						cell.highlight("red", this.building.getOrientation());
					} else {
						cell.highlight("green", this.building.getOrientation());
					}
				}
			);
			this.renderer.renderHightlightZone(this.highlightedCells, 'square');
		}
	}
	
}