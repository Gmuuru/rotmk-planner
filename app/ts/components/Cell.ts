
export class Cell {

	MAP_TABLE : Object;
	private building : Building;
	lineIndex : number;
	colIndex : number;
	public ref : Cell;
	referenced : Cell[];
	hl : string;
	hlOrientation : string;
	
	constructor(lineIndex : number, colIndex : number, char : string){
		this.lineIndex = lineIndex;
		this.colIndex = colIndex;
		if(!this.MAP_TABLE[char]){
			console.log("no building for char "+char);
			this.setBuilding(Building.getDefaultBuilding());
		} else {
			this.setBuilding(this.MAP_TABLE[char]);
		}
		this.referenced = [];
		this.ref = null;
	}
	
	setBuilding(building : Building) :void {
		this.building = Building.clone(building);
		this.referenced = [];
	}

	getBuilding() :Building{
		return this.building;
	}

	getBuildingName() :string {
		if(this.ref){
			return null;
		} else {
			return this.building.name;
		}
	}
	getBuildingWidth() {
		if(this.ref){
			return null;
		} else {
			return 16*this.getBuilding().width;
		}
	}
	
	getBuildingHeight() {
		if(this.ref){
			return null;
		} else {
			return 16*this.getBuilding().height;
		}
	}

	render(sc : number) :void {
		this.setName(this.building.name, sc);
	}
	
	setName(name : string, sc : number) :void {
		var nameStr = name;
		if(name != null && (name.indexOf('rw') == 0 || name.indexOf('wall') == 0 || name.indexOf('id') == 0)){
			nameStr = this.building.name.split('-')[0] + this.adaptToSurroundings(sc);
		}
		this.building.name = nameStr;
	}
	
	setRef(ref:Cell) : void {
		this.ref = ref;
		this.referenced = [];
		ref.referenced.push(this);
		this.setBuilding(ref.getBuilding());
	}
	
	getName() :string {
		return this.building.name;
	}

	getTitle():string {
		
		if(this.ref){
			return this.ref.getBuilding().label;
		}
		return this.building.label;
	}
	
	isEmpty() :boolean {
		return this.building.char == '' || this.building.char == ' ' || this.building.char == '.';
	}
	
	highlight(hl : string, orientation? : string){
		this.hl = hl;
		this.hlOrientation = orientation;
	}
	
	adaptToSurroundings(sc:number):string
	{
	  if(sc == 1 || sc == 3 || sc == 5){
		  return "-v";
	  } else if(sc==8){
		  return "-l1";
	  } else if(sc==9){
		  return "-l2";
	  } else if(sc==10){
		  return "-l3";
	  } else if(sc==7){
		  return "-l4";
	  } else if(sc==11){
		  return "-t1";
	  } else if(sc==14){
		  return "-t2";
	  } else if(sc==13){
		  return "-t3";
	  } else if(sc==12){
		  return "-t4";
	  } else if(sc == 15){
		  return "-x";
	  } else {
		  return "-h";
	  }
	  
	}
	
	public static getCharFromName(name : string) : string{
		for (var char in Cell.prototype.MAP_TABLE) {
			if (Cell.prototype.MAP_TABLE.hasOwnProperty(char)) {
				var building = Cell.prototype.MAP_TABLE[char];
				if(building && building.name == name){
					return char;
				}
			}
		}
		return null;
	}
	
	public static getBuildingData(char : string) : Building {
		return Cell.prototype.MAP_TABLE[char];
	}
}

export class Building {

	constructor(
		public char : string,
		public name : string,
		public width : number,
		public height : number,
		public label : string,
		public labelMenu : string,
		public renderingService : string){}

	public rotate() : Building {

		var building = Cell.getBuildingData(this.char);
		var orientation = building.getOrientation();

		if(orientation){
			var root = building.getRootName();
			var nextOrientation = building.getNextOrientation();
			return Cell.getBuildingData(Cell.getCharFromName(root+"-"+nextOrientation));

		} else {
			return building;
		}
	}

	public getRootName(){
		return this.name.substring(0, this.name.length-2);
	}

	public getOrientation(){
		if(this.name.lastIndexOf("-") == this.name.length-2){
			return this.name.charAt(this.name.length-1);
		}
		return null;
	}

	public getNextOrientation(){
		var orientation = this.getOrientation();
		if(orientation == null){
			return null;
		}
		if(orientation == 'v'){
				return "h";
		} else if(orientation == 'h'){
			return "v";
		} else if(orientation == 's'){
			return "w";
		} else if(orientation == 'w'){
			return "n";
		} else if(orientation == 'n'){
			return "e";
		} else if(orientation == 'e'){
			return "s";
		} else {
			return null;
		}
	}

