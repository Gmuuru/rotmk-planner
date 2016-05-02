System.register(["angular2/core", "./Cell", "./CellComponent"], function(exports_1, context_1) {
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
    var core_1, Cell_1, CellComponent_1;
    var Line, LineComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (CellComponent_1_1) {
                CellComponent_1 = CellComponent_1_1;
            }],
        execute: function() {
            Line = (function () {
                function Line(index, size) {
                    this.index = index;
                    this.size = size;
                    this.cells = [];
                }
                Line.prototype.push = function (cell) {
                    this.cells.push(cell);
                };
                Line.prototype.setCells = function (cells) {
                    this.cells = cells;
                };
                Line.prototype.complete = function () {
                    while (this.cells.length < this.size) {
                        this.cells.push(new Cell_1.Cell(this.index, this.cells.length, ""));
                    }
                };
                Line.prototype.getWidth = function () {
                    return this.cells.length * 16;
                };
                return Line;
            }());
            exports_1("Line", Line);
            LineComponent = (function () {
                function LineComponent() {
                }
                LineComponent = __decorate([
                    core_1.Component({
                        selector: 'line-block',
                        inputs: ['line'],
                        directives: [CellComponent_1.CellComponent],
                        template: "\n\t<cell-block *ngFor=\"#cell of line.cells\" [cell]=\"cell\" title=\"{{cell.getTitle()}}\">\n\t</cell-block>\n\t"
                    }), 
                    __metadata('design:paramtypes', [])
                ], LineComponent);
                return LineComponent;
            }());
            exports_1("LineComponent", LineComponent);
        }
    }
});
//# sourceMappingURL=Line.js.map