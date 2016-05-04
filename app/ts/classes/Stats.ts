


export class Stats {
	
	wageRates:Array<[{wages:number, workers:number}]> = [
		[{wages:2.0, workers:0.46},
		{wages:2.6, workers:0.49},
		{wages:3.0, workers:0.52},
		{wages:3.4, workers:0.55},
		{wages:4.0, workers:0.57}],

		[{wages:2.0, workers:0.31},
		{wages:2.6, workers:0.44},
		{wages:3.0, workers:0.47},
		{wages:3.4, workers:0.50},
		{wages:4.0, workers:0.52}],

		[{wages:2.0, workers:0.36},
		{wages:2.6, workers:0.39},
		{wages:3.0, workers:0.42},
		{wages:3.4, workers:0.45},
		{wages:4.0, workers:0.47}],

		[{wages:2.0, workers:0.33},
		{wages:2.6, workers:0.33},
		{wages:3.0, workers:0.39},
		{wages:3.4, workers:0.42},
		{wages:4.0, workers:0.44}],

		[{wages:2.0, workers:0.31},
		{wages:2.6, workers:0.34},
		{wages:3.0, workers:0.37},
		{wages:3.4, workers:0.40},
		{wages:4.0, workers:0.42}]
	];

	houses:Array<string> = ['Shelter', 'Hut', 'Plain Cottage', 'Attractive Cottage', 
		'Spacious Dwelling', 'Elegant Dwelling', 'Ornate Apartment', 'Luxury Apartment'];

	elites:Array<string> = ["Modest Siheyuan", "Lavish Siheyuan", "Humble Compound", "Impressive Compound", "Heavenly Compound"];
	difficulties:Array<string> = ["Very Easy", "Easy", "Normal", "Hard", "Very Hard"];
	taxAndWageRates:Array<string> = ["Very Low", "Low", "Normal", "High", "Very High"];

	houseData = {
		"Shelter" : {trm:0, pop:7},
		"Hut" : {trm:0, pop:14},
		"Plain Cottage" : {trm:1, pop:22},
		"Attractive Cottage" : {trm:1, pop:31},
		"Spacious Dwelling" : {trm:1, pop:41},
		"Elegant Dwelling" : {trm:1, pop:52},
		"Ornate Apartment" : {trm:1, pop:63},
		"Luxury Apartment" : {trm:2, pop:74},
		"Modest Siheyuan" : {trm:10, pop:5},
		"Lavish Siheyuan" : {trm:18, pop:10},
		"Humble Compound" : {trm:20, pop:15},
		"Impressive Compound" : {trm:22, pop:20},
		"Heavenly Compound" : {trm:24, pop:25}
	}

	private difficulty :number;
	private taxRate :number;
	private wageRate :number;
	MAP_TABLE : Object;

	constructor(){

		this.difficulty = 2;
		this.taxRate = 2;
		this.wageRate = 2;

	}

	getDifficulty(){
		return this.difficulty;
	}
	setDifficulty(val:number){
		this.difficulty = val;
	}

	getTaxRate(){
		return this.taxRate;
	}
	setTaxRate(val:number){
		this.taxRate = val;
	}

	getWageRate(){
		return this.wageRate;
	}
	setWageRate(val:number){
		this.wageRate = val;
	}

	computeData(house:string, quantity){
		var housePop = this.houseData[house].pop;
		var pop = housePop * quantity;
		var workers = this.computeWorkers(house, pop);
		var taxes = this.computeTaxes(house, pop);
		var wages = this.computeWages(house, workers);
		return {
			house : house,
			pop: pop,
			workers: workers,
			taxes : taxes,
			wages : wages,
			profit : taxes - wages,
			food : this.computeFood(house, pop),
			hemp : this.computeHemp(house, housePop) * quantity,
			ceram : this.computeCeram(house, housePop) * quantity,
			silk : this.computeSilk(house) * quantity,
			wares : this.computeWares(house) * quantity,
			tea : this.computeTea(house, housePop) * quantity
		}
	}

	computeWorkers(house:string, pop:number) :number{

		if(this.houseData[house].trm >=10){ return 0;}
		var percent:number = this.wageRates[this.difficulty][this.wageRate].workers;
		return Math.floor(pop * percent);
	}

	computeTaxes(house:string, pop:number) :number{
		var trm = this.houseData[house].trm;
		return Math.round(pop * trm * (this.taxRate+1) * 0.03) *12;
	}

	computeWages(house:string, workers:number) :number {
		var wages:number = this.wageRates[this.difficulty][this.wageRate].wages;
		return Math.floor(workers * wages);
	}

