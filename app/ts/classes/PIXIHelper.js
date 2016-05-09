System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PIXIHelper;
    return {
        setters:[],
        execute: function() {
            PIXIHelper = (function () {
                function PIXIHelper() {
                    this.defaultBounds = {
                        'x': 0,
                        'y': 0,
                        'width': 0,
                        'height': 0
                    };
                }
                PIXIHelper.prototype.initPIXICanvas = function (parentEl, width, height) {
                    this.renderer = PIXI.autoDetectRenderer(width, height);
                    this.parentEl = parentEl;
                    this.parentEl.appendChild(this.renderer.view);
                    this.loadStage();
                };
                PIXIHelper.prototype.initHLZones = function () {
                    this.hlArea = this.createHighlightSprite();
                    this.hlSubArea = this.createHighlightSprite();
                    this.selectArea = this.createSelectSprite();
                    this.stage.addChild(this.hlArea);
                    this.stage.addChild(this.hlSubArea);
                    this.stage.addChild(this.selectArea);
                };
                PIXIHelper.prototype.loadStage = function () {
                    //create the stage
                    this.stage = new PIXI.Container();
                    var renderer = this.renderer;
                    var stage = this.stage;
                    animate();
                    function animate() {
                        renderer.render(stage);
                        requestAnimationFrame(animate);
                    }
                };
                PIXIHelper.prototype.loadCanvasBackground = function () {
                    var backgroundTile = new PIXI.extras.TilingSprite(this.getTexture('grass'), 16, 16);
                    backgroundTile.width = this.renderer.width;
                    backgroundTile.height = this.renderer.height;
                    backgroundTile.interactive = true;
                    this.stage.addChild(backgroundTile);
                    return backgroundTile;
                };
                //SPRITES
                PIXIHelper.prototype.createSprite = function (cell) {
                    if (cell.getBuilding()) {
                        var sprite = new PIXI.Sprite(this.getTexture(cell.getBuilding().name));
                        sprite.position.x = cell.colIndex * 16;
                        sprite.position.y = cell.lineIndex * 16;
                        sprite.width = cell.getBuilding().width * 16;
                        sprite.height = cell.getBuilding().height * 16;
                        sprite.char = cell.getBuilding().char;
                    }
                    return sprite;
                };
                PIXIHelper.prototype.updateSprite = function (sprite, cell) {
                    if (cell.getBuilding()) {
                        sprite.texture = this.getTexture(cell.getBuilding().name);
                        sprite.position.x = cell.colIndex * 16;
                        sprite.position.y = cell.lineIndex * 16;
                        sprite.width = cell.getBuilding().width * 16;
                        sprite.height = cell.getBuilding().height * 16;
                        sprite.char = cell.getBuilding().char;
                        this.updateSpriteTint(sprite, cell);
                    }
                    return sprite;
                };
                PIXIHelper.prototype.updateSpriteTint = function (sprite, cell) {
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
                PIXIHelper.prototype.updateBuilding = function (sprite, cell) {
                    return this.updateSprite(sprite, cell);
                };
                PIXIHelper.prototype.createBuilding = function (cell) {
                    var sprite = this.createSprite(cell);
                    this.stage.addChild(sprite);
                    return sprite;
                };
                PIXIHelper.prototype.deleteBuilding = function (sprite) {
                    this.stage.removeChild(sprite);
                };
                //SPRITE BOUNDS
                PIXIHelper.prototype.setSpriteBounds = function (sprite, cells, shape) {
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
                PIXIHelper.prototype.setPathBounds = function (cells, shape) {
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
                PIXIHelper.prototype.setBounds = function (sprite, bounds) {
                    sprite.position.x = bounds.x;
                    sprite.position.y = bounds.y;
                    sprite.width = bounds.width;
                    sprite.height = bounds.height;
                };
                PIXIHelper.prototype.squareArea = function (cells) {
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
                PIXIHelper.prototype.pathArea = function (cells) {
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
                PIXIHelper.prototype.setOrientation = function (sprite, orientation) {
                    if (!orientation) {
                        sprite.texture = this.getTexture("grass");
                    }
                    if (orientation == 'v' || orientation == 'n') {
                        sprite.texture = this.getTexture("arrow-top");
                    }
                    else if (orientation == 'h' || orientation == 'e') {
                        sprite.texture = this.getTexture("arrow-right");
                    }
                    else if (orientation == 's') {
                        sprite.texture = this.getTexture("arrow-down");
                    }
                    else if (orientation == 'w') {
                        sprite.texture = this.getTexture("arrow-left");
                    }
                };
                // ZONES
                PIXIHelper.prototype.getSelectArea = function () {
                    return this.selectArea;
                };
                PIXIHelper.prototype.createHighlightSprite = function () {
                    var sprite = new PIXI.extras.TilingSprite(this.getTexture("grass"), 16, 16);
                    sprite.tint = 0x33DD33;
                    sprite.alpha = 0.5;
                    this.setSpriteBounds(sprite, null, null);
                    return sprite;
                };
                PIXIHelper.prototype.createSelectSprite = function () {
                    var sprite = new PIXI.extras.TilingSprite(this.getTexture("blank"), 16, 16);
                    sprite.tint = 0xCCCCEE;
                    sprite.alpha = 0.5;
                    this.setSpriteBounds(sprite, null, null);
                    return sprite;
                };
                PIXIHelper.prototype.selectZone = function (cells) {
                    this.setSpriteBounds(this.selectArea, cells, "");
                };
                PIXIHelper.prototype.highlightZone = function (cells, shape) {
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
                PIXIHelper.prototype.removeHighlight = function (cells) {
                    this.resetZones();
                };
                PIXIHelper.prototype.resetZones = function () {
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
                PIXIHelper.prototype.getTexture = function (image) {
                    if (!PIXIHelper.prototype.TEXTURES[image]) {
                        PIXIHelper.prototype.TEXTURES[image] = PIXI.Texture.fromImage('img/' + image + '.gif');
                    }
                    return PIXIHelper.prototype.TEXTURES[image];
                };
                return PIXIHelper;
            }());
            exports_1("PIXIHelper", PIXIHelper);
            PIXIHelper.prototype.TEXTURES = {};
        }
    }
});
//# sourceMappingURL=PIXIHelper.js.map