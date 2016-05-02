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
    var CopyService;
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
            CopyService = (function (_super) {
                __extends(CopyService, _super);
                function CopyService(HQ, renderer) {
                    _super.call(this, HQ, renderer);
                    this.HQ = HQ;
                    this.renderer = renderer;
                    this.highlightedCells = [];
                    this.name = "CopyService";
                    this.type = "copy";
                    this.width = 0;
                    this.height = 0;
                    this.isZoneOK = false;
                    this.currentCell = null;
                    this.cellsToCopy = null;
                }
                CopyService.prototype.init = function (args) {
                    try {
                        if (args.data) {
                            this.cellsToCopy = args.data;
                            this.computeDimensions(args.data);
                            console.log("CopyService initialized with " + this.cellsToCopy.length + " cells");
                        }
                        else {
                            console.log("CopyService initialized wrongly ! no input data !");
                            this.reset();
                        }
                    }
                    catch (err) {
                        this.HQ.log(err);
                    }
                };
                CopyService.prototype.computeDimensions = function (cells) {
                    this.width = cells[cells.length - 1].colIndex - cells[0].colIndex + 1;
                    this.height = cells[cells.length - 1].lineIndex - cells[0].lineIndex + 1;
                };
                CopyService.prototype.alertCellMouseEvent = function ($event, action, cell) {
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
                CopyService.prototype.reset = function () {
                    this.clearCells();
                    this.cellsToCopy = [];
                    this.width = 0;
                    this.height = 0;
                };
                CopyService.prototype.alertOnEnter = function ($event, cell) {
                    this.currentCell = cell;
                    this.highlightCells();
                };
                CopyService.prototype.alertOnMouseUp = function ($event, cell) {
                    //this.reset();
                };
                CopyService.prototype.alertOnMouseDown = function ($event, cell) {
                    if (this.isZoneOK) {
                        var defaultCell = new Cell_1.Cell(0, 0, " ");
                        for (var i = 0; i < this.cellsToCopy.length; i++) {
                            var sourceCell = this.cellsToCopy[i];
                            var destCell = this.highlightedCells[i];
                            if (this.renderer.isBuildingEntirelyInSelection(sourceCell, this.cellsToCopy)) {
                                this.renderer.copyCell(sourceCell, destCell);
                            }
                            else {
                                this.renderer.copyCell(defaultCell, destCell);
                            }
                        }
                    }
                };
                CopyService.prototype.highlightCells = function () {
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
                CopyService.prototype.clearCells = function () {
                    this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                    this.renderer.removeHightlightZone(this.highlightedCells);
                    this.highlightedCells = [];
                };
                CopyService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter, Renderer_1.Renderer])
                ], CopyService);
                return CopyService;
            }(GenericService_1.GenericService));
            exports_1("CopyService", CopyService);
        }
    }
});
//# sourceMappingURL=CopyService.js.map