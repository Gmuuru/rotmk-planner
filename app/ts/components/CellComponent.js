System.register(["angular2/core", "../services/Headquarter"], function(exports_1, context_1) {
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
    var core_1, Headquarter_1;
    var CellComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            }],
        execute: function() {
            CellComponent = (function () {
                function CellComponent(HQ) {
                    this.HQ = HQ;
                }
                CellComponent.prototype.hlOrientation = function () {
                    return this.cell.hlOrientation;
                };
                CellComponent.prototype.mouseEnter = function ($event) {
                    this.HQ.alertCellMouseEvent($event, "enter", this.cell);
                };
                CellComponent.prototype.mouseDown = function ($event) {
                    this.HQ.alertCellMouseEvent($event, "down", this.cell);
                };
                CellComponent.prototype.mouseUp = function ($event) {
                    this.HQ.alertCellMouseEvent($event, "up", this.cell);
                };
                CellComponent.prototype.rightClick = function ($event) {
                    this.HQ.alertMainMouseEvent($event, "click");
                    console.log(this.cell);
                    $event.preventDefault();
                };
                CellComponent = __decorate([
                    core_1.Component({
                        selector: 'cell-block',
                        inputs: ['cell'],
                        template: "\n\t\t<div style=\"width:{{cell.getBuildingWidth()}}px; height:{{cell.getBuildingHeight()}}px\" class=\"building {{cell.getBuildingName()}}\" \n\t\t\t(mousedown)=\"mouseDown($event)\"\n\t\t\t(mouseup)=\"mouseUp($event)\"\n\t\t\t(mouseenter)=\"mouseEnter($event)\"\n\t\t\t(contextmenu)=\"rightClick($event)\"></div>\n\t\t<div [hidden]=\"!cell.hl\" class=\"hl hl-{{cell.hl}}\"\n\t\t\t(mousedown)=\"mouseDown($event)\"\n\t\t\t(mouseup)=\"mouseUp($event)\"\n\t\t\t(mouseenter)=\"mouseEnter($event)\"\n\t\t\t(contextmenu)=\"rightClick($event)\">\n\t\t\t\t<div class=\"glyphicon orientation\" [ngClass]=\"{ 'glyphicon-chevron-up' : (hlOrientation() == 'v' ||  hlOrientation() == 'n'),\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t    'glyphicon-chevron-right' : (hlOrientation() == 'h' ||  hlOrientation() == 'e'),\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'glyphicon-chevron-down' : hlOrientation() == 's',\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t    'glyphicon-chevron-left' : hlOrientation() == 'w'}\"></div>\n\t\t\t</div>\n\t"
                    }), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter])
                ], CellComponent);
                return CellComponent;
            }());
            exports_1("CellComponent", CellComponent);
        }
    }
});
//# sourceMappingURL=CellComponent.js.map