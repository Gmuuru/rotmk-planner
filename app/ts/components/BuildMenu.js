System.register(["angular2/core", 'ng2-bootstrap/ng2-bootstrap', "../components/Cell", "../services/Headquarter", "../directives/highlight.directive", 'angular2/common'], function(exports_1, context_1) {
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
    var core_1, ng2_bootstrap_1, Cell_1, Headquarter_1, highlight_directive_1, common_1;
    var BuildMenuComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Headquarter_1_1) {
                Headquarter_1 = Headquarter_1_1;
            },
            function (highlight_directive_1_1) {
                highlight_directive_1 = highlight_directive_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            BuildMenuComponent = (function () {
                function BuildMenuComponent(HQ) {
                    var _this = this;
                    this.HQ = HQ;
                    this.oneAtATime = false;
                    this.basicOperations = [
                        {
                            type: 'building',
                            name: 'select',
                            service: 'select',
                            label: 'Select'
                        },
                        {
                            type: 'building',
                            name: 'delete',
                            service: 'delete',
                            label: 'Delete'
                        },
                    ];
                    this.sections = [
                        {
                            title: 'Terrain',
                            content: [
                                {
                                    type: 'category',
                                    name: 'grass',
                                    label: 'Terrains',
                                    subContent: [
                                        this.formatBuildingData('water'),
                                        this.formatBuildingData('dunes')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'rocks',
                                    label: 'Features',
                                    subContent: [
                                        this.formatBuildingData('rocks'),
                                        this.formatBuildingData('tree')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'tree',
                                    label: 'Resources',
                                    subContent: [
                                        this.formatBuildingData('ore'),
                                        this.formatBuildingData('saltmarsh'),
                                        this.formatBuildingData('quarry')
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Roads',
                            content: [
                                this.formatBuildingData('road'),
                                this.formatBuildingData('roadblock'),
                                this.formatBuildingData('grandroad-s'),
                                this.formatBuildingData('improad-v'),
                                this.formatBuildingData('ferry-s')
                            ]
                        },
                        {
                            title: 'Housing',
                            content: [
                                this.formatBuildingData('house-hi'),
                                this.formatBuildingData('elite-hi')
                            ]
                        },
                        {
                            title: 'Agriculture',
                            content: [
                                {
                                    type: 'category',
                                    name: 'farm',
                                    label: 'Farms',
                                    subContent: [
                                        this.formatBuildingData('farm'),
                                        this.formatBuildingData('hempfarm')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'wheat',
                                    label: 'Crops',
                                    subContent: [
                                        this.formatBuildingData('wheat'),
                                        this.formatBuildingData('millet'),
                                        this.formatBuildingData('rice'),
                                        this.formatBuildingData('soybeans'),
                                        this.formatBuildingData('cabbage')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'irrigationpump',
                                    label: 'Irrig.',
                                    subContent: [
                                        this.formatBuildingData('irrigationpump'),
                                        this.formatBuildingData('id')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'teashed',
                                    label: 'Sheds',
                                    subContent: [
                                        this.formatBuildingData('silkwormshed'),
                                        this.formatBuildingData('teashed'),
                                        this.formatBuildingData('refinery')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'teashed',
                                    label: 'Plants',
                                    subContent: [
                                        this.formatBuildingData('hemp'),
                                        this.formatBuildingData('silk'),
                                        this.formatBuildingData('tea'),
                                        this.formatBuildingData('laquer')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'hunter',
                                    label: 'Gather',
                                    subContent: [
                                        this.formatBuildingData('hunter'),
                                        this.formatBuildingData('wharf-s')
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Industry',
                            content: [
                                {
                                    type: 'category',
                                    name: 'claypit',
                                    label: 'Resources',
                                    subContent: [
                                        this.formatBuildingData('claypit'),
                                        this.formatBuildingData('loggingshed'),
                                        this.formatBuildingData('smelter'),
                                        this.formatBuildingData('ironsmelter'),
                                        this.formatBuildingData('saltmine')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'market-h',
                                    label: 'Craft',
                                    subContent: [
                                        this.formatBuildingData('kiln'),
                                        this.formatBuildingData('weaver'),
                                        this.formatBuildingData('bronzewaremaker'),
                                        this.formatBuildingData('jadecarver'),
                                        this.formatBuildingData('laquerwaremaker'),
                                        this.formatBuildingData('papermaker')
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Commerce',
                            content: [
                                this.formatBuildingData('mill'),
                                {
                                    type: 'category',
                                    name: 'market-h',
                                    label: 'Markets',
                                    subContent: [
                                        this.formatBuildingData('market-h'),
                                        this.formatBuildingData('market3-h')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'm-food',
                                    label: 'Shops',
                                    subContent: [
                                        this.formatBuildingData('m-food'),
                                        this.formatBuildingData('m-hemp'),
                                        this.formatBuildingData('m-pottery'),
                                        this.formatBuildingData('m-silk'),
                                        this.formatBuildingData('m-tea'),
                                        this.formatBuildingData('m-laquer')
                                    ]
                                },
                                this.formatBuildingData('warehouse'),
                                this.formatBuildingData('tradepost'),
                                this.formatBuildingData('tradepier-n')
                            ]
                        },
                        {
                            title: 'Safety',
                            content: [
                                this.formatBuildingData('h-well'),
                                this.formatBuildingData('guardtower'),
                                this.formatBuildingData('watchtower'),
                                this.formatBuildingData('herbalist'),
                                this.formatBuildingData('acupuncturist')
                            ]
                        },
                        {
                            title: 'Government',
                            content: [
                                this.formatBuildingData('admincity-h'),
                                this.formatBuildingData('palace-h'),
                                this.formatBuildingData('taxoffice'),
                                this.formatBuildingData('mint'),
                                this.formatBuildingData('moneyprinter')
                            ]
                        },
                        {
                            title: 'Entertainment',
                            content: [
                                this.formatBuildingData('musicschool'),
                                this.formatBuildingData('acrobatschool'),
                                this.formatBuildingData('dramaschool'),
                                this.formatBuildingData('theater')
                            ]
                        },
                        {
                            title: 'Religion',
                            content: [
                                this.formatBuildingData('ancestor'),
                                this.formatBuildingData('daoshrine'),
                                this.formatBuildingData('daotemple'),
                                this.formatBuildingData('confusianacademy'),
                                this.formatBuildingData('buddhashrine'),
                                this.formatBuildingData('buddhatemple')
                            ]
                        },
                        {
                            title: 'Landscape',
                            content: [
                                this.formatBuildingData('rw'),
                                this.formatBuildingData('rgate-v'),
                                this.formatBuildingData('garden1'),
                                this.formatBuildingData('pinktree'),
                                {
                                    type: 'category',
                                    name: 'pinktree',
                                    label: 'Decor.',
                                    subContent: [
                                        this.formatBuildingData('pond'),
                                        this.formatBuildingData('statue1'),
                                        this.formatBuildingData('statue2')
                                    ]
                                },
                                {
                                    type: 'category',
                                    name: 'pavilion',
                                    label: 'Buildings',
                                    subContent: [
                                        this.formatBuildingData('pavilion'),
                                        this.formatBuildingData('privategarden'),
                                        this.formatBuildingData('taichipark')
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Defense',
                            content: [
                                this.formatBuildingData('weaponsmith'),
                                this.formatBuildingData('militarycamp-h'),
                                {
                                    type: 'category',
                                    name: 'tower',
                                    label: 'Walls',
                                    subContent: [
                                        this.formatBuildingData('wall'),
                                        this.formatBuildingData('gate-v'),
                                        this.formatBuildingData('tower')
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Monuments',
                            content: [
                                this.formatBuildingData('workcamp'),
                                this.formatBuildingData('stoneworks'),
                                {
                                    type: 'category',
                                    name: 'masonsguild',
                                    label: 'Guilds',
                                    subContent: [
                                        this.formatBuildingData('masonsguild'),
                                        this.formatBuildingData('ceramistsguild'),
                                        this.formatBuildingData('carpenterguild')
                                    ]
                                }
                            ]
                        }
                    ];
                    this.selected = "select";
                    this.sections.forEach(function (section) {
                        section.isOpen = false;
                        section.decaleStatus = "init";
                        section.rightContent = [];
                        section.rightContentName = "";
                        section.colsize = 12 / Math.min(3, Math.max(section.content.length, 1));
                        section.rowsize = Math.ceil(Math.max(1, section.content.length / 3));
                        // on verifie la taille de la plus grande subsection
                        var maxSize = 0;
                        section.content.forEach(function (content) {
                            if (content.subContent && content.subContent.length > maxSize) {
                                maxSize = content.subContent.length;
                            }
                        });
                        section.rowsize = Math.max(section.rowsize, Math.ceil(maxSize / 3));
                        section.height = (section.rowsize * 49) + 16;
                    });
                    this.HQ.globalEventFired$.subscribe(function (action) {
                        if (action == "reset") {
                            _this.reset();
                        }
                    });
                    this.HQ.kbShortcut$.subscribe(function (code) {
                        if (code == -1) {
                            _this.select({
                                type: 'building',
                                name: 'delete',
                                service: 'delete',
                                label: 'Delete'
                            });
                        }
                        else if (code == 114) {
                            _this.autoSelect({
                                name: 'road',
                                label: 'Road'
                            });
                        }
                        else if (code == 104) {
                            _this.autoSelect({
                                name: 'house-hi',
                                label: 'House'
                            });
                        }
                    });
                }
                BuildMenuComponent.prototype.toggle = function (sectionClicked) {
                    this.sections.forEach(function (section) {
                        if (section.title != sectionClicked.title) {
                            section.isOpen = false;
                        }
                        else {
                            section.isOpen = !section.isOpen;
                        }
                    });
                };
                BuildMenuComponent.prototype.autoSelect = function (itemToSelect) {
                    var _this = this;
                    this.sections.forEach(function (section) {
                        section.isOpen = false;
                        for (var iid in section.content) {
                            var item = section.content[iid];
                            if (item.name == itemToSelect.name) {
                                //on force l'ouverture de la section
                                section.isOpen = true;
                                _this.select(item);
                                break;
                            }
                        }
                    });
                };
                BuildMenuComponent.prototype.select = function (item) {
                    this.selected = item.name;
                    this.HQ.notifySelection(item);
                };
                BuildMenuComponent.prototype.reset = function () {
                    this.select({
                        type: 'building',
                        name: 'select',
                        service: 'select',
                        label: 'Select'
                    });
                };
                BuildMenuComponent.prototype.openSubcontent = function (section, item) {
                    section.rightContent = item.subContent;
                    section.rightContentName = item.label;
                    section.decaleStatus = "decale";
                };
                BuildMenuComponent.prototype.closeSubcontent = function (section) {
                    section.rightContent = [];
                    section.rightContentName = "";
                    section.decaleStatus = "normal";
                };
                BuildMenuComponent.prototype.formatBuildingData = function (name) {
                    var res = { type: '', name: '', label: '', longLabel: '', service: '' };
                    var building = Cell_1.Cell.getBuildingData(Cell_1.Cell.getCharFromName(name));
                    if (!building) {
                        console.log("no data found for name " + name);
                    }
                    else {
                        res.type = 'building';
                        res.name = building.name;
                        res.label = building.labelMenu;
                        res.longLabel = building.label;
                        res.service = building.renderingService;
                    }
                    return res;
                };
                BuildMenuComponent = __decorate([
                    core_1.Component({
                        selector: 'build-accordion',
                        directives: [highlight_directive_1.HighlightDirective, ng2_bootstrap_1.CollapseDirective, common_1.NgClass],
                        templateUrl: 'app/templates/BuildMenu.html',
                    }), 
                    __metadata('design:paramtypes', [Headquarter_1.Headquarter])
                ], BuildMenuComponent);
                return BuildMenuComponent;
            }());
            exports_1("BuildMenuComponent", BuildMenuComponent);
        }
    }
});
//# sourceMappingURL=BuildMenu.js.map