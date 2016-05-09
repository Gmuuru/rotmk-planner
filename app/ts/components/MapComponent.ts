import { Component, ViewChild, ElementRef } from "angular2/core";
import {Headquarter} 			from "../services/Headquarter";
import {SelectService} 			from "../services/SelectService";
import {PIXIHelper} 					from "../classes/PIXIHelper";
import {Renderer} 				from "../classes/Renderer";
import {Cell} 					from "../components/Cell";
import {Line} 					from "../components/Line";
import {ContextMenuDirective} 	from "../directives/contextmenu.directive";

declare var PIXI:any;

@Component({

	selector: 'map-container',
	directives :[ContextMenuDirective],
	template: `
		<ng-content></ng-content>
		<map #map style="width:{{mapSize.width}}px;height:{{mapSize.height}}px" (contextmenu)="rightClick($event)">
		</map>
	`
})
export class MapComponent {

	buildings:any;
	currentPosition:string;
	mapSize : {width:number, height:number} = {width:0, height:0};
	PIXIHelper:any;

	selectedCells:Cell[];


	@ViewChild('map') map:ElementRef;

	constructor(public renderer:Renderer, public HQ : Headquarter, public selectService : SelectService){
		this.reset();
		this.renderer.reset$.subscribe(
			(inq) => {
				this.reset();
			}
		);

		this.renderer.loadIsDone$.subscribe(
			(lines) => {
				this.initPIXIStage(lines);
			}
		);
		this.renderer.cellUpdate$.subscribe(
			(inputData) => {
				try {
					var action = inputData.action;
					var cell:Cell = inputData.cell;
					var position = this.cellPosition(cell);

					switch(action){
						case 'build' :
						case 'update' : {
							this.insertUpdateBuilding(cell);
							break;
						}
						case 'delete' : {
							this.deleteBuilding(cell);
							break;
						}
					}
					this.HQ.broadcastBuildingList(this.buildings);
				} catch (err) {
					console.log(err);
					this.HQ.log(err);
				}
			}
		);

		this.renderer.zoneHightlight$.subscribe(
			(inputData) => {
				try {
					var action = inputData.action;
					var cells = inputData.cells;
					var shape = inputData.shape;
					this.handleBuildingsHighlight(cells);
					if(action == "highlight"){
						this.PIXIHelper.highlightZone(cells, shape);
					} else if(action == "remove"){
						this.PIXIHelper.removeHighlight(cells);
					} else if(action == "select"){
						this.PIXIHelper.selectZone(cells);
					}
				} catch (err) {
					console.log(err);
					this.HQ.log(err);
				}
			}
		);

		this.selectService.selectChange$.subscribe(
			($event) => {
				try {
					if($event.type=="mouseup"){
						this.selectedCells = this.selectService.highlightedCells;
					}
				} catch (err) {
					console.log(err);
					this.HQ.log(err);
				}
			}
		);
	}

	reset(){
		this.buildings = {};
		this.currentPosition = "";
		if(this.PIXIHelper){
			this.PIXIHelper.resetZones();
		}
	}


	insertUpdateBuilding(cell:Cell){
		var position = this.cellPosition(cell);
		var sprite = this.buildings[position];
		if(sprite){
			this.PIXIHelper.updateBuilding(sprite, cell);
		} else {
			var sprite = this.PIXIHelper.createBuilding(cell);
			if(sprite){
				this.buildings[position] = sprite;
			}
		}
	}

	

	handleBuildingsHighlight(cells:Cell[]){

		if(!cells || cells.length == 0){
			return;
		}
		var blankCell = new Cell(0,0," ");

		//reseting selected buildings
		if(this.selectedCells){
			this.selectedCells.forEach(
				(cell) => {
					if(this.buildings[this.cellPosition(cell)]){
						this.PIXIHelper.updateSpriteTint(this.buildings[this.cellPosition(cell)], blankCell);
					} else if(cell.ref && this.buildings[this.cellPosition(cell.ref)]){
						this.PIXIHelper.updateSpriteTint(this.buildings[this.cellPosition(cell.ref)], blankCell);
					}
				}
			);
		}

		cells.forEach(
			(cell) => {
				if(this.buildings[this.cellPosition(cell)]){
					this.PIXIHelper.updateSpriteTint(this.buildings[this.cellPosition(cell)], cell);
				} else if(cell.ref && this.buildings[this.cellPosition(cell.ref)]){
					this.PIXIHelper.updateSpriteTint(this.buildings[this.cellPosition(cell.ref)], cell);
				}
				
			}
		);
	}

