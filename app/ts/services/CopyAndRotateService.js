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
    var CopyAndRotateService;
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
            CopyAndRotateService = (function (_super) {
                __extends(CopyAndRotateService, _super);
                function CopyAndRotateService(HQ, renderer) {
                    _super.call(this, HQ, renderer);
                    this.HQ = HQ;
                    this.renderer = renderer;
                    this.highlightedCells = [];
                    this.name = "CopyAndRotateService";
                    this.type = "copyAndRotate";
                    this.width = 0;
                    this.height = 0;
                    this.isZoneOK = true;
                    this.currentCell = null;
                    this.originalCells = null;
                    this.cellsToCopy = null;
                    this.rotation = null;
                }
                CopyAndRotateService.prototype.init = function (args) {
                    try {
                        if (args.data && args.data.cells) {
                            this.originalCells = args.data.cells;
                            this.rotation = args.data.rotation;
                            this.computeDimensions(args.data.cells);
                            this.cellsToCopy = this.rotateSelection(this.originalCells, this.rotation);
                            console.log(this.name + " initialized with " + this.cellsToCopy.length + " cells with " + this.rotation + " symetry");
                        }
                        else {
                            console.log(this.name + " initialized wrongly ! no input data !");
                            this.reset();
                        }
                    }
                    catch (err) {
                        this.HQ.log(err);
                    }
                };
                CopyAndRotateService.prototype.computeDimensions = function (cells) {
                    this.width = cells[cells.length - 1].colIndex - cells[0].colIndex + 1;
                    this.height = cells[cells.length - 1].lineIndex - cells[0].lineIndex + 1;
                };
                CopyAndRotateService.prototype.rotateSelection = function (cellsToRotate, rotation) {
                    var res = [];
                    for (var i = 0; i < this.height; i++) {
                        for (var j = 0; j < this.width; j++) {
                            var cell = cellsToRotate[j + i * this.width];
                            var newIndex = j + i * this.width;
                            if (rotation == "vertical") {
                                newIndex = (this.width - 1 - j) + i * this.width;
                            }
                            else if (rotation == "horizontal") {
                                newIndex = j + (this.height - 1 - i) * this.width;
                            }
                            res[newIndex] = cell;
                        }
                    }
                    if (res.length != cellsToRotate.length) {
                        console.log("Error in rotate ! " + res.length + " != " + cellsToRotate.length);
                    }
                    return res;
                };
                CopyAndRotateService.prototype.alertCellMouseEvent = function ($event, action, cell) {
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
                CopyAndRotateService.prototype.reset = function () {
                    this.clearCells();
                    this.cellsToCopy = [];
                    this.originalCells = [];
                    this.isZoneOK = true;
                    this.rotation = null;
                    this.width = 0;
                    this.height = 0;
                };
                CopyAndRotateService.prototype.alertOnEnter = function ($event, cell) {
                    this.currentCell = cell;
                    this.highlightCells();
                };
                CopyAndRotateService.prototype.alertOnMouseUp = function ($event, cell) {
                    //this.reset();
                };
                CopyAndRotateService.prototype.alertOnMouseDown = function ($event, cell) {
                    if (this.isZoneOK) {
                        var defaultCell = new Cell_1.Cell(0, 0, " ");
                        for (var i = 0; i < this.cellsToCopy.length; i++) {
                            var sourceCell = this.cellsToCopy[i];
                            var destCell = this.highlightedCells[i];
                            if (this.renderer.isBuildingEntirelyInSelection(sourceCell, this.originalCells)) {
                                this.renderer.copyCell(sourceCell, destCell);
                            }
                            else {
                                this.renderer.copyCell(defaultCell, destCell);
                            }
                        }
                    }
                };
                CopyAndRotateService.prototype.highlightCells = function () {
                    var _this = this;
                    this.clearCells();
                    this.highlightedCells = this.renderer.getCellsInSquare(this.currentCell.lineIndex, this.currentCell.colIndex, this.currentCell.lineIndex + this.height - 1, this.currentCell.colIndex + this.width - 1);
                    this.isZoneOK = !this.renderer.isOOB(this.currentCell.lineIndex, this.currentCell.colIndex, this.currentCell.lineIndex + this.height - 1, this.currentCell.colIndex + this.width - 1);
                    var pathIsClear = true;
                    this.highlightedCells.forEach(function (cell) {
                        if (!cell.isEmpty() || !_this.isZoneOK) {
                            cell.highlight("red");
                            pathIsClear = false;
                        }
                        else {
                            cell.highlight("green");
                        }
                    });
                    this.renderer.renderHightlightZone(this.highlightedCells, 'square');
                    this.isZoneOK = this.isZoneOK && pathIsClear;
                };
                CopyAndRotateService.prototype.clearCells = function () {
                    this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                    this.renderer.removeHightlightZone(this.highlightedCells);
                    this.highlightedCells = [];
                };
                CopyAndRotateService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter, Renderer_1.Renderer])
                ], CopyAndRotateService);
                return CopyAndRotateService;
            }(GenericService_1.GenericService));
            exports_1("CopyAndRotateService", CopyAndRotateService);
        }
    }
});
//# sourceMappingURL=CopyAndRotateService.js.map