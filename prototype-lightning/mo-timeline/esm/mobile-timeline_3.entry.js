import { r as registerInstance, c as createEvent, h, g as getElement } from './index-db3f3b83.js';
import { c as createCommonjsModule, a as commonjsGlobal, T as TimeStepUtils, h as hooks } from './timestep-utils-e02ff818.js';
import { c as clone_1 } from './clone-66ec554f.js';
import { T as TimeStepService } from './timestep-service-4aec9583.js';

var momentumSlider = createCommonjsModule(function (module, exports) {
/* eslint-disable */
(function (global, factory) {
     module.exports = factory() ;
}(commonjsGlobal, (function () {
    /* eslint-enable */

    // fixes weird safari 10 bug where preventDefault is prevented
    // @see https://github.com/metafizzy/flickity/issues/457#issuecomment-254501356
    window.addEventListener('touchmove', function () {});

    function MomentumSlider(options) {
        this.o = extend({}, this.defaults, options);
        this.initHtml();
        this.initValues();
        this.initEvents();
        this.updateClassnames();
    }

    MomentumSlider.prototype = {
        defaults: {
            el: '.ms-container',
            cssClass: '',
            vertical: false,
            multiplier: 1,
            bounceCoefficient: 0.3,
            bounceMax: 100,
            loop: 0,
            interactive: true,
            reverse: false,
            currentIndex: 0
        },
        initHtml: function () {
            this.msContainer = is.str(this.o.el) ? document.querySelector(this.o.el) : this.o.el;
            if (this.o.range) {
                var html = '<div class="ms-container ' + this.o.cssClass + '"><ul class="ms-track">';
                for (var i = this.o.range[0]; i <= this.o.range[1]; i++) {
                    html += is.fnc(this.o.rangeContent) ? buildSlide(this.o.rangeContent(i)) : buildSlide(i);
                }
                html += '</ul></div>';
                var msHtml = document.createElement('div');
                msHtml.innerHTML = html;
                this.msContainer.appendChild(msHtml.firstChild);
                this.msContainer = this.msContainer.lastChild;
            }
            this.msContainer.classList.add('ms-container--' + (this.o.vertical ? 'vertical' : 'horizontal'));
            if (this.o.reverse) {
                this.msContainer.classList.add('ms-container--reverse');
            }
            this.msTrack = this.msContainer.children[0];
            this.msSlides = this.msTrack.children;
            this.step = this.o.vertical ? this.msSlides[0].scrollHeight : this.msSlides[0].scrollWidth;
            this.sliderLength = this.msSlides.length;
            if (this.o.loop) {
                var loopLength, slideIndex, fragment;
                // begin
                fragment = document.createDocumentFragment();
                loopLength = this.o.loop;
                slideIndex = this.sliderLength - loopLength;
                while (loopLength--) {
                    fragment.appendChild(this.msSlides[slideIndex++].cloneNode(true));
                }
                this.msTrack.insertBefore(fragment, this.msTrack.firstChild);
                // end
                fragment = document.createDocumentFragment();
                slideIndex = loopLength = this.o.loop;
                while (loopLength--) {
                    fragment.appendChild(this.msSlides[slideIndex++].cloneNode(true));
                }
                this.msTrack.appendChild(fragment);
                // update
                this.sliderLength += this.o.loop * 2;
            }
            this.sliderWidth = this.sliderLength * this.step;
        },
        initValues: function () {
            this.boundMin = this.o.reverse ? 0 : -this.step * (this.sliderLength - 1);
            this.boundMax = this.o.reverse ? this.step * (this.sliderLength - 1) : 0;
            this.targetPosition = this.targetPosition || 0;
            this.ticking = false;
            this.enabled = true;
            this.pointerActive = false;
            this.pointerMoved = false;
            this.trackingPoints = [];
            this.msTrack.style[this.o.vertical ? 'height' : 'width'] = this.sliderWidth + 'px';
            this.currentIndex = (this.currentIndex || this.o.currentIndex) + this.o.loop;
            this.updateSlider(undefined, true);
            this.renderTarget();
            var index = this.sliderLength;
            while (index--) {
                this.setStyle(index, this.currentIndex == index ? 0 : -1);
            }
        },
        initEvents: function () {
            if (this.o.interactive) {
                this.msContainer.addEventListener('touchstart', this.onDown.bind(this));
                this.msContainer.addEventListener('mousedown', this.onDown.bind(this));
                document.addEventListener('touchmove', this.onMove.bind(this), getPassiveSupported() ? {
                    passive: false
                } : false);
                document.addEventListener('touchend', this.onUp.bind(this));
                document.addEventListener('touchcancel', this.stopTracking.bind(this));
                document.addEventListener('mousemove', this.onMove.bind(this), getPassiveSupported() ? {
                    passive: false
                } : false);
                document.addEventListener('mouseup', this.onUp.bind(this));
                if (this.o.prevEl) {
                    this.prevEl = is.str(this.o.prevEl) ? document.querySelector(this.o.prevEl) : this.o.prevEl;
                    this.prevEl.addEventListener('click', this.prev.bind(this));
                }
                if (this.o.nextEl) {
                    this.nextEl = is.str(this.o.nextEl) ? document.querySelector(this.o.nextEl) : this.o.nextEl;
                    this.nextEl.addEventListener('click', this.next.bind(this));
                }
            }
            window.addEventListener('resize', this.onResize.bind(this));
        },
        prev: function () {
            if (this.enabled) {
                this.updateSlider(Math.round(this.targetPosition / this.step) * this.step + (this.o.reverse ? -this.step : this.step));
            }
        },
        next: function () {
            if (this.enabled) {
                this.updateSlider(Math.round(this.targetPosition / this.step) * this.step + (this.o.reverse ? this.step : -this.step));
            }
        },
        select: function (index) {
            if (this.enabled) {
                // this.currentIndex = index;
                // this.updateSlider();
                this.updateSlider((index + this.o.loop) * (this.o.reverse ? this.step : -this.step));
            }
        },
        setStyleToNode: function (node, style, diff, lower) {
            if (style) {
                var value = '';
                for (var property in style) {
                    if (property[0] == '.') {
                        this.setStyleToNode(node.querySelector(property), style[property], diff, lower);
                    } else if (property == 'transform') {
                        style[property].forEach(function(transform) {
                            for (var t in transform) {
                                value += t + '(' + getCurrentValue(transform[t], diff, lower);
                                if (t == 'rotate') {
                                    value += 'deg';
                                } else if (t == 'translateX' || t == 'translateY' || t == 'translateZ') {
                                    value += 'px';
                                }
                                value += ') ';
                            }
                        });
                    } else {
                        value = getCurrentValue(style[property], diff, lower);
                    }
                    node.style[property] = value;
                }
            }
        },
        setStyle: function (index, diff, lower) {
            this.setStyleToNode(this.msSlides[index], this.o.style, diff, lower);
            if (is.fnc(this.o.customStyles)) {
                this.o.customStyles(index, diff, lower);
            }
        },
        renderTarget: function () {
            if (this.o.sync) {
                var syncIndex = this.o.sync.length;
                var syncSlider;
                while (syncIndex--) {
                    syncSlider = this.o.sync[syncIndex];
                    syncSlider.targetPosition = (syncSlider.o.reverse ? -1 : 1) * this.targetPosition / this.sliderWidth * syncSlider.sliderWidth;
                    syncSlider.renderTarget();
                }
            }

            var paddingLength = this.o.loop * this.step;
            var contentLength = this.sliderWidth - (paddingLength * 2);
            if (this.o.loop) {
                if (-this.targetPosition < paddingLength) {
                    while (-this.targetPosition < paddingLength) {
                        this.targetPosition -= contentLength;
                    }
                } else if (-this.targetPosition >= paddingLength + contentLength) {
                    while (-this.targetPosition >= paddingLength + contentLength) {
                        this.targetPosition += contentLength;
                    }
                }
            }

            // var actualIndex = -this.targetPosition / this.step;
            var actualIndex = (this.o.reverse ? 1 : -1) * this.targetPosition / this.step;
            this.onChangeCurrentIndex(Math.round(actualIndex));
            var lowerIndex = Math.floor(actualIndex);
            var higherIndex = Math.ceil(actualIndex);
            var lowerDiff = actualIndex - lowerIndex;
            var higherDiff = actualIndex - higherIndex;

            if (!is.und(this.lowerIndex) && this.lowerIndex != lowerIndex && this.lowerIndex != higherIndex) {
                this.setStyle(this.lowerIndex, 1, true);
            }
            if (!is.und(this.higherIndex) && this.higherIndex != lowerIndex && this.higherIndex != higherIndex) {
                this.setStyle(this.higherIndex, -1);
            }

            if (lowerIndex >= 0 && lowerIndex < this.sliderLength) {
                this.setStyle(lowerIndex, lowerDiff, true);
                this.lowerIndex = lowerIndex;
            }
            if (higherIndex >= 0 && higherIndex < this.sliderLength) {
                this.setStyle(higherIndex, higherDiff);
                this.higherIndex = higherIndex;
            }

            var transformValue = 'translate' + (this.o.vertical ? 'Y' : 'X') + '(' + this.targetPosition + 'px)';
            this.msTrack.style[transformProperty] = transformValue;
        },
        onDown: function (ev) {
            if (this.enabled && !this.pointerActive) {
                var event = normalizeEvent(ev);
                this.pointerActive = true;
                this.pointerId = event.id;

                this.pointerLastX = this.pointerCurrentX = event.x;
                this.pointerLastY = this.pointerCurrentY = event.y;
                this.trackingPoints = [];
                this.addTrackingPoint(this.pointerLastX, this.pointerLastY);

                if (this.animateInstance) this.animateInstance.stop();
            }
        },
        onMove: function (ev) {
            if (this.enabled && this.pointerActive) {
                var event = normalizeEvent(ev);

                if (event.id === this.pointerId) {
                    this.pointerCurrentX = event.x;
                    this.pointerCurrentY = event.y;
                    
                    var shouldMoveSlider = this.pointerMoved;
                    if (!this.pointerMoved) {
                        var movingVertically =
                            Math.abs(Math.abs(this.pointerCurrentX) - Math.abs(this.pointerLastX)) <
                            Math.abs(Math.abs(this.pointerCurrentY) - Math.abs(this.pointerLastY));
                        if (
                            (this.o.vertical && movingVertically) ||
                            (!this.o.vertical && !movingVertically)
                        ) {
                            shouldMoveSlider = true;
                        }
                    }

                    if (shouldMoveSlider) {
                        ev.preventDefault();
                        this.pointerMoved = true;
                        this.addTrackingPoint(this.pointerLastX, this.pointerLastY);
                        this.requestTick();
                    } else {
                        this.stopTracking(-1);
                    }
                }
            }
        },
        onUp: function (ev) {
            if (this.enabled && this.pointerActive) {
                var event = normalizeEvent(ev);

                if (event.id === this.pointerId) {
                    var slide = ev.target;
                    if (this.msTrack.contains(slide)) {
                        while (!slide.matches('.ms-slide, .ms-track')) {
                            slide = slide.parentNode;
                        }
                    }
                    var index = Array.prototype.indexOf.call(this.msSlides, slide);
                    if (!this.pointerMoved) {
                        if (index !== -1) {
                            this.currentIndex = index;
                            this.updateSlider();
                        }
                    }
                    this.stopTracking(index);
                }
            }
        },
        onResize: function () {
            // this.initValues();
        },
        stopTracking: function (index) {
            this.pointerActive = false;
            if (this.pointerMoved || index === -1) {
                this.pointerMoved = false;
                this.addTrackingPoint(this.pointerLastX, this.pointerLastY);
                this.startDecelAnim();
            }
        },
        addTrackingPoint: function (x, y) {
            var time = Date.now();
            while (this.trackingPoints.length > 0) {
                if (time - this.trackingPoints[0].time <= 100) {
                    break;
                }
                this.trackingPoints.shift();
            }

            this.trackingPoints.push({
                x: x,
                y: y,
                time: time
            });
        },
        updateAndRender: function () {
            var pointerChange = this.o.vertical ? this.pointerCurrentY - this.pointerLastY : this.pointerCurrentX - this.pointerLastX;
            this.targetPosition += pointerChange * this.o.multiplier;

            if (this.o.bounceCoefficient) {
                var diff = this.checkBounds();
                if (diff !== 0) {
                    this.targetPosition -= pointerChange * dragOutOfBoundsMultiplier(diff) * this.o.multiplier;
                }
            } else {
                this.checkBounds(true);
            }

            this.renderTarget();

            this.pointerLastX = this.pointerCurrentX;
            this.pointerLastY = this.pointerCurrentY;
            this.ticking = false;
        },
        requestTick: function () {
            if (!this.ticking) {
                requestAnimationFrame(this.updateAndRender.bind(this));
            }
            this.ticking = true;
        },
        checkBounds: function (restrict) {
            var diff = 0;

            if (this.boundMin !== undefined && this.targetPosition < this.boundMin) {
                diff = this.boundMin - this.targetPosition;
            } else if (this.boundMax !== undefined && this.targetPosition > this.boundMax) {
                diff = this.boundMax - this.targetPosition;
            }

            if (restrict) {
                if (diff !== 0) {
                    this.targetPosition = diff > 0 ? this.boundMin : this.boundMax;
                }
            }

            return diff;
        },
        startDecelAnim: function () {
            var firstPoint = this.trackingPoints[0];
            var lastPoint = this.trackingPoints[this.trackingPoints.length - 1];

            var positionOffset = this.o.vertical ? lastPoint.y - firstPoint.y : lastPoint.x - firstPoint.x;
            var timeOffset = lastPoint.time - firstPoint.time;

            var D = timeOffset / 15 / this.o.multiplier;
            this.decVel = positionOffset / D || 0;

            var newTargetPosition = this.targetPosition + (this.decVel * 12);
            var newTargetPositionOffset = newTargetPosition % this.step;
            newTargetPosition = newTargetPosition - newTargetPositionOffset;
            if (Math.abs(newTargetPositionOffset) > this.step / 2) {
                newTargetPosition += (newTargetPositionOffset > 0 ? 1 : -1) * this.step;
            }

            this.updateSlider(newTargetPosition);
        },
        fixCurrentIndex: function () {
            if (this.o.loop) {
                if (this.currentIndex < this.o.loop) {
                    this.currentIndex = this.sliderLength - this.o.loop + (this.currentIndex - this.o.loop);
                } else if (this.currentIndex > this.sliderLength - this.o.loop - 1) {
                    this.currentIndex = this.currentIndex + this.o.loop * 2 - this.sliderLength;
                }
            }
        },
        updateSlider: function (newTargetPosition, initial) {
            if (is.und(newTargetPosition)) {
                newTargetPosition = (this.o.reverse ? 1 : -1) * this.currentIndex * this.step;
            } else {
                this.currentIndex = (this.o.reverse ? 1 : -1) * newTargetPosition / this.step;
            }
            this.fixCurrentIndex();
            if (newTargetPosition !== this.targetPosition) {
                this.updateClassnames();
                this.animateTarget(newTargetPosition, initial);
            }
        },
        updateClassnames: function () {
            if (this.prevEl) {
                if (this.currentIndex === 0) {
                    this.prevEl.classList.add('ms-first');
                } else {
                    this.prevEl.classList.remove('ms-first');
                }
            }
            if (this.nextEl) {
                if (this.currentIndex === this.sliderLength - 1) {
                    this.nextEl.classList.add('ms-last');
                } else {
                    this.nextEl.classList.remove('ms-last');
                }
            }
        },
        animateTarget: function (newTargetPosition, initial, back) {
            if (this.animateInstance) this.animateInstance.stop();
            var _ = this;
            var from = this.targetPosition;
            var to = newTargetPosition;
            this.animateInstance = animate(function(progress) {
                _.targetPosition = to > from ? from + ((to - from) * progress) : from - ((from - to) * progress); // 0 - ((0 - -2100) * progress)
                var sliderMin = _.o.reverse ? 0 : -(_.sliderLength - 1) * _.step;
                var sliderMax = _.o.reverse ? (_.sliderLength - 1) * _.step : 0;
                if (!back &&
                    !_.o.loop &&
                    _.o.bounceCoefficient &&
                    (
                        (
                            _.targetPosition > sliderMax &&
                            _.targetPosition > sliderMax + Math.min((to - sliderMax) * _.o.bounceCoefficient, _.o.bounceMax)
                        ) ||
                        (
                            _.targetPosition < sliderMin &&
                            _.targetPosition < sliderMin - Math.min(-(to - sliderMin) * _.o.bounceCoefficient, _.o.bounceMax)
                        )
                    )
                ) {
                    _.animateInstance.stop();
                    _.animateTarget(_.targetPosition < sliderMin ? sliderMin : sliderMax, false, true);
                    _.currentIndex = _.targetPosition < sliderMin ? 0 : _.sliderLength - 1;
                } else {
                    _.renderTarget();
                }
            }, initial ? 0 : 500, function(t) { return t * (2 - t); });
        },
        onChangeCurrentIndex: function (index) {
            var currentIndex = this.o.loop ? index - this.o.loop : index;
            currentIndex = currentIndex === this.sliderLength - this.o.loop * 2 ? 0 : currentIndex;
            if (is.fnc(this.o.change) && currentIndex !== this.lastCurrentIndex) {
                this.o.change(currentIndex, this.lastCurrentIndex);
                this.lastCurrentIndex = currentIndex;
            }
        },
        getCurrentIndex: function () {
            return this.o.loop ? this.currentIndex - this.o.loop : this.currentIndex;
        },
        enable: function () {
            this.enabled = true;
        },
        disable: function () {
            this.enabled = false;
        }
    };


    // Utils

    var is = {
        arr: function (a) { return Array.isArray(a); },
        str: function (a) { return typeof a === 'string'; },
        und: function (a) { return typeof a === 'undefined'; },
        fnc: function(a) { return typeof a === 'function' }
    };

    function stringToHyphens(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    function getCSSValue(el, prop) {
        if (prop in el.style) {
            return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
        }
    }

    var t = 'transform';
    var transformProperty = (getCSSValue(document.body, t) ? t : '-webkit-' + t);

    function buildSlide(value) {
        return '<li class="ms-slide">' + value + '</li>';
    }

    function extendSingle(target, source) {
        for (var key in source)
            target[key] = is.arr(source[key]) ? source[key].slice(0) : source[key];
        return target;
    }

    function extend(target) {
        if (!target) target = {};
        for (var i = 1; i < arguments.length; i++)
            extendSingle(target, arguments[i]);
        return target;
    }

    function animate(step, duration, easing) {
        if (duration) {
            var start = performance.now();
            var timer = null;
            var stopped = false;
            var animation = function (t) {
                var progress = (t - start) / duration;
                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;
                if (is.fnc(easing)) progress = easing(progress);
                step(progress);
                if (progress !== 1 && !stopped) timer = requestAnimationFrame(animation);
            };
            timer = requestAnimationFrame(animation);
            return new function() {
                this.stop = function() {
                    if (timer) cancelAnimationFrame(timer);
                    stopped = true;
                };
            };
        } else {
            step(1);
        }
    }

    /* eslint-disable */
    function getPassiveSupported() {
        var passiveSupported = false;
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function get() {
                    passiveSupported = true;
                }
            });

            window.addEventListener('test', null, options);
        } catch (err) {}
        getPassiveSupported = function () {
            return passiveSupported;
        };
        return passiveSupported;
    }
    /* eslint-enable */

    function normalizeEvent(ev) {
        if (ev.type === 'touchmove' || ev.type === 'touchstart' || ev.type === 'touchend') {
            var touch = ev.targetTouches[0] || ev.changedTouches[0];
            return {
                x: touch.clientX,
                y: touch.clientY,
                id: touch.identifier
            };
        } else {
            return {
                x: ev.clientX,
                y: ev.clientY,
                id: null
            };
        }
    }

    function dragOutOfBoundsMultiplier(val) {
        return 0.000005 * Math.pow(val, 2) + 0.0001 * val + 0.55;
    }

    function getCurrentValue(values, diff, lower) {
        var lowerValue = values[0];
        var centerValue = values[1];
        var higherValue = values[2] || lowerValue;
        var diffValue = lower ? centerValue - lowerValue : centerValue - higherValue;
        return lower ? centerValue - diffValue * diff : centerValue + diffValue * diff;
    }

    return extend(MomentumSlider, {
        extend: extend,
        transformProperty: transformProperty,
        getCurrentValue: getCurrentValue
    });

})));
});