	public static clone(building : Building){
		return new Building(
			building.char,
			building.name,
			building.width,
			building.height,
			building.label,
			building.labelMenu,
			building.renderingService
			);
	}

	public static getDefaultBuilding(){
		return Cell.prototype.MAP_TABLE[" "];
	}
}
// [char , name, width, height, long name, menu name, service]

Cell.prototype.MAP_TABLE = {};
Cell.prototype.MAP_TABLE[" "] = new Building(" ", "grass", 1, 1, "Grass", "Grass", "splash");
Cell.prototype.MAP_TABLE[""] = new Building(" ", "grass", 1, 1, "Grass", "Grass", "splash");
Cell.prototype.MAP_TABLE["."] = new Building(".", "dirt", 1, 1, "Arid", "Arid", "splash");
Cell.prototype.MAP_TABLE["o"] = new Building("o", "tree", 1, 1, "Tree/Bush", "Tree", "splash");
Cell.prototype.MAP_TABLE["Œ"] = new Building("Œ", "rocks", 1, 1, "Rocks", "Rocks", "splash");
Cell.prototype.MAP_TABLE["œ"] = new Building("œ", "water", 1, 1, "Water", "Water", "splash");
Cell.prototype.MAP_TABLE["Ÿ"] = new Building("Ÿ", "dunes", 1, 1, "Beach/Dunes", "Dunes", "splash");
Cell.prototype.MAP_TABLE["¹"] = new Building("¹", "saltmarsh", 1, 1, "Salt marsh", "Salt M.", "splash");
Cell.prototype.MAP_TABLE["²"] = new Building("²", "ore", 1, 1, "Ore", "Ore", "splash");
Cell.prototype.MAP_TABLE["³"] = new Building("³", "quarry", 1, 1, "Quarry", "Quarry", "splash");

// trade
Cell.prototype.MAP_TABLE["0"] = new Building("0", "m-empty", 2, 2, "Empty Shop", "Empty", "build");
Cell.prototype.MAP_TABLE["1"] = new Building("1", "m-food", 2, 2, "Food Shop", "Food", "build");
Cell.prototype.MAP_TABLE["2"] = new Building("2", "m-hemp", 2, 2, "Hemp Shop", "Hemp", "build");
Cell.prototype.MAP_TABLE["3"] = new Building("3", "m-silk", 2, 2, "Silk Shop", "Silk", "build");
Cell.prototype.MAP_TABLE["4"] = new Building("4", "m-pottery", 2, 2, "Ceramics Shop", "Ceramics", "build");
Cell.prototype.MAP_TABLE["5"] = new Building("5", "m-laquer", 2, 2, "Wares Shop", "Wares", "build");
Cell.prototype.MAP_TABLE["6"] = new Building("6", "m-tea", 2, 2, "Tea Shop", "Tea", "build");

Cell.prototype.MAP_TABLE["7"] = new Building("7", "mill", 5, 5, "Mill", "Mill", "build");
Cell.prototype.MAP_TABLE["8"] = new Building("8", "warehouse", 3, 3, "Warehouse", "Warehouse", "build");
Cell.prototype.MAP_TABLE["9"] = new Building("9", "tradepost", 4, 4, "Trading Station", "Tr. Station", "build");
Cell.prototype.MAP_TABLE["~"] = new Building("~", "tradepier-n", 4, 7, "Trading Pier", "Trade Pier", "build");
Cell.prototype.MAP_TABLE["`"] = new Building("`", "tradepier-e", 7, 4, "Trading Pier", "Trade Pier", "build");

Cell.prototype.MAP_TABLE["["] = new Building("[", "market-h", 4, 3, "Common Market (H)", "Market", "build");
Cell.prototype.MAP_TABLE["]"] = new Building("]", "market-v", 3, 4, "Common Market (V)", "Market", "build");
Cell.prototype.MAP_TABLE["{"] = new Building("{", "market3-h", 6, 3, "Grand Market (H)", "Market(G)", "build");
Cell.prototype.MAP_TABLE["}"] = new Building("}", "market3-v", 3, 6, "Grand Market (V)", "Market(G)", "build");

