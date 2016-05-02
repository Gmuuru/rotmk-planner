System.register(["angular2/core", "../classes/Renderer", "./GenericService", "./Headquarter"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, Renderer_1, GenericService_1, Headquarter_1;
    var SplashService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Renderer_1_1) {
                Renderer_1 = Renderer_1_1;
            },
            function (GenericService_1_1) {
                GenericService_1 = GenericService_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            }],
        execute: function() {
            SplashService = (function (_super) {
                __extends(SplashService, _super);
                function SplashService(HQ, renderer) {
                    _super.call(this, HQ, renderer);
                    this.HQ = HQ;
                    this.renderer = renderer;
                    this.highlightedCells = [];
                    this.splashOngoing = false;
                    this.originCell = null;
                    this.currentCell = null;
                    this.name = "SplashService";
                    this.type = "splash";
                }
                SplashService.prototype.alertCellMouseEvent = function ($event, action, cell) {
                    try {
                        if (action == "enter") {
                            this.alertOnEnter($event, cell);
                        }
                        else if (action == "up") {
                            this.alertOnMouseUp($event, cell);
                        }
                        else if (action == "down") {
                            this.alertOnMouseDown($event, cell);
                        }
                        else {
                            console.log("Error, unknown action " + action + " for provider DeleteService");
                        }
                    }
                    catch (err) {
                        this.HQ.log(err);
                    }
                };
                SplashService.prototype.reset = function () {
                    this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                    this.renderer.removeHightlightZone(this.highlightedCells);
                    this.highlightedCells = [];
                    this.originCell = null;
                    this.currentCell = null;
                    this.splashOngoing = false;
                };
                SplashService.prototype.alertOnEnter = function ($event, cell) {
                    this.currentCell = cell;
                    if (!this.splashOngoing) {
                        this.originCell = cell;
                    }
                    this.highlightCells();
                };
                SplashService.prototype.alertOnMouseUp = function ($event, cell) {
                    var _this = this;
                    if ($event.button == 0) {
                        //left click
                        if (cell) {
                            this.highlightedCells.forEach(function (hlCell) {
                                if (hlCell.hl == "green") {
                                    _this.renderer.updateCell(hlCell, _this.building, false);
                                }
                            });
                        }
                        this.reset();
                    }
                    else if ($event.button == 1) {
                        this.reset();
                    }
                };
                SplashService.prototype.alertOnMouseDown = function ($event, cell) {
                    if ($event.button == 0) {
                        this.originCell = cell;
                        this.splashOngoing = true;
                        this.highlightCells();
                    }
                };
                SplashService.prototype.highlightCells = function () {
                    var _this = this;
                    var cells = this.renderer.getCellsInSquare(this.originCell.lineIndex, this.originCell.colIndex, this.currentCell.lineIndex, this.currentCell.colIndex);
                    if (cells != null) {
                        //no out of bounds 
                        this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                        this.renderer.removeHightlightZone(this.highlightedCells);
                        this.highlightedCells = [];
                        cells.forEach(function (cell) {
                            _this.highlightedCells.push(cell);
                            if (!cell.isEmpty()) {
                                cell.highlight("red", _this.building.getOrientation());
                            }
                            else {
                                cell.highlight("green", _this.building.getOrientation());
                            }
                        });
                        this.renderer.renderHightlightZone(this.highlightedCells, 'square');
                    }
                };
                SplashService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter, Renderer_1.Renderer])
                ], SplashService);
                return SplashService;
            }(GenericService_1.GenericService));
            exports_1("SplashService", SplashService);
        }
    }
});
//# sourceMappingURL=SplashService.js.map