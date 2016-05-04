System.register(["angular2/core", "../services/Headquarter", "../services/SelectService", "../classes/Renderer", "../directives/contextmenu.directive"], function(exports_1, context_1) {
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
    var core_1, Headquarter_1, SelectService_1, Renderer_1, contextmenu_directive_1;
    var MapComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            },
            function (SelectService_1_1) {
                SelectService_1 = SelectService_1_1;
            },
            function (Renderer_1_1) {
                Renderer_1 = Renderer_1_1;
            },
            function (contextmenu_directive_1_1) {
                contextmenu_directive_1 = contextmenu_directive_1_1;
            }],
        execute: function() {
            MapComponent = (function () {
                function MapComponent(renderer, HQ, selectService) {
                    var _this = this;
                    this.renderer = renderer;
                    this.HQ = HQ;
                    this.selectService = selectService;
                    this.defaultArea = {
                        'position': 'absolute',
                        'top': '0px',
                        'left': '0px',
                        'width': '0px',
                        'height': '0px'
                    };
                    this.reset();
                    this.renderer.reset$.subscribe(function (inq) {
                        _this.reset();
                    });
                    this.renderer.cellUpdate$.subscribe(function (inputData) {
                        try {
                            var action = inputData.action;
                            var cell = inputData.cell;
                            var position = _this.cellPosition(cell);
                            switch (action) {
                                case 'build':
                                case 'update': {
                                    _this.buildings[position] = cell;
                                    break;
                                }
                                case 'delete': {
                                    delete _this.buildings[position];
                                    break;
                                }
                            }
                            _this.HQ.broadcastBuildingList(_this.buildings);
                        }
                        catch (err) {
                            _this.HQ.log(err);
                        }
                    });
                    this.renderer.zoneHightlight$.subscribe(function (inputData) {
                        try {
                            var action = inputData.action;
                            var cells = inputData.cells;
                            var shape = inputData.shape;
                            if (action == "highlight") {
                                _this.hightlightZone(cells, shape);
                            }
                            else if (action == "remove") {
                                _this.removeHighlight(cells);
                            }
                            else if (action == "select") {
                                _this.selectZone(cells);
                            }
                        }
                        catch (err) {
                            _this.HQ.log(err);
                        }
                    });
                    this.selectService.selectChange$.subscribe(function ($event) {
                        try {
                            if ($event.type == "mouseup") {
                                _this.selectedCells = _this.selectService.highlightedCells;
                            }
                        }
                        catch (err) {
                            _this.HQ.log(err);
                        }
                    });
                }
                MapComponent.prototype.reset = function () {
                    this.buildings = {};
                    this.currentPosition = "";
                    this.resetZones();
                };
                MapComponent.prototype.resetZones = function () {
                    this.orientation = "";
                    this.hlArea = this.defaultArea;
                    this.hlSubArea = this.defaultArea;
                    this.selectArea = this.defaultArea;
                };
                MapComponent.prototype.selectZone = function (cells) {
                    var _this = this;
                    if (!cells || cells.length == 0) {
                        return;
                    }
                    cells.forEach(function (cell) {
                        if (_this.buildings[_this.cellPosition(cell)]) {
                            _this.buildings[_this.cellPosition(cell)].highlight(cell.hl, cell.hlOrientation);
                        }
                        else if (cell.ref && _this.buildings[_this.cellPosition(cell.ref)]) {
                            _this.buildings[_this.cellPosition(cell.ref)].highlight(cell.hl, cell.hlOrientation);
                        }
                    });
                    this.selectArea = this.squareArea(cells);
                };
                MapComponent.prototype.hightlightZone = function (cells, shape) {
                    var _this = this;
                    if (!cells || cells.length == 0) {
                        return;
                    }
                    cells.forEach(function (cell) {
                        if (_this.buildings[_this.cellPosition(cell)]) {
                            _this.buildings[_this.cellPosition(cell)].highlight(cell.hl, cell.hlOrientation);
                        }
                        else if (cell.ref && _this.buildings[_this.cellPosition(cell.ref)]) {
                            _this.buildings[_this.cellPosition(cell.ref)].highlight(cell.hl, cell.hlOrientation);
                        }
                    });
                    if (shape == 'square') {
                        this.hlArea = this.squareArea(cells);
                    }
                    else if (shape == 'path') {
                        this.pathArea(cells);
                    }
                };
                MapComponent.prototype.squareArea = function (cells) {
                    if (!cells || cells.length == 0) {
                        return this.defaultArea;
                    }
                    var height = (cells[cells.length - 1].lineIndex - cells[0].lineIndex + 1) * 16;
                    var width = (cells[cells.length - 1].colIndex - cells[0].colIndex + 1) * 16;
                    this.orientation = cells[0].hlOrientation;
                    return {
                        'position': 'absolute',
                        'top': cells[0].lineIndex * 16 + 'px',
                        'left': cells[0].colIndex * 16 + 'px',
                        'width': width + 'px',
                        'height': height + 'px'
                    };
                };
                MapComponent.prototype.pathArea = function (cells) {
                    var mainCells = [];
                    var subCells = [];
                    var horizontalLineIndex = null;
                    var verticalColIndex = null;
                    cells.forEach(function (cell) {
                        if (!horizontalLineIndex) {
                            horizontalLineIndex = cell.lineIndex;
                        }
                        if (!verticalColIndex) {
                            verticalColIndex = cell.colIndex;
                        }
                        if (cell.lineIndex == horizontalLineIndex || cell.colIndex == verticalColIndex) {
                            mainCells.push(cell);
                        }
                        else {
                            subCells.push(cell);
                        }
                    });
                    mainCells.sort(function (a, b) {
                        if (a.lineIndex == b.lineIndex) {
                            return a.colIndex - b.colIndex;
                        }
                        return a.lineIndex - b.lineIndex;
                    });
                    subCells.sort(function (a, b) {
                        if (a.lineIndex == b.lineIndex) {
                            return a.colIndex - b.colIndex;
                        }
                        return a.lineIndex - b.lineIndex;
                    });
                    this.hlArea = this.squareArea(mainCells);
                    this.hlSubArea = this.squareArea(subCells);
                };
                MapComponent.prototype.removeHighlight = function (cells) {
                    var _this = this;
                    cells.forEach(function (cell) {
                        if (_this.buildings[_this.cellPosition(cell)]) {
                            _this.buildings[_this.cellPosition(cell)].highlight(null);
                        }
                        else if (cell.ref && _this.buildings[_this.cellPosition(cell.ref)]) {
                            _this.buildings[_this.cellPosition(cell.ref)].highlight(null);
                        }
                    });
                    this.resetZones();
                };
                MapComponent.prototype.getCurrentCellFromMousePos = function ($event) {
                    var mapPos = this.map.nativeElement.getBoundingClientRect();
                    var colIndex = Math.floor(($event.clientX - mapPos.left) / 16);
                    var lineIndex = Math.floor(($event.clientY - mapPos.top) / 16);
                    var lines = this.renderer.getLines();
                    if (lines && lines.length > lineIndex && lines[lineIndex].cells.length > colIndex) {
                        return this.renderer.getLines()[lineIndex].cells[colIndex];
                    }
                    return null;
                };
                MapComponent.prototype.onMouseMove = function ($event) {
                    var cell = this.getCurrentCellFromMousePos($event);
                    if (cell == null) {
                        return;
                    }
                    var newPos = cell.lineIndex + "x" + cell.colIndex;
                    if (newPos != this.currentPosition) {
                        this.currentPosition = newPos;
                        this.HQ.alertCellMouseEvent($event, "enter", cell);
                    }
                };
                MapComponent.prototype.mouseEnter = function ($event, cell) {
                    this.HQ.alertCellMouseEvent($event, "enter", cell);
                };
                MapComponent.prototype.mouseDown = function ($event) {
                    var cell = this.getCurrentCellFromMousePos($event);
                    if (cell) {
                        console.log("mouse down on cell " + cell.lineIndex + "," + cell.colIndex);
                        this.HQ.alertCellMouseEvent($event, "down", cell);
                    }
                };
                MapComponent.prototype.mouseUp = function ($event) {
                    var cell = this.getCurrentCellFromMousePos($event);
                    if (cell) {
                        this.HQ.alertCellMouseEvent($event, "up", cell);
                    }
                };
                MapComponent.prototype.rightClick = function ($event) {
                    var cell = this.getCurrentCellFromMousePos($event);
                    this.HQ.alertMainMouseEvent($event, "click");
                    console.log(cell);
                    $event.preventDefault();
                };
                Object.defineProperty(MapComponent.prototype, "getHLArea", {
                    get: function () {
                        return this.hlArea;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MapComponent.prototype, "getHLSubArea", {
                    get: function () {
                        return this.hlSubArea;
                    },
                    enumerable: true,
                    configurable: true
                });
                MapComponent.prototype.buildingLocation = function (cell) {
                    return {
                        'position': 'absolute',
                        'top': (cell.lineIndex * 16) + 'px',
                        'left': (cell.colIndex * 16) + 'px'
                    };
                };
                MapComponent.prototype.buildingSize = function (cell) {
                    return {
                        'width': (cell.getBuilding().width * 16) + 'px',
                        'height': (cell.getBuilding().height * 16) + 'px'
                    };
                };
                MapComponent.prototype.getBuildings = function () {
                    var res = [];
                    for (var _i = 0, _a = Object.keys(this.buildings); _i < _a.length; _i++) {
                        var key = _a[_i];
                        res.push(this.buildings[key]);
                    }
                    return res;
                };
                MapComponent.prototype.hlOrientation = function (cell) {
                    return cell.hlOrientation;
                };
                MapComponent.prototype.cellPosition = function (cell) {
                    return cell.lineIndex + "x" + cell.colIndex;
                };
                MapComponent.prototype.getMapWidth = function () {
                    var lines = this.renderer.getLines();
                    if (lines.length > 0) {
                        return lines[0].getWidth();
                    }
                    return 0;
                };
                MapComponent.prototype.getMapHeight = function () {
                    var lines = this.renderer.getLines();
                    if (lines) {
                        return lines.length * 16;
                    }
                    return 0;
                };
                __decorate([
                    core_1.ViewChild('map'), 
                    __metadata('design:type', core_1.ElementRef)
                ], MapComponent.prototype, "map", void 0);
                MapComponent = __decorate([
                    core_1.Component({
                        selector: 'map-container',
                        directives: [contextmenu_directive_1.ContextMenuDirective],
                        template: "\n\t\t<ng-content></ng-content>\n\t\t<map #map style=\"width:{{getMapWidth()}}px;height:{{getMapHeight()}}px\" class=\"background\"\n\t\t\t(mousemove)=\"onMouseMove($event)\"\n\t\t\t(mousedown)=\"mouseDown($event)\"\n\t\t\t(mouseup)=\"mouseUp($event)\"\n\t\t\t(contextmenu)=\"rightClick($event)\">\n\t\t\t<div *ngFor=\"#cell of getBuildings()\" class=\"building\" [ngStyle]=\"buildingLocation(cell)\" id=\"{{cellPosition(cell)}}\"\n\t\t\t\t\t(mouseenter)=\"mouseEnter($event, cell)\">\n\t\t\t\t<div class=\"{{cell.getBuilding().name}}\" [ngStyle]=\"buildingSize(cell)\">\n\t\t\t\t</div>\n\t\t\t\t<div *ngIf=\"cell.hl\" class=\"hl hl-{{cell.hl}}\" [ngStyle]=\"buildingSize(cell)\">\n\t\t\t\t\t\t<div class=\"glyphicon orientation\" [ngClass]=\"{ 'glyphicon-chevron-up' : (cell.hlOrientation == 'v' ||  cell.hlOrientation == 'n'),\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t    'glyphicon-chevron-right' : (cell.hlOrientation == 'h' ||  cell.hlOrientation == 'e'),\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'glyphicon-chevron-down' : cell.hlOrientation == 's',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t    'glyphicon-chevron-left' : cell.hlOrientation == 'w'}\">\n\t\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"hl-area hl-green glyphicon orientation\" [ngStyle]=\"getHLArea\"\n\t\t\t\t[ngClass]=\"{ 'glyphicon-chevron-up' : (orientation == 'v' ||  orientation == 'n'),\n\t\t\t\t\t    'glyphicon-chevron-right' : (orientation == 'h' ||  orientation == 'e'),\n\t\t\t\t\t\t'glyphicon-chevron-down' : orientation == 's',\n\t\t\t\t\t    'glyphicon-chevron-left' : orientation == 'w'}\"></div>\n\t\t\t<div class=\"hl-area hl-green\" [ngStyle]=\"getHLSubArea\"></div>\n\t\t\t<div class=\"select-area\" [ngStyle]=\"selectArea\" [context-menu]=\"'select'\" [contextData]=\"selectedCells\"></div>\n\t\t</map>\n\t"
                    }), 
                    __metadata('design:paramtypes', [Renderer_1.Renderer, Headquarter_1.Headquarter, SelectService_1.SelectService])
                ], MapComponent);
                return MapComponent;
            }());
            exports_1("MapComponent", MapComponent);
        }
    }
});
//# sourceMappingURL=MapComponent.js.map