//agriculture
Cell.prototype.MAP_TABLE["f"] = new Building("f", "wharf-e", 3, 2, "Fishing Quay (E)", "Fish Quay", "build");
Cell.prototype.MAP_TABLE["F"] = new Building("F", "wharf-s", 2, 3, "Fishing Quay (S)", "Fish Quay", "build");
Cell.prototype.MAP_TABLE["â"] = new Building("â", "wharf-w", 3, 2, "Fishing Quay (W)", "Fish Quay", "build");
Cell.prototype.MAP_TABLE["Â"] = new Building("Â", "wharf-n", 2, 3, "Fishing Quay (N)", "Fish Quay", "build");
Cell.prototype.MAP_TABLE["I"] = new Building("I", "irrigationpump", 2, 2, "Irrigation Pump", "Irr. Pump", "build");
Cell.prototype.MAP_TABLE["_"] = new Building("_", "id", 1, 1, "Irrigation Ditch", "Irr. Ditch", "path");
Cell.prototype.MAP_TABLE["n"] = new Building("n", "hunter", 2, 2, "Hunter's Tent", "Hunter", "build");
Cell.prototype.MAP_TABLE["r"] = new Building("r", "refinery", 2, 2, "Lacquer Refinery", "Lacquer", "build");
Cell.prototype.MAP_TABLE["s"] = new Building("s", "silkwormshed", 2, 2, "Silkworm Shed", "Silk", "build");
Cell.prototype.MAP_TABLE["ß"] = new Building("ß", "teashed", 2, 2, "Tea Curing Shed", "Tea", "build");
Cell.prototype.MAP_TABLE["v"] = new Building("v", "hempfarm", 2, 2, "Hemp Farm", "Hemp", "build");
Cell.prototype.MAP_TABLE["V"] = new Building("V", "farm", 3, 3, "Farm House", "Farm", "build");
Cell.prototype.MAP_TABLE["w"] = new Building("w", "wheat", 1, 1, "Wheat", "Wheat", "splash");
Cell.prototype.MAP_TABLE["W"] = new Building("W", "h-well", 2, 2, "Well", "Well", "splash");
Cell.prototype.MAP_TABLE["å"] = new Building("å", "rice", 1, 1, "Rice", "Rice", "splash");
Cell.prototype.MAP_TABLE["é"] = new Building("é", "hemp", 1, 1, "Hemp", "Hemp", "splash");
Cell.prototype.MAP_TABLE["è"] = new Building("è", "soybeans", 1, 1, "Soybeans", "Beans", "splash");
Cell.prototype.MAP_TABLE["á"] = new Building("á", "cabbage", 1, 1, "Cabbage", "Cabb.", "splash");
Cell.prototype.MAP_TABLE["à"] = new Building("à", "millet", 1, 1, "Millet", "Millet", "splash");
Cell.prototype.MAP_TABLE["ù"] = new Building("ù", "tea", 1, 1, "Tea Field", "Tea", "splash");
Cell.prototype.MAP_TABLE["û"] = new Building("û", "silk", 1, 1, "Silk Field", "Silk", "splash");
Cell.prototype.MAP_TABLE["Ô"] = new Building("Ô", "laquer", 1, 1, "Laquer Field", "Silk", "splash");

//industry
Cell.prototype.MAP_TABLE["b"] = new Building("b", "smelter", 3, 3, "Smelter/Furnace", "Furnace", "build");
Cell.prototype.MAP_TABLE["B"] = new Building("B", "bronzewaremaker", 2, 2, "Bronzeware Maker", "Bz Maker", "build");
Cell.prototype.MAP_TABLE["C"] = new Building("C", "claypit", 2, 2, "Clay Pit", "Clay Pit", "build");
Cell.prototype.MAP_TABLE["©"] = new Building("©", "saltmine", 2, 2, "Salt Mine", "Salt Mine", "build");
Cell.prototype.MAP_TABLE["i"] = new Building("i", "ironsmelter", 3, 3, "Iron Smelter", "Ir. Smelter", "build");
Cell.prototype.MAP_TABLE["j"] = new Building("j", "jadecarver", 2, 2, "Jade Carver", "Jade Carver", "build");
Cell.prototype.MAP_TABLE["k"] = new Building("k", "kiln", 2, 2, "Kiln", "Kiln", "build");
Cell.prototype.MAP_TABLE["l"] = new Building("l", "loggingshed", 2, 2, "Logging Shed", "Logging", "build");
Cell.prototype.MAP_TABLE["L"] = new Building("L", "laquerwaremaker", 2, 2, "Laquerware Maker", "Laq. Maker", "build");
Cell.prototype.MAP_TABLE["µ"] = new Building("µ", "weaver", 3, 3, "Weaver", "Weaver", "build");
Cell.prototype.MAP_TABLE["N"] = new Building("N", "papermaker", 2, 2, "Paper Maker", "Paper", "build");

