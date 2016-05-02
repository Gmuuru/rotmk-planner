import { Component, ViewChild, ElementRef } from "angular2/core";
import {Headquarter} 			from "../services/Headquarter";
import {SelectService} 			from "../services/SelectService";
import {Renderer} 				from "../classes/Renderer";
import {Cell} 					from "../components/Cell";
import {ContextMenuDirective} 	from "../directives/contextmenu.directive";

@Component({

	selector: 'map-container',
	directives :[ContextMenuDirective],
	template: `
		<ng-content></ng-content>
		<map #map style="width:{{getMapWidth()}}px;height:{{getMapHeight()}}px" class="background"
			(mousemove)="onMouseMove($event)"
			(mousedown)="mouseDown($event)"
			(mouseup)="mouseUp($event)"
			(contextmenu)="rightClick($event)">
			<div *ngFor="#cell of getBuildings()" class="building" [ngStyle]="buildingLocation(cell)" id="{{cellPosition(cell)}}"
					(mouseenter)="mouseEnter($event, cell)">
				<div class="{{cell.getBuilding().name}}" [ngStyle]="buildingSize(cell)">
				</div>
				<div *ngIf="cell.hl" class="hl hl-{{cell.hl}}" [ngStyle]="buildingSize(cell)">
						<div class="glyphicon orientation" [ngClass]="{ 'glyphicon-chevron-up' : (cell.hlOrientation == 'v' ||  cell.hlOrientation == 'n'),
																    'glyphicon-chevron-right' : (cell.hlOrientation == 'h' ||  cell.hlOrientation == 'e'),
																	'glyphicon-chevron-down' : cell.hlOrientation == 's',
																    'glyphicon-chevron-left' : cell.hlOrientation == 'w'}">
						</div>
				</div>
			</div>
			<div class="hl-area hl-green glyphicon orientation" [ngStyle]="getHLArea"
				[ngClass]="{ 'glyphicon-chevron-up' : (orientation == 'v' ||  orientation == 'n'),
					    'glyphicon-chevron-right' : (orientation == 'h' ||  orientation == 'e'),
						'glyphicon-chevron-down' : orientation == 's',
					    'glyphicon-chevron-left' : orientation == 'w'}"></div>
			<div class="hl-area hl-green" [ngStyle]="getHLSubArea"></div>
			<div class="select-area" [ngStyle]="selectArea" [context-menu]="'select'" [contextData]="selectedCells"></div>
		</map>
	`
})
export class MapComponent {

	buildings:any;
	currentPosition:string;
	orientation:string;

	hlArea :any;
	hlSubArea :any;
	selectArea:any;
	selectedCells:Cell[];

	defaultArea:any = {
		'position':'absolute',
		'top':'0px',
		'left':'0px',
		'width':'0px',
		'height':'0px'
	};

	@ViewChild('map') map:ElementRef;

	constructor(public renderer:Renderer, public HQ : Headquarter, public selectService : SelectService){
		this.reset();
		this.renderer.reset$.subscribe(
			(inq) => {
				this.reset();
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
							this.buildings[position] = cell;
							break;
						}
						case 'delete' : {
							delete this.buildings[position];
							break;
						}
					}
				} catch (err) {
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
					if(action == "highlight"){
						this.hightlightZone(cells, shape);
					} else if(action == "remove"){
						this.removeHighlight(cells);
					} else if(action == "select"){
						this.selectZone(cells);
					}
				} catch (err) {
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
		this.orientation = "";
		this.hlArea = this.defaultArea;
		this.hlSubArea = this.defaultArea;
		this.selectArea = this.defaultArea;
	}

	selectZone(cells:Cell[]){
		if(!cells || cells.length == 0){
			return;
		}
		cells.forEach(
			(cell) => {
				if(this.buildings[this.cellPosition(cell)]){
					this.buildings[this.cellPosition(cell)].highlight(cell.hl, cell.hlOrientation);
				} else if(cell.ref && this.buildings[this.cellPosition(cell.ref)]){
					this.buildings[this.cellPosition(cell.ref)].highlight(cell.hl, cell.hlOrientation);
				}
				
			}
		);
		this.selectArea = this.squareArea(cells);
	}
	hightlightZone(cells:Cell[], shape:string){

		if(!cells || cells.length == 0){
			return;
		}

		cells.forEach(
			(cell) => {
				if(this.buildings[this.cellPosition(cell)]){
					this.buildings[this.cellPosition(cell)].highlight(cell.hl, cell.hlOrientation);
				} else if(cell.ref && this.buildings[this.cellPosition(cell.ref)]){
					this.buildings[this.cellPosition(cell.ref)].highlight(cell.hl, cell.hlOrientation);
				}
				
			}
		);
		if(shape == 'square'){
			this.hlArea = this.squareArea(cells);
		} else if(shape == 'path'){
			this.pathArea(cells);
		}
		
	}

