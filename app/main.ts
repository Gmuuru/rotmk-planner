/// <reference path="../node_modules/angular2/ts/typings/node/node.d.ts"/>
/// <reference path="../node_modules/angular2/typings/browser.d.ts"/>

import { bootstrap } 		from "angular2/platform/browser";
import { Component } 		from "angular2/core";
import { Injectable } 		from "angular2/core";

import {Headquarter} 		from "./ts/services/Headquarter";
import {PathService} 		from "./ts/services/PathService";
import {BuildService} 		from "./ts/services/BuildService";
import {DeleteService} 		from "./ts/services/DeleteService";
import {SplashService} 		from "./ts/services/SplashService";
import {SelectService} 		from "./ts/services/SelectService";
import {CopyService} 		from "./ts/services/CopyService";
import {MoveService} 		from "./ts/services/MoveService";
import {CopyAndRotateService} 		from "./ts/services/CopyAndRotateService";

import {Parser} 			from "./ts/classes/Parser";
import {ProgressiveLoader} 	from "./ts/classes/ProgressiveLoader";
import {Renderer} 			from "./ts/classes/Renderer";

import {MapComponent} 		from "./ts/components/MapComponent";
import {BuildMenuComponent} from "./ts/components/BuildMenu";
import {Line} 				from "./ts/components/Line";
import {LineComponent} 		from "./ts/components/Line";
import {ServiceLoader} 		from "./ts/components/ServiceLoader";
import {ContextMenuHolder} 	from "./ts/components/ContextMenu";
import {SaveMenuHolder} 	from "./ts/components/SaveMenu";
import {TemplatesMenu} 		from "./ts/components/TemplatesMenu";
import {Template} 			from "./ts/components/TemplatesMenu";
import {AlertsComponent} 	from "./ts/components/AlertsComponent";

//############################ APP #########################################

@Component(
{
	selector: 'reader',
	template: `
    <!-- Menu Bar -->
    <nav class="navbar navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <a style="color:#DDDDDD" href="#" class="navbar-brand">Emperor City Planner</a>
        </div>
        <div>
          <ul class="nav navbar-nav">
          	<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
					New ç œ
					<span class="caret"></span>
				</a>
				<ul class="dropdown-menu">
					<li><a href="javascript:void(0)" (click)="newMap(10,10)">Tiny</a></li>
					<li><a href="javascript:void(0)" (click)="newMap(25,25)">Small</a></li>
					<li><a href="javascript:void(0)" (click)="newMap(50,50)">Normal</a></li>
					<li><a href="javascript:void(0)" (click)="newMap(75,75)">Big</a></li>
					<li><a href="javascript:void(0)" (click)="newMap(90,90)">Huge</a></li>
					<li><a href="javascript:void(0)" (click)="newMap(140,140)">Enormous</a></li>
				</ul>
			</li>
          	<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
					File 
					<span class="caret"></span>
				</a>
				<ul class="dropdown-menu">
		            <li>
						<a href="javascript:void(0)" onclick="$('#upload').click()">Open</a>
						<form>
							<input id="upload" type="file" style="visibility:hidden;position:absolute;top:0;left:0;width:0px" (change)="fileChangeEvent($event)">
						</form>
					</li>
		            <li>
						<a href="javascript:void(0)" onclick="$('#import').click()">Import Templates</a>
						<form>
							<input id="import" type="file" multiple style="visibility:hidden;position:absolute;top:0;left:0;width:0px" (change)="importFileEvent($event)">
						</form>
					</li>
					<li [ngClass]="{'disabled' : getLines().length == 0}">
						<a *ngIf="getLines().length > 0" href="javascript:void(0)" (click)="openSaveMenu('text')">Save as text...</a>
						<a *ngIf="getLines().length == 0">Save as text...</a>
					</li>
					<li [ngClass]="{'disabled' : getLines().length == 0}">
						<a *ngIf="getLines().length > 0" href="javascript:void(0)" (click)="openSaveMenu('image')">Save as image...</a>
						<a *ngIf="getLines().length == 0">Save as image...</a>
					</li>
				</ul>
			</li>
			<li templates-menu [templates]="templates" class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
					Insert templates 
					<span class="caret"></span>
				</a>
			</li>
          </ul>
        </div>
		<current-action class="pull-right">
			{{currentAction}}
			<span *ngIf="currentAction && currentMessage">&nbsp;&nbsp;-&nbsp;&nbsp;</span>
			{{currentMessage}}
		</current-action>
      </div>
    </nav>
	<map-container class="panel panel-primary" (click)="click($event)" (contextmenu)="click($event)" [ngClass]="{expanded: toggled, collapsed: !toggled}">
		<alerts-holder></alerts-holder>
	</map-container>
	
	<build-menu *ngIf="getLines().length > 0" [ngClass]="{expanded: toggled, collapsed: !toggled}">
		<collapse-button>
			<button *ngIf="!toggled" class="btn btn-primary btn-xs glyphicon glyphicon-backward" (click)="toggle()"></button>
		</collapse-button>
		<div class="accordion-container panel panel-primary">
			<div class="panel-heading clearfix">
				<span *ngIf="toggled" class="btn btn-primary btn-xs glyphicon glyphicon-forward pull-left" (click)="toggle()"></span>
				<span class="menu-title">Build Menu</span>
			</div>
			<build-accordion></build-accordion>
		</div>
	</build-menu>
	<service-loader></service-loader>
	<context-menu-holder></context-menu-holder>
	<save-menu-holder></save-menu-holder>
	`,
	host: {
		'(document:keypress)': 'onKeyPress($event)'
	},
	directives: [MapComponent, LineComponent, BuildMenuComponent, ServiceLoader, ContextMenuHolder, SaveMenuHolder, TemplatesMenu, AlertsComponent],
	providers : [ProgressiveLoader, Renderer, Headquarter, PathService, BuildService, DeleteService, SplashService, SelectService, CopyService, MoveService, CopyAndRotateService]
}
)
class mainApp {
	