// roads
Cell.prototype.MAP_TABLE["="] = new Building("=", "road", 1, 1, "Road", "Road", "path");
Cell.prototype.MAP_TABLE[";"] = new Building(";", "grandroad-s", 1, 2, "Grand Way (S)", "Gr. Way", "path");
Cell.prototype.MAP_TABLE[":"] = new Building(":", "grandroad-e", 2, 1, "Grand Way (E)", "Gr. Way", "path");
Cell.prototype.MAP_TABLE["¶"] = new Building("¶", "grandroad-n", 1, 2, "Grand Way (N)", "Gr. Way", "path");
Cell.prototype.MAP_TABLE["°"] = new Building("°", "grandroad-w", 2, 1, "Grand Way (W)", "Gr. Way", "path");
Cell.prototype.MAP_TABLE["("] = new Building("(", "improad-v", 1, 3, "Imperial Way (V)", "Imp. Way", "path");
Cell.prototype.MAP_TABLE[")"] = new Building(")", "improad-h", 3, 1, "Imperial Way (H)", "Imp. Way", "path");
Cell.prototype.MAP_TABLE["+"] = new Building("+", "roadblock", 1, 1, "Roadblock", "block", "build");
Cell.prototype.MAP_TABLE["e"] = new Building("e", "ferry-e", 3, 2, "Ferry (E)", "Ferry", "build");
Cell.prototype.MAP_TABLE["E"] = new Building("E", "ferry-s", 2, 3, "Ferry (S)", "Ferry", "build");
Cell.prototype.MAP_TABLE["ê"] = new Building("ê", "ferry-w", 3, 2, "Ferry (W)", "Ferry", "build");
Cell.prototype.MAP_TABLE["ë"] = new Building("ë", "ferry-n", 2, 3, "Ferry (N)", "Ferry", "build");

// decoration
Cell.prototype.MAP_TABLE["!"] = new Building("!", "garden1", 1, 1, "Garden", "Garden", "splash");
Cell.prototype.MAP_TABLE["@"] = new Building("@", "garden2", 2, 2, "Garden", "Garden", "splash");
Cell.prototype.MAP_TABLE["#"] = new Building("#", "garden3", 3, 3, "Garden", "Garden", "splash");
Cell.prototype.MAP_TABLE["$"] = new Building("$", "pond", 3, 3, "Pond", "Pond", "build");
Cell.prototype.MAP_TABLE["%"] = new Building("%", "pavilion", 2, 2, "Pavilion", "Pavilion", "build");
Cell.prototype.MAP_TABLE["^"] = new Building("^", "statue1", 1, 1, "Small Statue", "Statue(s)", "build");
Cell.prototype.MAP_TABLE["&"] = new Building("&", "statue2", 2, 2, "Statue", "Statue", "build");
Cell.prototype.MAP_TABLE["*"] = new Building("*", "pinktree", 1, 1, "Aesthetic Tree", "Pink Tree", "splash");
Cell.prototype.MAP_TABLE["|"] = new Building("|", "privategarden", 5, 5, "Private Garden", "Private G.", "build");
Cell.prototype.MAP_TABLE["\\"] = new Building("\\", "taichipark", 4, 4, "T'ai Chi Park", "Park", "build");
Cell.prototype.MAP_TABLE["-"] = new Building("-", "rw", 1, 1, "Residential Wall", "Res. Wall", "path");
Cell.prototype.MAP_TABLE["ç"] = new Building("ç", "rgate-h", 1, 1, "RW Gate (H)", "Wall Gate", "build");
Cell.prototype.MAP_TABLE["Ç"] = new Building("Ç", "rgate-v", 1, 1, "RW Gate (V)", "Wall Gate", "build");

//safety
Cell.prototype.MAP_TABLE["J"] = new Building("J", "watchtower", 2, 2, "Watchtower", "Watch", "build");
Cell.prototype.MAP_TABLE["K"] = new Building("K", "guardtower", 2, 2, "Inspector's Tower", "Inspect.", "build");
Cell.prototype.MAP_TABLE["q"] = new Building("q", "herbalist", 2, 2, "Herbalist", "Herbalist", "build");
Cell.prototype.MAP_TABLE["Q"] = new Building("Q", "acupuncturist", 2, 2, "Acupuncturist", "Acupunc.", "build");

