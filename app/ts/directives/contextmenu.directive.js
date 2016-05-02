System.register(['angular2/core', "../services/Headquarter"], function(exports_1, context_1) {
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
    var ContextMenuDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            }],
        execute: function() {
            ContextMenuDirective = (function () {
                function ContextMenuDirective(HQ) {
                    this.HQ = HQ;
                }
                Object.defineProperty(ContextMenuDirective.prototype, "contextData", {
                    set: function (data) {
                        this.data = data;
                    },
                    enumerable: true,
                    configurable: true
                });
                ContextMenuDirective.prototype.rightClicked = function (event) {
                    this.HQ.openContextMenu(event, this.source, this.data);
                    event.preventDefault();
                };
                __decorate([
                    core_1.Input('context-menu'), 
                    __metadata('design:type', Object)
                ], ContextMenuDirective.prototype, "source", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], ContextMenuDirective.prototype, "contextData", null);
                ContextMenuDirective = __decorate([
                    core_1.Directive({
                        selector: '[context-menu]',
                        host: { '(contextmenu)': 'rightClicked($event)' }
                    }), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter])
                ], ContextMenuDirective);
                return ContextMenuDirective;
            }());
            exports_1("ContextMenuDirective", ContextMenuDirective);
        }
    }
});
//# sourceMappingURL=contextmenu.directive.js.map