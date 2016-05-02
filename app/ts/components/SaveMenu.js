System.register(["angular2/core", 'angular2/common', "../services/Headquarter", "../classes/Renderer"], function(exports_1, context_1) {
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
    var core_1, common_1, Headquarter_1, Renderer_1;
    var SaveMenuHolder;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            },
            function (Renderer_1_1) {
                Renderer_1 = Renderer_1_1;
            }],
        execute: function() {
            SaveMenuHolder = (function () {
                function SaveMenuHolder(renderer, HQ) {
                    var _this = this;
                    this.renderer = renderer;
                    this.HQ = HQ;
                    this.isShown = false;
                    this.HQ.saveMenuOpen$.subscribe(function (format) {
                        _this.isShown = true;
                        _this.format = format;
                        console.log("Save Menu open with format " + _this.format);
                    });
                }
                Object.defineProperty(SaveMenuHolder.prototype, "menuLocationCss", {
                    get: function () {
                        return {
                            'display': this.isShown ? 'block' : 'none'
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                SaveMenuHolder.prototype.close = function () {
                    this.isShown = false;
                    this.HQ.reset();
                };
                SaveMenuHolder.prototype.onSubmit = function (formObj) {
                    try {
                        if (formObj.fileName && formObj.fileName.trim() != "") {
                            var fileName = formObj.fileName;
                            if (this.format == "text") {
                                this.createText(fileName);
                            }
                            else if (this.format == "image") {
                                this.createImage(fileName);
                            }
                            this.close();
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                };
                SaveMenuHolder.prototype.createText = function (filename) {
                    var charMap = [];
                    this.renderer.getLines().forEach(function (line) {
                        line.cells.forEach(function (cell) {
                            charMap.push(cell.getBuilding().char);
                        });
                        charMap.push("\r");
                        charMap.push("\n");
                    });
                    var blob = new Blob(charMap, { type: "text/plain;charset=utf-8" });
                    saveAs(blob, filename + ".txt");
                };
                SaveMenuHolder.prototype.createImage = function (filename) {
                    html2canvas(document.getElementById('map'), {
                        onrendered: function (canvas) {
                            canvas.toBlob(function (blob) {
                                saveAs(blob, filename + ".png");
                            });
                        }
                    });
                };
                SaveMenuHolder = __decorate([
                    core_1.Component({
                        selector: 'save-menu-holder',
                        directives: [common_1.FORM_DIRECTIVES],
                        template: "\n\t\t<div [ngStyle]=\"menuLocationCss\" class=\"container save-menu\">\n\t      <div class=\"panel panel-primary save-menu\">\n\t      \t<div class=\"panel-heading\">Save as {{format}}\n\t      \t\t<div class=\"btn btn-xs glyphicon glyphicon-remove pull-right\" (click)=\"close()\"></div>\n\t      \t</div>\n\t      \t<form role=\"form\" #f=\"ngForm\" (ngSubmit)=\"onSubmit(f.value)\">\n\t\t      \t<div class=\"panel-body\">\n\t  \t\t\t\t<div class=\"form-group\">\n\t    \t\t\t\t<label for=\"exampleInputEmail1\">Enter a Map Name</label>\n\t\t      \t\t\t<input type=\"text\" class=\"form-control\" ngControl=\"fileName\" name=\"fileName\">\n\t\t      \t\t</div>\n\t\t      \t\t<div class=\"text-center\">\n\t\t      \t\t\t<button type=\"submit\" class=\"btn btn-primary pull-right\">Save</button>\n\t\t      \t\t</div>\n\t\t      \t</div>\n\t      \t</form>\n\t      </div>\n\t    </div>\n\t"
                    }), 
                    __metadata('design:paramtypes', [Renderer_1.Renderer, Headquarter_1.Headquarter])
                ], SaveMenuHolder);
                return SaveMenuHolder;
            }());
            exports_1("SaveMenuHolder", SaveMenuHolder);
        }
    }
});
//# sourceMappingURL=SaveMenu.js.map