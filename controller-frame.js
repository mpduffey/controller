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
var widget_1 = require('components/widget/widget');
var controller_1 = require('components/controller/controller');
var ControllerFrame = (function () {
    function ControllerFrame() {
    }
    __decorate([
        core_1.Input("initial-tags"), 
        __metadata('design:type', Object)
    ], ControllerFrame.prototype, "initialTags", void 0);
    __decorate([
        core_1.Input("initialize-ctrl"), 
        __metadata('design:type', Object)
    ], ControllerFrame.prototype, "initializeCtrl", void 0);
    ControllerFrame = __decorate([
        core_1.Component({
            selector: 'controller-frame',
            directives: [widget_1.Widget, controller_1.Controller],
            template: "\n\t\t<widget [widgetTitle]=\"controllerTitle\" class=\"max-height flex-container-column\" showContent=\"true\">\n\t\t\t<controller [initialize-ctrl]=\"initializeCtrl\" class=\"flex-item flex-container-column float-left\" style=\"width: 100%\" [initial-tags]=\"initialTags\"></controller>\n\t\t</widget>\n\t"
        }), 
        __metadata('design:paramtypes', [])
    ], ControllerFrame);
    return ControllerFrame;
}());
exports.ControllerFrame = ControllerFrame;
//# sourceMappingURL=controller-frame.js.map