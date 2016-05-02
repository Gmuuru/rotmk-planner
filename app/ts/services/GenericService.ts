import {Injectable} 	from "angular2/core";
import {Cell} 			from "../components/Cell";
import {Building} 			from "../components/Cell";
import {Service} 		from "./Service";
import {Renderer} 		from "../classes/Renderer";
import {Headquarter} 			from "./Headquarter";

@Injectable()
export abstract class GenericService implements Service {
	
	building : Building;
	highlightedCells : Cell[];
	name : string;
	type : string;
	
	constructor(public HQ : Headquarter, public renderer :Renderer){
		this.building = null;
		this.HQ.serviceChange$.subscribe(
			(item) => {
				if(item.service && this.type == item.service){
					this.HQ.activateService(this);
					this.init(item);
				}
			}
		);
	}

	init( args? : any ) :void {
		if(args && args.name){
			// standard build service init
			this.building = Cell.getBuildingData(Cell.getCharFromName(args.name));
			console.log(`${this.name} initialized with ${args.name} (${this.building.char})`);
			
		}
	}

	abstract alertCellMouseEvent($event, action :string, cell :Cell) :void;
	abstract reset() :void;
	
	rotate() :string{
		if(this.building){
			this.building = this.building.rotate();
			console.log("new building : "+this.building.name);
			this.highlightCells();
			return this.building.label;
		} else {
			return null;
		}
	}
	
	abstract highlightCells();
}