const mobileTimelineCss = ".container{width:100%;height:100%;overflow:hidden}.ms-container{position:relative;top:50%;width:340px;max-width:100%;margin:0 auto;overflow:hidden;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.ms-track{position:relative;left:calc(50% - 25px);width:340px;white-space:nowrap;font-size:0;list-style:none;padding:0;margin:0;will-change:transform}.ms-slide{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:50px;height:100%;font-size:50px;font-family:\"Roboto Mono\", monospace;color:#FFFFFF;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;will-change:transform}.timestep{width:7px;height:30px;border-radius:30%;background-color:#FFFFFF}.timestep.selected{background-color:#b9dc0c}.timestep.selected.disabled{background-color:#53676D}.timestep.disabled{background-color:#53676D}";

const MobileTimeline = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.newIndexSelected = createEvent(this, "newIndexSelected", 7);
        this.dateClicked = createEvent(this, "dateClicked", 7);
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
        this.timeline = new momentumSlider({
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
    get el() { return getElement(this); }
    static get watchers() { return {
        "timeStepIndex": ["onTimeStepIndexChange"],
        "timeSteps": ["onTimeStepsChange"],
        "loadedTimeStepMap": ["onLoadedTimeStepsChange"]
    }; }
};
MobileTimeline.style = mobileTimelineCss;

const playButtonsCss = ".buttonsContainer .buttonsContainer__button{background-color:transparent;height:46.5px;width:46.5px;border:none;text-align:-webkit-center;cursor:pointer}.buttonsContainer .buttonsContainer__button svg{display:block;height:60%}";

const PlayButtons = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.forwardClicked = createEvent(this, "forwardClicked", 7);
        this.backClicked = createEvent(this, "backClicked", 7);
        this.playPauseClicked = createEvent(this, "playPauseClicked", 7);
        this.disablePlayButton = false;
        this.playing = false;
    }
    onpPlayingChange(newVal) {
        this.playing = newVal;
    }
    render() {
        return (h("div", { class: 'buttonsContainer', role: 'controlbuttons' }, h("button", { class: 'buttonsContainer__button back', title: 'Back', "aria-label": 'Back', onClick: () => {
                this.handleBackClick();
            } }, h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' }, h("path", { d: 'M249.6 402V110L32 256l217.6 146zm12.8-146L480 402V110L262.4 256z', fill: '#B9DC0C' }))), this.disablePlayButton ?
            h("button", { class: 'buttonsContainer__button play', title: 'Play Button Disabled', "aria-label": 'Play Button Disabled' }, h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' }, h("path", { d: 'M96 52v408l320-204L96 52z', fill: '#A1A0AA', opacity: '0.75' }))) :
            h("button", { class: 'buttonsContainer__button play', title: this.playing ? 'Pause' : 'Play', "aria-label": 'PlayPause', onClick: () => {
                    this.handlePlayPauseClick();
                } }, (this.playing) ?
                h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' }, h("path", { d: 'M96 448h106.7V64H96v384zM309.3 64v384H416V64H309.3z', fill: '#B9DC0C' }))
                :
                    h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' }, h("path", { d: 'M96 52v408l320-204L96 52z', fill: '#B9DC0C' }))), h("button", { class: 'buttonsContainer__button forward', title: 'Forward', "aria-label": 'Forward', onClick: () => {
                this.handleForwardClick();
            } }, h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' }, h("path", { d: 'M480 256L262.4 110v292L480 256zM32 110v292l217.6-146L32 110z', fill: '#B9DC0C' })))));
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
    static get watchers() { return {
        "playing": ["onpPlayingChange"]
    }; }
};
PlayButtons.style = playButtonsCss;

const timeLineCss = ".timesteps{white-space:initial;position:relative}";

const Timeline = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.timeStepProperties = [];
        this.warnings = [];
        this.timeLineConstraint = { left: 0, right: Number.MAX_SAFE_INTEGER };
    }
    constrainTimelineHandler() {
        this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timeSteps.length);
    }
    onTimeStepsChange(newTimesteps) {
        // Empty any existing timeStepProperties so everything is regenerated for the new timesteps
        this.timeStepProperties = [];
        this.timeStepSpacingService.setTimesteps(newTimesteps);
        this.timeLineConstraint = this.timeStepUtils.resetTimelineConstraint(this.timeSteps.length);
    }
    watchMouseState(newVal) {
        this.mouseState = newVal;
    }
    constraintChangedHandler(event) {
        if (event.detail !== null) {
            this.timeLineConstraint = event.detail;
        }
    }
    componentWillLoad() {
        this.timeStepSpacingService = new TimeStepService(this.timeSteps);
        this.timeStepUtils = new TimeStepUtils();
    }
    render() {
        if (this.timeSteps) {
            return (h("div", { class: 'timesteps' }, h("time-slider", { timeSteps: this.timeSteps, timeStepProperties: this.timeStepProperties, loadedTimeStepMap: this.loadedTimeStepMap, timeStepIndex: this.timeStepIndex, disableTimesteps: this.disableTimesteps, mouseState: this.mouseState, constrainTimeline: this.constrainTimeline }), (this.warnings && this.warnings.length > 0) &&
                h("timeline-warnings", { firstTimeStep: this.timeSteps[0], lastTimeStep: this.timeSteps[this.timeSteps.length - 1], warnings: this.warnings }), this.timeSteps.map((timeStep, index) => {
                return (h("time-step", { timeData: this.generateTimeStepProp(timeStep, index, this.constrainTimeline), labelFormat: this.labelFormat }));
            })));
        }
        else {
            return null;
        }
    }
    generateTimeStepProp(time, timeStepIndex, constrainTimeline) {
        let timeStepProperty = this.timeStepProperties[timeStepIndex];
        // only regenerate if, either we have never set one or the timesteps have changed.
        if (timeStepProperty === null || typeof timeStepProperty === 'undefined') {
            const timeStep = hooks(time);
            const previousTimeStep = (timeStepIndex > 0) ? hooks(this.timeSteps[timeStepIndex - 1]) : undefined;
            const maxIndex = this.timeSteps.length - 1;
            const nextTimeStep = (timeStepIndex < maxIndex) ? hooks(this.timeSteps[timeStepIndex + 1]) : undefined;
            timeStepProperty = {
                nextTimeStep,
                timeStep,
                previousTimeStep,
                style: this.timeStepSpacingService.generatePaddingWidths(timeStepIndex),
                enabled: !this.disableTimesteps
            };
        }
        const timeStepEnabled = timeStepProperty.enabled;
        // Need to detemine is this timestep should be enabled or disabled.
        // The timeStepMap is only relevant if we are loading timesteps.  If we aren't set it to null and only the
        // constraint will be used to determine if the timestep should be enabled or disabled.
        const timeStepMap = this.disableTimesteps ? this.loadedTimeStepMap : null;
        // tslint:disable-next-line:prefer-conditional-expression
        if (this.disableTimesteps && timeStepMap === null) {
            timeStepProperty.enabled = false;
        }
        else {
            timeStepProperty.enabled = this.timeStepUtils.isValidTimeStep(timeStepIndex, timeStepMap, this.timeLineConstraint);
        }
        if (!constrainTimeline && !this.disableTimesteps) {
            timeStepProperty.enabled = true;
        }
        if (timeStepEnabled !== timeStepProperty.enabled) {
            // the status of this timestep has changed.  Need to clone it to create a new object so that the timestep
            // is rerendered (changing object properties doesn't force a rerender)
            timeStepProperty = clone_1(timeStepProperty);
        }
        this.timeStepProperties[timeStepIndex] = timeStepProperty;
        return timeStepProperty;
    }
    static get watchers() { return {
        "constrainTimeline": ["constrainTimelineHandler"],
        "timeSteps": ["onTimeStepsChange"],
        "mouseState": ["watchMouseState"]
    }; }
};
Timeline.style = timeLineCss;

export { MobileTimeline as mobile_timeline, PlayButtons as play_buttons, Timeline as time_line };