	squareArea(cells:Cell[]){
		if(!cells || cells.length == 0){
			return this.defaultArea;
		}
		var height = (cells[cells.length-1].lineIndex - cells[0].lineIndex +1)*16;
		var width = (cells[cells.length-1].colIndex - cells[0].colIndex +1)*16;
		this.orientation = cells[0].hlOrientation;
		return {
			'position':'absolute',
			'top':cells[0].lineIndex * 16+'px',
			'left': cells[0].colIndex * 16+'px',
			'width': width+'px',
			'height': height+'px'
		};
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
		this.hlArea = this.squareArea(mainCells);
		this.hlSubArea = this.squareArea(subCells);

	}

	removeHighlight(cells:Cell[]){
		cells.forEach(
			(cell) => {
				if(this.buildings[this.cellPosition(cell)]){
					this.buildings[this.cellPosition(cell)].highlight(null);
				} else if(cell.ref && this.buildings[this.cellPosition(cell.ref)]){
					this.buildings[this.cellPosition(cell.ref)].highlight(null);
				}
			}
		);
		this.resetZones();
	}

	getCurrentCellFromMousePos($event) :Cell {
		var mapPos = this.map.nativeElement.getBoundingClientRect();
		var colIndex = Math.floor(($event.clientX - mapPos.left) / 16);
		var lineIndex = Math.floor(($event.clientY - mapPos.top) / 16);
		var lines = this.renderer.getLines();
		if(lines && lines.length > lineIndex && lines[lineIndex].cells.length > colIndex){
			return this.renderer.getLines()[lineIndex].cells[colIndex];
		}
		return null;
	}

	onMouseMove($event){
		var cell = this.getCurrentCellFromMousePos($event);
		if(cell == null){
			return;
		}

		var newPos = cell.lineIndex+"x"+cell.colIndex;
		if(newPos != this.currentPosition){
			this.currentPosition = newPos;
			this.HQ.alertCellMouseEvent($event, "enter", cell);
		}
	}
	mouseEnter($event, cell:Cell){
		this.HQ.alertCellMouseEvent($event, "enter", cell);
	}
	
	mouseDown($event){
		var cell = this.getCurrentCellFromMousePos($event);
		if(cell){
			console.log("mouse down on cell "+cell.lineIndex+","+cell.colIndex);
			this.HQ.alertCellMouseEvent($event, "down", cell);
		}
	}
	
	mouseUp($event){
		var cell = this.getCurrentCellFromMousePos($event);
		if(cell){
			this.HQ.alertCellMouseEvent($event,"up", cell);
		}
	}
	
	rightClick($event){
		var cell = this.getCurrentCellFromMousePos($event);
		this.HQ.alertMainMouseEvent($event, "click");
		console.log(cell);
		$event.preventDefault();
	}

	get getHLArea(){
		return this.hlArea;
	}

	get getHLSubArea(){
		return this.hlSubArea;
	}

	buildingLocation(cell:Cell){
		return {
			'position':'absolute',
			'top': (cell.lineIndex * 16)+'px',
			'left': (cell.colIndex * 16)+'px'
		}
	}

	buildingSize(cell:Cell){
		return {
			'width': (cell.getBuilding().width * 16)+'px',
			'height': (cell.getBuilding().height * 16)+'px'
		}
	}

	getBuildings(){
		var res = [];
		for (const key of Object.keys(this.buildings)) {
		    res.push(this.buildings[key]);
		}
		return res;
	}


	hlOrientation (cell) {
		return cell.hlOrientation;
	}

	cellPosition(cell:Cell){
		return cell.lineIndex+"x"+cell.colIndex;
	}

	getMapWidth(){
		var lines = this.renderer.getLines();
		if(lines.length > 0){
			return lines[0].getWidth();
		}
		return 0;
	}

	getMapHeight(){
		var lines = this.renderer.getLines();
		if(lines){
			return lines.length * 16;
		}
		return 0;
	}
}