
declare var PIXI:any;

export class PIXIHelper {
	
	TEXTURES:any;
	public static createPIXIRenderer(parentEl, width:number, height:number){
		var renderer = PIXI.autoDetectRenderer(width, height);
		parentEl.appendChild(renderer.view);
		return renderer;
	}

	public static loadStage(renderer){
		//create the stage
		var stage = new PIXI.Container();

		animate();

		function animate() {
		    // render the stage
		    renderer.render(stage);

		    requestAnimationFrame(animate);
		}

		return stage;
	}

	//SPRITES
	public static createBackground(parentWidth:number, parentHeight: number, background:{image:string, width:number, height:number}){

		var backgroundTile = new PIXI.extras.TilingSprite(
			this.getTexture(background.image),
			background.width,
			background.height
		);

		backgroundTile.width = parentWidth;
		backgroundTile.height = parentHeight;
		backgroundTile.interactive = true;
		return backgroundTile;
	}

	public static getTexture(image:string){
		if(!PIXIHelper.prototype.TEXTURES[image]){
			PIXIHelper.prototype.TEXTURES[image] = PIXI.Texture.fromImage('img/'+image+'.gif');
		}
		return PIXIHelper.prototype.TEXTURES[image];
	}
}

PIXIHelper.prototype.TEXTURES = {};