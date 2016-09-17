import {Component, Input, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {ObjectBlockList} from 'components/object-block-list/object-block-list';
import {NgTagIt} from 'components/ng-tag-it/ng-tag-it';
import {Autocomplete} from 'components/autocomplete/autocomplete';
import {ObjectService} from 'services/object-service/objects.service';
import {Slimscroll} from 'components/slimscroll/slimscroll';
import {Menu} from 'components/menu/menu';
import {ClassEditor} from 'components/class-editor/class-editor';

@Component({
	selector:					'controller',
	templateUrl:			'/app/components/controller/controller.html',
	directives:				[ObjectBlockList, NgTagIt, Autocomplete, Slimscroll, Menu],
	providers:				[ObjectService],
	host:							{
		style:	`
			display:			inline-block;
		`
	},
	styles:						[`
		section > div {
			padding-top: 	5px;
		}
		.select-all {
			display: inline-block;
			width: 15px;
			box-shadow: none;
			margin: 2px 0 2px 18px;
			vertical-align: middle;
		}
		.add-link-input {
			display: inline-block;
			margin: 0 0 5px 5px;
			line-height: 12px;
			font-size: 11px;
			padding: 1px;
			height: 18px;
		}
		.list-dash {
			padding-right: 0;
		}
	`]
})

export class Controller implements AfterViewInit {
	@Input("initial-tags") initialTags;
	@Input("initialize-ctrl") initializeCtrl;
	@Input() compact: boolean = false;
	objects = [];
	initialized = false;

	constructor(private _objectService: ObjectService, private cd: ChangeDetectorRef) {}
	addTag = (event, ui) => {
		console.log(ui);
		if(ui.item.value === -1) {
			this._objectService.createObject({ObjectName: ui.item.label.substring(5, ui.item.label.length-1)}).subscribe(res => {
				console.log(res);
			});
		} else {
			var tag_ids = [];
			this.tags.forEach(x => tag_ids.push(x.value));
			this._objectService.getObjectsWithTags(tag_ids).subscribe(x => this.objects = x);
		}
	}
	auto = {
		source:				(request, response) => {
			this._objectService.getObjectsFromServer(request.term).subscribe(objects => {
				objects.unshift({value: -1, label: "Add '" + request.term + "'"});
				response(objects);
			});
		},
		select:				(event, ui) => {
			var linked_object = {
						name:					ui.item.label.substring(5,ui.item.label.length-1),
						value:				ui.item.value,
						class:				null,
						rank:					null
					};
			event.preventDefault();
			if(this.objects.filter(this.filterFn, {field: 'select', value: true}).length > 0) {
				var selectIds = Array.from(this.objects.filter(this.filterFn, {field: 'select', value: true}), x => x.ObjectID);
				this._objectService.linkObjects(selectIds, linked_object).subscribe(res => {
					// send confirmation through notification
					$(event.target).val(null);
					this.cd.markForCheck();
				});
			} else {
				var tagIds = Array.from(this.tags, x => x.value);
				this._objectService.linkObjects(tagIds, linked_object).subscribe(res => {
					this.objects = res;
					$(event.target).val(null);
					this.cd.markForCheck();
				});
			}
		},
		focus:				(event, ui) => {
			event.preventDefault();
		},
		autoFocus:		true
	}
	menu = {
		icon:				"fa fa-caret-down",
		menuRight:	true,
		items:		[
			{
				label:			"Remove Item",
				action:			(x) => {console.log(x);}
			},
			{
				label:			"Copy contents",
				action:			(x) => {
					document.execCommand('Copy', false, this.objects[0].ObjectName);
				}
			}
		]
	};
	ngAfterViewInit() {
		if(this.initializeCtrl) {
			this.initializeController();
		}
	}

	refreshObjects = () => {
		if(this.initializeCtrl) {
			var tagIds = Array.from(this.tags, x => x.value);
			this._objectService.getObjectsWithTags(tagIds).subscribe(objects => {
				this.objects = objects;
			});
		} else {
			this.initializeController();
		}
	}
	initializeController = () => {
		this._objectService.initializeController(this.initialTags.toString()).subscribe(response => {
			this.objects = response.objects;
			this.initialized = true;
			this.tags = response.tags.map(el => {return {label: el.ObjectName, value: el.ObjectID};});
			this.tags.forEach((item,index) => {this.addMenuItem(item);})
			this.cd.markForCheck();
		});
	}
	filterFn = function(item) {
		return item[this.field] == this.value;
	}
	showObjectDetail = () => {
		if(!this.initialized) {
			this.initializeController();
		}
	}
	addMenuItem = (newTag) => {
		let newItem = {
			label:			"Remove link to '" + newTag.label + "'",
			action:			() => {
				let selected = this.objects.filter(this.filterFn, {field: "select", value: true}).map(function(a) {return a.ObjectID;});
				if(selected.length > 0) {
					this._objectService.removeLinks(newTag.value, selected.toString(), Array.from(this.tags, x => x.value)).subscribe(x => {
						this.objects = this.objects.filter(function(obj) {
    					return obj.select !== true;
						});
					});
				}
				// Send remove link function, and then remove objects upon successful
			}
		}
		this.menu.items.push(newItem);
	}
	returnSearch = (input) => {
		this.searchText = input.value;
	}
}