
import {Cell} from "../components/Cell";
import {Line} from "../components/Line";

export class Parser {

	constructor(){}
	
	static parse(text : string) : Line[]{
		var res : Line[] = [];
		if(!text){
			console.log("Parse error : received null content");
			return res;
		}
		// on split le fichier par ligne
		var lineArray : string[] = text.split("\n");
		lineArray = lineArray.map((str) => this.nettoyage(str));
		//on recupere la plus longue des lignes
		var longestStr : string = lineArray.reduce(function (a, b) { return a.length > b.length ? a : b; });
		
		lineArray.forEach(
			(lineStr : string, lineIndex : number) => {
				//On cree un nouvel objet Line que l'on popule avec des Cell pour chaque caractere de la ligne du fichier
				var line : Line = new Line(lineIndex, longestStr.length);
				line.setCells(lineStr.split("").map((char, index) => new Cell(lineIndex, index, char)));
				line.complete();
				res.push(line);
			}
		);
		return res;
	}
	
	static nettoyage(line :string) :string {
		if(line.charCodeAt(0) == 13){
			line = line.substring(1);
		}

		if(line.charCodeAt(line.length-1) == 13){
			line = line.substring(0, line.length-1);
		}
		return line;
	}
}