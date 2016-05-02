System.register(["angular2/core", "../services/Headquarter", "../directives/highlight.directive"], function(exports_1, context_1) {
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
    var core_1, Headquarter_1, highlight_directive_1;
    var ContextMenuHolder;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            },
            function (highlight_directive_1_1) {
                highlight_directive_1 = highlight_directive_1_1;
            }],
        execute: function() {
            ContextMenuHolder = (function () {
                function ContextMenuHolder(HQ) {
                    var _this = this;
                    this.HQ = HQ;
                    this.mouseLocation = { left: 0, top: 0 };
                    this.submenuLocation = { left: 0, top: 0 };
                    this.isShown = false;
                    this.HQ.contextMenuChange$.subscribe(function (input) {
                        var event = input.event;
                        _this.initMenus(input);
                        _this.showMenu(event);
                    });
                }
                Object.defineProperty(ContextMenuHolder.prototype, "locationCss", {
                    get: function () {
                        return {
                            'position': 'fixed',
                            'display': this.isShown ? 'block' : 'none',
                            'left': this.mouseLocation.left + 'px',
                            'top': (this.mouseLocation.top - 25) + 'px'
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ContextMenuHolder.prototype, "locationCssSubmenu", {
                    get: function () {
                        return {
                            'position': 'fixed',
                            'display': (this.subOptions && this.subOptions.length > 0) ? 'block' : 'none',
                            'left': this.submenuLocation.left + 'px',
                            'top': (this.submenuLocation.top) + 'px'
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                ContextMenuHolder.prototype.enterOption = function ($event, option) {
                    this.currentOption = option;
                    if (!option.subOptions) {
                        this.subOptions = [];
                        return;
                    }
                    this.subOptions = option.subOptions;
                    var optionPos = $event.target.getBoundingClientRect();
                    this.submenuLocation.top = optionPos.top;
                    this.submenuLocation.left = optionPos.right;
                };
                ContextMenuHolder.prototype.clickedOutside = function () {
                    this.isShown = false;
                };
                ContextMenuHolder.prototype.clickOnOption = function ($event, option) {
                    if (!option.service) {
                        //menu with submenus
                        $event.preventDefault();
                        return;
                    }
                    if ($event && $event.button == 0) {
                        this.HQ.notifySelection({
                            name: option.service,
                            service: option.service,
                            data: option.data
                        });
                    }
                    this.subOptions = [];
                    this.currentOption = null;
                };
                ContextMenuHolder.prototype.showMenu = function (event) {
                    console.log("opening menu !");
                    this.isShown = true;
                    this.mouseLocation = {
                        left: event.clientX,
                        top: event.clientY
                    };
                };
                ContextMenuHolder.prototype.initMenus = function (input) {
                    this.contextMenus = {
                        "select": [
                            {
                                name: 'copy',
                                service: 'copy',
                                data: input.data
                            },
                            {
                                name: 'move',
                                service: 'move',
                                data: input.data
                            },
                            {
                                name: 'copy & rotate',
                                subOptions: [
                                    {
                                        name: 'vertically',
                                        service: 'copyAndRotate',
                                        data: {
                                            cells: input.data,
                                            rotation: 'vertical'
                                        }
                                    },
                                    {
                                        name: 'horizontally',
                                        service: 'copyAndRotate',
                                        data: {
                                            cells: input.data,
                                            rotation: 'horizontal'
                                        }
                                    }
                                ]
                            }
                        ],
                    };
                    this.options = this.contextMenus[input.source];
                };
                ContextMenuHolder = __decorate([
                    core_1.Component({
                        selector: 'context-menu-holder',
                        directives: [highlight_directive_1.HighlightDirective],
                        host: {
                            '(document:click)': 'clickedOutside()',
                        },
                        template: "\n\t\t<div [ngStyle]=\"locationCss\" class=\"container context-menu-container\">\n\t      <div class=\"panel panel-primary context-menu\">\n\t      \t<div class=\"panel-heading\">Context Menu</div>\n\n\t\t        <div *ngFor=\"#option of options\" class=\"menu-option panel-default\">\n\t\t        \t<div class=\"panel-heading\" (mouseenter)=\"enterOption($event, option)\"\n\t\t        \t(click)=\"clickOnOption($event, option)\" \n\t\t        \t[class-switch]=\"false\">\n\t\t        \t\t{{option.name}}\n\t\t        </div>\n\t        </div>\n\n\t        <div class=\"context-menu panel panel-primary\" [ngStyle]=\"locationCssSubmenu\">\n\t        \t<div *ngFor=\"#subOption of subOptions\" class=\"menu-option panel-default\">\n\t\t        \t<div class=\"panel-heading\" (click)=\"clickOnOption($event, subOption)\" [class-switch]=\"false\">\n\t\t        \t\t\t{{subOption.name}}\n\t\t        \t</div>\n\t        \t</div>\n\t        </div>\n\t      </div>\n\t    </div>\n\t"
                    }), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter])
                ], ContextMenuHolder);
                return ContextMenuHolder;
            }());
            exports_1("ContextMenuHolder", ContextMenuHolder);
        }
    }
});
//# sourceMappingURL=ContextMenu.js.map