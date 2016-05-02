import {Injectable} from "angular2/core";
import {Line} from "../components/Line";

@Injectable()
export class ProgressiveLoader {

	origin : Line[];
	destination : Line[];
	index : number;
	interval : any;
	
	constructor(){}
	
	load(origin : Line[], destination : Line[]):void{
		this.origin = origin;
		this.destination = destination;
		this.index = 0;
		this.interval = setInterval(() => this.add(), 200);
	}
	
	add():void{
		for(var i = 0; i < 5; i++){
			this.destination.push(this.origin[this.index]);
			this.index++;
			if(this.index >= this.origin.length){
				clearInterval(this.interval);
				return;
			}
		}
	}
}