	computeFood(house:string, pop:number) :number{
		var trm = this.houseData[house].trm;
		if(trm == 0 || trm == 10){
			return 0;
		}
		return pop *3;
	}

	computeHemp(house:string, pop:number) :number{
		var trm = this.houseData[house].trm;
		if(pop <= 22 && trm <=1){
			return 0;
		}
		return 24;
	}
	computeCeram(house:string, pop:number) :number{
		var trm = this.houseData[house].trm;
		if(pop <= 41 && trm <=1){
			return 0;
		}
		return 24;
	}

	computeSilk(house:string) :number{
		var trm = this.houseData[house].trm;
		if(trm <=10){
			return 0;
		}
		return 24;
	}
	computeWares(house:string) :number{
		var trm = this.houseData[house].trm;
		if(trm <=18){
			return 0;
		}
		return 24;
	}
	computeTea(house:string, pop:number) :number{
		var trm = this.houseData[house].trm;
		if(trm != 2 && trm != 24){
			return 0;
		}
		return 24;
	}

	public static getBuildingData(char : string) : any {
		if(!Stats.prototype.MAP_TABLE[char]){
			return null;
		}
		return Stats.prototype.MAP_TABLE[char];
	}

}

Stats.prototype.MAP_TABLE = {};


// trade
Stats.prototype.MAP_TABLE["1"] = {workers:4};
Stats.prototype.MAP_TABLE["2"] = {workers:4};
Stats.prototype.MAP_TABLE["3"] = {workers:4};
Stats.prototype.MAP_TABLE["4"] = {workers:4};
Stats.prototype.MAP_TABLE["5"] = {workers:4};
Stats.prototype.MAP_TABLE["6"] = {workers:4};

//mill
Stats.prototype.MAP_TABLE["7"] = {workers:16};
//warehouse
Stats.prototype.MAP_TABLE["8"] = {workers:6};
//trading post
Stats.prototype.MAP_TABLE["9"] = {workers:9};
//pier
Stats.prototype.MAP_TABLE["~"] = {workers:10};
Stats.prototype.MAP_TABLE["`"] = {workers:10};

//markets
Stats.prototype.MAP_TABLE["["] = {workers:0};
Stats.prototype.MAP_TABLE["]"] = {workers:0};
Stats.prototype.MAP_TABLE["{"] = {workers:0};
Stats.prototype.MAP_TABLE["}"] = {workers:0};

//agriculture
//wharf
Stats.prototype.MAP_TABLE["f"] = {workers:10};
Stats.prototype.MAP_TABLE["F"] = {workers:10};
Stats.prototype.MAP_TABLE["â"] = {workers:10};
Stats.prototype.MAP_TABLE["Â"] = {workers:10};

//irrigation
Stats.prototype.MAP_TABLE["I"] = {workers:10};
Stats.prototype.MAP_TABLE["_"] = {workers:0};
Stats.prototype.MAP_TABLE["n"] = {workers:15};
Stats.prototype.MAP_TABLE["r"] = {workers:12};
Stats.prototype.MAP_TABLE["s"] = {workers:12};
Stats.prototype.MAP_TABLE["ß"] = {workers:12};
Stats.prototype.MAP_TABLE["v"] = {workers:18};
Stats.prototype.MAP_TABLE["V"] = {workers:22};
Stats.prototype.MAP_TABLE["w"] = {workers:0};
Stats.prototype.MAP_TABLE["W"] = {workers:4};
Stats.prototype.MAP_TABLE["å"] = {workers:0};
Stats.prototype.MAP_TABLE["é"] = {workers:0};
Stats.prototype.MAP_TABLE["è"] = {workers:0};
Stats.prototype.MAP_TABLE["á"] = {workers:0};
Stats.prototype.MAP_TABLE["à"] = {workers:0};
Stats.prototype.MAP_TABLE["ù"] = {workers:0};
Stats.prototype.MAP_TABLE["û"] = {workers:0};
Stats.prototype.MAP_TABLE["Ô"] = {workers:0};

//industry
Stats.prototype.MAP_TABLE["b"] = {workers:19};
Stats.prototype.MAP_TABLE["B"] = {workers:12};
Stats.prototype.MAP_TABLE["C"] = {workers:14};
Stats.prototype.MAP_TABLE["©"] = {workers:17};
Stats.prototype.MAP_TABLE["i"] = {workers:20};
Stats.prototype.MAP_TABLE["j"] = {workers:9};
Stats.prototype.MAP_TABLE["k"] = {workers:12};
Stats.prototype.MAP_TABLE["l"] = {workers:14};
Stats.prototype.MAP_TABLE["L"] = {workers:11};
Stats.prototype.MAP_TABLE["µ"] = {workers:11};
Stats.prototype.MAP_TABLE["N"] = {workers:10};

