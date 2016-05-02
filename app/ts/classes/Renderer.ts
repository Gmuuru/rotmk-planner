import {Injectable} from "angular2/core";
import {Subject}    	from 'rxjs/Subject';

import {ProgressiveLoader} from "./ProgressiveLoader";
import {Line} from "../components/Line";
import {Cell} from "../components/Cell";
import {Building} from "../components/Cell";

@Injectable()
export class Renderer {

	lines : Line[];
	storage : Line[];
	currentSource : Line[];

	private _zoneHighlightSource = new Subject<{action:string, cells:Cell[], shape:string}>();
	private _cellUpdateSource = new Subject<{action:string, cell:Cell}>();
	private _resetSource = new Subject<string>();
	zoneHightlight$ = this._zoneHighlightSource.asObservable();
	cellUpdate$ = this._cellUpdateSource.asObservable();
	reset$ = this._resetSource.asObservable();
	
	constructor(public pl :ProgressiveLoader){
		this.lines = [];
		this.currentSource = [];
	}
	

	loadMap(lines : Line[]) :void {
	
		this.reset();
		this.storage = this.render(lines);
		this.currentSource = this.storage;
		
		this.pl.load(this.storage, this.lines);
		
		this.currentSource = this.lines;
		
	}
	
	render(lines : Line[]){
		this._resetSource.next("reset");
		var bck = this.currentSource;
		this.currentSource = lines;
		this.currentSource.forEach(
			(line) => {
				line.cells.forEach(
					(cell) => {this.updateCell(cell, cell.getBuilding(), false);}
				);
			}
		);
		lines = this.currentSource;
		this.currentSource = bck;

		return lines;
	}

	getLines() :Line[]{
		return this.lines;
	}
	
	isOOB(startLinePos :number,startColPos :number,endLinePos :number, endColPos:number) :boolean{
		return startLinePos < 0 || startColPos < 0 || 
			endLinePos >= this.lines.length || endColPos >= this.lines[0].cells.length;
	}

	getCellsInSquare(startLinePos :number,startColPos :number,endLinePos :number, endColPos:number) :Cell[]{
		var res : Cell[] = [];
		try {
			var topLine = Math.max(0,Math.min(startLinePos, endLinePos));
			var bottomLine = Math.min(this.lines.length-1, Math.max(startLinePos, endLinePos));
			var leftCol = Math.max(0, Math.min(startColPos, endColPos));
			var rightCol = Math.min(this.lines[0].cells.length-1, Math.max(startColPos, endColPos));
			
			var res : Cell[] = [];
			for(var i = topLine; i <= bottomLine; i++){
				for(var j = leftCol; j <= rightCol; j++){
					res.push(this.lines[i].cells[j]);
				}
			}
			return res;
		} catch (err){
			console.log(err);
			return [];
		}
	}
	
	getCellsInBuilding(linePos : number, colPos : number, building :Building) :Cell[]{
		var res : Cell[] = [];
		var width  = building.width;
		var height = building.height;
		if(linePos+height > this.lines.length || colPos+width >  this.lines[0].cells.length){
			//out of bounds
			return null;
		}
		
		for(var i = 0; i < height; i++){
			for(var j = 0; j < width; j++){
				res.push(this.lines[linePos+i].cells[colPos+j]);
			}
		}
		return res;
	}

	getCellsInLine(linePos:number, startColPos :number, endColPos:number, height :number) :Cell[] {
		var res = [];
		// on ne prend qu'en horizontal
		var startCol = Math.min(startColPos, endColPos);
		var endCol = Math.max(startColPos, endColPos);
		for(var i = startCol; i <= endCol; i++){
			if(height >=3 && linePos > 0){
				res.push(this.lines[linePos-1].cells[i]);
			}
			res.push(this.lines[linePos].cells[i]);
			if(height >=2 && linePos < this.lines.length-1){
				res.push(this.lines[linePos+1].cells[i]);
			}
		}
		return res;
	}

	getCellsInCol(colPos :number, startLinePos :number,endLinePos :number, width :number) :Cell[] {
		var res = [];
		// on ne prend qu'en vertical
		var startLine = Math.min(startLinePos, endLinePos);
		var endLine = Math.max(startLinePos, endLinePos);
		for(var i = startLine; i <= endLine; i++){
			if(width >=3 && colPos > 0){
				res.push(this.lines[i].cells[colPos-1]);
			}
			res.push(this.lines[i].cells[colPos]);
			if(width >=2 && colPos < this.lines[0].cells.length-1){
				res.push(this.lines[i].cells[colPos+1]);
			}
		}
		

		return res;
	}


	detectOOBForLargeRoads(cell : Cell, building :Building) :boolean {

		if(building.width >=2 && cell.colIndex >= this.lines[0].cells.length -1 ){
			return true;
		}
		if(building.width >=3 && cell.colIndex == 0){
			return true;
		}
		if(building.height >=2 && cell.lineIndex >= this.lines.length -1 ){
			return true;
		}
		if(building.height >=3 && cell.lineIndex == 0){
			return true;
		}
		return false;
	}

