System.register(["angular2/core", 'rxjs/Subject', "./ProgressiveLoader", "../components/Cell"], function(exports_1, context_1) {
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
    var core_1, Subject_1, ProgressiveLoader_1, Cell_1;
    var Renderer;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (ProgressiveLoader_1_1) {
                ProgressiveLoader_1 = ProgressiveLoader_1_1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            }],
        execute: function() {
            Renderer = (function () {
                function Renderer(pl) {
                    this.pl = pl;
                    this._zoneHighlightSource = new Subject_1.Subject();
                    this._cellUpdateSource = new Subject_1.Subject();
                    this._resetSource = new Subject_1.Subject();
                    this.zoneHightlight$ = this._zoneHighlightSource.asObservable();
                    this.cellUpdate$ = this._cellUpdateSource.asObservable();
                    this.reset$ = this._resetSource.asObservable();
                    this.lines = [];
                    this.currentSource = [];
                }
                Renderer.prototype.loadMap = function (lines) {
                    this.reset();
                    this.storage = this.render(lines);
                    this.currentSource = this.storage;
                    this.pl.load(this.storage, this.lines);
                    this.currentSource = this.lines;
                };
                Renderer.prototype.render = function (lines) {
                    var _this = this;
                    this._resetSource.next("reset");
                    var bck = this.currentSource;
                    this.currentSource = lines;
                    this.currentSource.forEach(function (line) {
                        line.cells.forEach(function (cell) { _this.updateCell(cell, cell.getBuilding(), false); });
                    });
                    lines = this.currentSource;
                    this.currentSource = bck;
                    return lines;
                };
                Renderer.prototype.getLines = function () {
                    return this.lines;
                };
                Renderer.prototype.isOOB = function (startLinePos, startColPos, endLinePos, endColPos) {
                    return startLinePos < 0 || startColPos < 0 ||
                        endLinePos >= this.lines.length || endColPos >= this.lines[0].cells.length;
                };
                Renderer.prototype.getCellsInSquare = function (startLinePos, startColPos, endLinePos, endColPos) {
                    var res = [];
                    try {
                        var topLine = Math.max(0, Math.min(startLinePos, endLinePos));
                        var bottomLine = Math.min(this.lines.length - 1, Math.max(startLinePos, endLinePos));
                        var leftCol = Math.max(0, Math.min(startColPos, endColPos));
                        var rightCol = Math.min(this.lines[0].cells.length - 1, Math.max(startColPos, endColPos));
                        var res = [];
                        for (var i = topLine; i <= bottomLine; i++) {
                            for (var j = leftCol; j <= rightCol; j++) {
                                res.push(this.lines[i].cells[j]);
                            }
                        }
                        return res;
                    }
                    catch (err) {
                        console.log(err);
                        return [];
                    }
                };
                Renderer.prototype.getCellsInBuilding = function (linePos, colPos, building) {
                    var res = [];
                    var width = building.width;
                    var height = building.height;
                    if (linePos + height > this.lines.length || colPos + width > this.lines[0].cells.length) {
                        //out of bounds
                        return null;
                    }
                    for (var i = 0; i < height; i++) {
                        for (var j = 0; j < width; j++) {
                            res.push(this.lines[linePos + i].cells[colPos + j]);
                        }
                    }
                    return res;
                };
                Renderer.prototype.getCellsInLine = function (linePos, startColPos, endColPos, height) {
                    var res = [];
                    // on ne prend qu'en horizontal
                    var startCol = Math.min(startColPos, endColPos);
                    var endCol = Math.max(startColPos, endColPos);
                    for (var i = startCol; i <= endCol; i++) {
                        if (height >= 3 && linePos > 0) {
                            res.push(this.lines[linePos - 1].cells[i]);
                        }
                        res.push(this.lines[linePos].cells[i]);
                        if (height >= 2 && linePos < this.lines.length - 1) {
                            res.push(this.lines[linePos + 1].cells[i]);
                        }
                    }
                    return res;
                };
                Renderer.prototype.getCellsInCol = function (colPos, startLinePos, endLinePos, width) {
                    var res = [];
                    // on ne prend qu'en vertical
                    var startLine = Math.min(startLinePos, endLinePos);
                    var endLine = Math.max(startLinePos, endLinePos);
                    for (var i = startLine; i <= endLine; i++) {
                        if (width >= 3 && colPos > 0) {
                            res.push(this.lines[i].cells[colPos - 1]);
                        }
                        res.push(this.lines[i].cells[colPos]);
                        if (width >= 2 && colPos < this.lines[0].cells.length - 1) {
                            res.push(this.lines[i].cells[colPos + 1]);
                        }
                    }
                    return res;
                };
                Renderer.prototype.detectOOBForLargeRoads = function (cell, building) {
                    if (building.width >= 2 && cell.colIndex >= this.lines[0].cells.length - 1) {
                        return true;
                    }
                    if (building.width >= 3 && cell.colIndex == 0) {
                        return true;
                    }
                    if (building.height >= 2 && cell.lineIndex >= this.lines.length - 1) {
                        return true;
                    }
                    if (building.height >= 3 && cell.lineIndex == 0) {
                        return true;
                    }
                    return false;
                };
                Renderer.prototype.getCellsInPath = function (startLinePos, startColPos, endLinePos, endColPos) {
                    var res = [];
                    if (startLinePos == endLinePos && startColPos == endColPos) {
                        // une seule cell
                        res.push(this.lines[startLinePos].cells[startColPos]);
                    }
                    else if (startLinePos < endLinePos && startColPos <= endColPos) {
                        // en bas a droite
                        for (var i = startLinePos; i <= endLinePos; i++) {
                            res.push(this.lines[i].cells[startColPos]);
                        }
                        for (var j = startColPos + 1; j <= endColPos; j++) {
                            res.push(this.lines[endLinePos].cells[j]);
                        }
                    }
                    else if (startLinePos >= endLinePos && startColPos < endColPos) {
                        //en haut a droite
                        for (var i = startColPos; i <= endColPos; i++) {
                            res.push(this.lines[startLinePos].cells[i]);
                        }
                        for (var j = startLinePos - 1; j >= endLinePos; j--) {
                            res.push(this.lines[j].cells[endColPos]);
                        }
                    }
                    else if (startLinePos > endLinePos && startColPos >= endColPos) {
                        //en haut a gauche
                        for (var i = startLinePos; i >= endLinePos; i--) {
                            res.push(this.lines[i].cells[startColPos]);
                        }
                        for (var j = startColPos - 1; j >= endColPos; j--) {
                            res.push(this.lines[endLinePos].cells[j]);
                        }
                    }
                    else if (startLinePos <= endLinePos && startColPos > endColPos) {
                        //en bas a gauche
                        for (var i = startColPos; i >= endColPos; i--) {
                            res.push(this.lines[startLinePos].cells[i]);
                        }
                        for (var j = startLinePos + 1; j <= endLinePos; j++) {
                            res.push(this.lines[j].cells[endColPos]);
                        }
                    }
                    return res;
                };
                Renderer.prototype.reset = function () {
                    this.lines = [];
                    this.storage = [];
                    this.currentSource = this.storage;
                };
                Renderer.prototype.deleteBuilding = function (cell) {
                    var _this = this;
                    if (cell.ref) {
                        // on detruit tjs un building pas sa cellule de ref (top left)
                        this.deleteBuilding(cell.ref);
                    }
                    else {
                        cell.referenced.forEach(function (refCell) {
                            _this.deleteCell(refCell);
                        });
                        this.deleteCell(cell);
                    }
                };
                Renderer.prototype.deleteCell = function (cell) {
                    var originalChar = null;
                    if (cell.getBuilding()) {
                        originalChar = cell.getBuilding().char;
                    }
                    cell.ref = null;
                    cell.referenced = [];
                    this.updateCell(cell, Cell_1.Building.getDefaultBuilding(), true);
                    if (originalChar != null && (originalChar == '-' || originalChar == 't' || originalChar == '_')) {
                        // on met a jour les cellules autour
                        var sc = this.getSurroundingConfig(originalChar, cell.lineIndex, cell.colIndex);
                        this.renderSurroundingCells(cell.lineIndex, cell.colIndex, sc);
                    }
                };
                Renderer.prototype.copyCell = function (source, destination) {
                    this.updateCell(destination, source.getBuilding(), true);
                };
                Renderer.prototype.isBuildingEntirelyInSelection = function (cell, selection) {
                    try {
                        if (cell.ref) {
                            //we perform the check for the 'main' cell of the building
                            return this.isBuildingEntirelyInSelection(cell.ref, selection);
                        }
                        if (!cell.getBuilding()) {
                            console.log("Error : cell without building and without ref !");
                            return false;
                        }
                        var minLine = selection[0].lineIndex;
                        var minCol = selection[0].colIndex;
                        var maxLine = selection[selection.length - 1].lineIndex;
                        var maxCol = selection[selection.length - 1].colIndex;
                        if (cell.lineIndex < minLine || cell.colIndex < minCol ||
                            cell.lineIndex > maxLine || cell.colIndex > maxCol) {
                            //cell itself is not in selection
                            return false;
                        }
                        if (cell.getBuilding().width + cell.getBuilding().height > 2) {
                            // for buildings with size > 1x1
                            var maxBuildingLine = cell.lineIndex + cell.getBuilding().height - 1;
                            var maxBuildingCol = cell.colIndex + cell.getBuilding().width - 1;
                            if (maxBuildingLine < minLine || maxBuildingCol < minCol ||
                                maxBuildingLine > maxLine || maxBuildingCol > maxCol) {
                                //building is not in selection
                                return false;
                            }
                        }
                        return true;
                    }
                    catch (err) {
                        console.log("isBuildingEntirelyInSelection error : ", err);
                        return false;
                    }
                };
                Renderer.prototype.updateCell = function (cell, building, renderSurroundingCells) {
                    cell.setBuilding(building);
                    this.renderCell(cell, renderSurroundingCells);
                };
                Renderer.prototype.updateCellContent = function (cell, sc) {
                    cell.render(sc);
                    if (!cell.ref) {
                        if (cell.isEmpty()) {
                            this._cellUpdateSource.next({ action: "delete", cell: cell });
                        }
                        else {
                            this._cellUpdateSource.next({ action: "update", cell: cell });
                        }
                    }
                };
                Renderer.prototype.renderCell = function (cell, renderSurroundingCells) {
                    if (cell.ref) {
                        return;
                    }
                    var c = cell.getBuilding().char;
                    var sc = this.getSurroundingConfig(c, cell.lineIndex, cell.colIndex);
                    this.updateCellContent(cell, sc);
                    if (cell.getBuilding().width + cell.getBuilding().height > 2) {
                        this.spreadRefCell(cell);
                    }
                    if (renderSurroundingCells && c != null && (c == '-' || c == 't' || c == '_')) {
                        // il faut regenerer les cellules environnantes dans le cas des path
                        this.renderSurroundingCells(cell.lineIndex, cell.colIndex, sc);
                    }
                };
                Renderer.prototype.selectZone = function (cells) {
                    this._zoneHighlightSource.next({ action: 'select', cells: cells, shape: "" });
                };
                Renderer.prototype.renderHightlightZone = function (cells, shape) {
                    this._zoneHighlightSource.next({ action: 'highlight', cells: cells, shape: shape });
                };
                Renderer.prototype.removeHightlightZone = function (cells) {
                    this._zoneHighlightSource.next({ action: 'remove', cells: cells, shape: null });
                };
                Renderer.prototype.renderSurroundingCells = function (x, y, sc) {
                    if (sc == 0) {
                        return;
                    }
                    var cellToRender = null;
                    var scToRender = null;
                    if (sc == 1 || sc == 5 || sc == 7 || sc == 8 || sc == 11 || sc == 12 || sc == 14 || sc == 15) {
                        // top cell
                        cellToRender = this.lines[x - 1].cells[y];
                        scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
                        this.updateCellContent(cellToRender, scToRender);
                    }
                    if (sc == 2 || sc == 6 || sc == 8 || sc == 9 || sc == 11 || sc == 13 || sc == 14 || sc == 15) {
                        //right cell
                        cellToRender = this.lines[x].cells[y + 1];
                        scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
                        this.updateCellContent(cellToRender, scToRender);
                    }
                    if (sc == 3 || sc == 5 || sc == 9 || sc == 10 || sc == 12 || sc == 13 || sc == 14 || sc == 15) {
                        //bottom cell
                        cellToRender = this.lines[x + 1].cells[y];
                        scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
                        this.updateCellContent(cellToRender, scToRender);
                    }
                    if (sc == 4 || sc == 6 || sc == 7 || sc == 10 || sc == 11 || sc == 12 || sc == 13 || sc == 15) {
                        //left cell
                        cellToRender = this.lines[x].cells[y - 1];
                        scToRender = this.getSurroundingConfig(cellToRender.getBuilding().char, cellToRender.lineIndex, cellToRender.colIndex);
                        this.updateCellContent(cellToRender, scToRender);
                    }
                };
                /*	0   1				5		  7  8			 b		 c			 e		 f
                 * 0c0  c	c2	c	4c	c	6c6	 7c	 c8	c9	ac	bcb		cc	dcd		 ce		fcf
                 *  0			3		5				9	 a			 c	 d		 e		 f
                 *
                 *
                 */
                Renderer.prototype.getSurroundingConfig = function (c, x, y) {
                    var top = this.isIdentic(c, x - 1, y);
                    var bottom = this.isIdentic(c, x + 1, y);
                    var right = this.isIdentic(c, x, y + 1);
                    var left = this.isIdentic(c, x, y - 1);
                    if (!top && !bottom && !left && !right) {
                        //tout seul
                        return 0;
                    }
                    if (top) {
                        if (bottom) {
                            if (right) {
                                if (left) {
                                    return 15;
                                }
                                else {
                                    return 14;
                                }
                            }
                            else {
                                if (left) {
                                    return 12;
                                }
                                else {
                                    return 5;
                                }
                            }
                        }
                        else {
                            // !bottom
                            if (right) {
                                if (left) {
                                    return 11;
                                }
                                else {
                                    return 8;
                                }
                            }
                            else {
                                //!right
                                if (left) {
                                    return 7;
                                }
                                else {
                                    return 1;
                                }
                            }
                        }
                    }
                    else {
                        //!top
                        if (bottom) {
                            if (right) {
                                if (left) {
                                    return 13;
                                }
                                else {
                                    return 9;
                                }
                            }
                            else {
                                if (left) {
                                    return 10;
                                }
                                else {
                                    return 3;
                                }
                            }
                        }
                        else {
                            // !bottom
                            if (right) {
                                if (left) {
                                    return 6;
                                }
                                else {
                                    return 2;
                                }
                            }
                            else {
                                //!right
                                if (left) {
                                    return 4;
                                }
                                else {
                                    return 0;
                                }
                            }
                        }
                    }
                };
                Renderer.prototype.isIdentic = function (c, x, y) {
                    var source = this.currentSource;
                    if (x < 0 || x == source.length || y < 0 || y == source[0].cells.length) {
                        return false;
                    }
                    if (!source[x].cells[y].getBuilding()) {
                        return false;
                    }
                    return c == source[x].cells[y].getBuilding().char;
                };
                Renderer.prototype.spreadRefCell = function (ref) {
                    var source = this.currentSource;
                    var refLine = ref.lineIndex;
                    var refCol = ref.colIndex;
                    var refWidth = ref.getBuilding().width;
                    var refHeight = ref.getBuilding().height;
                    var lineOffset = 0;
                    var colOffset = 0;
                    while (lineOffset < refHeight && (refLine + lineOffset) < source.length) {
                        colOffset = (lineOffset == 0) ? 1 : 0;
                        while (colOffset < refWidth && (refCol + colOffset) < source[0].cells.length) {
                            var cell = source[refLine + lineOffset].cells[refCol + colOffset];
                            cell.setRef(ref);
                            colOffset++;
                        }
                        lineOffset++;
                    }
                };
                Renderer = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [ProgressiveLoader_1.ProgressiveLoader])
                ], Renderer);
                return Renderer;
            }());
            exports_1("Renderer", Renderer);
        }
    }
});
//# sourceMappingURL=Renderer.js.map