	onMouseMove(mouseEvent){
		var originalEvent = mouseEvent.data.originalEvent;
		var cell = this.getCurrentCellFromMousePos(originalEvent);
		if(cell == null){
			return;
		}

		var newPos = cell.lineIndex+"x"+cell.colIndex;
		if(newPos != this.currentPosition){
			this.currentPosition = newPos;
			this.HQ.alertCellMouseEvent(originalEvent, "enter", cell);
		}
	}
	mouseEnter($event, cell:Cell){
		this.HQ.alertCellMouseEvent($event, "enter", cell);
	}
	
	mouseDown(mouseEvent){
		var originalEvent = mouseEvent.data.originalEvent;
		var cell = this.getCurrentCellFromMousePos(originalEvent);
		if(cell){
			this.HQ.alertCellMouseEvent(originalEvent, "down", cell);
		}
	}
	
	mouseUp(mouseEvent){
		var originalEvent = mouseEvent.data.originalEvent;
		var cell = this.getCurrentCellFromMousePos(originalEvent);
		if(cell){
			this.HQ.alertCellMouseEvent(originalEvent,"up", cell);
		}
	}
	
	rightClick($event){
		if(!this.isInSprite(this.PIXIHelper.getSelectArea(), $event)){
			var cell = this.getCurrentCellFromMousePos($event);
			this.HQ.alertMainMouseEvent($event, "click");
			$event.preventDefault();
		} else {
			console.log($event);
			this.HQ.openContextMenu($event, "select", this.selectedCells);
			$event.preventDefault();
		}
	}

	cellPosition(cell:Cell){
		return cell.lineIndex+"x"+cell.colIndex;
	}

	initPIXIStage(lines:Line[]){
		this.cleanPreviousStage();
		this.mapSize.width = this.getMapWidth(lines);
		this.mapSize.height = this.getMapHeight(lines);
		this.PIXIHelper = new PIXIHelper();
		this.PIXIHelper.initPIXICanvas(this.map.nativeElement, this.mapSize.width, this.mapSize.height);
		var background = this.PIXIHelper.loadCanvasBackground();
		background.on('mousemove', this.onMouseMove.bind(this));
		background.on('mousedown', this.mouseDown.bind(this));
		background.on('mouseup', this.mouseUp.bind(this));

		this.PIXIHelper.initHLZones();
	}

	cleanPreviousStage(){
		while (this.map.nativeElement.firstChild) {
		    this.map.nativeElement.removeChild(this.map.nativeElement.firstChild);
		}
	}


	deleteBuilding(cell:Cell){
		var position = this.cellPosition(cell);
		var sprite = this.buildings[position];
		if(sprite){
			this.PIXIHelper.deleteBuilding(sprite);
			delete this.buildings[position];
		}
	}

	

	getMapWidth(lines:Line[]){
		if(lines && lines.length > 0){
			return lines[0].getWidth();
		}
		return 0;
	}

	getMapHeight(lines:Line[]){
		if(lines){
			return lines.length * 16;
		}
		return 0;
	}

	getCurrentCellFromMousePos($event) :Cell {
		var mapPos = this.map.nativeElement.getBoundingClientRect();
		var colIndex = Math.floor(($event.clientX - mapPos.left) / 16);
		var lineIndex = Math.floor(($event.clientY - mapPos.top) / 16);
		if(colIndex < 0 || lineIndex < 0){
			return null;
		}
		var lines = this.renderer.getLines();
		try{
			if(lines && lines.length > lineIndex && lines[lineIndex].cells.length > colIndex){
				return this.renderer.getLines()[lineIndex].cells[colIndex];
			}
		} catch (err){
			console.log(lineIndex, lines[lineIndex]);
		}
		return null;
	}

	isInSprite(sprite, $event){
		var mapPos = this.map.nativeElement.getBoundingClientRect();
		var mousePosX = $event.clientX - mapPos.left;
		var mousePosY = $event.clientY - mapPos.top;

		return ( sprite.position.x <= mousePosX && mousePosX <= (sprite.position.x + sprite.width)
				&& sprite.position.y <= mousePosY && mousePosY <= (sprite.position.y + sprite.height)
			);
	}
}
