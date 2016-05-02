System.register(["angular2/core", "../services/PathService", "../services/BuildService", "../services/DeleteService", "../services/SplashService", "../services/CopyService", "../services/MoveService", "../services/CopyAndRotateService"], function(exports_1, context_1) {
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
    var core_1, PathService_1, BuildService_1, DeleteService_1, SplashService_1, CopyService_1, MoveService_1, CopyAndRotateService_1;
    var ServiceLoader;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
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
            function (CopyService_1_1) {
                CopyService_1 = CopyService_1_1;
            },
            function (MoveService_1_1) {
                MoveService_1 = MoveService_1_1;
            },
            function (CopyAndRotateService_1_1) {
                CopyAndRotateService_1 = CopyAndRotateService_1_1;
            }],
        execute: function() {
            ServiceLoader = (function () {
                function ServiceLoader(buildService, deleteService, pathService, splashService, copyService, moveService, copyAndRotateService) {
                    this.buildService = buildService;
                    this.deleteService = deleteService;
                    this.pathService = pathService;
                    this.splashService = splashService;
                    this.copyService = copyService;
                    this.moveService = moveService;
                    this.copyAndRotateService = copyAndRotateService;
                }
                ServiceLoader = __decorate([
                    core_1.Component({
                        selector: 'service-loader',
                        template: ""
                    }), 
                    __metadata('design:paramtypes', [BuildService_1.BuildService, DeleteService_1.DeleteService, PathService_1.PathService, SplashService_1.SplashService, CopyService_1.CopyService, MoveService_1.MoveService, CopyAndRotateService_1.CopyAndRotateService])
                ], ServiceLoader);
                return ServiceLoader;
            }());
            exports_1("ServiceLoader", ServiceLoader);
        }
    }
});
//# sourceMappingURL=ServiceLoader.js.map