import { Component, ViewChild, ElementRef } from "angular2/core";
import { FORM_DIRECTIVES } from 'angular2/common';
import {Headquarter} 			from "../services/Headquarter";
import {Renderer} 			from "../classes/Renderer";

declare var saveAs: any;
declare var html2canvas: any;

@Component({

	selector: 'save-menu-holder',
	directives: [FORM_DIRECTIVES],
	template: `
		<div [ngStyle]="menuLocationCss" class="container save-menu">
	      <div class="panel panel-primary save-menu">
	      	<div class="panel-heading">Save as {{format}}
	      		<div class="btn btn-xs glyphicon glyphicon-remove pull-right" (click)="close()"></div>
	      	</div>
	      	<form role="form" #f="ngForm" (ngSubmit)="onSubmit(f.value)">
		      	<div class="panel-body">
	  				<div class="form-group">
	    				<label for="exampleInputEmail1">Enter a Map Name</label>
		      			<input type="text" class="form-control" ngControl="fileName" name="fileName">
		      		</div>
		      		<div class="text-center">
		      			<button type="submit" class="btn btn-primary pull-right">Save</button>
		      		</div>
		      	</div>
	      	</form>
	      </div>
	    </div>
	`
})
export class SaveMenuHolder {

	isShown :boolean;
	format :string;

	constructor(public renderer: Renderer, public HQ : Headquarter){
		this.isShown = false;
		this.HQ.saveMenuOpen$.subscribe(
			(format) => {
				this.isShown = true;
				this.format = format;
				console.log("Save Menu open with format "+this.format);
			}
		);
	}

	get menuLocationCss(){ 
		return {
		  'display':this.isShown ?  'block':'none'
		};
	}

	close(){
		this.isShown= false;
		this.HQ.reset();
	}

	onSubmit(formObj){
		try {
			if(formObj.fileName && formObj.fileName.trim() != ""){
				var fileName = formObj.fileName;
				
				if(this.format == "text"){
					this.createText(fileName);
				} else if(this.format == "image"){
					this.createImage(fileName);
				}
				this.close();
			}
		} catch(err){
			console.log(err);
		}
	}

	createText(filename:string){
		var charMap = [];
		this.renderer.getLines().forEach(
			(line) => {
				line.cells.forEach(
					(cell) => {
						charMap.push(cell.getBuilding().char);
					}
				);
				charMap.push("\r");
				charMap.push("\n");
			}
		);

		var blob = new Blob(charMap, {type: "text/plain;charset=utf-8"});
		saveAs(blob, filename+".txt");
	}

	createImage(filename:string){
	    html2canvas(document.getElementById('map'), {
	      onrendered: function(canvas) {
	        canvas.toBlob(function(blob) {
			    saveAs(blob, filename+".png");
			});
	      }
	    });
	}
	
	
}