	getCellsInPath(startLinePos :number,startColPos :number,endLinePos :number, endColPos:number) :Cell[] {
		var res = [];
		if(startLinePos == endLinePos && startColPos == endColPos){
			// une seule cell
			res.push(this.lines[startLinePos].cells[startColPos]);
		}
		
		// verification du quadrant
		else if(startLinePos < endLinePos && startColPos <= endColPos){
			// en bas a droite
			for(var i = startLinePos; i <= endLinePos; i++){
				res.push(this.lines[i].cells[startColPos]);
			}
			for(var j = startColPos+1; j <= endColPos; j++){
				res.push(this.lines[endLinePos].cells[j]);
			}
		} else if(startLinePos >= endLinePos && startColPos < endColPos){
			//en haut a droite
			for(var i = startColPos; i <= endColPos; i++){
				res.push(this.lines[startLinePos].cells[i]);
			}
			for(var j = startLinePos-1; j >= endLinePos; j--){
				res.push(this.lines[j].cells[endColPos]);
			}
		} else if(startLinePos > endLinePos && startColPos >= endColPos){
			//en haut a gauche
			for(var i = startLinePos; i >= endLinePos; i--){
				res.push(this.lines[i].cells[startColPos]);
			}
			for(var j = startColPos-1; j >= endColPos; j--){
				res.push(this.lines[endLinePos].cells[j]);
			}
		} else if(startLinePos <= endLinePos && startColPos > endColPos){
			//en bas a gauche
			for(var i = startColPos; i >= endColPos; i--){
				res.push(this.lines[startLinePos].cells[i]);
			}
			for(var j = startLinePos+1; j <= endLinePos; j++){
				res.push(this.lines[j].cells[endColPos]);
			}
		}
		return res;
	}
	
	reset(){
		this.lines = [];
		this.storage = [];
		this.currentSource = this.storage;
	}
	
	deleteBuilding(cell:Cell) :void {
		if(cell.ref){
			// on detruit tjs un building pas sa cellule de ref (top left)
			this.deleteBuilding(cell.ref);
		} else {
			cell.referenced.forEach(
				(refCell) => {
					this.deleteCell(refCell);
				}
			);
			this.deleteCell(cell);
		}
	}
	
	deleteCell(cell:Cell) :void {

		var originalChar = null;
		if(cell.getBuilding()){
			originalChar = cell.getBuilding().char;
		}
		cell.ref = null;
		cell.referenced = [];
		this.updateCell(cell, Building.getDefaultBuilding(), true);
		
		if(originalChar != null && (originalChar == '-' || originalChar == 't' || originalChar == '_')){
			// on met a jour les cellules autour
			var sc = this.getSurroundingConfig(originalChar, cell.lineIndex, cell.colIndex);
			this.renderSurroundingCells(cell.lineIndex, cell.colIndex, sc);
		}
	}
	
	copyCell(source:Cell, destination:Cell) :void{
		this.updateCell(destination, source.getBuilding(), true);
	}

	isBuildingEntirelyInSelection(cell:Cell, selection:Cell[]){
		try {
			if(cell.ref){
				//we perform the check for the 'main' cell of the building
				return this.isBuildingEntirelyInSelection(cell.ref, selection);
			}
			if(!cell.getBuilding()){
				console.log(`Error : cell without building and without ref !`);
				return false;
			}
			var minLine = selection[0].lineIndex;
			var minCol = selection[0].colIndex;
			var maxLine = selection[selection.length-1].lineIndex;
			var maxCol = selection[selection.length-1].colIndex;

			if(cell.lineIndex < minLine || cell.colIndex < minCol || 
				cell.lineIndex > maxLine || cell.colIndex > maxCol){
				//cell itself is not in selection
				return false;
			}
			if(cell.getBuilding().width + cell.getBuilding().height > 2){
				// for buildings with size > 1x1
				var maxBuildingLine = cell.lineIndex + cell.getBuilding().height -1;
				var maxBuildingCol = cell.colIndex + cell.getBuilding().width -1;
				if(maxBuildingLine < minLine || maxBuildingCol < minCol || 
					maxBuildingLine > maxLine || maxBuildingCol > maxCol){
					//building is not in selection
					return false;
				}
			}
			return true;
		} catch (err){
			console.log("isBuildingEntirelyInSelection error : ",err);
			return false;
		}
	}

	updateCell(cell:Cell, building:Building, renderSurroundingCells:boolean) :void {

		cell.setBuilding(building);
		this.renderCell(cell, renderSurroundingCells);

	}

	updateCellContent(cell:Cell, sc:number){
		cell.render(sc);
		if(!cell.ref){
			if(cell.isEmpty()){
				this._cellUpdateSource.next({action : "delete", cell : cell});
			} else {
				this._cellUpdateSource.next({action : "update", cell : cell});
			}
		}
	}

