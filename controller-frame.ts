import {Component, Input} from '@angular/core';
import {Widget} from 'components/widget/widget';
import {Controller} from 'components/controller/controller';

@Component({
	selector:			'controller-frame',
	directives:		[Widget, Controller],
	template:			`
		<widget [widgetTitle]="controllerTitle" class="max-height flex-container-column" showContent="true">
			<controller [initialize-ctrl]="initializeCtrl" class="flex-item flex-container-column float-left" style="width: 100%" [initial-tags]="initialTags"></controller>
		</widget>
	`
})

export class ControllerFrame {
	@Input("initial-tags") initialTags;
	@Input("initialize-ctrl") initializeCtrl;
}