	file : File;
	contentText : string;
	toggled : boolean;
	currentAction : string;
	currentMessage : string;
	templates : Array<{name:string, content:Line[]}>;
	
	constructor(public renderer: Renderer, public HQ :Headquarter){
		this.toggled = false;
		this.file = null;
		this.currentAction = "";
		this.currentMessage = "";
		this.HQ.actionChange$.subscribe(
			(action) => {
				this.currentAction = action;
			}
		);
		this.HQ.messageChange$.subscribe(
			(msg) => {
				this.currentMessage = msg;
			}
		);
		this.HQ.toggle$.subscribe(
			(action) => {
				this.toggle();
			}
		);
		this.templates = new Array<{name:string, content:Line[]}>();
	}

	getLines() :Line[]{
		var lines = this.renderer.getLines();
		if(!lines){
			return [];
		}
		return lines;
	}
	
	newMap(x:number, y:number) : void{
		this.toggled = true;
		var lines : Line[] = [];
		for(var i = 0; i < y; i++){
			var line:Line = new Line(i, x);
			line.complete();
			lines.push(line);
		}
		this.render(lines);
	}
	
	//navbar
	openSaveMenu(format:string) :void {
		this.HQ.alertNavbarEvent("SaveMenu", format);
	}

	//events
	
	onKeyPress($event){
		this.HQ.keyPress($event);
	}
	
	click($event){
		var target = $event.target;
		if(target.tagName == 'MAP' || target.tagName == 'MAP-CONTAINER'){
			this.HQ.alertMainMouseEvent($event, "click");
		}
	}
	
	// file reading
	fileChangeEvent($event: any){
        var files = (<FileList> $event.target.files);
		this.read(files, this.render.bind(this));
    }

	importFileEvent($event){
        var files = (<FileList> $event.target.files);
		this.read(files, this.loadTemplate.bind(this));
    }

	
	read(files:FileList, callback: (lines:Line[], any?) => any): void {
		for(var i = 0; i < files.length; i++){
			let file = files[i];
			let reader : FileReader = new FileReader();
			reader.onload  = 
				((file) => {
					return (
						(e) => {
						let lines = [];
						try{
							lines = Parser.parse(reader.result);
						} catch(err){
							console.log("Error parsing file "+file.name+" : ", err);
						}
						callback(lines, file);
					}
				);
			})(file);
			reader.readAsText(file);
		}
	}

	render(lines:Line[]){
		this.toggled = true;
		this.renderer.loadMap(lines);
	}

	loadTemplate(lines:Line[], file:File){
		lines = this.renderer.render(lines);
		this.templates.push(new Template(file.name, lines));
	}
	
	toggle() :void{
		this.toggled = !this.toggled;
	}
}

bootstrap(mainApp);