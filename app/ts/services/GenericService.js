System.register(["angular2/core", "../components/Cell", "../classes/Renderer", "./Headquarter"], function(exports_1, context_1) {
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
    var core_1, Cell_1, Renderer_1, Headquarter_1;
    var GenericService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Renderer_1_1) {
                Renderer_1 = Renderer_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            }],
        execute: function() {
            GenericService = (function () {
                function GenericService(HQ, renderer) {
                    var _this = this;
                    this.HQ = HQ;
                    this.renderer = renderer;
                    this.building = null;
                    this.HQ.serviceChange$.subscribe(function (item) {
                        if (item.service && _this.type == item.service) {
                            _this.HQ.activateService(_this);
                            _this.init(item);
                        }
                    });
                }
                GenericService.prototype.init = function (args) {
                    if (args && args.name) {
                        // standard build service init
                        this.building = Cell_1.Cell.getBuildingData(Cell_1.Cell.getCharFromName(args.name));
                        console.log(this.name + " initialized with " + args.name + " (" + this.building.char + ")");
                    }
                };
                GenericService.prototype.rotate = function () {
                    if (this.building) {
                        this.building = this.building.rotate();
                        console.log("new building : " + this.building.name);
                        this.highlightCells();
                        return this.building.label;
                    }
                    else {
                        return null;
                    }
                };
                GenericService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter, Renderer_1.Renderer])
                ], GenericService);
                return GenericService;
            }());
            exports_1("GenericService", GenericService);
        }
    }
});
//# sourceMappingURL=GenericService.js.map