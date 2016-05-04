System.register(["angular2/core", "../services/Headquarter", "angular2/common", "../classes/Stats"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, Headquarter_1, common_1, Stats_1;
    var StatsPanel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (Stats_1_1) {
                Stats_1 = Stats_1_1;
            }],
        execute: function() {
            StatsPanel = (function () {
                function StatsPanel(HQ, builder) {
                    var _this = this;
                    this.HQ = HQ;
                    this.onClose = new core_1.EventEmitter();
                    this.activeTab = 'buildings';
                    this.stats = new Stats_1.Stats();
                    this.diffForm = builder.group({
                        difficulty: [this.stats.getDifficulty()],
                        taxrate: [this.stats.getTaxRate()],
                        wagerate: [this.stats.getWageRate()]
                    });
                    this.diffForm.valueChanges.subscribe(function (data) {
                        _this.updateSettings(data);
                        _this.collectData();
                    });
                    this.collectData();
                }
                StatsPanel.prototype.collectData = function () {
                    this.buildings = this.parseBuildings(this.HQ.buildingStorage);
                    this.workersByBuilding = this.parseWorkers(this.buildings.counts);
                    this.totals = this.computeTotals();
                };
                StatsPanel.prototype.parseBuildings = function (buildings) {
                    var res = { counts: {}, names: [] };
                    Object.keys(buildings).forEach(function (key) {
                        var building = buildings[key].getBuilding();
                        if (Stats_1.Stats.getBuildingData(building.char)) {
                            if (!res.counts[building.label]) {
                                res.names.push(building.label);
                                res.counts[building.label] = { 'char': building.char, 'name': building.label, 'count': 0 };
                            }
                            res.counts[building.label].count++;
                        }
                    });
                    res.names.sort();
                    return res;
                };
                StatsPanel.prototype.parseWorkers = function (buildings) {
                    var res = [];
                    Object.keys(buildings).forEach(function (key) {
                        console.log(building);
                        var building = buildings[key];
                        var workers = Stats_1.Stats.getBuildingData(building.char).workers;
                        if (workers > 0) {
                            res.push({ name: building.name, workers: building.count * workers });
                        }
                    });
                    res.sort(function (a, b) { return b.workers - a.workers; });
                    console.log(res);
                    return res;
                };
                StatsPanel.prototype.round = function (val) {
                    return Math.round(val);
                };
                StatsPanel.prototype.computeTotals = function () {
                    var res = { pop: 0, workers: 0, taxes: 0, wages: 0, profit: 0, jobs: 0,
                        food: 0, hemp: 0, ceram: 0, silk: 0, wares: 0, tea: 0 };
                    var common = this.getCommonHousingData();
                    var commonMax = common[common.length - 1];
                    var elite = this.getEliteHousingData();
                    var eliteMax = elite[elite.length - 1];
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
                    this.workersByBuilding.forEach(function (building) {
                        res.jobs += building.workers;
                    });
                    return res;
                };
                StatsPanel.prototype.selectTab = function (tab) {
                    this.activeTab = tab;
                };
                StatsPanel.prototype.getCommonHousingData = function () {
                    var _this = this;
                    var res = [];
                    var nbOfHouses = !this.buildings.counts['Common Housing'] ? 0 : this.buildings.counts['Common Housing'].count;
                    this.stats.houses.forEach(function (house) {
                        res.push(_this.stats.computeData(house, nbOfHouses));
                    });
                    return res;
                };
                StatsPanel.prototype.getEliteHousingData = function () {
                    var _this = this;
                    var res = [];
                    var nbOfHouses = !this.buildings.counts['Elite Housing'] ? 0 : this.buildings.counts['Elite Housing'].count;
                    this.stats.elites.forEach(function (house) {
                        res.push(_this.stats.computeData(house, nbOfHouses));
                    });
                    return res;
                };
                StatsPanel.prototype.updateSettings = function (data) {
                    if (data.difficulty) {
                        this.stats.setDifficulty(parseInt(data.difficulty));
                    }
                    if (data.taxrate) {
                        this.stats.setTaxRate(parseInt(data.taxrate));
                    }
                    if (data.wagerate) {
                        this.stats.setWageRate(parseInt(data.wagerate));
                    }
                };
                StatsPanel.prototype.close = function () {
                    this.onClose.emit("");
                };
                StatsPanel = __decorate([
                    core_1.Component({
                        selector: 'stats-panel',
                        inputs: ['buildings'],
                        outputs: ['onClose'],
                        viewBindings: [common_1.FORM_BINDINGS],
                        directives: [common_1.FORM_DIRECTIVES],
                        host: {},
                        templateUrl: 'app/templates/Stats.html',
                    }), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter, common_1.FormBuilder])
                ], StatsPanel);
                return StatsPanel;
            }());
            exports_1("StatsPanel", StatsPanel);
        }
    }
});
//# sourceMappingURL=StatsPanel.js.map