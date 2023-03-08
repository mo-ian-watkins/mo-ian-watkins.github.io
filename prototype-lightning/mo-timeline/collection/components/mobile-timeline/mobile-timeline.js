import { Component, Element, Event, h, Prop, Watch, Listen } from '@stencil/core';
import MomentumSlider from 'momentum-slider';
export class MobileTimeline {
    constructor() {
        this.externalUpdate = false;
        this.newTimeStepIndex = 0;
    }
    componentDidLoad() {
        this.generateSlider(this.timeSteps, this.loadedTimeStepMap);
    }
    onTimeStepIndexChange(newTimeStepIndex) {
        if (this.timeline) {
            this.timeStepIndex = newTimeStepIndex;
            if (this.newTimeStepIndex !== newTimeStepIndex) {
                this.newTimeStepIndex = newTimeStepIndex;
                this.externalUpdate = true;
                this.timeline.select(newTimeStepIndex);
            }
        }
    }
    onTimeStepsChange(newTimeSteps) {
        const slider = this.el.firstElementChild.querySelector('.ms-container');
        this.el.firstElementChild.removeChild(slider);
        this.timeline = null;
        this.generateSlider(newTimeSteps, this.loadedTimeStepMap);
    }
    onLoadedTimeStepsChange(newTimeSteps) {
        if (newTimeSteps.size > 0) {
            this.loadedTimeStepMap = newTimeSteps;
            if (typeof this.slides === 'undefined') {
                this.slides = this.el.firstElementChild.querySelectorAll('.timestep');
            }
            for (let i = 0; i < this.slides.length; i++) {
                if (typeof newTimeSteps.get(i) === 'undefined') {
                    this.slides[i].classList.add('disabled');
                }
                else {
                    this.slides[i].classList.remove('disabled');
                }
            }
        }
        else {
            this.slides = undefined;
        }
    }
    newIndex(event) {
        if (this.timeline) {
            if (this.externalUpdate) {
                this.externalUpdate = false;
                this.dateClicked.emit(event.detail);
            }
            if (!this.externalUpdate) {
                this.newTimeStepIndex = event.detail;
                this.dateClicked.emit(event.detail);
            }
        }
    }
    generateSlider(timesteps, loadedTimesteps) {
        const numberOfTimeSteps = timesteps.length;
        const newSelection = this.newIndexSelected;
        const getNewIndex = this.getNewIndex;
        // No obvious way to deal with closure scoping here other than to reference 'this'
        // tslint:disable-next-line: no-this-assignment
        const that = this;
        this.timeline = new MomentumSlider({
            el: this.el.firstChild,
            range: [1, numberOfTimeSteps],
            rangeContent(i) {
                if (that.disableTimesteps
                    && that.loadedTimeStepMap !== null
                    && typeof that.loadedTimeStepMap !== 'undefined') {
                    // If timestep data is being dynamically loaded need to check if this timestep has been loaded yet.
                    if (typeof loadedTimesteps.get(i - 1) !== 'undefined') {
                        return '<div class=\'timestep\'></div>';
                    }
                    else {
                        return '<div class=\'timestep disabled\' "></div>';
                    }
                }
                else {
                    return '<div class=\'timestep\'></div>';
                }
            },
            // Styles to interpolate as we move the slider
            // The first value corresponds to the adjacent elements
            // The second value corresponds to the current element
            style: {
                transform: [{ scale: [0.4, 1] }],
                opacity: [0.3, 1]
            },
            currentIndex: (this.timeStepIndex > numberOfTimeSteps - 1) ? 0 : this.timeStepIndex,
            change(newIndex, _oldIndex) {
                const index = getNewIndex(newIndex, numberOfTimeSteps);
                const slides = this.el.firstElementChild.querySelectorAll('.timestep');
                if (typeof slides[_oldIndex] !== 'undefined') {
                    slides[_oldIndex].classList.remove('selected');
                }
                slides[index].classList.add('selected');
                if (that.loadedTimeStepMap !== null
                    && typeof that.loadedTimeStepMap !== 'undefined'
                    && typeof that.loadedTimeStepMap.get(index) !== 'undefined') {
                    newSelection.emit(index);
                }
                else if (!that.disableTimesteps) {
                    // if timeline is set to have timesteps enabled by default then emit the event
                    newSelection.emit(index);
                }
            }
        });
    }
    getNewIndex(newIndex, numberOfTimeSteps) {
        let index;
        if (newIndex < 0 || newIndex === -0) {
            index = 0;
        }
        else if (newIndex > numberOfTimeSteps - 1) {
            index = numberOfTimeSteps - 1;
        }
        else {
            index = !isNaN(newIndex) ? newIndex : 0;
        }
        return index;
    }
    render() {
        return (h("div", { class: 'container' }));
    }
    static get is() { return "mobile-timeline"; }
    static get originalStyleUrls() { return {
        "$": ["mobile-timeline.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["mobile-timeline.css"]
    }; }
    static get properties() { return {
        "timeSteps": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "string[]",
                "resolved": "string[]",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            }
        },
        "loadedTimeStepMap": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "Map<number, string>",
                "resolved": "Map<number, string>",
                "references": {
                    "Map": {
                        "location": "global"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            }
        },
        "disableTimesteps": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "disable-timesteps",
            "reflect": false
        },
        "timeStepIndex": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "time-step-index",
            "reflect": false
        }
    }; }
    static get events() { return [{
            "method": "newIndexSelected",
            "name": "newIndexSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }, {
            "method": "dateClicked",
            "name": "dateClicked",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "any",
                "resolved": "any",
                "references": {}
            }
        }]; }
    static get elementRef() { return "el"; }
    static get watchers() { return [{
            "propName": "timeStepIndex",
            "methodName": "onTimeStepIndexChange"
        }, {
            "propName": "timeSteps",
            "methodName": "onTimeStepsChange"
        }, {
            "propName": "loadedTimeStepMap",
            "methodName": "onLoadedTimeStepsChange"
        }]; }
    static get listeners() { return [{
            "name": "newIndexSelected",
            "method": "newIndex",
            "target": undefined,
            "capture": false,
            "passive": false
        }]; }
}
