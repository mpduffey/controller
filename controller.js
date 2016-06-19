"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var object_block_list_1 = require('components/object-block-list/object-block-list');
var ng_tag_it_1 = require('components/ng-tag-it/ng-tag-it');
var autocomplete_1 = require('components/autocomplete/autocomplete');
var objects_service_1 = require('services/objects.service');
var slimscroll_1 = require('components/slimscroll/slimscroll');
var menu_1 = require('components/menu/menu');
var Controller = (function () {
    function Controller(_objectService, cd) {
        var _this = this;
        this._objectService = _objectService;
        this.cd = cd;
        this.compact = false;
        this.objects = [];
        this.initialized = false;
        this.addTag = function (event, ui) {
            console.log(ui);
            if (ui.item.value === -1) {
                _this._objectService.createObject({ ObjectName: ui.item.label.substring(5, ui.item.label.length - 1) }).subscribe(function (res) {
                    console.log(res);
                });
            }
            else {
                var tag_ids = [];
                _this.tags.forEach(function (x) { return tag_ids.push(x.value); });
                _this._objectService.getObjectsWithTags(tag_ids).subscribe(function (x) { return _this.objects = x; });
            }
        };
        this.auto = {
            source: function (request, response) {
                _this._objectService.getObjectsFromServer(request.term).subscribe(function (objects) {
                    objects.unshift({ value: -1, label: "Add '" + request.term + "'" });
                    response(objects);
                });
            },
            select: function (event, ui) {
                var tagIds = Array.from(_this.tags, function (x) { return x.value; }), linked_object = {
                    name: ui.item.label.substring(5, ui.item.label.length - 1),
                    value: ui.item.value,
                    class: null,
                    rank: null
                };
                event.preventDefault();
                _this._objectService.linkObjects(tagIds, linked_object).subscribe(function (res) {
                    _this.objects = res;
                    $(event.target).val(null);
                    _this.cd.markForCheck();
                });
            },
            focus: function (event, ui) {
                event.preventDefault();
            },
            autoFocus: true
        };
        this.menu = {
            icon: "fa fa-caret-down",
            menuRight: true,
            items: [
                {
                    label: "Remove Item",
                    action: function (x) { console.log(x); }
                },
                {
                    label: "Copy contents",
                    action: function (x) {
                        document.execCommand('Copy', false, _this.objects[0].ObjectName);
                    }
                }
            ]
        };
        this.refreshObjects = function () {
            if (_this.initializeCtrl) {
                var tagIds = Array.from(_this.tags, function (x) { return x.value; });
                _this._objectService.getObjectsWithTags(tagIds).subscribe(function (objects) {
                    _this.objects = objects;
                    _this.cd.markForCheck();
                });
            }
            else {
                _this.initializeController();
            }
        };
        this.initializeController = function () {
            _this._objectService.initializeController(_this.initialTags.toString()).subscribe(function (response) {
                _this.objects = response.objects;
                _this.initialized = true;
                _this.tags = response.tags.map(function (el) { return { label: el.ObjectName, value: el.ObjectID }; });
                _this.tags.forEach(function (item, index) {
                    _this.addMenuItem(item);
                });
                _this.cd.markForCheck();
            });
        };
        this.filterFn = function (item) {
            return item[this.field] == this.value;
        };
        this.showObjectDetail = function () {
            if (!_this.initialized) {
                _this.initializeController();
            }
        };
        this.addMenuItem = function (newTag) {
            var newItem = {
                label: "Remove link to '" + newTag.label + "'",
                action: function () {
                    var selected = _this.objects.filter(_this.filterFn, { field: "select", value: true }).map(function (a) { return a.ObjectID; });
                    if (selected.length > 0) {
                        _this._objectService.removeLinks(newTag.value, selected.toString(), Array.from(_this.tags, function (x) { return x.value; })).subscribe(function (x) {
                            _this.objects = _this.objects.filter(function (obj) {
                                return obj.select !== true;
                            });
                        });
                    }
                    // Send remove link function, and then remove objects upon successful
                }
            };
            _this.menu.items.push(newItem);
        };
        this.returnSearch = function (input) {
            _this.searchText = input.value;
        };
    }
    Controller.prototype.ngAfterViewInit = function () {
        if (this.initializeCtrl) {
            this.initializeController();
        }
    };
    __decorate([
        core_1.Input("initial-tags"), 
        __metadata('design:type', Object)
    ], Controller.prototype, "initialTags", void 0);
    __decorate([
        core_1.Input("initialize-ctrl"), 
        __metadata('design:type', Object)
    ], Controller.prototype, "initializeCtrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Controller.prototype, "compact", void 0);
    Controller = __decorate([
        core_1.Component({
            selector: 'controller',
            templateUrl: '/app/components/controller/controller.html',
            directives: [object_block_list_1.ObjectBlockList, ng_tag_it_1.NgTagIt, autocomplete_1.Autocomplete, slimscroll_1.Slimscroll, menu_1.Menu],
            providers: [objects_service_1.ObjectService],
            host: {
                style: "\n\t\t\tdisplay:\t\t\tinline-block;\n\t\t"
            },
            styles: ["\n\t\tsection > div {\n\t\t\tpadding-top: \t5px;\n\t\t}\n\t\t.select-all {\n\t\t\tdisplay: inline-block;\n\t\t\twidth: 15px;\n\t\t\tbox-shadow: none;\n\t\t\tmargin: 2px 0 2px 18px;\n\t\t\tvertical-align: middle;\n\t\t}\n\t\t.add-link-input {\n\t\t\tdisplay: inline-block;\n\t\t\tmargin: 0 0 5px 5px;\n\t\t\tline-height: 12px;\n\t\t\tfont-size: 11px;\n\t\t\tpadding: 1px;\n\t\t\theight: 18px;\n\t\t}\n\t\t.list-dash {\n\t\t\tpadding-right: 0;\n\t\t}\n\t"]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof objects_service_1.ObjectService !== 'undefined' && objects_service_1.ObjectService) === 'function' && _a) || Object, core_1.ChangeDetectorRef])
    ], Controller);
    return Controller;
    var _a;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map