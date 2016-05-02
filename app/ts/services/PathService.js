System.register(["angular2/core", "../components/Cell", "../classes/Renderer", "./GenericService", "./Headquarter"], function(exports_1, context_1) {
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
    var core_1, Cell_1, Renderer_1, GenericService_1, Headquarter_1;
    var PathService;
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
            function (GenericService_1_1) {
                GenericService_1 = GenericService_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            }],
        execute: function() {
            PathService = (function (_super) {
                __extends(PathService, _super);
                function PathService(HQ, renderer) {
                    _super.call(this, HQ, renderer);
                    this.HQ = HQ;
                    this.renderer = renderer;
                    this.highlightedCells = [];
                    this.pathOK = false;
                    this.tracingOngoing = false;
                    this.name = "PathService";
                    this.type = "path";
                }
                PathService.prototype.init = function (args) {
                    try {
                        if (args && args.name) {
                            var name = args.name;
                            this.building = Cell_1.Cell.getBuildingData(Cell_1.Cell.getCharFromName(name));
                            this.lineOnly = false;
                            if (this.building.name.indexOf("improad") == 0 || this.building.name.indexOf("grandroad") == 0) {
                                this.lineOnly = true;
                            }
                            console.log(this.name + " initialized with " + name + " (" + this.building.name + ")");
                        }
                    }
                    catch (err) {
                        this.HQ.log(err);
                    }
                };
                PathService.prototype.alertCellMouseEvent = function ($event, action, cell) {
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
                            console.log("Error, unknown action " + action + " for provider RoadService");
                        }
                    }
                    catch (err) {
                        this.HQ.log(err);
                    }
                };
                PathService.prototype.reset = function () {
                    this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                    this.renderer.removeHightlightZone(this.highlightedCells);
                    this.highlightedCells = [];
                    this.originCell = null;
                    this.currentCell = null;
                    this.tracingOngoing = false;
                };
                PathService.prototype.alertOnEnter = function ($event, cell) {
                    this.currentCell = cell;
                    if (!this.tracingOngoing) {
                        this.originCell = cell;
                    }
                    this.pathOK = this.highlightCells();
                };
                PathService.prototype.alertOnMouseUp = function ($event, cell) {
                    var _this = this;
                    if ($event.button == 0) {
                        //left click
                        if (cell && this.pathOK) {
                            this.highlightedCells.forEach(function (hlCell) {
                                _this.renderer.updateCell(hlCell, _this.building, true);
                            });
                        }
                        this.reset();
                    }
                    else if ($event.button == 1) {
                        this.reset();
                    }
                };
                PathService.prototype.alertOnMouseDown = function ($event, cell) {
                    if ($event.button == 0) {
                        this.originCell = cell;
                        this.tracingOngoing = true;
                        this.pathOK = this.highlightCells();
                    }
                };
                PathService.prototype.highlightCells = function () {
                    var _this = this;
                    if (!this.originCell || !this.currentCell) {
                        return false;
                    }
                    var pathOK = true;
                    var startX = this.originCell.lineIndex;
                    var startY = this.originCell.colIndex;
                    var endX = this.currentCell.lineIndex;
                    var endY = this.currentCell.colIndex;
                    this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                    this.renderer.removeHightlightZone(this.highlightedCells);
                    this.highlightedCells = [];
                    var cells = [];
                    var oobDetected = false;
                    if (!this.lineOnly) {
                        cells = this.renderer.getCellsInPath(this.originCell.lineIndex, this.originCell.colIndex, this.currentCell.lineIndex, this.currentCell.colIndex);
                    }
                    else {
                        var direction = this.building.name.split('-').pop();
                        if (direction == 's' || direction == 'n' || direction == 'v') {
                            cells = this.renderer.getCellsInLine(this.originCell.lineIndex, this.originCell.colIndex, this.currentCell.colIndex, this.building.height);
                        }
                        else if (direction == 'e' || direction == 'w' || direction == 'h') {
                            cells = this.renderer.getCellsInCol(this.originCell.colIndex, this.originCell.lineIndex, this.currentCell.lineIndex, this.building.width);
                        }
                        else {
                            console.log("unknown direction : " + direction);
                        }
                        oobDetected = this.renderer.detectOOBForLargeRoads(this.originCell, this.building);
                    }
                    cells.forEach(function (cell) {
                        _this.highlightedCells.push(cell);
                        if (cell.isEmpty() && !oobDetected) {
                            cell.highlight("green", _this.building.getOrientation());
                        }
                        else {
                            cell.highlight("red", _this.building.getOrientation());
                            pathOK = false;
                        }
                    });
                    this.renderer.renderHightlightZone(this.highlightedCells, 'path');
                    this.HQ.sendMessage(this.highlightedCells.length + " cells");
                    return pathOK;
                };
                PathService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter, Renderer_1.Renderer])
                ], PathService);
                return PathService;
            }(GenericService_1.GenericService));
            exports_1("PathService", PathService);
        }
    }
});
//# sourceMappingURL=PathService.js.map