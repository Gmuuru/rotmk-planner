import {Injectable} 	from "angular2/core";
import {Subject}    	from 'rxjs/Subject';

import {Service} 		from "./Service";
import {Cell} 			from "../components/Cell";

@Injectable()
export class Headquarter {

	currentService : Service;
	defaultService : Service;
	detectKeyPress : boolean;

	constructor(){
		this.defaultService = null;
		this.detectKeyPress = false;
	}

	private _alertSource = new Subject<Error>();
	private _kbShortcutEventSource = new Subject<number>();
	private _menuToggleEventSource = new Subject<string>();
	private _globalEventSource = new Subject<string>();
	private _serviceActivationSource = new Subject<any>();
	private _currentActionSource = new Subject<string>();
	private _currentMessageSource = new Subject<string>();
	private _contextMenuSource = new Subject<{event : MouseEvent, source:string, data:any}>();
	private _saveMenuSource = new Subject<any>();

	alert$ = this._alertSource.asObservable();
	kbShortcut$ = this._kbShortcutEventSource.asObservable();
	toggle$ = this._menuToggleEventSource.asObservable();
	globalEventFired$ = this._globalEventSource.asObservable();
	serviceChange$ = this._serviceActivationSource.asObservable();
	actionChange$ = this._currentActionSource.asObservable();
	messageChange$ = this._currentMessageSource.asObservable();
	contextMenuChange$ = this._contextMenuSource.asObservable();
	saveMenuOpen$ = this._saveMenuSource.asObservable();
	
	reset() :void {
		this._globalEventSource.next("reset");
		this._currentActionSource.next("");
		this._currentMessageSource.next("");
		this.switchService(this.defaultService);
		this.detectKeyPress = true;
	}
	
	alertMainMouseEvent($event, action:string) :void {
		this.reset();
	}

	alertCellMouseEvent($event, action :string, cell :Cell) :void {
		if(this.currentService){
			this.currentService.alertCellMouseEvent( $event , action , cell );
		}
	}
	
	alertNavbarEvent(event:string, data:any) :void {
		if(event == "SaveMenu"){
				this.detectKeyPress = false;
				console.log("Opening Save Menu with format "+data);
			this._saveMenuSource.next(data);
		}
	}

	switchService(service : Service){
		if(this.currentService){
			this.currentService.reset();
		}
		this.currentService = service;
		this.detectKeyPress = true;
	}
	
	sendMessage(msg :string){
		this._currentMessageSource.next(msg);
	}

	log(err:Error) :void {
		this._alertSource.next(err);
	}
	
	activateDefaultService(service : Service){
		this.defaultService = service;
		this.reset();
	}

	activateService(service : Service){
		this.switchService(service);
	}
	
	openContextMenu(event: MouseEvent, source:string, data :any){
		this._contextMenuSource.next({event : event, source : source, data : data});
	}

	notifySelection(item){
		console.log("Selection : ", item);
		this._serviceActivationSource.next(item);
		if(item.name == "delete"){
			this._currentActionSource.next(`Deleting`);
		} else if(item.name == "copy"){
			this._currentActionSource.next(`Copying cells`);
		} else if(item.name == "copyAndRotate"){
			this._currentActionSource.next(`Copying cells with ${item.data.rotation} rotation`);
		} else if(item.name == "move"){
			this._currentActionSource.next(`Moving cells`);
		} else {
			this._currentActionSource.next(`Building ${item.longLabel}`);
		}
	}
	
	keyPress($event){
		if(!this.detectKeyPress){
			return;
		}
		if($event.keyCode != 0){
			switch($event.keyCode){
				case 27 : {
					// escape
					this.reset();
					return;
				}
				case 46 : {
					// delete
					this._kbShortcutEventSource.next(-1);
					return;
				}
				default : {
					return;
				}
			}
		} else {
			switch($event.charCode){
				case 60 : case 62 : {
					// < et >
					this._menuToggleEventSource.next("");
					return;
				}
				case 116 : {
					// t pour tourner un element
					if(this.currentService){
						var newBuilding = this.currentService.rotate();
						this._currentActionSource.next(`Building ${newBuilding}`);
					}
					return;
				}
				default : {
					this._kbShortcutEventSource.next($event.charCode);
					return;
				}
			}
		}
	}
}