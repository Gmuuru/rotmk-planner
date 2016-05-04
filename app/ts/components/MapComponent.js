System.register(["angular2/core", "../services/Headquarter", "../services/SelectService", "../classes/PIXIHelper", "../classes/Renderer", "../components/Cell", "../directives/contextmenu.directive"], function(exports_1, context_1) {
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
    var core_1, Headquarter_1, SelectService_1, PIXIHelper_1, Renderer_1, Cell_1, contextmenu_directive_1;
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
            function (PIXIHelper_1_1) {
                PIXIHelper_1 = PIXIHelper_1_1;
            },
            function (Renderer_1_1) {
                Renderer_1 = Renderer_1_1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
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
                    this.mapSize = { width: 0, height: 0 };
                    this.defaultBounds = {
                        'x': 0,
                        'y': 0,
                        'width': 0,
                        'height': 0
                    };
                    this.reset();
                    this.renderer.reset$.subscribe(function (inq) {
                        _this.reset();
                    });
                    this.renderer.loadIsDone$.subscribe(function (lines) {
                        _this.initPIXIStage(lines);
                    });
                    this.renderer.cellUpdate$.subscribe(function (inputData) {
                        try {
                            var action = inputData.action;
                            var cell = inputData.cell;
                            var position = _this.cellPosition(cell);
                            switch (action) {
                                case 'build':
                                case 'update': {
                                    _this.insertUpdateBuilding(cell);
                                    break;
                                }
                                case 'delete': {
                                    _this.deleteBuilding(cell);
                                    break;
                                }
                            }
                            _this.HQ.broadcastBuildingList(_this.buildings);
                        }
                        catch (err) {
                            console.log(err);
                            _this.HQ.log(err);
                        }
                    });
                    this.renderer.zoneHightlight$.subscribe(function (inputData) {
                        try {
                            var action = inputData.action;
                            var cells = inputData.cells;
                            var shape = inputData.shape;
                            _this.handleBuildingsHighlight(cells);
                            if (action == "highlight") {
                                _this.highlightZone(cells, shape);
                            }
                            else if (action == "remove") {
                                _this.removeHighlight(cells);
                            }
                            else if (action == "select") {
                                _this.selectZone(cells);
                            }
                        }
                        catch (err) {
                            console.log(err);
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
                            console.log(err);
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
                    if (this.selectArea) {
                        this.setSpriteBounds(this.selectArea, null, null);
                    }
                    if (this.hlArea) {
                        this.setSpriteBounds(this.hlArea, null, null);
                    }
                    if (this.hlSubArea) {
                        this.setSpriteBounds(this.hlSubArea, null, null);
                    }
                };
                MapComponent.prototype.handleBuildingsHighlight = function (cells) {
                    var _this = this;
                    if (!cells || cells.length == 0) {
                        return;
                    }
                    var blankCell = new Cell_1.Cell(0, 0, " ");
                    //reseting selected buildings
                    if (this.selectedCells) {
                        this.selectedCells.forEach(function (cell) {
                            if (_this.buildings[_this.cellPosition(cell)]) {
                                _this.updateSpriteTint(_this.buildings[_this.cellPosition(cell)], blankCell);
                            }
                            else if (cell.ref && _this.buildings[_this.cellPosition(cell.ref)]) {
                                _this.updateSpriteTint(_this.buildings[_this.cellPosition(cell.ref)], blankCell);
                            }
                        });
                    }
                    cells.forEach(function (cell) {
                        if (_this.buildings[_this.cellPosition(cell)]) {
                            _this.updateSpriteTint(_this.buildings[_this.cellPosition(cell)], cell);
                        }
                        else if (cell.ref && _this.buildings[_this.cellPosition(cell.ref)]) {
                            _this.updateSpriteTint(_this.buildings[_this.cellPosition(cell.ref)], cell);
                        }
                    });
                };
                MapComponent.prototype.selectZone = function (cells) {
                    this.setSpriteBounds(this.selectArea, cells, "");
                };
                MapComponent.prototype.highlightZone = function (cells, shape) {
                    if (!cells || cells.length == 0) {
                        return;
                    }
                    if (shape == 'square') {
                        this.setSpriteBounds(this.hlArea, cells, shape);
                    }
                    else if (shape == 'path') {
                        this.setPathBounds(cells, shape);
                    }
                };
                MapComponent.prototype.removeHighlight = function (cells) {
                    this.resetZones();
                };
                MapComponent.prototype.onMouseMove = function (mouseEvent) {
                    var originalEvent = mouseEvent.data.originalEvent;
                    var cell = this.getCurrentCellFromMousePos(originalEvent);
                    if (cell == null) {
                        return;
                    }
                    var newPos = cell.lineIndex + "x" + cell.colIndex;
                    if (newPos != this.currentPosition) {
                        this.currentPosition = newPos;
                        this.HQ.alertCellMouseEvent(originalEvent, "enter", cell);
                    }
                };
                MapComponent.prototype.mouseEnter = function ($event, cell) {
                    this.HQ.alertCellMouseEvent($event, "enter", cell);
                };
                MapComponent.prototype.mouseDown = function (mouseEvent) {
                    var originalEvent = mouseEvent.data.originalEvent;
                    var cell = this.getCurrentCellFromMousePos(originalEvent);
                    if (cell) {
                        this.HQ.alertCellMouseEvent(originalEvent, "down", cell);
                    }
                };
                MapComponent.prototype.mouseUp = function (mouseEvent) {
                    var originalEvent = mouseEvent.data.originalEvent;
                    var cell = this.getCurrentCellFromMousePos(originalEvent);
                    if (cell) {
                        this.HQ.alertCellMouseEvent(originalEvent, "up", cell);
                    }
                };
                MapComponent.prototype.rightClick = function ($event) {
                    if (!this.isInSprite(this.selectArea, $event)) {
                        var cell = this.getCurrentCellFromMousePos($event);
                        this.HQ.alertMainMouseEvent($event, "click");
                        $event.preventDefault();
                    }
                    else {
                        console.log($event);
                        this.HQ.openContextMenu($event, "select", this.selectedCells);
                        $event.preventDefault();
                    }
                };
                MapComponent.prototype.cellPosition = function (cell) {
                    return cell.lineIndex + "x" + cell.colIndex;
                };
                MapComponent.prototype.initPIXIStage = function (lines) {
                    this.cleanPreviousStage();
                    this.mapSize.width = this.getMapWidth(lines);
                    this.mapSize.height = this.getMapHeight(lines);
                    this.PIXIRenderer = PIXIHelper_1.PIXIHelper.createPIXIRenderer(this.map.nativeElement, this.mapSize.width, this.mapSize.height);
                    var background = PIXIHelper_1.PIXIHelper.createBackground(this.PIXIRenderer.width, this.PIXIRenderer.height, {
                        image: 'grass',
                        width: 16,
                        height: 16
                    });
                    background.on('mousemove', this.onMouseMove.bind(this));
                    background.on('mousedown', this.mouseDown.bind(this));
                    background.on('mouseup', this.mouseUp.bind(this));
                    //create the stage
                    this.stage = PIXIHelper_1.PIXIHelper.loadStage(this.PIXIRenderer);
                    this.stage.addChild(background);
                    this.hlArea = this.createHighlightSprite();
                    this.hlSubArea = this.createHighlightSprite();
                    this.selectArea = this.createSelectSprite();
                    this.stage.addChild(this.hlArea);
                    this.stage.addChild(this.hlSubArea);
                    this.stage.addChild(this.selectArea);
                };
                MapComponent.prototype.cleanPreviousStage = function () {
                    while (this.map.nativeElement.firstChild) {
                        this.map.nativeElement.removeChild(this.map.nativeElement.firstChild);
                    }
                };
                MapComponent.prototype.createHighlightSprite = function () {
                    var sprite = new PIXI.extras.TilingSprite(PIXIHelper_1.PIXIHelper.getTexture("grass"), 16, 16);
                    sprite.tint = 0x33DD33;
                    sprite.alpha = 0.5;
                    this.setSpriteBounds(sprite, null, null);
                    return sprite;
                };
                MapComponent.prototype.createSelectSprite = function () {
                    var sprite = new PIXI.extras.TilingSprite(PIXIHelper_1.PIXIHelper.getTexture("blank"), 16, 16);
                    sprite.tint = 0xCCCCEE;
                    sprite.alpha = 0.5;
                    this.setSpriteBounds(sprite, null, null);
                    return sprite;
                };
                MapComponent.prototype.setSpriteBounds = function (sprite, cells, shape) {
                    var bounds = null;
                    var orientation = null;
                    if (cells) {
                        bounds = this.squareArea(cells);
                        orientation = cells[0].hlOrientation;
                    }
                    else {
                        bounds = this.defaultBounds;
                    }
                    this.setBounds(sprite, bounds);
                    this.setOrientation(sprite, orientation);
                };
                MapComponent.prototype.setPathBounds = function (cells, shape) {
                    if (cells) {
                        var cellArrays = this.pathArea(cells);
                        this.setBounds(this.hlArea, this.squareArea(cellArrays.main));
                        this.setBounds(this.hlSubArea, this.squareArea(cellArrays.sub));
                    }
                    else {
                        this.setBounds(this.hlArea, this.defaultBounds);
                        this.setBounds(this.hlSubArea, this.defaultBounds);
                    }
                };
                MapComponent.prototype.setBounds = function (sprite, bounds) {
                    sprite.position.x = bounds.x;
                    sprite.position.y = bounds.y;
                    sprite.width = bounds.width;
                    sprite.height = bounds.height;
                };
                MapComponent.prototype.squareArea = function (cells) {
                    if (!cells || cells.length == 0) {
                        return this.defaultBounds;
                    }
                    var height = (cells[cells.length - 1].lineIndex - cells[0].lineIndex + 1) * 16;
                    var width = (cells[cells.length - 1].colIndex - cells[0].colIndex + 1) * 16;
                    var obj = {
                        'y': cells[0].lineIndex * 16,
                        'x': cells[0].colIndex * 16,
                        'width': width,
                        'height': height
                    };
                    return obj;
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
                    return { main: mainCells, sub: subCells };
                };
                MapComponent.prototype.setOrientation = function (sprite, orientation) {
                    if (!orientation) {
                        sprite.texture = PIXIHelper_1.PIXIHelper.getTexture("grass");
                    }
                    if (orientation == 'v' || orientation == 'n') {
                        sprite.texture = PIXIHelper_1.PIXIHelper.getTexture("arrow-top");
                    }
                    else if (orientation == 'h' || orientation == 'e') {
                        sprite.texture = PIXIHelper_1.PIXIHelper.getTexture("arrow-right");
                    }
                    else if (orientation == 's') {
                        sprite.texture = PIXIHelper_1.PIXIHelper.getTexture("arrow-down");
                    }
                    else if (orientation == 'w') {
                        sprite.texture = PIXIHelper_1.PIXIHelper.getTexture("arrow-left");
                    }
                };
                MapComponent.prototype.insertUpdateBuilding = function (cell) {
                    var position = this.cellPosition(cell);
                    var sprite = this.buildings[position];
                    if (sprite) {
                        this.updateSprite(sprite, cell);
                    }
                    else {
                        var sprite = this.createSprite(cell);
                        if (sprite) {
                            this.stage.addChild(sprite);
                            this.buildings[position] = sprite;
                        }
                    }
                };
                MapComponent.prototype.deleteBuilding = function (cell) {
                    var position = this.cellPosition(cell);
                    var sprite = this.buildings[position];
                    if (sprite) {
                        this.stage.removeChild(sprite);
                        delete this.buildings[position];
                    }
                };
                MapComponent.prototype.createSprite = function (cell) {
                    if (cell.getBuilding()) {
                        var sprite = new PIXI.Sprite(PIXIHelper_1.PIXIHelper.getTexture(cell.getBuilding().name));
                        sprite.position.x = cell.colIndex * 16;
                        sprite.position.y = cell.lineIndex * 16;
                        sprite.width = cell.getBuilding().width * 16;
                        sprite.height = cell.getBuilding().height * 16;
                        sprite.char = cell.getBuilding().char;
                        return sprite;
                    }
                };
                MapComponent.prototype.updateSprite = function (sprite, cell) {
                    if (cell.getBuilding()) {
                        sprite.texture = PIXIHelper_1.PIXIHelper.getTexture(cell.getBuilding().name);
                        sprite.position.x = cell.colIndex * 16;
                        sprite.position.y = cell.lineIndex * 16;
                        sprite.width = cell.getBuilding().width * 16;
                        sprite.height = cell.getBuilding().height * 16;
                        sprite.char = cell.getBuilding().char;
                        this.updateSpriteTint(sprite, cell);
                    }
                };
                MapComponent.prototype.updateSpriteTint = function (sprite, cell) {
                    if (cell.hl == 'green') {
                        sprite.tint = 0x33DD33;
                    }
                    else if (cell.hl == 'red') {
                        sprite.tint = 0xDD3333;
                    }
                    else {
                        sprite.tint = 0xFFFFFF;
                    }
                };
                MapComponent.prototype.getMapWidth = function (lines) {
                    if (lines && lines.length > 0) {
                        return lines[0].getWidth();
                    }
                    return 0;
                };
                MapComponent.prototype.getMapHeight = function (lines) {
                    if (lines) {
                        return lines.length * 16;
                    }
                    return 0;
                };
                MapComponent.prototype.getCurrentCellFromMousePos = function ($event) {
                    var mapPos = this.map.nativeElement.getBoundingClientRect();
                    var colIndex = Math.floor(($event.clientX - mapPos.left) / 16);
                    var lineIndex = Math.floor(($event.clientY - mapPos.top) / 16);
                    if (colIndex < 0 || lineIndex < 0) {
                        return null;
                    }
                    var lines = this.renderer.getLines();
                    try {
                        if (lines && lines.length > lineIndex && lines[lineIndex].cells.length > colIndex) {
                            return this.renderer.getLines()[lineIndex].cells[colIndex];
                        }
                    }
                    catch (err) {
                        console.log(lineIndex, lines[lineIndex]);
                    }
                    return null;
                };
                MapComponent.prototype.isInSprite = function (sprite, $event) {
                    var mapPos = this.map.nativeElement.getBoundingClientRect();
                    var mousePosX = $event.clientX - mapPos.left;
                    var mousePosY = $event.clientY - mapPos.top;
                    return (sprite.position.x <= mousePosX && mousePosX <= (sprite.position.x + sprite.width)
                        && sprite.position.y <= mousePosY && mousePosY <= (sprite.position.y + sprite.height));
                };
                __decorate([
                    core_1.ViewChild('map'), 
                    __metadata('design:type', core_1.ElementRef)
                ], MapComponent.prototype, "map", void 0);
                MapComponent = __decorate([
                    core_1.Component({
                        selector: 'map-container',
                        directives: [contextmenu_directive_1.ContextMenuDirective],
                        template: "\n\t\t<ng-content></ng-content>\n\t\t<map #map style=\"width:{{mapSize.width}}px;height:{{mapSize.height}}px\" (contextmenu)=\"rightClick($event)\">\n\t\t</map>\n\t"
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