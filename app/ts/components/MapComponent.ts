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
	PIXIRenderer:any;
	stage:any;
	hlArea :any;
	hlSubArea :any;
	selectArea:any;

	selectedCells:Cell[];

	defaultBounds:any = {
			'x': 0,
			'y': 0,
			'width': 0,
			'height': 0
	};

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
						this.highlightZone(cells, shape);
					} else if(action == "remove"){
						this.removeHighlight(cells);
					} else if(action == "select"){
						this.selectZone(cells);
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
		this.resetZones();
	}


	resetZones(){
		if(this.selectArea){
			this.setSpriteBounds(this.selectArea, null, null);
		}
		if(this.hlArea){
			this.setSpriteBounds(this.hlArea, null, null);
		}
		if(this.hlSubArea){
			this.setSpriteBounds(this.hlSubArea, null, null);
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
						this.updateSpriteTint(this.buildings[this.cellPosition(cell)], blankCell);
					} else if(cell.ref && this.buildings[this.cellPosition(cell.ref)]){
						this.updateSpriteTint(this.buildings[this.cellPosition(cell.ref)], blankCell);
					}
				}
			);
		}

		cells.forEach(
			(cell) => {
				if(this.buildings[this.cellPosition(cell)]){
					this.updateSpriteTint(this.buildings[this.cellPosition(cell)], cell);
				} else if(cell.ref && this.buildings[this.cellPosition(cell.ref)]){
					this.updateSpriteTint(this.buildings[this.cellPosition(cell.ref)], cell);
				}
				
			}
		);
	}

	selectZone(cells:Cell[]){
		this.setSpriteBounds(this.selectArea, cells, "");
	}

	highlightZone(cells:Cell[], shape:string){
		if(!cells || cells.length == 0){
			return;
		}
		if(shape == 'square'){
			this.setSpriteBounds(this.hlArea, cells, shape);
		} else if(shape == 'path'){
			this.setPathBounds(cells, shape);
		}
		
	}

	removeHighlight(cells:Cell[]){
		this.resetZones();
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
		if(!this.isInSprite(this.selectArea, $event)){
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

		this.PIXIRenderer = PIXIHelper.createPIXIRenderer(this.map.nativeElement, this.mapSize.width, this.mapSize.height);
		var background = PIXIHelper.createBackground(this.PIXIRenderer.width, this.PIXIRenderer.height, {
			image:'grass',
			width: 16,
			height: 16
		});
		background.on('mousemove', this.onMouseMove.bind(this));
		background.on('mousedown', this.mouseDown.bind(this));
		background.on('mouseup', this.mouseUp.bind(this));
		//create the stage
		this.stage = PIXIHelper.loadStage(this.PIXIRenderer);

		this.stage.addChild(background);
		this.hlArea = this.createHighlightSprite();
		this.hlSubArea = this.createHighlightSprite();
		this.selectArea = this.createSelectSprite();
		this.stage.addChild(this.hlArea);
		this.stage.addChild(this.hlSubArea);
		this.stage.addChild(this.selectArea);
	}

	cleanPreviousStage(){
		while (this.map.nativeElement.firstChild) {
		    this.map.nativeElement.removeChild(this.map.nativeElement.firstChild);
		}
	}

	createHighlightSprite(){
		var sprite = new PIXI.extras.TilingSprite(PIXIHelper.getTexture("grass"), 16, 16);
		sprite.tint = 0x33DD33;
		sprite.alpha = 0.5;
		this.setSpriteBounds(sprite, null, null);
		return sprite;
	}

	createSelectSprite(){
		var sprite = new PIXI.extras.TilingSprite(PIXIHelper.getTexture("blank"), 16, 16);
		sprite.tint = 0xCCCCEE;
		sprite.alpha = 0.5;
		this.setSpriteBounds(sprite, null, null);
		return sprite;
	}

	setSpriteBounds(sprite, cells:Cell[], shape:string){
		var bounds = null;
		var orientation = null;
		if(cells){
			bounds = this.squareArea(cells);
			orientation = cells[0].hlOrientation;
		} else {
			bounds = this.defaultBounds;
		}
		this.setBounds(sprite, bounds);
		this.setOrientation(sprite, orientation);
	}

	setPathBounds(cells:Cell[], shape:string){
		if(cells){
			var cellArrays = this.pathArea(cells);
			this.setBounds(this.hlArea, this.squareArea(cellArrays.main));
			this.setBounds(this.hlSubArea, this.squareArea(cellArrays.sub));
		} else {
			this.setBounds(this.hlArea, this.defaultBounds);
			this.setBounds(this.hlSubArea, this.defaultBounds);
		}
	}

	setBounds(sprite, bounds){
		sprite.position.x = bounds.x;
		sprite.position.y = bounds.y;
		sprite.width = bounds.width;
		sprite.height = bounds.height;
	}

	squareArea(cells:Cell[]){
		if(!cells || cells.length == 0){
			return this.defaultBounds;
		}
		var height = (cells[cells.length-1].lineIndex - cells[0].lineIndex +1)*16;
		var width = (cells[cells.length-1].colIndex - cells[0].colIndex +1)*16;
		var obj = {
			'y':cells[0].lineIndex * 16,
			'x': cells[0].colIndex * 16,
			'width': width,
			'height': height
		};
		return obj;
	}

	pathArea(cells:Cell[]){
		var mainCells = [];
		var subCells = [];

		var horizontalLineIndex = null;
		var verticalColIndex = null;
		cells.forEach(
			(cell) => {
				if(!horizontalLineIndex){
					horizontalLineIndex = cell.lineIndex;
				}
				if(!verticalColIndex){
					verticalColIndex = cell.colIndex;
				}
				if(cell.lineIndex == horizontalLineIndex || cell.colIndex == verticalColIndex){
					mainCells.push(cell);
				} else {
					subCells.push(cell);
				}
			}
		);
		mainCells.sort(
			(a, b) => {
				if(a.lineIndex == b.lineIndex){
					return a.colIndex - b.colIndex;
				}
				return a.lineIndex - b.lineIndex;
			}
		);
		subCells.sort(
			(a, b) => {
				if(a.lineIndex == b.lineIndex){
					return a.colIndex - b.colIndex;
				}
				return a.lineIndex - b.lineIndex;
			}
		);
		return {main:mainCells, sub:subCells};
	}


	setOrientation(sprite, orientation){
		if(!orientation){
			sprite.texture = PIXIHelper.getTexture("grass");
		}
		if(orientation == 'v' ||  orientation == 'n'){
			sprite.texture = PIXIHelper.getTexture("arrow-top");
		} else if(orientation == 'h' ||  orientation == 'e'){
			sprite.texture = PIXIHelper.getTexture("arrow-right");
		} else if(orientation == 's'){
			sprite.texture = PIXIHelper.getTexture("arrow-down");
		} else if(orientation == 'w'){
			sprite.texture = PIXIHelper.getTexture("arrow-left");
		}
	}

	insertUpdateBuilding(cell:Cell){
		var position = this.cellPosition(cell);
		var sprite = this.buildings[position];
		if(sprite){
			this.updateSprite(sprite, cell);
		} else {
			var sprite = this.createSprite(cell);
			if(sprite){
				this.stage.addChild(sprite);
				this.buildings[position] = sprite;


			}
		}
	}


	deleteBuilding(cell:Cell){
		var position = this.cellPosition(cell);
		var sprite = this.buildings[position];
		if(sprite){
			this.stage.removeChild(sprite);
			delete this.buildings[position];
		}
	}

	createSprite(cell:Cell){
		if(cell.getBuilding()){
	    	var sprite = new PIXI.Sprite(PIXIHelper.getTexture(cell.getBuilding().name));
	    	sprite.position.x = cell.colIndex * 16;
	    	sprite.position.y = cell.lineIndex * 16;
	    	sprite.width = cell.getBuilding().width * 16;
	    	sprite.height = cell.getBuilding().height * 16;
	    	sprite.char = cell.getBuilding().char;
	    	return sprite;
    	}
	}

	updateSprite(sprite, cell:Cell){
		if(cell.getBuilding()){
			sprite.texture = PIXIHelper.getTexture(cell.getBuilding().name);
	    	sprite.position.x = cell.colIndex * 16;
	    	sprite.position.y = cell.lineIndex * 16;
	    	sprite.width = cell.getBuilding().width * 16;
	    	sprite.height = cell.getBuilding().height * 16;
	    	sprite.char = cell.getBuilding().char;
	    	this.updateSpriteTint(sprite, cell);
    	}
	}

	updateSpriteTint(sprite, cell:Cell){
		if(cell.hl == 'green'){
    		sprite.tint = 0x33DD33;
    	} else if(cell.hl == 'red'){
    		sprite.tint = 0xDD3333;
    	} else {
	    	sprite.tint = 0xFFFFFF;
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