// roads
Stats.prototype.MAP_TABLE["="] = {workers:0};
//grand roads
Stats.prototype.MAP_TABLE[";"] = {workers:0};
Stats.prototype.MAP_TABLE[":"] = {workers:0};
Stats.prototype.MAP_TABLE["¶"] = {workers:0};
Stats.prototype.MAP_TABLE["°"] = {workers:0};
//imperial roads
Stats.prototype.MAP_TABLE["("] = {workers:0};
Stats.prototype.MAP_TABLE[")"] = {workers:0};
//roadblock
Stats.prototype.MAP_TABLE["+"] = {workers:0};
//ferries
Stats.prototype.MAP_TABLE["e"] = {workers:0};
Stats.prototype.MAP_TABLE["E"] = {workers:0};
Stats.prototype.MAP_TABLE["ê"] = {workers:0};
Stats.prototype.MAP_TABLE["ë"] = {workers:0};

// decoration
Stats.prototype.MAP_TABLE["!"] = {workers:0};
Stats.prototype.MAP_TABLE["@"] = {workers:0};
Stats.prototype.MAP_TABLE["#"] = {workers:0};
Stats.prototype.MAP_TABLE["$"] = {workers:0};
Stats.prototype.MAP_TABLE["%"] = {workers:0};
Stats.prototype.MAP_TABLE["^"] = {workers:0};
Stats.prototype.MAP_TABLE["&"] = {workers:0};
Stats.prototype.MAP_TABLE["*"] = {workers:0};
Stats.prototype.MAP_TABLE["|"] = {workers:0};
Stats.prototype.MAP_TABLE["\\"] = {workers:0};
Stats.prototype.MAP_TABLE["-"] = {workers:0};
Stats.prototype.MAP_TABLE["ç"] = {workers:0};
Stats.prototype.MAP_TABLE["Ç"] = {workers:0};

//safety
Stats.prototype.MAP_TABLE["J"] = {workers:6};
Stats.prototype.MAP_TABLE["K"] = {workers:5};
Stats.prototype.MAP_TABLE["q"] = {workers:7};
Stats.prototype.MAP_TABLE["Q"] = {workers:8};

//government
Stats.prototype.MAP_TABLE["a"] = {workers:40};
Stats.prototype.MAP_TABLE["A"] = {workers:40};
Stats.prototype.MAP_TABLE["m"] = {workers:18};
Stats.prototype.MAP_TABLE["M"] = {workers:16};
Stats.prototype.MAP_TABLE["p"] = {workers:30};
Stats.prototype.MAP_TABLE["P"] = {workers:30};
Stats.prototype.MAP_TABLE["x"] = {workers:8};

//entertainment
Stats.prototype.MAP_TABLE["O"] = {workers:10};
Stats.prototype.MAP_TABLE["R"] = {workers:9};
Stats.prototype.MAP_TABLE["u"] = {workers:8};
Stats.prototype.MAP_TABLE["S"] = {workers:7};

//religion
Stats.prototype.MAP_TABLE["c"] = {workers:4};
Stats.prototype.MAP_TABLE["d"] = {workers:4};
Stats.prototype.MAP_TABLE["D"] = {workers:8};
Stats.prototype.MAP_TABLE["g"] = {workers:4};
Stats.prototype.MAP_TABLE["G"] = {workers:10};
Stats.prototype.MAP_TABLE["U"] = {workers:12};

//military
Stats.prototype.MAP_TABLE["ð"] = {workers:8};
Stats.prototype.MAP_TABLE["×"] = {workers:9, isDeactivable:true};
Stats.prototype.MAP_TABLE["÷"] = {workers:9, isDeactivable:true};
Stats.prototype.MAP_TABLE["«"] = {workers:20};
Stats.prototype.MAP_TABLE["»"] = {workers:20};
Stats.prototype.MAP_TABLE["T"] = {workers:6, isDeactivable:true};
Stats.prototype.MAP_TABLE["t"] = {workers:0};

// other buildings
Stats.prototype.MAP_TABLE["h"] = {workers:0};
Stats.prototype.MAP_TABLE["H"] = {workers:0};

Stats.prototype.MAP_TABLE["X"] = {workers:15};
Stats.prototype.MAP_TABLE["y"] = {workers:27};
Stats.prototype.MAP_TABLE["Y"] = {workers:20};
Stats.prototype.MAP_TABLE["z"] = {workers:25};
Stats.prototype.MAP_TABLE["Z"] = {workers:35};