//government
Cell.prototype.MAP_TABLE["a"] = new Building("a", "admincity-h", 8, 4, "Administrative City (H)", "Adm. City", "build");
Cell.prototype.MAP_TABLE["A"] = new Building("A", "admincity-v", 4, 8, "Administrative City (V)", "Adm. City", "build");
Cell.prototype.MAP_TABLE["m"] = new Building("m", "mint", 3, 3, "Mint", "Mint", "build");
Cell.prototype.MAP_TABLE["M"] = new Building("M", "moneyprinter", 3, 3, "Money Printer", "Money", "build");
Cell.prototype.MAP_TABLE["p"] = new Building("p", "palace-h", 10, 5, "Palace (H)", "Palace", "build");
Cell.prototype.MAP_TABLE["P"] = new Building("P", "palace-v", 5, 10, "Palace (V)", "Palace", "build");
Cell.prototype.MAP_TABLE["x"] = new Building("x", "taxoffice", 2, 2, "Tax Office", "Tax O.", "build");

//entertainment
Cell.prototype.MAP_TABLE["O"] = new Building("O", "dramaschool", 3, 3, "Drama School", "Drama Sch.", "build");
Cell.prototype.MAP_TABLE["R"] = new Building("R", "acrobatschool", 3, 3, "Acrobat School", "Acrobat", "build");
Cell.prototype.MAP_TABLE["u"] = new Building("u", "musicschool", 2, 2, "Music School", "Music Sch.", "build");
Cell.prototype.MAP_TABLE["S"] = new Building("S", "theater", 4, 4, "Theater Pavilion", "Theater", "build");

//religion
Cell.prototype.MAP_TABLE["c"] = new Building("c", "ancestor", 2, 2, "Ancestral Shrine", "Shrine", "build");
Cell.prototype.MAP_TABLE["d"] = new Building("d", "daoshrine", 2, 2, "Daoist Shrine", "Da. Schrine", "build");
Cell.prototype.MAP_TABLE["D"] = new Building("D", "daotemple", 4, 4, "Daoist Temple", "Da. Temple", "build");
Cell.prototype.MAP_TABLE["g"] = new Building("g", "buddhashrine", 2, 2, "Buddhist Shrine", "Bd. Shrine", "build");
Cell.prototype.MAP_TABLE["G"] = new Building("G", "buddhatemple", 4, 4, "Buddhist Pagoda", "Bd. Pagoda", "build");
Cell.prototype.MAP_TABLE["U"] = new Building("U", "confusianacademy", 3, 3, "Confusian Academy", "Academy", "build");

//military
Cell.prototype.MAP_TABLE["ð"] = new Building("ð", "weaponsmith", 2, 2, "Weaponsmith", "Weaponsmith", "build");
Cell.prototype.MAP_TABLE["×"] = new Building("×", "gate-h", 5, 3, "City Gate (H)", "City Gate", "build");
Cell.prototype.MAP_TABLE["÷"] = new Building("÷", "gate-v", 3, 5, "City Gate (V)", "City Gate", "build");
Cell.prototype.MAP_TABLE["«"] = new Building("«", "militarycamp-h", 6, 4, "Fort (H)", "Fort", "build");
Cell.prototype.MAP_TABLE["»"] = new Building("»", "militarycamp-v", 4, 6, "Fort (V)", "Fort", "build");
Cell.prototype.MAP_TABLE["T"] = new Building("T", "tower", 2, 2, "Tower", "Tower", "build");
Cell.prototype.MAP_TABLE["t"] = new Building("t", "wall", 1, 1, "City Wall", "City Wall", "path");

// other buildings
Cell.prototype.MAP_TABLE["h"] = new Building("h", "house-hi", 2, 2, "Common Housing", "House", "build");
Cell.prototype.MAP_TABLE["H"] = new Building("H", "elite-hi", 4, 4, "Elite Housing", "Elite House", "build");

Cell.prototype.MAP_TABLE["X"] = new Building("X", "stoneworks", 2, 2, "Stoneworks", "StoneW.", "build");
Cell.prototype.MAP_TABLE["y"] = new Building("y", "masonsguild", 2, 2, "Masons Guild", "Masons", "build");
Cell.prototype.MAP_TABLE["Y"] = new Building("Y", "ceramistsguild", 2, 2, "Ceramist Guild", "Ceram.", "build");
Cell.prototype.MAP_TABLE["z"] = new Building("z", "carpenterguild", 2, 2, "Carpenter Guild", "Carp.", "build");
Cell.prototype.MAP_TABLE["Z"] = new Building("Z", "workcamp", 4, 4, "Labourers' Camp", "Lab Camp", "build");
