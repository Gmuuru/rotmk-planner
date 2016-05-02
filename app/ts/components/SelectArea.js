System.register(["angular2/core", "../services/SelectService", "../directives/contextmenu.directive"], function(exports_1, context_1) {
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
    var core_1, SelectService_1, contextmenu_directive_1;
    var SelectAreaHolder;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (SelectService_1_1) {
                SelectService_1 = SelectService_1_1;
            },
            function (contextmenu_directive_1_1) {
                contextmenu_directive_1 = contextmenu_directive_1_1;
            }],
        execute: function() {
            SelectAreaHolder = (function () {
                function SelectAreaHolder(selectService) {
                    this.selectService = selectService;
                    this.misteryOffset = 9.5;
                    this.first = null;
                    this.top = 0;
                    this.left = 0;
                    this.width = 0;
                    this.height = 0;
                }
                SelectAreaHolder.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    this.selectService.selectChange$.subscribe(function ($event) {
                        if ($event.type == "mousedown") {
                            _this.handleMouseDown($event);
                        }
                        else if ($event.type == "mouseenter") {
                            _this.handleMouseEnter($event);
                        }
                        else if ($event.type == "mouseup") {
                            _this.handleMouseUp($event);
                        }
                    });
                    this.selectService.action$.subscribe(function (action) {
                        if (action == "reset") {
                            _this.onDeselect(null);
                        }
                    });
                };
                SelectAreaHolder.prototype.onDeselect = function ($event) {
                    if (!$event || $event.button == 0) {
                        this.top = 0;
                        this.left = 0;
                        this.width = 0;
                        this.height = 0;
                    }
                };
                SelectAreaHolder.prototype.handleMouseDown = function ($event) {
                    var target = $event.target.getBoundingClientRect();
                    this.first = {};
                    this.first.left = target.left - this.misteryOffset;
                    this.first.top = target.top + window.scrollY;
                    this.first.width = 16;
                    this.first.height = 16;
                    this.top = this.first.top;
                    this.left = this.first.left;
                    this.width = this.first.width;
                    this.height = this.first.height;
                };
                SelectAreaHolder.prototype.handleMouseEnter = function ($event) {
                    var targetPos = $event.target.getBoundingClientRect();
                    var targetPosLeft = targetPos.left - this.misteryOffset;
                    var targetPosTop = targetPos.top + window.scrollY;
                    if (this.first.top < targetPosTop) {
                        this.height = targetPosTop - this.first.top + 16;
                    }
                    else if (this.first.top > targetPosTop) {
                        this.top = targetPosTop;
                        this.height = this.first.top - this.top + this.first.height;
                    }
                    else {
                        this.top = this.first.top;
                        this.height = this.first.height;
                    }
                    if (this.first.left < targetPosLeft) {
                        this.width = targetPosLeft - this.first.left + 16;
                    }
                    else if (this.first.left > targetPosLeft) {
                        this.left = targetPosLeft;
                        this.width = this.first.left - this.left + this.first.width;
                    }
                    else {
                        this.left = this.first.left;
                        this.width = this.first.width;
                    }
                };
                SelectAreaHolder.prototype.handleMouseUp = function ($event) {
                    this.selectedCells = this.selectService.highlightedCells;
                };
                __decorate([
                    core_1.ViewChild('SelectedZone'), 
                    __metadata('design:type', core_1.ElementRef)
                ], SelectAreaHolder.prototype, "selectedZone", void 0);
                SelectAreaHolder = __decorate([
                    core_1.Component({
                        selector: 'select-zone-holder',
                        directives: [contextmenu_directive_1.ContextMenuDirective],
                        template: "<selected-zone #SelectedZone\n\t\t(mousedown)=\"onDeselect($event)\"\n\t\t[context-menu]=\"'select'\" [contextData]=\"selectedCells\"\n\t\t[ngStyle]=\"{'top': top+'px', 'left': left+'px', 'width': width+'px','height': height+'px'}\"\n\t></selected-zone>\n\t"
                    }), 
                    __metadata('design:paramtypes', [SelectService_1.SelectService])
                ], SelectAreaHolder);
                return SelectAreaHolder;
            }());
            exports_1("SelectAreaHolder", SelectAreaHolder);
        }
    }
});
//# sourceMappingURL=SelectArea.js.map