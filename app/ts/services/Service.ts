import {Cell} from "../components/Cell";

export interface Service {
	
	name : string;
	
	alertCellMouseEvent($event, action :string, cell :Cell) :void;
	reset() :void;
	rotate() :string;
	init( args? : any ) :void;
	
}