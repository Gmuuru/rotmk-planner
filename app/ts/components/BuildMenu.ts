import { Component }								from "angular2/core";
import {Subscription}   							from 'rxjs/Subscription';
import { CollapseDirective  } 								from 'ng2-bootstrap/ng2-bootstrap';
import {Cell} 										from "../components/Cell";
import {Headquarter} 										from "../services/Headquarter";
import {HighlightDirective} 						from "../directives/highlight.directive";
import {NgClass} 									from 'angular2/common';
	
@Component(
{
	selector: 'build-accordion',
	directives:[HighlightDirective, CollapseDirective, NgClass],
	templateUrl: 'app/templates/BuildMenu.html',
}
)
export class BuildMenuComponent {

	public oneAtATime:boolean = false;

	public selected : string;
	
	constructor(public HQ : Headquarter){
		
		this.selected = "select";
		this.sections.forEach(
			(section) => {
				section.isOpen = false;
				section.decaleStatus = "init";
				
				section.rightContent = [];
				section.rightContentName = "";
				
				section.colsize = 12 / Math.min(3, Math.max(section.content.length, 1));
				section.rowsize = Math.ceil(Math.max(1, section.content.length / 3));
				
				// on verifie la taille de la plus grande subsection
				var maxSize = 0;
				section.content.forEach(
					(content) => {
						if(content.subContent && content.subContent.length > maxSize){
							maxSize = content.subContent.length;
						}
					}
				);
				section.rowsize =Math.max(section.rowsize, Math.ceil(maxSize / 3));
				section.height = (section.rowsize*49) + 16;
			}
		);

		this.HQ.globalEventFired$.subscribe(
			(action) => {
				if(action == "reset"){
					this.reset();
				}
			}
		);
		this.HQ.kbShortcut$.subscribe(
			(code) => {
				if(code == -1){
					this.select({
						type : 'building',
						name : 'delete',
						service : 'delete',
						label: 'Delete'
					});
				} else if(code == 114){
					this.autoSelect({
						name : 'road',
						label: 'Road'
					});
				} else if(code == 104){
					this.autoSelect({
						name : 'house-hi',
						label: 'House'
					});
				}
			}
		);
	}
	
	toggle(sectionClicked) {
		
		this.sections.forEach(
			(section) => {
				if(section.title != sectionClicked.title){
					section.isOpen = false;
				} else {
					section.isOpen = !section.isOpen;
				}
		});
	}
	
	autoSelect(itemToSelect) : void {
		this.sections.forEach(
			(section) => {
				section.isOpen = false;
				for(var iid in section.content){
					var item = section.content[iid];
					if(item.name == itemToSelect.name){
						//on force l'ouverture de la section
						section.isOpen = true;
						this.select(item);
						break;
					}
				}
			}
		);
	}
	
	select(item){
		this.selected = item.name;
		this.HQ.notifySelection(item);
	}
	
	reset(){
		this.select({
			type : 'building',
			name : 'select',
			service : 'select',
			label: 'Select'
		});
	}
	
	openSubcontent(section, item){
		section.rightContent = item.subContent;
		section.rightContentName = item.label;
		section.decaleStatus = "decale";
	}
	
	closeSubcontent(section){
		section.rightContent = [];
		section.rightContentName = "";
		section.decaleStatus = "normal";
	}
	
	formatBuildingData(name:string) : Object{
		var res = {type:'', name:'', label:'', longLabel:'', service : ''};
		var building = Cell.getBuildingData(Cell.getCharFromName(name));
		if(!building){
			console.log("no data found for name "+name);
		} else {
			res.type = 'building';
			res.name = building.name;
			res.label = building.labelMenu;
			res.longLabel = building.label;
			res.service = building.renderingService;
		}
		
		return res;
	}
	
	public basicOperations:Array<any> = [
		{
			type : 'building',
			name : 'select',
			service : 'select',
			label: 'Select'
		},
		{
			type : 'building',
			name : 'delete',
			service : 'delete',
			label: 'Delete'
		},
	];
	public sections:Array<any> = [
    
	{
      title: 'Terrain',
      content: [
		{
			type : 'category',
			name : 'grass',
			label : 'Terrains',
			subContent : [
				this.formatBuildingData('water'),
				this.formatBuildingData('dunes')
			]
		},
		{
			type : 'category',
			name : 'rocks',
			label : 'Features',
			subContent : [
				this.formatBuildingData('rocks'),
				this.formatBuildingData('tree')
			]
		},
		{
			type : 'category',
			name : 'tree',
			label : 'Resources',
			subContent : [
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
			type : 'category',
			name : 'farm',
			label : 'Farms',
			subContent : [
				this.formatBuildingData('farm'),
				this.formatBuildingData('hempfarm')
			]
		},
		{
			type : 'category',
			name : 'wheat',
			label : 'Crops',
			subContent : [
				this.formatBuildingData('wheat'),
				this.formatBuildingData('millet'),
				this.formatBuildingData('rice'),
				this.formatBuildingData('soybeans'),
				this.formatBuildingData('cabbage')
			]
		},
		{
			type : 'category',
			name : 'irrigationpump',
			label : 'Irrig.',
			subContent : [
				this.formatBuildingData('irrigationpump'),
				this.formatBuildingData('id')
			]
		},
		{
			type : 'category',
			name : 'teashed',
			label : 'Sheds',
			subContent : [
				
			this.formatBuildingData('silkwormshed'),
			this.formatBuildingData('teashed'),
			this.formatBuildingData('refinery')
			]
		},
		{
			type : 'category',
			name : 'teashed',
			label : 'Plants',
			subContent : [
				this.formatBuildingData('hemp'),
				this.formatBuildingData('silk'),
				this.formatBuildingData('tea'),
				this.formatBuildingData('laquer')
			]
		},
		{
			type : 'category',
			name : 'hunter',
			label : 'Gather',
			subContent : [
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
			type : 'category',
			name : 'claypit',
			label : 'Resources',
			subContent : [
				this.formatBuildingData('claypit'),
				this.formatBuildingData('loggingshed'),
				this.formatBuildingData('smelter'),
				this.formatBuildingData('ironsmelter'),
				this.formatBuildingData('saltmine')
			]
		},
		{
			type : 'category',
			name : 'market-h',
			label : 'Craft',
			subContent : [
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
			type : 'category',
			name : 'market-h',
			label : 'Markets',
			subContent : [
				this.formatBuildingData('market-h'),
				this.formatBuildingData('market3-h')
			]
		},
		{
			type : 'category',
			name : 'm-food',
			label : 'Shops',
			subContent : [
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
			type : 'category',
			name : 'pinktree',
			label : 'Decor.',
			subContent : [
				this.formatBuildingData('pond'),
				this.formatBuildingData('statue1'),
				this.formatBuildingData('statue2')
			]
		},
		{
			type : 'category',
			name : 'pavilion',
			label : 'Buildings',
			subContent : [
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
			type : 'category',
			name : 'tower',
			label : 'Walls',
			subContent : [
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
			type : 'category',
			name : 'masonsguild',
			label : 'Guilds',
			subContent : [
				this.formatBuildingData('masonsguild'),
				this.formatBuildingData('ceramistsguild'),
				this.formatBuildingData('carpenterguild')
			]
		}
      ]
    }
	];
}