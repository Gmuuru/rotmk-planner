import { Component } from "angular2/core";
import {PathService} 		from "../services/PathService";
import {BuildService} 		from "../services/BuildService";
import {DeleteService} 		from "../services/DeleteService";
import {SplashService} 		from "../services/SplashService";
import {CopyService} 		from "../services/CopyService";
import {MoveService} 		from "../services/MoveService";
import {CopyAndRotateService} 		from "../services/CopyAndRotateService";

@Component(
{
	selector: 'service-loader',
	template: ``
}
)
export class ServiceLoader {
	
	constructor(public buildService : BuildService,
				public deleteService : DeleteService,
				public pathService : PathService,
				public splashService : SplashService,
				public copyService : CopyService,
				public moveService : MoveService,
				public copyAndRotateService : CopyAndRotateService){}
}