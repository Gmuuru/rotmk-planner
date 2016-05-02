import {Injectable} 	from "angular2/core";

import {Cell} 			from "../components/Cell";
import {Building} 			from "../components/Cell";
import {Renderer} 		from "../classes/Renderer";
import {GenericService} from "./GenericService";
import {Headquarter} 			from "./Headquarter";

@Injectable()
export class BuildService extends GenericService {

	originCell : Cell;
	buildOngoing : boolean;
	pathOK : boolean;
	lineOnly : boolean;
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		super(HQ, renderer);
		this.highlightedCells = [];
		this.pathOK = false;
		this.buildOngoing = false;
		this.originCell = null;
		this.name = "BuildService";
		this.type = "build";
		this.lineOnly = false;
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
		this.buildOngoing = false;
	}
	
	alertOnEnter($event, cell : Cell) :void {
		if(!this.buildOngoing){
			this.originCell = cell;
			this.pathOK = this.highlightCells();
		}
	}
	
	alertOnMouseUp($event, cell : Cell) :void {
		console.log("building ? ");
		if($event.button == 0 && cell && cell == this.originCell){
			//left click
			if(this.pathOK){
				this.highlightedCells.forEach(
					(hlCell) => {
						this.renderer.updateCell(hlCell, this.building, false);
					}
				);
			}
			this.reset();
		} else {
			this.reset();
		}
	}
	
	alertOnMouseDown($event, cell : Cell) :void {
		if($event.button == 0){
			this.originCell = cell;
			this.buildOngoing = true;
		}
	}
	
	highlightCells() :boolean {
		if(!this.originCell){
			return false;
		}
		var pathOK = true;
		var startX = this.originCell.lineIndex;
		var startY = this.originCell.colIndex;
		
		
		var cells = this.renderer.getCellsInBuilding(
			this.originCell.lineIndex,
			this.originCell.colIndex,
			this.building );
		
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
					if(cell.isEmpty()){
						cell.highlight("green", this.building.getOrientation());
					} else {
						cell.highlight("red", this.building.getOrientation());
						pathOK = false;
					}
				}
			);
			this.renderer.renderHightlightZone(this.highlightedCells, 'square');
		} else {
			pathOK = false;
		}
		return pathOK;
	}
	
}