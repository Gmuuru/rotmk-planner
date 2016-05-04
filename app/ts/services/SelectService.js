System.register(['rxjs/Subject', "./GenericService"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subject_1, GenericService_1;
    var SelectService;
    return {
        setters:[
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (GenericService_1_1) {
                GenericService_1 = GenericService_1_1;
            }],
        execute: function() {
            SelectService = (function (_super) {
                __extends(SelectService, _super);
                function SelectService(HQ, renderer) {
                    _super.call(this, HQ, renderer);
                    this.HQ = HQ;
                    this.renderer = renderer;
                    this._selectCellsSource = new Subject_1.Subject();
                    this._actionSource = new Subject_1.Subject();
                    this.selectChange$ = this._selectCellsSource.asObservable();
                    this.action$ = this._actionSource.asObservable();
                    this.highlightedCells = [];
                    this.selectOngoing = false;
                    this.originCell = null;
                    this.currentCell = null;
                    this.name = "SelectService";
                    this.type = "select";
                    this.HQ.activateDefaultService(this);
                    this.init();
                }
                SelectService.prototype.init = function (args) {
                    this.highlightedCells = [];
                    console.log("SelectService initialized");
                };
                SelectService.prototype.alertCellMouseEvent = function ($event, action, cell) {
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
                            console.log("Error, unknown action " + action + " for provider SelectService");
                        }
                    }
                    catch (err) {
                        console.log(err);
                        this.HQ.log(err);
                    }
                };
                SelectService.prototype.reset = function () {
                    if (this.selectOngoing == false) {
                        this._actionSource.next("reset");
                    }
                    this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                    this.highlightedCells = [];
                    this.originCell = null;
                    this.currentCell = null;
                    this.selectOngoing = false;
                };
                SelectService.prototype.alertOnEnter = function ($event, cell) {
                    this.currentCell = cell;
                    if (!this.selectOngoing) {
                        this.originCell = cell;
                    }
                    if (this.selectOngoing) {
                        this.highlightCells();
                        this._selectCellsSource.next($event);
                    }
                };
                SelectService.prototype.alertOnMouseUp = function ($event, cell) {
                    if ($event.button == 0) {
                        //left click
                        if (cell) {
                            this._selectCellsSource.next($event);
                        }
                        this.reset();
                    }
                    else if ($event.button == 1) {
                        this.reset();
                    }
                };
                SelectService.prototype.alertOnMouseDown = function ($event, cell) {
                    if ($event.button == 0) {
                        this.originCell = cell;
                        this.selectOngoing = true;
                        this.highlightCells();
                        this._selectCellsSource.next($event);
                    }
                };
                SelectService.prototype.highlightCells = function () {
                    var _this = this;
                    if (!this.originCell || !this.currentCell) {
                        return;
                    }
                    var cells = this.renderer.getCellsInSquare(this.originCell.lineIndex, this.originCell.colIndex, this.currentCell.lineIndex, this.currentCell.colIndex);
                    if (cells != null) {
                        //no out of bounds 
                        this.highlightedCells.forEach(function (cell) { cell.highlight(null); });
                        this.renderer.removeHightlightZone(this.highlightedCells);
                        this.highlightedCells = [];
                        cells.forEach(function (cell) {
                            _this.highlightedCells.push(cell);
                            if (!cell.isEmpty()) {
                                cell.highlight("green");
                            }
                        });
                        this.renderer.selectZone(this.highlightedCells);
                    }
                };
                return SelectService;
            }(GenericService_1.GenericService));
            exports_1("SelectService", SelectService);
        }
    }
});
//# sourceMappingURL=SelectService.js.map