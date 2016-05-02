System.register(["angular2/core", 'rxjs/Subject'], function(exports_1, context_1) {
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
    var core_1, Subject_1;
    var Headquarter;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }],
        execute: function() {
            Headquarter = (function () {
                function Headquarter() {
                    this._alertSource = new Subject_1.Subject();
                    this._kbShortcutEventSource = new Subject_1.Subject();
                    this._menuToggleEventSource = new Subject_1.Subject();
                    this._globalEventSource = new Subject_1.Subject();
                    this._serviceActivationSource = new Subject_1.Subject();
                    this._currentActionSource = new Subject_1.Subject();
                    this._currentMessageSource = new Subject_1.Subject();
                    this._contextMenuSource = new Subject_1.Subject();
                    this._saveMenuSource = new Subject_1.Subject();
                    this.alert$ = this._alertSource.asObservable();
                    this.kbShortcut$ = this._kbShortcutEventSource.asObservable();
                    this.toggle$ = this._menuToggleEventSource.asObservable();
                    this.globalEventFired$ = this._globalEventSource.asObservable();
                    this.serviceChange$ = this._serviceActivationSource.asObservable();
                    this.actionChange$ = this._currentActionSource.asObservable();
                    this.messageChange$ = this._currentMessageSource.asObservable();
                    this.contextMenuChange$ = this._contextMenuSource.asObservable();
                    this.saveMenuOpen$ = this._saveMenuSource.asObservable();
                    this.defaultService = null;
                    this.detectKeyPress = false;
                }
                Headquarter.prototype.reset = function () {
                    this._globalEventSource.next("reset");
                    this._currentActionSource.next("");
                    this._currentMessageSource.next("");
                    this.switchService(this.defaultService);
                    this.detectKeyPress = true;
                };
                Headquarter.prototype.alertMainMouseEvent = function ($event, action) {
                    this.reset();
                };
                Headquarter.prototype.alertCellMouseEvent = function ($event, action, cell) {
                    if (this.currentService) {
                        this.currentService.alertCellMouseEvent($event, action, cell);
                    }
                };
                Headquarter.prototype.alertNavbarEvent = function (event, data) {
                    if (event == "SaveMenu") {
                        this.detectKeyPress = false;
                        console.log("Opening Save Menu with format " + data);
                        this._saveMenuSource.next(data);
                    }
                };
                Headquarter.prototype.switchService = function (service) {
                    if (this.currentService) {
                        this.currentService.reset();
                    }
                    this.currentService = service;
                    this.detectKeyPress = true;
                };
                Headquarter.prototype.sendMessage = function (msg) {
                    this._currentMessageSource.next(msg);
                };
                Headquarter.prototype.log = function (err) {
                    this._alertSource.next(err);
                };
                Headquarter.prototype.activateDefaultService = function (service) {
                    this.defaultService = service;
                    this.reset();
                };
                Headquarter.prototype.activateService = function (service) {
                    this.switchService(service);
                };
                Headquarter.prototype.openContextMenu = function (event, source, data) {
                    this._contextMenuSource.next({ event: event, source: source, data: data });
                };
                Headquarter.prototype.notifySelection = function (item) {
                    console.log("Selection : ", item);
                    this._serviceActivationSource.next(item);
                    if (item.name == "delete") {
                        this._currentActionSource.next("Deleting");
                    }
                    else if (item.name == "copy") {
                        this._currentActionSource.next("Copying cells");
                    }
                    else if (item.name == "copyAndRotate") {
                        this._currentActionSource.next("Copying cells with " + item.data.rotation + " rotation");
                    }
                    else if (item.name == "move") {
                        this._currentActionSource.next("Moving cells");
                    }
                    else {
                        this._currentActionSource.next("Building " + item.longLabel);
                    }
                };
                Headquarter.prototype.keyPress = function ($event) {
                    if (!this.detectKeyPress) {
                        return;
                    }
                    if ($event.keyCode != 0) {
                        switch ($event.keyCode) {
                            case 27: {
                                // escape
                                this.reset();
                                return;
                            }
                            case 46: {
                                // delete
                                this._kbShortcutEventSource.next(-1);
                                return;
                            }
                            default: {
                                return;
                            }
                        }
                    }
                    else {
                        switch ($event.charCode) {
                            case 60:
                            case 62: {
                                // < et >
                                this._menuToggleEventSource.next("");
                                return;
                            }
                            case 116: {
                                // t pour tourner un element
                                if (this.currentService) {
                                    var newBuilding = this.currentService.rotate();
                                    this._currentActionSource.next("Building " + newBuilding);
                                }
                                return;
                            }
                            default: {
                                this._kbShortcutEventSource.next($event.charCode);
                                return;
                            }
                        }
                    }
                };
                Headquarter = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], Headquarter);
                return Headquarter;
            }());
            exports_1("Headquarter", Headquarter);
        }
    }
});
//# sourceMappingURL=Headquarter.js.map