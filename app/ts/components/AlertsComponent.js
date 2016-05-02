System.register(['angular2/core', 'angular2/common', 'ng2-bootstrap/ng2-bootstrap', "../services/Headquarter"], function(exports_1, context_1) {
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
    var core_1, common_1, ng2_bootstrap_1, Headquarter_1;
    var AlertsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            }],
        execute: function() {
            AlertsComponent = (function () {
                function AlertsComponent(HQ) {
                    var _this = this;
                    this.HQ = HQ;
                    this.alerts = new Array();
                    this.HQ.alert$.subscribe(function (err) {
                        _this.addAlert(err);
                    });
                }
                AlertsComponent.prototype.closeAlert = function (i) {
                    this.alerts.splice(i, 1);
                };
                AlertsComponent.prototype.addAlert = function (err) {
                    this.alerts.push({ msg: err, type: 'danger', closable: true });
                };
                AlertsComponent = __decorate([
                    core_1.Component({
                        selector: 'alerts-holder',
                        template: "\n\n  <div class=\"alert-container panel panel-primary\" *ngIf=\"alerts && alerts.length > 0\">\n    <div class=\"panel-heading alert-container-title\">Message</div>\n    <div class=\"panel-body\">\n    <alert *ngFor=\"#alert of alerts;#i = index\" [type]=\"alert.type\" dismissible=\"true\" (close)=\"closeAlert(i)\">\n      {{ alert?.msg }}\n    </alert>\n    </div>\n  </div>",
                        directives: [ng2_bootstrap_1.AlertComponent, common_1.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter])
                ], AlertsComponent);
                return AlertsComponent;
            }());
            exports_1("AlertsComponent", AlertsComponent);
        }
    }
});
//# sourceMappingURL=AlertsComponent.js.map