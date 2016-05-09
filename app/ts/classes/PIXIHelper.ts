import {Cell} 					from "../components/Cell";

declare var PIXI:any;


export class PIXIHelper {
	
	parentEl:any;
	renderer:any;
	stage:any;
	TEXTURES:any;
	hlArea:any;
	hlSubArea:any;
	selectArea:any;

	defaultBounds:any = {
			'x': 0,
			'y': 0,
			'width': 0,
			'height': 0
	};


	constructor(){}

	public initPIXICanvas(parentEl, width:number, height:number){
		this.renderer = PIXI.autoDetectRenderer(width, height);
		this.parentEl = parentEl;
		this.parentEl.appendChild(this.renderer.view);
		this.loadStage();
	}

	public initHLZones(){

		this.hlArea = this.createHighlightSprite();
		this.hlSubArea = this.createHighlightSprite();
		this.selectArea = this.createSelectSprite();

		this.stage.addChild(this.hlArea);
		this.stage.addChild(this.hlSubArea);
		this.stage.addChild(this.selectArea);
	}

	public loadStage(){
		//create the stage
		this.stage = new PIXI.Container();
		var renderer = this.renderer;
		var stage = this.stage;
		animate();

		function animate() {

		    renderer.render(stage);
		    requestAnimationFrame(animate);
		}
	}

	public loadCanvasBackground(){
		var backgroundTile = new PIXI.extras.TilingSprite(
			this.getTexture('grass'),
			16,
			16
		);

		backgroundTile.width = this.renderer.width;
		backgroundTile.height = this.renderer.height;
		backgroundTile.interactive = true;
		this.stage.addChild(backgroundTile);
		return backgroundTile;
	}


	//SPRITES

	private createSprite(cell:Cell){
		if(cell.getBuilding()){
	    	var sprite = new PIXI.Sprite(this.getTexture(cell.getBuilding().name));
	    	sprite.position.x = cell.colIndex * 16;
	    	sprite.position.y = cell.lineIndex * 16;
	    	sprite.width = cell.getBuilding().width * 16;
	    	sprite.height = cell.getBuilding().height * 16;
	    	sprite.char = cell.getBuilding().char;
    	}
	    	return sprite;
	}

	private updateSprite(sprite, cell:Cell){
		if(cell.getBuilding()){
			sprite.texture = this.getTexture(cell.getBuilding().name);
	    	sprite.position.x = cell.colIndex * 16;
	    	sprite.position.y = cell.lineIndex * 16;
	    	sprite.width = cell.getBuilding().width * 16;
	    	sprite.height = cell.getBuilding().height * 16;
	    	sprite.char = cell.getBuilding().char;
	    	this.updateSpriteTint(sprite, cell);
    	}
    	return sprite;
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
	
	public updateBuilding(sprite, cell){
		return this.updateSprite(sprite, cell);
	}

	public createBuilding(cell:Cell){

		var sprite = this.createSprite(cell);
		this.stage.addChild(sprite);
		return sprite;
	}

	public deleteBuilding(sprite){
		this.stage.removeChild(sprite);
	}

	//SPRITE BOUNDS
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
			sprite.texture = this.getTexture("grass");
		}
		if(orientation == 'v' ||  orientation == 'n'){
			sprite.texture = this.getTexture("arrow-top");
		} else if(orientation == 'h' ||  orientation == 'e'){
			sprite.texture = this.getTexture("arrow-right");
		} else if(orientation == 's'){
			sprite.texture = this.getTexture("arrow-down");
		} else if(orientation == 'w'){
			sprite.texture = this.getTexture("arrow-left");
		}
	}

	// ZONES
	public getSelectArea(){
		return this.selectArea;
	}

	public createHighlightSprite(){
		var sprite = new PIXI.extras.TilingSprite(this.getTexture("grass"), 16, 16);
		sprite.tint = 0x33DD33;
		sprite.alpha = 0.5;
		this.setSpriteBounds(sprite, null, null);
		return sprite;
	}

	public createSelectSprite(){
		var sprite = new PIXI.extras.TilingSprite(this.getTexture("blank"), 16, 16);
		sprite.tint = 0xCCCCEE;
		sprite.alpha = 0.5;
		this.setSpriteBounds(sprite, null, null);
		return sprite;
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

	public getTexture(image:string){
		if(!PIXIHelper.prototype.TEXTURES[image]){
			PIXIHelper.prototype.TEXTURES[image] = PIXI.Texture.fromImage('img/'+image+'.gif');
		}
		return PIXIHelper.prototype.TEXTURES[image];
	}
}

PIXIHelper.prototype.TEXTURES = {};