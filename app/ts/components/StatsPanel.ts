import { Component, EventEmitter } from "angular2/core";
import {Headquarter} 			from "../services/Headquarter";
import {Cell} 					from "../components/Cell";
import {Building} 					from "../components/Cell";
import {
	FORM_BINDINGS,
	FORM_DIRECTIVES,
	ControlGroup,
	FormBuilder } 
 from "angular2/common";

import {Stats} 		from "../classes/Stats";

@Component({

	selector: 'stats-panel',
	inputs: ['buildings'],
	outputs: ['onClose'],
	viewBindings: [FORM_BINDINGS],
	directives :[FORM_DIRECTIVES],
	host:{
	},
	templateUrl: 'app/templates/Stats.html',
})
export class StatsPanel {

	stats:Stats;
	activeTab:string;
	diffForm:ControlGroup;
	onClose: EventEmitter<string>;
	buildings:any;
	workersByBuilding:Array<any>;
	totals:any;


	constructor( public HQ : Headquarter, builder: FormBuilder){
		this.onClose = new EventEmitter();
		this.activeTab = 'buildings';
		this.stats = new Stats();
		this.diffForm = builder.group({
			difficulty:[this.stats.getDifficulty()],
			taxrate:[this.stats.getTaxRate()],
			wagerate:[this.stats.getWageRate()]
		});
		this.diffForm.valueChanges.subscribe(data => {
			this.updateSettings(data);
			this.collectData();
		});
		this.collectData();
	}

	collectData(){
		this.buildings = this.parseBuildings(this.HQ.buildingStorage);
		this.workersByBuilding = this.parseWorkers(this.buildings.counts);
		this.totals = this.computeTotals();
	}
	
	parseBuildings(buildings) :any{
		var res = {counts : {}, names : []};

		Object.keys(buildings).forEach(
			(key) => {

			    var building:Building = Cell.getBuildingData(buildings[key].char);
			    if(building && Stats.getBuildingData(building.char)){
			    	if(!res.counts[building.label]){
			    		res.names.push(building.label);
			    		res.counts[building.label] = {'char': building.char, 'name':building.label, 'count':0};
			    	}
			    	res.counts[building.label].count++;
			    }
			}
		);
		res.names.sort();
		return res;
	}

	parseWorkers(buildings){
		var res = [];
		Object.keys(buildings).forEach(
			(key) => {
				console.log(building);
				var building = buildings[key];
				var workers = Stats.getBuildingData(building.char).workers;
				if(workers > 0){
					res.push({name:building.name, workers:building.count * workers});
				}
			}
		);
		res.sort((a, b) => {return b.workers - a.workers});
		console.log(res);
		return res;
	}

	round(val:number){
		return Math.round(val);
	}

	computeTotals(){
		var res = {pop:0, workers:0, taxes : 0, wages : 0, profit : 0, jobs : 0, 
			food:0, hemp: 0, ceram: 0, silk: 0, wares: 0, tea: 0};

		var common = this.getCommonHousingData();
		var commonMax = common[common.length-1];
		var elite = this.getEliteHousingData();
		var eliteMax = elite[elite.length-1];
		res.pop = commonMax.pop + eliteMax.pop;
		res.workers = commonMax.workers + eliteMax.workers;
		res.taxes = commonMax.taxes + eliteMax.taxes;
		res.wages = commonMax.wages + eliteMax.wages;
		res.profit = commonMax.profit + eliteMax.profit;
		res.food = commonMax.food + eliteMax.food;
		res.hemp = commonMax.hemp + eliteMax.hemp;
		res.ceram = commonMax.ceram + eliteMax.ceram;
		res.silk = commonMax.silk + eliteMax.silk;
		res.wares = commonMax.wares + eliteMax.wares;
		res.tea = commonMax.tea + eliteMax.tea;
		this.workersByBuilding.forEach(
			(building) => {
				res.jobs += building.workers
			}
		);

		return res;
	}

	selectTab(tab:string){
		this.activeTab = tab;
	}

	getCommonHousingData(){
		var res = [];
		var nbOfHouses = !this.buildings.counts['Common Housing'] ? 0 : this.buildings.counts['Common Housing'].count;
		this.stats.houses.forEach(
			(house) => {
				res.push(this.stats.computeData(house, nbOfHouses));
			}
		);
		return res;
	}
	getEliteHousingData(){
		var res = [];
		var nbOfHouses = !this.buildings.counts['Elite Housing'] ? 0 : this.buildings.counts['Elite Housing'].count;
		this.stats.elites.forEach(
			(house) => {
				res.push(this.stats.computeData(house, nbOfHouses));
			}
		);
		return res;
	}

	updateSettings(data){
		if(data.difficulty){
			this.stats.setDifficulty(parseInt(data.difficulty));
		}
		if(data.taxrate){
			this.stats.setTaxRate(parseInt(data.taxrate));
		}
		if(data.wagerate){
			this.stats.setWageRate(parseInt(data.wagerate));
		}
	}
	
	close(){
		this.onClose.emit("");
	}
}