import { Component, Event, h, Prop, Watch } from '@stencil/core';
export class PlayButtons {
    constructor() {
        this.disablePlayButton = false;
        this.playing = false;
    }
    onpPlayingChange(newVal) {
        this.playing = newVal;
    }
    render() {
        return (h("div", { class: 'buttonsContainer', role: 'controlbuttons' },
            h("button", { class: 'buttonsContainer__button back', title: 'Back', "aria-label": 'Back', onClick: () => {
                    this.handleBackClick();
                } },
                h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' },
                    h("path", { d: 'M249.6 402V110L32 256l217.6 146zm12.8-146L480 402V110L262.4 256z', fill: '#B9DC0C' }))),
            this.disablePlayButton ?
                h("button", { class: 'buttonsContainer__button play', title: 'Play Button Disabled', "aria-label": 'Play Button Disabled' },
                    h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' },
                        h("path", { d: 'M96 52v408l320-204L96 52z', fill: '#A1A0AA', opacity: '0.75' }))) :
                h("button", { class: 'buttonsContainer__button play', title: this.playing ? 'Pause' : 'Play', "aria-label": 'PlayPause', onClick: () => {
                        this.handlePlayPauseClick();
                    } }, (this.playing) ?
                    h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' },
                        h("path", { d: 'M96 448h106.7V64H96v384zM309.3 64v384H416V64H309.3z', fill: '#B9DC0C' }))
                    :
                        h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' },
                            h("path", { d: 'M96 52v408l320-204L96 52z', fill: '#B9DC0C' }))),
            h("button", { class: 'buttonsContainer__button forward', title: 'Forward', "aria-label": 'Forward', onClick: () => {
                    this.handleForwardClick();
                } },
                h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' },
                    h("path", { d: 'M480 256L262.4 110v292L480 256zM32 110v292l217.6-146L32 110z', fill: '#B9DC0C' })))));
    }
    handleBackClick() {
        this.backClicked.emit();
    }
    handlePlayPauseClick() {
        this.playPauseClicked.emit();
    }
    handleForwardClick() {
        this.forwardClicked.emit();
    }
    static get is() { return "play-buttons"; }
    static get originalStyleUrls() { return {
        "$": ["play-buttons.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["play-buttons.css"]
    }; }
    static get properties() { return {
        "disablePlayButton": {
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
            "attribute": "disable-play-button",
            "reflect": false,
            "defaultValue": "false"
        },
        "playing": {
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
            "attribute": "playing",
            "reflect": false,
            "defaultValue": "false"
        }
    }; }
    static get events() { return [{
            "method": "forwardClicked",
            "name": "forwardClicked",
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
            "method": "backClicked",
            "name": "backClicked",
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
            "method": "playPauseClicked",
            "name": "playPauseClicked",
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
    static get watchers() { return [{
            "propName": "playing",
            "methodName": "onpPlayingChange"
        }]; }
}