	renderCell(cell:Cell, renderSurroundingCells : boolean):void {
		
		if(cell.ref){
			return;
		}
		var c:string = cell.getBuilding().char; 
		var sc:number = this.getSurroundingConfig(c, cell.lineIndex, cell.colIndex);
		this.updateCellContent(cell, sc);
		
		if(cell.getBuilding().width+cell.getBuilding().height > 2){
			this.spreadRefCell(cell);
		}
		
		if(renderSurroundingCells && c != null && (c == '-' || c == 't' || c == '_')){
			// il faut regenerer les cellules environnantes dans le cas des path
			this.renderSurroundingCells(cell.lineIndex, cell.colIndex, sc);
		}
		
	}

	selectZone(cells:Cell[]){
		this._zoneHighlightSource.next({action:'select', cells:cells, shape:""});
	}

	renderHightlightZone(cells:Cell[], shape:string){
		this._zoneHighlightSource.next({action:'highlight', cells:cells, shape:shape});
	}
	removeHightlightZone(cells:Cell[]){
		this._zoneHighlightSource.next({action:'remove', cells:cells, shape:null});
	}
	
	renderSurroundingCells(x:number, y:number, sc:number){
		if(sc == 0){
			return;
		}
		var cellToRender = null;
		var scToRender = null;
		if(sc == 1 || sc == 5 || sc == 7 || sc == 8 || sc == 11 || sc == 12 || sc == 14 || sc == 15){
			// top cell
			cellToRender = this.lines[x-1].cells[y];
			scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
			this.updateCellContent(cellToRender, scToRender);
		}
		if(sc == 2 || sc == 6 || sc == 8 || sc == 9 || sc == 11 || sc == 13 || sc == 14 || sc == 15){
			//right cell
			cellToRender = this.lines[x].cells[y+1];
			scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
			this.updateCellContent(cellToRender, scToRender);
		}
		if(sc == 3 || sc == 5 || sc == 9 || sc == 10 || sc == 12 || sc == 13 || sc == 14 || sc == 15){
			//bottom cell
			cellToRender = this.lines[x+1].cells[y];
			scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
			this.updateCellContent(cellToRender, scToRender);
		}
		if(sc == 4 || sc == 6 || sc == 7 || sc == 10 || sc == 11 || sc == 12 || sc == 13 || sc == 15){
			//left cell
			cellToRender = this.lines[x].cells[y-1];
			scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
			this.updateCellContent(cellToRender, scToRender);
		}

	}
	
	/*	0   1				5		  7  8			 b		 c			 e		 f
	 * 0c0  c	c2	c	4c	c	6c6	 7c	 c8	c9	ac	bcb		cc	dcd		 ce		fcf
	 *  0			3		5				9	 a			 c	 d		 e		 f
	 *  
	 *  
	 */
	
	getSurroundingConfig(c : string, x:number, y:number) : number{
		var top:boolean = this.isIdentic(c, x-1, y);
		var bottom:boolean = this.isIdentic(c, x+1, y);
		var right:boolean = this.isIdentic(c, x, y+1);
		var left:boolean = this.isIdentic(c, x, y-1);
		
		if(!top && !bottom && !left && !right){
			//tout seul
			return 0;
		}
		if(top){
			if(bottom){
				if(right){
					if(left){
						return 15;
					} else {
						return 14;
					}
				} else {
					if(left){
						return 12;
					} else {
						return 5;
					}
				}
			} else {
				// !bottom
				if(right){
					if(left){
						return 11;
					} else {
						return 8;
					}
				} else {
					//!right
					if(left){
						return 7;
					} else {
						return 1;
					}
				}
			}
		} else {
			//!top
			if(bottom){
				if(right){
					if(left){
						return 13;
					} else {
						return 9;
					}
				} else {
					if(left){
						return 10;
					} else {
						return 3;
					}
				}
			} else {
				// !bottom
				if(right){
					if(left){
						return 6;
					} else {
						return 2;
					}
				} else {
					//!right
					if(left){
						return 4;
					} else {
						return 0;
					}
				}
			}
		}
	}
	
	isIdentic(c : string, x:number, y:number) : boolean{
	
		var source = this.currentSource;
		
		if(x < 0 || x == source.length || y < 0 || y == source[0].cells.length){
			return false;
		}
		if(!source[x].cells[y].getBuilding()){
			return false;
		}
		return c == source[x].cells[y].getBuilding().char;
	}
	
	spreadRefCell(ref:Cell){
		var source = this.currentSource;
		var refLine:number = ref.lineIndex;
		var refCol:number = ref.colIndex;
		var refWidth:number = ref.getBuilding().width;
		var refHeight:number = ref.getBuilding().height;
		var lineOffset:number = 0;
		var colOffset:number = 0;
		
		
		while(lineOffset < refHeight && (refLine + lineOffset) < source.length){
			colOffset = (lineOffset == 0) ? 1 : 0;
			while(colOffset < refWidth && (refCol + colOffset) < source[0].cells.length){
				var cell = source[refLine + lineOffset].cells[refCol + colOffset];
				cell.setRef(ref);
				colOffset++;
			}
			lineOffset++;
		}
	}
	
}