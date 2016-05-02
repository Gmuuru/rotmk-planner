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
    var TemplatesMenu, Template;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            }],
        execute: function() {
            TemplatesMenu = (function () {
                function TemplatesMenu(HQ) {
                    this.HQ = HQ;
                }
                TemplatesMenu.prototype.click = function (template) {
                    console.log(template.content);
                    var cells = [];
                    template.content.forEach(function (line) {
                        line.cells.forEach(function (cell) {
                            cells.push(cell);
                        });
                    });
                    this.HQ.notifySelection({
                        name: 'copy',
                        service: 'copy',
                        data: cells
                    });
                };
                TemplatesMenu = __decorate([
                    core_1.Component({
                        selector: '[templates-menu]',
                        inputs: ['templates'],
                        directives: [],
                        template: "\n\t\t\t<ng-content></ng-content>\n\t\t\t<ul class=\"dropdown-menu\">\n\t\t\t\t<li *ngFor=\"#template of templates\"><a href=\"javascript:void(0)\" (click)=\"click(template)\">{{template.getName()}}\n\t\t\t\t( {{template.getDimension()}} )</a></li>\n\t\t\t\t<li *ngIf=\"!templates || templates.length == 0\"><a>No templates yet</a></li>\n\t\t\t</ul>\n\t"
                    }), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter])
                ], TemplatesMenu);
                return TemplatesMenu;
            }());
            exports_1("TemplatesMenu", TemplatesMenu);
            Template = (function () {
                function Template(name, content) {
                    this.name = name;
                    this.content = content;
                }
                Template.prototype.getName = function () {
                    return this.name.substring(0, this.name.lastIndexOf("."));
                };
                Template.prototype.getDimension = function () {
                    return this.content.length + " x " + this.content[0].cells.length;
                };
                return Template;
            }());
            exports_1("Template", Template);
        }
    }
});
//# sourceMappingURL=TemplatesMenu.js.map