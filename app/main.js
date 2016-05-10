/// <reference path="../node_modules/angular2/ts/typings/node/node.d.ts"/>
/// <reference path="../node_modules/angular2/typings/browser.d.ts"/>
System.register(["angular2/platform/browser", "angular2/core", "angular2/common", "./ts/services/Headquarter", "./ts/services/PathService", "./ts/services/BuildService", "./ts/services/DeleteService", "./ts/services/SplashService", "./ts/services/SelectService", "./ts/services/CopyService", "./ts/services/MoveService", "./ts/services/CopyAndRotateService", "./ts/classes/Parser", "./ts/classes/ProgressiveLoader", "./ts/classes/Renderer", "./ts/components/MapComponent", "./ts/components/BuildMenu", "./ts/components/Line", "./ts/components/ServiceLoader", "./ts/components/ContextMenu", "./ts/components/SaveMenu", "./ts/components/TemplatesMenu", "./ts/components/AlertsComponent", "./ts/components/StatsPanel"], function(exports_1, context_1) {
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
    var browser_1, core_1, common_1, Headquarter_1, PathService_1, BuildService_1, DeleteService_1, SplashService_1, SelectService_1, CopyService_1, MoveService_1, CopyAndRotateService_1, Parser_1, ProgressiveLoader_1, Renderer_1, MapComponent_1, BuildMenu_1, Line_1, Line_2, ServiceLoader_1, ContextMenu_1, SaveMenu_1, TemplatesMenu_1, TemplatesMenu_2, AlertsComponent_1, StatsPanel_1;
    var mainApp;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            },
            function (PathService_1_1) {
                PathService_1 = PathService_1_1;
            },
            function (BuildService_1_1) {
                BuildService_1 = BuildService_1_1;
            },
            function (DeleteService_1_1) {
                DeleteService_1 = DeleteService_1_1;
            },
            function (SplashService_1_1) {
                SplashService_1 = SplashService_1_1;
            },
            function (SelectService_1_1) {
                SelectService_1 = SelectService_1_1;
            },
            function (CopyService_1_1) {
                CopyService_1 = CopyService_1_1;
            },
            function (MoveService_1_1) {
                MoveService_1 = MoveService_1_1;
            },
            function (CopyAndRotateService_1_1) {
                CopyAndRotateService_1 = CopyAndRotateService_1_1;
            },
            function (Parser_1_1) {
                Parser_1 = Parser_1_1;
            },
            function (ProgressiveLoader_1_1) {
                ProgressiveLoader_1 = ProgressiveLoader_1_1;
            },
            function (Renderer_1_1) {
                Renderer_1 = Renderer_1_1;
            },
            function (MapComponent_1_1) {
                MapComponent_1 = MapComponent_1_1;
            },
            function (BuildMenu_1_1) {
                BuildMenu_1 = BuildMenu_1_1;
            },
            function (Line_1_1) {
                Line_1 = Line_1_1;
                Line_2 = Line_1_1;
            },
            function (ServiceLoader_1_1) {
                ServiceLoader_1 = ServiceLoader_1_1;
            },
            function (ContextMenu_1_1) {
                ContextMenu_1 = ContextMenu_1_1;
            },
            function (SaveMenu_1_1) {
                SaveMenu_1 = SaveMenu_1_1;
            },
            function (TemplatesMenu_1_1) {
                TemplatesMenu_1 = TemplatesMenu_1_1;
                TemplatesMenu_2 = TemplatesMenu_1_1;
            },
            function (AlertsComponent_1_1) {
                AlertsComponent_1 = AlertsComponent_1_1;
            },
            function (StatsPanel_1_1) {
                StatsPanel_1 = StatsPanel_1_1;
            }],
        execute: function() {
            //############################ APP #########################################
            mainApp = (function () {
                function mainApp(renderer, HQ) {
                    var _this = this;
                    this.renderer = renderer;
                    this.HQ = HQ;
                    this.toggled = false;
                    this.display = "map";
                    this.file = null;
                    this.currentAction = "";
                    this.currentMessage = "";
                    this.HQ.actionChange$.subscribe(function (action) {
                        _this.currentAction = action;
                    });
                    this.HQ.messageChange$.subscribe(function (msg) {
                        _this.currentMessage = msg;
                    });
                    this.HQ.toggle$.subscribe(function (action) {
                        _this.toggle();
                    });
                    this.templates = new Array();
                }
                mainApp.prototype.getLines = function () {
                    var lines = this.renderer.getLines();
                    if (!lines) {
                        return [];
                    }
                    return lines;
                };
                mainApp.prototype.newMap = function (x, y) {
                    this.toggled = true;
                    var lines = [];
                    for (var i = 0; i < y; i++) {
                        var line = new Line_1.Line(i, x);
                        line.complete();
                        lines.push(line);
                    }
                    this.render(lines);
                };
                //navbar
                mainApp.prototype.openSaveMenu = function (format) {
                    this.HQ.alertNavbarEvent("SaveMenu", format);
                };
                mainApp.prototype.showStats = function () {
                    this.display = 'stats';
                };
                //events
                mainApp.prototype.onKeyPress = function ($event) {
                    this.HQ.keyPress($event);
                };
                mainApp.prototype.click = function ($event) {
                    var target = $event.target;
                    if (target.tagName == 'MAP' || target.tagName == 'MAP-CONTAINER') {
                        this.HQ.alertMainMouseEvent($event, "click");
                    }
                };
                // file reading
                mainApp.prototype.fileChangeEvent = function ($event) {
                    var files = $event.target.files;
                    this.read(files, this.render.bind(this));
                };
                mainApp.prototype.importFileEvent = function ($event) {
                    var files = $event.target.files;
                    this.read(files, this.loadTemplate.bind(this));
                };
                mainApp.prototype.read = function (files, callback) {
                    var _loop_1 = function() {
                        var file = files[i];
                        var reader = new FileReader();
                        reader.onload =
                            (function (file) {
                                return (function (e) {
                                    var lines = [];
                                    try {
                                        lines = Parser_1.Parser.parse(reader.result);
                                    }
                                    catch (err) {
                                        console.log("Error parsing file " + file.name + " : ", err);
                                    }
                                    callback(lines, file);
                                });
                            })(file);
                        reader.readAsText(file);
                    };
                    for (var i = 0; i < files.length; i++) {
                        _loop_1();
                    }
                };
                mainApp.prototype.render = function (lines) {
                    this.toggled = true;
                    this.renderer.loadMap(lines);
                };
                mainApp.prototype.loadTemplate = function (lines, file) {
                    lines = this.renderer.render(lines);
                    this.templates.push(new TemplatesMenu_2.Template(file.name, lines));
                };
                mainApp.prototype.toggle = function () {
                    this.toggled = !this.toggled;
                };
                mainApp = __decorate([
                    core_1.Component({
                        selector: 'reader',
                        template: "\n    <!-- Menu Bar -->\n    <nav class=\"navbar navbar-inverse\">\n      <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n          <a style=\"color:#DDDDDD\" href=\"#\" class=\"navbar-brand\">Emperor City Planner</a>\n        </div>\n        <div>\n          <ul class=\"nav navbar-nav\">\n          \t<li class=\"dropdown\">\n\t\t\t\t<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\t\t\t\t\tNew\n\t\t\t\t\t<span class=\"caret\"></span>\n\t\t\t\t</a>\n\t\t\t\t<ul class=\"dropdown-menu\">\n\t\t\t\t\t<li><a href=\"javascript:void(0)\" (click)=\"newMap(10,10)\">Tiny</a></li>\n\t\t\t\t\t<li><a href=\"javascript:void(0)\" (click)=\"newMap(25,25)\">Small</a></li>\n\t\t\t\t\t<li><a href=\"javascript:void(0)\" (click)=\"newMap(50,50)\">Normal</a></li>\n\t\t\t\t\t<li><a href=\"javascript:void(0)\" (click)=\"newMap(75,75)\">Big</a></li>\n\t\t\t\t\t<li><a href=\"javascript:void(0)\" (click)=\"newMap(90,90)\">Huge</a></li>\n\t\t\t\t\t<li><a href=\"javascript:void(0)\" (click)=\"newMap(160,160)\">Enormous</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n          \t<li class=\"dropdown\">\n\t\t\t\t<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\t\t\t\t\tFile \n\t\t\t\t\t<span class=\"caret\"></span>\n\t\t\t\t</a>\n\t\t\t\t<ul class=\"dropdown-menu\">\n\t\t            <li>\n\t\t\t\t\t\t<a href=\"javascript:void(0)\" onclick=\"$('#upload').click()\">Open</a>\n\t\t\t\t\t\t<form>\n\t\t\t\t\t\t\t<input id=\"upload\" type=\"file\" style=\"visibility:hidden;position:absolute;top:0;left:0;width:0px\" (change)=\"fileChangeEvent($event)\">\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</li>\n\t\t            <li>\n\t\t\t\t\t\t<a href=\"javascript:void(0)\" onclick=\"$('#import').click()\">Import Templates</a>\n\t\t\t\t\t\t<form>\n\t\t\t\t\t\t\t<input id=\"import\" type=\"file\" multiple style=\"visibility:hidden;position:absolute;top:0;left:0;width:0px\" (change)=\"importFileEvent($event)\">\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li [ngClass]=\"{'disabled' : getLines().length == 0}\">\n\t\t\t\t\t\t<a *ngIf=\"getLines().length > 0\" href=\"javascript:void(0)\" (click)=\"openSaveMenu('text')\">Save as text...</a>\n\t\t\t\t\t\t<a *ngIf=\"getLines().length == 0\">Save as text...</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li [ngClass]=\"{'disabled' : getLines().length == 0}\">\n\t\t\t\t\t\t<a *ngIf=\"getLines().length > 0\" href=\"javascript:void(0)\" (click)=\"openSaveMenu('image')\">Save as image...</a>\n\t\t\t\t\t\t<a *ngIf=\"getLines().length == 0\">Save as image...</a>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\t\t\t<li templates-menu [templates]=\"templates\" class=\"dropdown\">\n\t\t\t\t<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n\t\t\t\t\tInsert templates \n\t\t\t\t\t<span class=\"caret\"></span>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t\t<li><a href=\"javascript:void(0)\" (click)=\"showStats()\">Stats</a></li>\n          </ul>\n        </div>\n\t\t<current-action class=\"pull-right\">\n\t\t\t{{currentAction}}\n\t\t\t<span *ngIf=\"currentAction && currentMessage\">&nbsp;&nbsp;-&nbsp;&nbsp;</span>\n\t\t\t{{currentMessage}}\n\t\t</current-action>\n      </div>\n    </nav>\n\t<map-container [hidden]=\"display != 'map'\" class=\"panel panel-primary\" (click)=\"click($event)\" (contextmenu)=\"click($event)\" [ngClass]=\"{expanded: toggled, collapsed: !toggled}\">\n\t\t<alerts-holder></alerts-holder>\n\t</map-container>\n\t\n\t<build-menu [hidden]=\"display != 'map'\" *ngIf=\"getLines().length > 0\" [ngClass]=\"{expanded: toggled, collapsed: !toggled}\">\n\t\t<collapse-button>\n\t\t\t<button *ngIf=\"!toggled\" class=\"btn btn-primary btn-xs glyphicon glyphicon-backward\" (click)=\"toggle()\"></button>\n\t\t</collapse-button>\n\t\t<div class=\"accordion-container panel panel-primary\">\n\t\t\t<div class=\"panel-heading clearfix\">\n\t\t\t\t<span *ngIf=\"toggled\" class=\"btn btn-primary btn-xs glyphicon glyphicon-forward pull-left\" (click)=\"toggle()\"></span>\n\t\t\t\t<span class=\"menu-title\">Build Menu</span>\n\t\t\t</div>\n\t\t\t<build-accordion></build-accordion>\n\t\t</div>\n\t</build-menu>\n\t<stats-panel *ngIf=\"display == 'stats'\" (onClose)=\"display='map'\"></stats-panel>\n\t<service-loader></service-loader>\n\t<context-menu-holder></context-menu-holder>\n\t<save-menu-holder></save-menu-holder>\n\t",
                        host: {
                            '(document:keypress)': 'onKeyPress($event)'
                        },
                        directives: [MapComponent_1.MapComponent, Line_2.LineComponent, BuildMenu_1.BuildMenuComponent, ServiceLoader_1.ServiceLoader, ContextMenu_1.ContextMenuHolder, SaveMenu_1.SaveMenuHolder, TemplatesMenu_1.TemplatesMenu, AlertsComponent_1.AlertsComponent, StatsPanel_1.StatsPanel],
                        providers: [ProgressiveLoader_1.ProgressiveLoader, Renderer_1.Renderer, Headquarter_1.Headquarter, PathService_1.PathService, BuildService_1.BuildService, DeleteService_1.DeleteService, SplashService_1.SplashService, SelectService_1.SelectService, CopyService_1.CopyService, MoveService_1.MoveService, CopyAndRotateService_1.CopyAndRotateService]
                    }), 
                    __metadata('design:paramtypes', [Renderer_1.Renderer, Headquarter_1.Headquarter])
                ], mainApp);
                return mainApp;
            }());
            browser_1.bootstrap(mainApp, [common_1.FORM_DIRECTIVES]);
        }
    }
});
//# sourceMappingURL=main.js.map