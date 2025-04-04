/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = __webpack_require__(7);
var CanvasBound = /** @class */ (function () {
    function CanvasBound(xMin, yMin, xMax, yMax) {
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
    }
    Object.defineProperty(CanvasBound.prototype, "width", {
        get: function () {
            return this.xMax - this.xMin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasBound.prototype, "height", {
        get: function () {
            return this.yMax - this.yMin;
        },
        enumerable: true,
        configurable: true
    });
    CanvasBound.prototype.getRandomParticule = function (maxAge) {
        var x = Math.round(Math.floor(Math.random() * this.width) + this.xMin);
        var y = Math.round(Math.floor(Math.random() * this.height) + this.yMin);
        return new particle_1.default(x, y, maxAge);
    };
    CanvasBound.prototype.resetParticule = function (p) {
        var x = Math.round(Math.floor(Math.random() * this.width) + this.xMin);
        var y = Math.round(Math.floor(Math.random() * this.height) + this.yMin);
        p.reset(x, y);
        return p;
    };
    return CanvasBound;
}());
exports.default = CanvasBound;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MapBound = /** @class */ (function () {
    function MapBound(north, east, south, west) {
        this.north = north * Math.PI / 180;
        this.east = east * Math.PI / 180;
        this.south = south * Math.PI / 180;
        this.west = west * Math.PI / 180;
    }
    Object.defineProperty(MapBound.prototype, "width", {
        get: function () {
            return (720 + this.east - this.west) % 360;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapBound.prototype, "height", {
        get: function () {
            return (360 + this.north - this.south) % 180;
        },
        enumerable: true,
        configurable: true
    });
    return MapBound;
}());
exports.default = MapBound;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(3);
var grid_1 = __webpack_require__(8);
var colorScale_1 = __webpack_require__(9);
var animationBucket_1 = __webpack_require__(10);
var Windy = /** @class */ (function () {
    function Windy(options) {
        this.canvas = null;
        this.particuleMultiplier = 1 / 300;
        this.autoColorRange = false;
        this.particules = [];
        this.animationLoop = null;
        this.then = 0;
        this.canvas = options.canvas;
        if (options.minVelocity === undefined && options.maxVelocity === undefined) {
            this.autoColorRange = true;
        }
        this.colorScale = new colorScale_1.default(options.minVelocity || 0, options.maxVelocity || 10, options.colorScale);
        this.velocityScale = options.velocityScale || 0.01;
        this.particleAge = options.particleAge || 64;
        this.setData(options.data);
        this.particuleMultiplier = options.particleMultiplier || 1 / 300;
        this.particuleLineWidth = options.lineWidth || 1;
        var frameRate = options.frameRate || 15;
        this.frameTime = 1000 / frameRate;
    }
    Object.defineProperty(Windy.prototype, "particuleCount", {
        get: function () {
            var particuleReduction = ((/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent)) ? (Math.pow(window.devicePixelRatio, 1 / 3) || 1.6) : 1;
            return Math.round(this.layer.canvasBound.width * this.layer.canvasBound.height * this.particuleMultiplier) * particuleReduction;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Load data
     * @param data
     */
    Windy.prototype.setData = function (data) {
        var uData = null;
        var vData = null;
        var grid = [];
        data.forEach(function (record) {
            switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
                case "2,31":
                    uData = record;
                    break;
                case "2,32":
                    vData = record;
                    break;
                /*         case "2,149":
                          vData = record;
                          break; */
                default:
            }
        });
        if (!uData || !vData) {
            console.warn("Data are not correct format");
            return;
        }
        // Dir/Speed to U/V
        uData.data.forEach(function (u, index) {
            var phi = (u * Math.PI / 180);
            uData.data[index] = -vData.data[index] * Math.sin(phi);
            vData.data[index] = -vData.data[index] * Math.cos(phi);
            grid.push(new vector_1.default(uData.data[index], vData.data[index]));
        });
        this.grid = new grid_1.default(grid, uData.header.la2, // scanmode 64
        uData.header.lo1, uData.header.dy, uData.header.dx, uData.header.ny, uData.header.nx);
        this.λ0 = uData.header.lo1;
        this.φ0 = uData.header.la1;
        this.Δλ = uData.header.dx;
        this.Δφ = uData.header.dy;
        this.ni = uData.header.nx;
        this.nj = uData.header.ny; // number of grid points W-E and N-S (e.g., 144 x 73)
        var p = 0;
        var isContinuous = Math.floor(this.ni * this.Δλ) >= 360;
        //for (var j = 0; j < this.nj; j++) { // scanmode = 0
        for (var j = this.nj; j > 0; j--) {
            var row = [];
            for (var i = 0; i < this.ni; i++, p++) {
                row[i] = this.grid.data[p];
            }
            if (isContinuous) {
                // For wrapped grids, duplicate first column as last column to simplify interpolation logic
                row.push(row[0]);
            }
            this.grid[j] = row;
        }
        if (this.autoColorRange) {
            var minMax = this.grid.valueRange;
            this.colorScale.setMinMax(minMax[0], minMax[1]);
        }
    };
    Windy.prototype.floorMod = function (a, n) {
        return a - n * Math.floor(a / n);
    };
    ;
    Windy.prototype.isValue = function (x) {
        return x !== null && x !== undefined;
    };
    ;
    Windy.prototype.bilinearInterpolateVector = function (x, y, g00, g10, g01, g11) {
        var rx = (1 - x);
        var ry = (1 - y);
        var a = rx * ry, b = x * ry, c = rx * y, d = x * y;
        var u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
        var v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
        return [u, v, Math.sqrt(u * u + v * v)];
    };
    ;
    /* Get interpolated grid value from Lon/Lat position
    * @param λ {Float} Longitude
    * @param φ {Float} Latitude
    * @returns {Object}
    */
    Windy.prototype.interpolate = function (λ, φ) {
        if (!this.grid) {
            return null;
        }
        var i = this.floorMod(λ - this.λ0, 360) / this.Δλ; // calculate longitude index in wrapped range [0, 360)
        var j = (this.φ0 - φ) / this.Δφ; // calculate latitude index in direction +90 to -90
        var fi = Math.floor(i);
        var ci = fi + 1;
        var fj = Math.floor(j);
        var cj = fj + 1;
        var row = this.grid[fj]; //Dont know why he dosent found any row ERRRROR
        if (row) {
            var g00 = row[fi];
            var g10 = row[ci];
            if (this.isValue(g00) && this.isValue(g10) && (row = this.grid[cj])) {
                var g01 = row[fi];
                var g11 = row[ci];
                if (this.isValue(g01) && this.isValue(g11)) {
                    // All four points found, so interpolate the value.
                    return this.bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
                }
            }
        }
        return null;
    };
    ;
    Windy.prototype.getParticuleWind = function (p) {
        var lngLat = this.layer.canvasToMap(p.x, p.y);
        var wind = this.grid.get(lngLat[0], lngLat[1]);
        p.intensity = wind.intensity;
        var mapArea = this.layer.mapBound.height * this.layer.mapBound.width;
        var velocityScale = this.velocityScale * Math.pow(mapArea, 0.4);
        this.layer.distort(lngLat[0], lngLat[1], p.x, p.y, velocityScale, wind);
        return wind;
    };
    Windy.prototype.start = function (layer) {
        this.context2D = this.canvas.getContext("2d");
        this.context2D.lineWidth = this.particuleLineWidth;
        this.context2D.fillStyle = "rgba(0, 0, 0, 0.97)";
        this.context2D.globalAlpha = 0.6;
        this.layer = layer;
        this.animationBucket = new animationBucket_1.default(this.colorScale);
        this.particules.splice(0, this.particules.length);
        for (var i = 0; i < this.particuleCount; i++) {
            this.particules.push(this.layer.canvasBound.getRandomParticule(this.particleAge));
        }
        this.then = new Date().getTime();
        this.frame();
    };
    Windy.prototype.frame = function () {
        var _this = this;
        this.animationLoop = requestAnimationFrame(function () {
            _this.frame();
        });
        var now = new Date().getTime();
        var delta = now - this.then;
        if (delta > this.frameTime) {
            this.then = now - (delta % this.frameTime);
            this.evolve();
            this.draw();
        }
    };
    Windy.prototype.evolve = function () {
        var _this = this;
        this.animationBucket.clear();
        this.particules.forEach(function (p) {
            p.grow();
            if (p.isDead) {
                _this.layer.canvasBound.resetParticule(p);
            }
            var wind = _this.getParticuleWind(p);
            _this.animationBucket.add(p, wind);
        });
    };
    Windy.prototype.draw = function () {
        this.context2D.globalCompositeOperation = "destination-in";
        this.context2D.fillRect(this.layer.canvasBound.xMin, this.layer.canvasBound.yMin, this.layer.canvasBound.width, this.layer.canvasBound.height);
        // Fade existing particle trails.
        this.context2D.globalCompositeOperation = "lighter";
        this.context2D.globalAlpha = 0.9;
        this.animationBucket.draw(this.context2D);
    };
    Windy.prototype.stop = function () {
        this.particules.splice(0, this.particules.length);
        this.animationBucket.clear();
        if (this.animationLoop) {
            clearTimeout(this.animationLoop);
            this.animationLoop = null;
        }
    };
    return Windy;
}());
exports.default = Windy;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector = /** @class */ (function () {
    function Vector(u, v) {
        this.u = u || 0;
        this.v = v || 0;
    }
    Object.defineProperty(Vector.prototype, "intensity", {
        get: function () {
            return Math.sqrt(this.u * this.u + this.v * this.v);
        },
        enumerable: true,
        configurable: true
    });
    return Vector;
}());
exports.default = Vector;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CanvasLayer = /** @class */ (function () {
    function CanvasLayer() {
    }
    CanvasLayer.prototype.initialize = function (options) {
        this._map = null;
        this._canvas = null;
        this._frame = null;
        this._delegate = null;
        L.Util.setOptions(this, options);
    };
    CanvasLayer.prototype.delegate = function (del) {
        this._delegate = del;
        return this;
    };
    CanvasLayer.prototype.needRedraw = function () {
        if (!this._frame) {
            this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
        }
        return this;
    };
    //-------------------------------------------------------------
    CanvasLayer.prototype._onLayerDidResize = function (resizeEvent) {
        this._canvas.width = resizeEvent.newSize.x;
        this._canvas.height = resizeEvent.newSize.y;
    };
    //-------------------------------------------------------------
    CanvasLayer.prototype._onLayerDidMove = function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this.drawLayer();
    };
    //-------------------------------------------------------------
    CanvasLayer.prototype.getEvents = function () {
        var events = {
            resize: this._onLayerDidResize,
            moveend: this._onLayerDidMove,
            zoomanim: undefined
        };
        if (this._map.options.zoomAnimation && L.Browser.any3d) {
            events.zoomanim = this._animateZoom;
        }
        return events;
    };
    //-------------------------------------------------------------
    CanvasLayer.prototype.onAdd = function (map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
        this.tiles = {};
        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        map._panes.overlayPane.appendChild(this._canvas);
        map.on(this.getEvents(), this);
        var del = this._delegate || this;
        del.onLayerDidMount && del.onLayerDidMount(); // -- callback
        this.needRedraw();
        var self = this;
        setTimeout(function () {
            self._onLayerDidMove();
        }, 0);
    };
    //-------------------------------------------------------------
    CanvasLayer.prototype.onRemove = function (map) {
        var del = this._delegate || this;
        del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback
        map.getPanes().overlayPane.removeChild(this._canvas);
        map.off(this.getEvents(), this);
        this._canvas = null;
    };
    //------------------------------------------------------------
    CanvasLayer.prototype.addTo = function (map) {
        map.addLayer(this);
        return this;
    };
    // --------------------------------------------------------------------------------
    CanvasLayer.prototype.LatLonToMercator = function (latlon) {
        return {
            x: latlon.lng * 6378137 * Math.PI / 180,
            y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
        };
    };
    //------------------------------------------------------------------------------
    CanvasLayer.prototype.drawLayer = function () {
        // -- todo make the viewInfo properties  flat objects.
        var size = this._map.getSize();
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();
        var center = this.LatLonToMercator(this._map.getCenter());
        var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));
        var del = this._delegate || this;
        del.onDrawLayer && del.onDrawLayer({
            layer: this,
            canvas: this._canvas,
            bounds: bounds,
            size: size,
            zoom: zoom,
            center: center,
            corner: corner
        });
        this._frame = null;
    };
    // -- L.DomUtil.setTransform from leaflet 1.0.0 to work on 0.0.7
    //------------------------------------------------------------------------------
    CanvasLayer.prototype._setTransform = function (el, offset, scale) {
        var pos = offset || new L.Point(0, 0);
        el.style[L.DomUtil.TRANSFORM] =
            (L.Browser.ie3d ?
                'translate(' + pos.x + 'px,' + pos.y + 'px)' :
                'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
                (scale ? ' scale(' + scale + ')' : '');
    };
    //------------------------------------------------------------------------------
    CanvasLayer.prototype._animateZoom = function (e) {
        var scale = this._map.getZoomScale(e.zoom);
        // -- different calc of offset in leaflet 1.0.0 and 0.0.7 thanks for 1.0.0-rc2 calc @jduggan1
        var offset = L.Layer ? this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), e.zoom, e.center) :
            this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
        L.DomUtil.setTransform(this._canvas, offset, scale);
    };
    return CanvasLayer;
}());
exports.default = CanvasLayer;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var velocitycss = __webpack_require__(13);
var VelocityControl = /** @class */ (function () {
    function VelocityControl() {
        this._windy = null;
        this._map = null;
        this._container = null;
        this.options = {
            position: 'bottomleft',
            emptyString: 'Unavailable',
            // Could be any combination of 'bearing' (angle toward which the flow goes) or 'meteo' (angle from which the flow comes)
            // and 'CW' (angle value increases clock-wise) or 'CCW' (angle value increases counter clock-wise)
            angleConvention: 'bearingCCW',
            // Could be 'm/s' for meter per second, 'k/h' for kilometer per hour or 'kt' for knots
            speedUnit: 'm/s'
        };
    }
    VelocityControl.prototype.setWindy = function (_windy) {
        if (!this._windy && _windy)
            this._windy = _windy;
    };
    VelocityControl.prototype.setOptions = function (options) {
        this.options = options;
    };
    VelocityControl.prototype.onAdd = function (map) {
        this._map = map;
        this._container = L.DomUtil.create('div', velocitycss.leafletControlVelocity);
        L.DomEvent.disableClickPropagation(this._container);
        this._map.on('mousemove', this.drawWindSpeed, this);
        this._container.innerHTML = this.options.emptyString;
        return this._container;
    };
    VelocityControl.prototype.onRemove = function (map) {
        this._map.off('mousemove', this.drawWindSpeed, this);
    };
    VelocityControl.prototype.vectorToSpeed = function (uMs, vMs, unit) {
        var velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
        // Default is m/s
        if (unit === 'k/h') {
            return this.meterSec2kilometerHour(velocityAbs);
        }
        else if (unit === 'kt') {
            return this.meterSec2Knots(velocityAbs);
        }
        else if (unit === 'mph') {
            return this.meterSec2mileHour(velocityAbs);
        }
        else {
            return velocityAbs;
        }
    };
    VelocityControl.prototype.vectorToDegrees = function (uMs, vMs, angleConvention) {
        // Default angle convention is CW
        if (angleConvention.endsWith('CCW')) {
            // vMs comes out upside-down..
            vMs = vMs > 0 ? vMs = -vMs : Math.abs(vMs);
        }
        var velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
        var velocityDir = Math.atan2(uMs / velocityAbs, vMs / velocityAbs);
        var velocityDirToDegrees = velocityDir * 180 / Math.PI + 180;
        if (angleConvention === 'bearingCW' || angleConvention === 'meteoCCW') {
            velocityDirToDegrees += 180;
            if (velocityDirToDegrees >= 360)
                velocityDirToDegrees -= 360;
        }
        return velocityDirToDegrees;
    };
    VelocityControl.prototype.meterSec2Knots = function (meters) {
        return meters / 0.514;
    };
    VelocityControl.prototype.meterSec2kilometerHour = function (meters) {
        return meters * 3.6;
    };
    VelocityControl.prototype.meterSec2mileHour = function (meters) {
        return meters * 2.23694;
    };
    VelocityControl.prototype.drawWindSpeed = function (ev) {
        var pos = this._map.containerPointToLatLng(L.point(ev.containerPoint.x, ev.containerPoint.y));
        var gridValue = this._windy.interpolate(pos.lng, pos.lat);
        var template = "";
        if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
            template = "<strong>  Direction: </strong>" +
                this.vectorToDegrees(gridValue[0], gridValue[1], this.options.angleConvention).toFixed(1) +
                "°" + " <thisstrong>  Speed: </strong>" +
                this.vectorToSpeed(gridValue[0], gridValue[1], this.options.speedUnit).toFixed(1) + (" " + this.options.speedUnit);
        }
        else {
            if (this.options.emptyString)
                template = this.options.emptyString;
        }
        this._container.innerHTML = template;
    };
    return VelocityControl;
}());
exports.default = VelocityControl;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var canvasBound_1 = __webpack_require__(0);
var mapBound_1 = __webpack_require__(1);
var windy_1 = __webpack_require__(2);
var L_CanvasLayer_1 = __webpack_require__(4);
var L_VelocityLayer_1 = __webpack_require__(11);
var L_ControlVelocity_1 = __webpack_require__(5);
window.CanvasBound = canvasBound_1.default;
window.MapBound = mapBound_1.default;
window.Windy = windy_1.default;
L.CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new L_CanvasLayer_1.default());
L.canvasLayer = function () {
    return new L.CanvasLayer();
};
L.ControlVelocity = (L.Control).extend(new L_ControlVelocity_1.default());
L.controlVelocity = function () {
    return new L.ControlVelocity();
};
L.VelocityLayer = (L.Layer ? L.Layer : L.Class).extend(new L_VelocityLayer_1.default());
L.velocityLayer = function (options) {
    return new L.VelocityLayer(options);
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Particule = /** @class */ (function () {
    function Particule(x, y, maxAge) {
        this.x = x;
        this.y = y;
        this.age = Math.floor(Math.random() * maxAge);
        this.maxAge = maxAge;
    }
    Particule.prototype.reset = function (x, y) {
        this.x = x;
        this.y = y;
        this.age = 0;
    };
    Object.defineProperty(Particule.prototype, "isDead", {
        get: function () {
            return this.age > this.maxAge;
        },
        enumerable: true,
        configurable: true
    });
    Particule.prototype.grow = function () {
        this.age++;
    };
    return Particule;
}());
exports.default = Particule;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(3);
var Grid = /** @class */ (function () {
    function Grid(data, φ0, λ0, Δφ, Δλ, height, width) {
        this.data = data;
        this.φ0 = φ0;
        this.λ0 = λ0;
        this.Δλ = Δλ;
        this.Δφ = -Δφ; // scanmode 64
        this.height = height;
        this.width = width;
    }
    Object.defineProperty(Grid.prototype, "valueRange", {
        get: function () {
            if (!this.data.length) {
                return [0, 0];
            }
            var min = this.data[0].intensity;
            var max = this.data[0].intensity;
            this.data.forEach(function (value) {
                min = Math.min(min, value.intensity);
                max = Math.max(max, value.intensity);
            });
            return [min, max];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get vector at any point
     * @param λ Longitude
     * @param φ Latitude
     */
    Grid.prototype.get = function (λ, φ) {
        var fλ = this.floorMod(λ - this.λ0, 360) / this.Δλ; // calculate longitude index in wrapped range [0, 360)
        var fφ = (this.φ0 - φ) / this.Δφ; // calculate latitude index in direction +90 to -90
        var iλ = Math.floor(fλ); // col n
        var jλ = iλ + 1; // col n+1
        if (jλ >= this.width) {
            jλ = this.λ0;
        }
        var iφ = Math.floor(fφ); // line m
        var jφ = iφ + 1; // line m+1
        if (jφ >= this.height) {
            jφ = iφ;
        }
        var vλ = fλ - iλ; // col variation [0..1]
        var vφ = fφ - iφ; // line variation [0..1]
        if (iλ >= 0 && iφ >= 0 && iλ < this.width && iφ < this.height) {
            var g00 = this.data[iλ + iφ * this.width];
            var g10 = this.data[jλ + iφ * this.width];
            if (this.isValue(g00) && this.isValue(g10)) {
                var g01 = this.data[iλ + jφ * this.width];
                var g11 = this.data[jλ + jφ * this.width];
                if (this.isValue(g01) && this.isValue(g11)) {
                    return this.interpolation(vλ, vφ, g00, //l0c0
                    g10, //l0c1
                    g01, //l1c0
                    g11 //l1cl
                    );
                }
            }
        }
        return new vector_1.default(0, 0);
    };
    /**
     * Interpolate value
     * @param x variation between g0* and g1*
     * @param y variation between g*0 dans g*1
     * @param g00 point at col_0 and line_0
     * @param g10 point at col_1 and line_0
     * @param g01 point at col_0 and line_1
     * @param g11 point at col_1 and line_1
     * @return interpolated vector
     */
    Grid.prototype.interpolation = function (x, y, g00, g10, g01, g11) {
        var rx = (1 - x);
        var ry = (1 - y);
        var a = rx * ry, b = x * ry, c = rx * y, d = x * y;
        var u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
        var v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
        return new vector_1.default(u, v);
    };
    /**
     * Custom modulo
     * @returns {number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
     *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
     */
    Grid.prototype.floorMod = function (a, n) {
        return a - n * Math.floor(a / n);
    };
    ;
    /**
     * Detect if x is a value
     * @returns {boolean} true if the specified value is not null and not undefined.
     */
    Grid.prototype.isValue = function (x) {
        return x !== null && x !== undefined;
    };
    ;
    return Grid;
}());
exports.default = Grid;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ColorScale = /** @class */ (function () {
    function ColorScale(minValue, maxValue, scale) {
        this.scale = [
            "rgb(36,104, 180)",
            "rgb(60,157, 194)",
            "rgb(128,205,193 )",
            "rgb(151,218,168 )",
            "rgb(198,231,181)",
            "rgb(238,247,217)",
            "rgb(255,238,159)",
            "rgb(252,217,125)",
            "rgb(255,182,100)",
            "rgb(252,150,75)",
            "rgb(250,112,52)",
            "rgb(245,64,32)",
            "rgb(237,45,28)",
            "rgb(220,24,32)",
            "rgb(180,0,35)"
        ];
        this.setMinMax(minValue, maxValue);
        if ((scale instanceof Array) && scale.length) {
            this.scale = scale;
        }
    }
    ColorScale.prototype.setMinMax = function (minValue, maxValue) {
        this.minValue = minValue;
        this.maxValue = maxValue;
    };
    Object.defineProperty(ColorScale.prototype, "size", {
        get: function () {
            return this.scale.length;
        },
        enumerable: true,
        configurable: true
    });
    ColorScale.prototype.getColorIndex = function (value) {
        if (value <= this.minValue) {
            return 0;
        }
        if (value >= this.maxValue) {
            return this.scale.length - 1;
        }
        var index = this.scale.length * (value - this.minValue) / (this.maxValue - this.minValue);
        if (index < 0) {
            return 0;
        }
        if (index > this.scale.length - 1) {
            return this.scale.length - 1;
        }
        return Math.floor(index);
    };
    ColorScale.prototype.colorAt = function (index) {
        return this.scale[index];
    };
    ColorScale.prototype.getColor = function (value) {
        return this.scale[this.getColorIndex(value)];
    };
    return ColorScale;
}());
exports.default = ColorScale;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AnimationBucket = /** @class */ (function () {
    function AnimationBucket(colorScale) {
        this.buckets = [];
        this.colorScale = colorScale;
        for (var i = 0; i < colorScale.size; i++) {
            this.buckets.push([]);
        }
    }
    AnimationBucket.prototype.clear = function () {
        this.buckets.forEach(function (particuleSet) {
            particuleSet.splice(0, particuleSet.length);
        });
    };
    AnimationBucket.prototype.add = function (p, v) {
        var index = this.colorScale.getColorIndex(p.intensity);
        if (index < 0 || index >= this.buckets.length) {
            console.log(index);
            return;
        }
        p.xt = p.x + v.u;
        p.yt = p.y + v.v;
        this.buckets[index].push(p);
    };
    AnimationBucket.prototype.draw = function (context2D) {
        var _this = this;
        this.buckets.forEach(function (bucket, i) {
            if (bucket.length > 0) {
                context2D.beginPath();
                context2D.strokeStyle = _this.colorScale.colorAt(i);
                bucket.forEach(function (particle) {
                    context2D.moveTo(particle.x, particle.y);
                    context2D.lineTo(particle.xt, particle.yt);
                    particle.x = particle.xt;
                    particle.y = particle.yt;
                });
                context2D.stroke();
            }
        });
    };
    return AnimationBucket;
}());
exports.default = AnimationBucket;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var windy_1 = __webpack_require__(2);
var canvasBound_1 = __webpack_require__(0);
var mapBound_1 = __webpack_require__(1);
var layer_1 = __webpack_require__(12);
var L_CanvasLayer_1 = __webpack_require__(4);
var L_ControlVelocity_1 = __webpack_require__(5);
var L_CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new L_CanvasLayer_1.default());
var L_canvasLayer = function () {
    return new L_CanvasLayer();
};
var L_ControlVelocity = (L.Control).extend(new L_ControlVelocity_1.default);
var L_controlVelocity = function () {
    return new L_ControlVelocity();
};
var VelocityLayer = /** @class */ (function () {
    function VelocityLayer() {
        this._map = null;
        this._canvasLayer = null;
        this._windy = null;
        this._context = null;
        this._displayTimeout = 0;
        this._mouseControl = null;
        this.options = {
            displayValues: true,
            displayOptions: {
                velocityType: 'Velocity',
                position: 'bottomleft',
                emptyString: 'No velocity data',
                angleConvention: 'bearingCCW',
                speedUnit: 'm/s'
            },
            maxVelocity: 10,
            colorScale: null,
            data: null
        };
    }
    VelocityLayer.prototype.initialize = function (options) {
        L.Util.setOptions(this, options);
    };
    VelocityLayer.prototype.onAdd = function (map) {
        // create canvas, add overlay control
        this._canvasLayer = L_canvasLayer().delegate(this);
        this._canvasLayer.addTo(map);
        this._map = map;
    };
    VelocityLayer.prototype.onRemove = function (map) {
        this._destroyWind();
    };
    VelocityLayer.prototype.setData = function (data) {
        this.options.data = data;
        if (this._windy) {
            this._windy.setData(data);
            this._clearAndRestart();
        }
        this.fire('load');
    };
    /*------------------------------------ PRIVATE ------------------------------------------*/
    VelocityLayer.prototype.onDrawLayer = function (overlay, params) {
        var self = this;
        if (!this._windy) {
            this._initWindy();
            return;
        }
        if (!this.options.data) {
            return;
        }
        if (this._displayTimeout)
            clearTimeout(self._displayTimeout);
        this._displayTimeout = setTimeout(function () {
            self._startWindy();
        }, 150); // showing velocity is delayed
    };
    VelocityLayer.prototype._startWindy = function () {
        var bounds = this._map.getBounds();
        var size = this._map.getSize();
        // bounds, width, height, extent
        this._windy.start(new layer_1.default(new mapBound_1.default(bounds._northEast.lat, bounds._northEast.lng, bounds._southWest.lat, bounds._southWest.lng), new canvasBound_1.default(0, 0, size.x, size.y)));
    };
    VelocityLayer.prototype._initWindy = function () {
        var _this = this;
        // windy object, copy options
        var options = Object.assign({ canvas: this._canvasLayer._canvas }, this.options);
        this._windy = new windy_1.default(options);
        // prepare context global var, start drawing
        this._context = this._canvasLayer._canvas.getContext('2d');
        this._canvasLayer._canvas.classList.add("velocity-overlay");
        this.onDrawLayer();
        //TODO : Figure out why the event is called after the layer is removed
        this._map.on('dragstart', function () {
            if (_this._windy)
                _this._windy.stop();
        });
        this._map.on('dragend', function () {
            _this._clearAndRestart();
        });
        this._map.on('zoomstart', function () {
            if (_this._windy)
                _this._windy.stop();
        });
        this._map.on('zoomend', function () {
            _this._clearAndRestart();
        });
        this._map.on('resize', function () {
            _this._clearWind();
        });
        this._initMouseHandler();
    };
    VelocityLayer.prototype._initMouseHandler = function () {
        if (!this._mouseControl && this.options.displayValues) {
            var options = this.options.displayOptions || {};
            options['leafletVelocity'] = this;
            this._mouseControl = L_controlVelocity();
            this._mouseControl.setWindy(this._windy);
            this._mouseControl.setOptions(this.options.displayOptions);
            this._mouseControl.addTo(this._map);
        }
    };
    VelocityLayer.prototype._clearAndRestart = function () {
        if (this._context)
            this._context.clearRect(0, 0, 3000, 3000);
        if (this._windy)
            this._startWindy();
    };
    VelocityLayer.prototype._clearWind = function () {
        if (this._windy)
            this._windy.stop();
        if (this._context)
            this._context.clearRect(0, 0, 3000, 3000);
    };
    VelocityLayer.prototype._destroyWind = function () {
        if (this._displayTimeout)
            clearTimeout(this._displayTimeout);
        if (this._windy)
            this._windy.stop();
        if (this._context)
            this._context.clearRect(0, 0, 3000, 3000);
        if (this._mouseControl)
            this._map.removeControl(this._mouseControl);
        this._mouseControl = null;
        this._windy = null;
        this._map.removeLayer(this._canvasLayer);
    };
    return VelocityLayer;
}());
exports.default = VelocityLayer;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var layer = /** @class */ (function () {
    function layer(mapBound, canvasBound) {
        this.canvasBound = canvasBound;
        this.mapBound = mapBound;
    }
    /**
     * Find geocoordinate from canvas point
     * @param x
     * @param y
     * return [lng, lat]
     */
    layer.prototype.canvasToMap = function (x, y) {
        var mapLonDelta = this.mapBound.east - this.mapBound.west;
        var worldMapRadius = (this.canvasBound.width / this.rad2deg(mapLonDelta)) * 360 / (2 * Math.PI);
        var mapOffsetY = (worldMapRadius / 2 * Math.log((1 + Math.sin(this.mapBound.south)) / (1 - Math.sin(this.mapBound.south))));
        var equatorY = this.canvasBound.height + mapOffsetY;
        var a = (equatorY - y) / worldMapRadius;
        var φ = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
        var λ = this.rad2deg(this.mapBound.west) + x / this.canvasBound.width * this.rad2deg(mapLonDelta);
        return [λ, φ];
    };
    ;
    layer.prototype.mercY = function (φ) {
        return Math.log(Math.tan(φ / 2 + Math.PI / 4));
    };
    ;
    /**
     * Project a point on the map
     * @param λ Longitude
     * @param φ Latitude
     * @return [x, y]
     */
    layer.prototype.mapToCanvas = function (λ, φ) {
        var ymin = this.mercY(this.mapBound.south);
        var ymax = this.mercY(this.mapBound.north);
        var xFactor = this.canvasBound.width / (this.mapBound.east - this.mapBound.west);
        var yFactor = this.canvasBound.height / (ymax - ymin);
        var y = this.mercY(this.deg2rad(φ));
        var x = (this.deg2rad(λ) - this.mapBound.west) * xFactor;
        y = (ymax - y) * yFactor;
        return [x, y];
    };
    ;
    layer.prototype.deg2rad = function (deg) {
        return deg * Math.PI / 180;
    };
    ;
    layer.prototype.rad2deg = function (rad) {
        return rad * 180 / Math.PI;
    };
    ;
    /**
     *
     * @param λ Longitude
     * @param φ Latitude
     * @param x
     * @param y
     * @return []
     */
    layer.prototype.distortion = function (λ, φ, x, y) {
        var τ = 2 * Math.PI;
        var H = Math.pow(10, -5.2);
        var hλ = λ < 0 ? H : -H;
        var hφ = φ < 0 ? H : -H;
        var pλ = this.mapToCanvas(λ + hλ, φ);
        var pφ = this.mapToCanvas(λ, φ + hφ);
        // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
        // changes depending on φ. Without this, there is a pinching effect at the poles.
        var k = Math.cos(φ / 360 * τ);
        return [
            (pλ[0] - x) / hλ / k,
            (pλ[1] - y) / hλ / k,
            (pφ[0] - x) / hφ,
            (pφ[1] - y) / hφ
        ];
    };
    /**
     * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
     * vector is modified in place and returned by this function.
     * @param λ
     * @param φ
     * @param x
     * @param y
     * @param scale scale factor
     * @param wind [u, v]
     * @return []
     */
    layer.prototype.distort = function (λ, φ, x, y, scale, wind) {
        var u = wind.u * scale;
        var v = wind.v * scale;
        var d = this.distortion(λ, φ, x, y);
        // Scale distortion vectors by u and v, then add.
        wind.u = d[0] * u + d[2] * v;
        wind.v = d[1] * u + d[3] * v;
        return wind;
    };
    return layer;
}());
exports.default = layer;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(16)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/typings-for-css-modules-loader/lib/index.js??ref--1-1!./leaflet-velocity.css", function() {
			var newContent = require("!!../node_modules/typings-for-css-modules-loader/lib/index.js??ref--1-1!./leaflet-velocity.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15)(false);
// imports


// module
exports.push([module.i, "._2IOUeyYrQ95tBI3v82ZjWk {\n  background-color: rgba(255, 255, 255, 0.7);\n  padding: 0 5px;\n  margin: 0 !important;\n  color: #333;\n  font: 11px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif;\n}\n", ""]);

// exports
exports.locals = {
	"leafletControlVelocity": "_2IOUeyYrQ95tBI3v82ZjWk"
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(17);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 17 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWQwYzk3YWU2ZGM5OWYwMTMzMDYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NhbnZhc0JvdW5kLnRzIiwid2VicGFjazovLy8uL3NyYy9tYXBCb3VuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2luZHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTC5DYW52YXNMYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTC5Db250cm9sVmVsb2NpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJ0aWNsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JpZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29sb3JTY2FsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYW5pbWF0aW9uQnVja2V0LnRzIiwid2VicGFjazovLy8uL3NyYy9MLlZlbG9jaXR5TGF5ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xheWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9sZWFmbGV0LXZlbG9jaXR5LmNzcz8xNGQzIiwid2VicGFjazovLy8uL3NyYy9sZWFmbGV0LXZlbG9jaXR5LmNzcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVB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QzdCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzVELElBQU0sY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEcsSUFBTSxVQUFVLEdBQUcsQ0FBRSxjQUFjLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUcsQ0FBQyxDQUFDO1FBQ25JLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUN0RCxJQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBQyxDQUFDLENBQUMsR0FBQyxjQUFjLENBQUM7UUFFdEMsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEcsTUFBTSxDQUFD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RUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzVXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVyxFQUFFO0FBQ3JELHdDQUF3QyxXQUFXLEVBQUU7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esc0NBQXNDO0FBQ3RDLEdBQUc7QUFDSDtBQUNBLDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EiLCJmaWxlIjoibGVhZmxldC12ZWxvY2l0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFkMGM5N2FlNmRjOTlmMDEzMzA2IiwiaW1wb3J0IFBhcnRpY3VsZSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNCb3VuZCB7XG4gICAgcHVibGljIHhNaW46IG51bWJlcjtcbiAgICBwdWJsaWMgeU1pbjogbnVtYmVyO1xuICAgIHB1YmxpYyB4TWF4OiBudW1iZXI7XG4gICAgcHVibGljIHlNYXg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yICh4TWluOiBudW1iZXIsIHlNaW46IG51bWJlciwgeE1heDogbnVtYmVyLCB5TWF4OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54TWluID0geE1pbjtcbiAgICAgICAgdGhpcy55TWluID0geU1pbjtcbiAgICAgICAgdGhpcy54TWF4ID0geE1heDtcbiAgICAgICAgdGhpcy55TWF4ID0geU1heDtcbiAgICB9XG5cbiAgICBnZXQgd2lkdGggKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54TWF4IC0gdGhpcy54TWluO1xuICAgIH1cblxuICAgIGdldCBoZWlnaHQgKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy55TWF4IC0gdGhpcy55TWluO1xuICAgIH1cblxuICAgIGdldFJhbmRvbVBhcnRpY3VsZShtYXhBZ2U6IG51bWJlcik6IFBhcnRpY3VsZSAge1xuICAgICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoKSArIHRoaXMueE1pbik7XG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSArIHRoaXMueU1pbik7XG4gICAgICAgIHJldHVybiBuZXcgUGFydGljdWxlKHgsIHksIG1heEFnZSk7XG4gICAgfVxuXG4gICAgcmVzZXRQYXJ0aWN1bGUocDogUGFydGljdWxlKTogUGFydGljdWxlIHtcbiAgICAgICAgY29uc3QgeCA9IE1hdGgucm91bmQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy53aWR0aCkgKyB0aGlzLnhNaW4pO1xuICAgICAgICBjb25zdCB5ID0gTWF0aC5yb3VuZChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkgKyB0aGlzLnlNaW4pO1xuICAgICAgICBwLnJlc2V0KHgsIHkpO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jYW52YXNCb3VuZC50cyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcEJvdW5kIHtcbiAgICBwdWJsaWMgc291dGg6IG51bWJlcjtcbiAgICBwdWJsaWMgbm9ydGg6IG51bWJlcjtcbiAgICBwdWJsaWMgZWFzdDogbnVtYmVyO1xuICAgIHB1YmxpYyB3ZXN0OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciAobm9ydGg6IG51bWJlciwgZWFzdDogbnVtYmVyLCBzb3V0aDogbnVtYmVyLCB3ZXN0OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5ub3J0aCA9IG5vcnRoICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgdGhpcy5lYXN0ID0gZWFzdCAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgIHRoaXMuc291dGggPSBzb3V0aCAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgIHRoaXMud2VzdCA9IHdlc3QgKiBNYXRoLlBJIC8gMTgwO1xuICAgIH1cblxuICAgIGdldCB3aWR0aCAoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAoNzIwICsgdGhpcy5lYXN0IC0gdGhpcy53ZXN0KSAlIDM2MDtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0ICgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICgzNjAgKyB0aGlzLm5vcnRoIC0gdGhpcy5zb3V0aCkgJSAxODA7XG4gICAgfVxuXG4gICAgXG5cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFwQm91bmQudHMiLCJpbXBvcnQgTWFwQm91bmQgZnJvbSBcIi4vbWFwQm91bmRcIjtcclxuaW1wb3J0IFZlY3RvciBmcm9tIFwiLi92ZWN0b3JcIjtcclxuaW1wb3J0IEdyaWQgZnJvbSBcIi4vZ3JpZFwiO1xyXG5pbXBvcnQgQ29sb3JTY2FsZSBmcm9tIFwiLi9jb2xvclNjYWxlXCI7XHJcbmltcG9ydCBQYXJ0aWN1bGUgZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IEFuaW1hdGlvbkJ1Y2tldCBmcm9tIFwiLi9hbmltYXRpb25CdWNrZXRcIjtcclxuaW1wb3J0IExheWVyIGZyb20gXCIuL2xheWVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaW5keSB7XHJcblxyXG4gIHByaXZhdGUgZ3JpZDogYW55O1xyXG4gIHByaXZhdGUgzrswOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSDPhjA6IG51bWJlcjtcclxuICBwcml2YXRlIM6Uzrs6IG51bWJlcjtcclxuICBwcml2YXRlIM6Uz4Y6IG51bWJlcjtcclxuICBwcml2YXRlIG5pOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBuajogbnVtYmVyO1xyXG4gIHByaXZhdGUgY2FudmFzOiBhbnkgPSBudWxsO1xyXG4gIHByaXZhdGUgY29sb3JTY2FsZTogQ29sb3JTY2FsZTtcclxuICBwcml2YXRlIHZlbG9jaXR5U2NhbGU6IG51bWJlcjtcclxuICBwcml2YXRlIHBhcnRpY3VsZU11bHRpcGxpZXIgPSAxIC8gMzAwO1xyXG4gIHByaXZhdGUgcGFydGljbGVBZ2U6IG51bWJlcjtcclxuICBwcml2YXRlIHBhcnRpY3VsZUxpbmVXaWR0aDogbnVtYmVyO1xyXG4gIHByaXZhdGUgYXV0b0NvbG9yUmFuZ2UgPSBmYWxzZTtcclxuXHJcbiAgcHJpdmF0ZSBsYXllcjogTGF5ZXI7XHJcbiAgcHJpdmF0ZSBwYXJ0aWN1bGVzOiBQYXJ0aWN1bGVbXSA9IFtdO1xyXG4gIHByaXZhdGUgYW5pbWF0aW9uQnVja2V0OiBBbmltYXRpb25CdWNrZXQ7XHJcbiAgcHJpdmF0ZSBjb250ZXh0MkQ6IGFueTtcclxuICBwcml2YXRlIGFuaW1hdGlvbkxvb3A6IGFueSA9IG51bGw7XHJcbiAgcHJpdmF0ZSBmcmFtZVRpbWU6IG51bWJlcjtcclxuICBwcml2YXRlIHRoZW4gPSAwO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9uczogYW55KSB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IG9wdGlvbnMuY2FudmFzO1xyXG4gICAgaWYgKG9wdGlvbnMubWluVmVsb2NpdHkgPT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLm1heFZlbG9jaXR5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5hdXRvQ29sb3JSYW5nZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNvbG9yU2NhbGUgPSBuZXcgQ29sb3JTY2FsZShvcHRpb25zLm1pblZlbG9jaXR5IHx8IDAsIG9wdGlvbnMubWF4VmVsb2NpdHkgfHwgMTAsIG9wdGlvbnMuY29sb3JTY2FsZSk7XHJcbiAgICB0aGlzLnZlbG9jaXR5U2NhbGUgPSBvcHRpb25zLnZlbG9jaXR5U2NhbGUgfHwgMC4wMTtcclxuICAgIHRoaXMucGFydGljbGVBZ2UgPSBvcHRpb25zLnBhcnRpY2xlQWdlIHx8IDY0O1xyXG4gICAgdGhpcy5zZXREYXRhKG9wdGlvbnMuZGF0YSk7XHJcbiAgICB0aGlzLnBhcnRpY3VsZU11bHRpcGxpZXIgPSBvcHRpb25zLnBhcnRpY2xlTXVsdGlwbGllciB8fCAxIC8gMzAwO1xyXG4gICAgdGhpcy5wYXJ0aWN1bGVMaW5lV2lkdGggPSBvcHRpb25zLmxpbmVXaWR0aCB8fCAxO1xyXG4gICAgY29uc3QgZnJhbWVSYXRlID0gb3B0aW9ucy5mcmFtZVJhdGUgfHwgMTU7XHJcbiAgICB0aGlzLmZyYW1lVGltZSA9IDEwMDAgLyBmcmFtZVJhdGU7XHJcbiAgfVxyXG5cclxuICBnZXQgcGFydGljdWxlQ291bnQoKSB7XHJcbiAgICBjb25zdCBwYXJ0aWN1bGVSZWR1Y3Rpb24gPSAoKC9hbmRyb2lkfGJsYWNrYmVycnl8aWVtb2JpbGV8aXBhZHxpcGhvbmV8aXBvZHxvcGVyYSBtaW5pfHdlYm9zL2kpLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpID8gKE1hdGgucG93KHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAxIC8gMykgfHwgMS42KSA6IDE7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLmxheWVyLmNhbnZhc0JvdW5kLndpZHRoICogdGhpcy5sYXllci5jYW52YXNCb3VuZC5oZWlnaHQgKiB0aGlzLnBhcnRpY3VsZU11bHRpcGxpZXIpICogcGFydGljdWxlUmVkdWN0aW9uO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9hZCBkYXRhXHJcbiAgICogQHBhcmFtIGRhdGFcclxuICAgKi9cclxuICBzZXREYXRhKGRhdGE6IGFueVtdKSB7XHJcbiAgICBsZXQgdURhdGE6IGFueSA9IG51bGw7XHJcbiAgICBsZXQgdkRhdGE6IGFueSA9IG51bGw7XHJcbiAgICBjb25zdCBncmlkOiBWZWN0b3JbXSA9IFtdO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaCgocmVjb3JkKSA9PiB7XHJcbiAgICAgIHN3aXRjaCAoYCR7cmVjb3JkLmhlYWRlci5wYXJhbWV0ZXJDYXRlZ29yeX0sJHtyZWNvcmQuaGVhZGVyLnBhcmFtZXRlck51bWJlcn1gKSB7XHJcbiAgICAgICAgY2FzZSBcIjIsMzFcIjpcclxuICAgICAgICAgIHVEYXRhID0gcmVjb3JkO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIjIsMzJcIjpcclxuICAgICAgICAgIHZEYXRhID0gcmVjb3JkO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbi8qICAgICAgICAgY2FzZSBcIjIsMTQ5XCI6XHJcbiAgICAgICAgICB2RGF0YSA9IHJlY29yZDtcclxuICAgICAgICAgIGJyZWFrOyAqL1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdURhdGEgfHwgIXZEYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIkRhdGEgYXJlIG5vdCBjb3JyZWN0IGZvcm1hdFwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERpci9TcGVlZCB0byBVL1ZcclxuICAgIHVEYXRhLmRhdGEuZm9yRWFjaCgodTogbnVtYmVyLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGxldCBwaGkgPSAodSAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICB1RGF0YS5kYXRhW2luZGV4XSA9IC0gdkRhdGEuZGF0YVtpbmRleF0gKiBNYXRoLnNpbihwaGkpO1xyXG4gICAgICB2RGF0YS5kYXRhW2luZGV4XSA9IC0gdkRhdGEuZGF0YVtpbmRleF0gKiBNYXRoLmNvcyhwaGkpO1xyXG4gICAgICBncmlkLnB1c2gobmV3IFZlY3Rvcih1RGF0YS5kYXRhW2luZGV4XSwgdkRhdGEuZGF0YVtpbmRleF0pKTtcclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5ncmlkID0gbmV3IEdyaWQoXHJcbiAgICAgIGdyaWQsXHJcbiAgICAgIHVEYXRhLmhlYWRlci5sYTIsIC8vIHNjYW5tb2RlIDY0XHJcbiAgICAgIHVEYXRhLmhlYWRlci5sbzEsXHJcbiAgICAgIHVEYXRhLmhlYWRlci5keSxcclxuICAgICAgdURhdGEuaGVhZGVyLmR4LFxyXG4gICAgICB1RGF0YS5oZWFkZXIubnksXHJcbiAgICAgIHVEYXRhLmhlYWRlci5ueFxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLs67MCA9IHVEYXRhLmhlYWRlci5sbzE7XHJcbiAgICB0aGlzLs+GMCA9IHVEYXRhLmhlYWRlci5sYTE7XHJcblxyXG4gICAgdGhpcy7OlM67ID0gdURhdGEuaGVhZGVyLmR4O1xyXG4gICAgdGhpcy7OlM+GID0gdURhdGEuaGVhZGVyLmR5O1xyXG5cclxuICAgIHRoaXMubmkgPSB1RGF0YS5oZWFkZXIubng7XHJcbiAgICB0aGlzLm5qID0gdURhdGEuaGVhZGVyLm55OyAvLyBudW1iZXIgb2YgZ3JpZCBwb2ludHMgVy1FIGFuZCBOLVMgKGUuZy4sIDE0NCB4IDczKVxyXG5cclxuICAgIHZhciBwID0gMDtcclxuICAgIHZhciBpc0NvbnRpbnVvdXMgPSBNYXRoLmZsb29yKHRoaXMubmkgKiB0aGlzLs6UzrspID49IDM2MDtcclxuXHJcbiAgICAvL2ZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5uajsgaisrKSB7IC8vIHNjYW5tb2RlID0gMFxyXG4gICAgZm9yICh2YXIgaiA9IHRoaXMubmo7IGogPiAwOyBqLS0pIHsgICAvLyBzY2FubW9kZSA9IDY0XHJcbiAgICAgIHZhciByb3cgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5pOyBpKyssIHArKykge1xyXG4gICAgICAgIHJvd1tpXSA9IHRoaXMuZ3JpZC5kYXRhW3BdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpc0NvbnRpbnVvdXMpIHtcclxuICAgICAgICAvLyBGb3Igd3JhcHBlZCBncmlkcywgZHVwbGljYXRlIGZpcnN0IGNvbHVtbiBhcyBsYXN0IGNvbHVtbiB0byBzaW1wbGlmeSBpbnRlcnBvbGF0aW9uIGxvZ2ljXHJcbiAgICAgICAgcm93LnB1c2gocm93WzBdKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmdyaWRbal0gPSByb3c7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b0NvbG9yUmFuZ2UpIHtcclxuICAgICAgY29uc3QgbWluTWF4ID0gdGhpcy5ncmlkLnZhbHVlUmFuZ2U7XHJcbiAgICAgIHRoaXMuY29sb3JTY2FsZS5zZXRNaW5NYXgobWluTWF4WzBdLCBtaW5NYXhbMV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmxvb3JNb2QoYTogbnVtYmVyLCBuOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBhIC0gbiAqIE1hdGguZmxvb3IoYSAvIG4pO1xyXG4gIH07XHJcblxyXG4gIGlzVmFsdWUoeDogYW55KSB7XHJcbiAgICByZXR1cm4geCAhPT0gbnVsbCAmJiB4ICE9PSB1bmRlZmluZWQ7XHJcbiAgfTtcclxuXHJcbiAgYmlsaW5lYXJJbnRlcnBvbGF0ZVZlY3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgZzAwOiBhbnksIGcxMDogYW55LCBnMDE6IGFueSwgZzExOiBhbnkpIHtcclxuICAgIHZhciByeCA9ICgxIC0geCk7XHJcbiAgICB2YXIgcnkgPSAoMSAtIHkpO1xyXG4gICAgdmFyIGEgPSByeCAqIHJ5LCBiID0geCAqIHJ5LCBjID0gcnggKiB5LCBkID0geCAqIHk7XHJcbiAgICB2YXIgdSA9IGcwMC51ICogYSArIGcxMC51ICogYiArIGcwMS51ICogYyArIGcxMS51ICogZDtcclxuICAgIHZhciB2ID0gZzAwLnYgKiBhICsgZzEwLnYgKiBiICsgZzAxLnYgKiBjICsgZzExLnYgKiBkO1xyXG4gICAgcmV0dXJuIFt1LCB2LCBNYXRoLnNxcnQodSAqIHUgKyB2ICogdildO1xyXG4gIH07XHJcblxyXG4gIC8qIEdldCBpbnRlcnBvbGF0ZWQgZ3JpZCB2YWx1ZSBmcm9tIExvbi9MYXQgcG9zaXRpb25cclxuICAqIEBwYXJhbSDOuyB7RmxvYXR9IExvbmdpdHVkZVxyXG4gICogQHBhcmFtIM+GIHtGbG9hdH0gTGF0aXR1ZGVcclxuICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgKi9cclxuICBpbnRlcnBvbGF0ZSjOuzogbnVtYmVyLCDPhjogbnVtYmVyKTogYW55IHtcclxuICAgIGlmICghdGhpcy5ncmlkKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgdmFyIGkgPSB0aGlzLmZsb29yTW9kKM67IC0gdGhpcy7OuzAsIDM2MCkgLyB0aGlzLs6Uzrs7IC8vIGNhbGN1bGF0ZSBsb25naXR1ZGUgaW5kZXggaW4gd3JhcHBlZCByYW5nZSBbMCwgMzYwKVxyXG4gICAgdmFyIGogPSAodGhpcy7PhjAgLSDPhikgLyB0aGlzLs6Uz4Y7IC8vIGNhbGN1bGF0ZSBsYXRpdHVkZSBpbmRleCBpbiBkaXJlY3Rpb24gKzkwIHRvIC05MFxyXG5cclxuICAgIHZhciBmaSA9IE1hdGguZmxvb3IoaSk7XHJcbiAgICB2YXIgY2kgPSBmaSArIDE7XHJcbiAgICB2YXIgZmogPSBNYXRoLmZsb29yKGopO1xyXG4gICAgdmFyIGNqID0gZmogKyAxO1xyXG4gICAgdmFyIHJvdyA9IHRoaXMuZ3JpZFtmal07Ly9Eb250IGtub3cgd2h5IGhlIGRvc2VudCBmb3VuZCBhbnkgcm93IEVSUlJST1JcclxuICAgIGlmIChyb3cpIHtcclxuICAgICAgdmFyIGcwMCA9IHJvd1tmaV07XHJcbiAgICAgIHZhciBnMTAgPSByb3dbY2ldO1xyXG4gICAgICBpZiAodGhpcy5pc1ZhbHVlKGcwMCkgJiYgdGhpcy5pc1ZhbHVlKGcxMCkgJiYgKHJvdyA9IHRoaXMuZ3JpZFtjal0pKSB7XHJcbiAgICAgICAgdmFyIGcwMSA9IHJvd1tmaV07XHJcbiAgICAgICAgdmFyIGcxMSA9IHJvd1tjaV07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZShnMDEpICYmIHRoaXMuaXNWYWx1ZShnMTEpKSB7XHJcbiAgICAgICAgICAvLyBBbGwgZm91ciBwb2ludHMgZm91bmQsIHNvIGludGVycG9sYXRlIHRoZSB2YWx1ZS5cclxuICAgICAgICAgIHJldHVybiB0aGlzLmJpbGluZWFySW50ZXJwb2xhdGVWZWN0b3IoaSAtIGZpLCBqIC0gZmosIGcwMCwgZzEwLCBnMDEsIGcxMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9O1xyXG5cclxuICBnZXRQYXJ0aWN1bGVXaW5kKHA6IFBhcnRpY3VsZSk6IFZlY3RvciB7XHJcbiAgICBjb25zdCBsbmdMYXQgPSB0aGlzLmxheWVyLmNhbnZhc1RvTWFwKHAueCwgcC55KTtcclxuICAgIGNvbnN0IHdpbmQgPSB0aGlzLmdyaWQuZ2V0KGxuZ0xhdFswXSwgbG5nTGF0WzFdKTtcclxuICAgIHAuaW50ZW5zaXR5ID0gd2luZC5pbnRlbnNpdHk7XHJcbiAgICBjb25zdCBtYXBBcmVhID0gdGhpcy5sYXllci5tYXBCb3VuZC5oZWlnaHQgKiB0aGlzLmxheWVyLm1hcEJvdW5kLndpZHRoO1xyXG4gICAgdmFyIHZlbG9jaXR5U2NhbGUgPSB0aGlzLnZlbG9jaXR5U2NhbGUgKiBNYXRoLnBvdyhtYXBBcmVhLCAwLjQpO1xyXG4gICAgdGhpcy5sYXllci5kaXN0b3J0KGxuZ0xhdFswXSwgbG5nTGF0WzFdLCBwLngsIHAueSwgdmVsb2NpdHlTY2FsZSwgd2luZCk7XHJcbiAgICByZXR1cm4gd2luZDtcclxuICB9XHJcblxyXG4gIHN0YXJ0KGxheWVyOiBMYXllcikge1xyXG5cclxuICAgIHRoaXMuY29udGV4dDJEID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgdGhpcy5jb250ZXh0MkQubGluZVdpZHRoID0gdGhpcy5wYXJ0aWN1bGVMaW5lV2lkdGg7XHJcbiAgICB0aGlzLmNvbnRleHQyRC5maWxsU3R5bGUgPSBcInJnYmEoMCwgMCwgMCwgMC45NylcIjtcclxuICAgIHRoaXMuY29udGV4dDJELmdsb2JhbEFscGhhID0gMC42O1xyXG5cclxuICAgIHRoaXMubGF5ZXIgPSBsYXllcjtcclxuICAgIHRoaXMuYW5pbWF0aW9uQnVja2V0ID0gbmV3IEFuaW1hdGlvbkJ1Y2tldCh0aGlzLmNvbG9yU2NhbGUpO1xyXG5cclxuICAgIHRoaXMucGFydGljdWxlcy5zcGxpY2UoMCwgdGhpcy5wYXJ0aWN1bGVzLmxlbmd0aCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFydGljdWxlQ291bnQ7IGkrKykge1xyXG4gICAgICB0aGlzLnBhcnRpY3VsZXMucHVzaCh0aGlzLmxheWVyLmNhbnZhc0JvdW5kLmdldFJhbmRvbVBhcnRpY3VsZSh0aGlzLnBhcnRpY2xlQWdlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50aGVuID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgdGhpcy5mcmFtZSgpO1xyXG4gIH1cclxuXHJcbiAgZnJhbWUoKSB7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkxvb3AgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmZyYW1lKClcclxuICAgIH0pO1xyXG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIGRlbHRhID0gbm93IC0gdGhpcy50aGVuO1xyXG4gICAgaWYgKGRlbHRhID4gdGhpcy5mcmFtZVRpbWUpIHtcclxuICAgICAgdGhpcy50aGVuID0gbm93IC0gKGRlbHRhICUgdGhpcy5mcmFtZVRpbWUpO1xyXG4gICAgICB0aGlzLmV2b2x2ZSgpO1xyXG4gICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV2b2x2ZSgpIHtcclxuICAgIHRoaXMuYW5pbWF0aW9uQnVja2V0LmNsZWFyKCk7XHJcbiAgICB0aGlzLnBhcnRpY3VsZXMuZm9yRWFjaCgocDogUGFydGljdWxlKSA9PiB7XHJcbiAgICAgIHAuZ3JvdygpO1xyXG4gICAgICBpZiAocC5pc0RlYWQpIHtcclxuICAgICAgICB0aGlzLmxheWVyLmNhbnZhc0JvdW5kLnJlc2V0UGFydGljdWxlKHApO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHdpbmQgPSB0aGlzLmdldFBhcnRpY3VsZVdpbmQocCk7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uQnVja2V0LmFkZChwLCB3aW5kKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZHJhdygpIHtcclxuICAgIHRoaXMuY29udGV4dDJELmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24taW5cIjtcclxuICAgIHRoaXMuY29udGV4dDJELmZpbGxSZWN0KFxyXG4gICAgICB0aGlzLmxheWVyLmNhbnZhc0JvdW5kLnhNaW4sXHJcbiAgICAgIHRoaXMubGF5ZXIuY2FudmFzQm91bmQueU1pbixcclxuICAgICAgdGhpcy5sYXllci5jYW52YXNCb3VuZC53aWR0aCxcclxuICAgICAgdGhpcy5sYXllci5jYW52YXNCb3VuZC5oZWlnaHRcclxuICAgICk7XHJcbiAgICAvLyBGYWRlIGV4aXN0aW5nIHBhcnRpY2xlIHRyYWlscy5cclxuICAgIHRoaXMuY29udGV4dDJELmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwibGlnaHRlclwiO1xyXG4gICAgdGhpcy5jb250ZXh0MkQuZ2xvYmFsQWxwaGEgPSAwLjk7XHJcblxyXG4gICAgdGhpcy5hbmltYXRpb25CdWNrZXQuZHJhdyh0aGlzLmNvbnRleHQyRCk7XHJcbiAgfVxyXG5cclxuICBzdG9wKCkge1xyXG4gICAgdGhpcy5wYXJ0aWN1bGVzLnNwbGljZSgwLCB0aGlzLnBhcnRpY3VsZXMubGVuZ3RoKTtcclxuICAgIHRoaXMuYW5pbWF0aW9uQnVja2V0LmNsZWFyKCk7XHJcbiAgICBpZiAodGhpcy5hbmltYXRpb25Mb29wKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmFuaW1hdGlvbkxvb3ApO1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbkxvb3AgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3dpbmR5LnRzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjdG9yIHtcbiAgICBwdWJsaWMgdTogbnVtYmVyO1xuICAgIHB1YmxpYyB2OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciAodT86IG51bWJlciwgdj86IG51bWJlcikge1xuICAgICAgICB0aGlzLnUgPSB1IHx8IDA7XG4gICAgICAgIHRoaXMudiA9IHYgfHwgMDtcbiAgICB9XG5cbiAgICBnZXQgaW50ZW5zaXR5ICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnUgKiB0aGlzLnUgKyB0aGlzLnYgKiB0aGlzLnYpO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdmVjdG9yLnRzIiwiZGVjbGFyZSB2YXIgTDogYW55O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNMYXllciB7XG5cdHByaXZhdGUgX21hcDogYW55O1xuXHRwcml2YXRlIF9jYW52YXM6IGFueTtcblx0cHJpdmF0ZSBfZnJhbWU6IGFueTtcblx0cHJpdmF0ZSBfZGVsZWdhdGU6IGFueTtcblx0cHJpdmF0ZSB0aWxlczogYW55O1xuXG5cdGluaXRpYWxpemUgKG9wdGlvbnM6IGFueSkge1xuXHRcdHRoaXMuX21hcCAgICA9IG51bGw7XG5cdFx0dGhpcy5fY2FudmFzID0gbnVsbDtcblx0XHR0aGlzLl9mcmFtZSAgPSBudWxsO1xuXHRcdHRoaXMuX2RlbGVnYXRlID0gbnVsbDtcblx0XHRMLlV0aWwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcblx0fVxuXG5cdGRlbGVnYXRlIChkZWw6IGFueSk6IENhbnZhc0xheWVyIHtcblx0XHR0aGlzLl9kZWxlZ2F0ZSA9IGRlbDtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdG5lZWRSZWRyYXcgKCkge1xuXHRcdGlmICghdGhpcy5fZnJhbWUpIHtcblx0XHRcdHRoaXMuX2ZyYW1lID0gTC5VdGlsLnJlcXVlc3RBbmltRnJhbWUodGhpcy5kcmF3TGF5ZXIsIHRoaXMpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRfb25MYXllckRpZFJlc2l6ZSAocmVzaXplRXZlbnQ6IGFueSkge1xuXHRcdHRoaXMuX2NhbnZhcy53aWR0aCA9IHJlc2l6ZUV2ZW50Lm5ld1NpemUueDtcblx0XHR0aGlzLl9jYW52YXMuaGVpZ2h0ID0gcmVzaXplRXZlbnQubmV3U2l6ZS55O1xuXHR9XG5cblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdF9vbkxheWVyRGlkTW92ZSAoKSB7XG5cdFx0dmFyIHRvcExlZnQgPSB0aGlzLl9tYXAuY29udGFpbmVyUG9pbnRUb0xheWVyUG9pbnQoWzAsIDBdKTtcblx0XHRMLkRvbVV0aWwuc2V0UG9zaXRpb24odGhpcy5fY2FudmFzLCB0b3BMZWZ0KTtcblx0XHR0aGlzLmRyYXdMYXllcigpO1xuXHR9XG5cblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGdldEV2ZW50cyAoKSB7XG5cdFx0dmFyIGV2ZW50cyA9IHtcblx0XHRcdHJlc2l6ZTogdGhpcy5fb25MYXllckRpZFJlc2l6ZSxcblx0XHRcdG1vdmVlbmQ6IHRoaXMuX29uTGF5ZXJEaWRNb3ZlLFxuXHRcdFx0em9vbWFuaW06IDxhbnk+dW5kZWZpbmVkXG5cdFx0fTtcblx0XHRpZiAodGhpcy5fbWFwLm9wdGlvbnMuem9vbUFuaW1hdGlvbiAmJiBMLkJyb3dzZXIuYW55M2QpIHtcblx0XHRcdGV2ZW50cy56b29tYW5pbSA9ICB0aGlzLl9hbmltYXRlWm9vbTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZXZlbnRzO1xuXHR9XG5cblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdG9uQWRkIChtYXA6IGFueSkge1xuXHRcdHRoaXMuX21hcCA9IG1hcDtcblx0XHR0aGlzLl9jYW52YXMgPSBMLkRvbVV0aWwuY3JlYXRlKCdjYW52YXMnLCAnbGVhZmxldC1sYXllcicpO1xuXHRcdHRoaXMudGlsZXMgPSB7fTtcblxuXHRcdHZhciBzaXplID0gdGhpcy5fbWFwLmdldFNpemUoKTtcblx0XHR0aGlzLl9jYW52YXMud2lkdGggPSBzaXplLng7XG5cdFx0dGhpcy5fY2FudmFzLmhlaWdodCA9IHNpemUueTtcblxuXHRcdHZhciBhbmltYXRlZCA9IHRoaXMuX21hcC5vcHRpb25zLnpvb21BbmltYXRpb24gJiYgTC5Ccm93c2VyLmFueTNkO1xuXHRcdEwuRG9tVXRpbC5hZGRDbGFzcyh0aGlzLl9jYW52YXMsICdsZWFmbGV0LXpvb20tJyArIChhbmltYXRlZCA/ICdhbmltYXRlZCcgOiAnaGlkZScpKTtcblxuXG5cdFx0bWFwLl9wYW5lcy5vdmVybGF5UGFuZS5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMpO1xuXHRcdG1hcC5vbih0aGlzLmdldEV2ZW50cygpLHRoaXMpO1xuXG5cdFx0dmFyIGRlbCA9IHRoaXMuX2RlbGVnYXRlIHx8IHRoaXM7XG5cdFx0ZGVsLm9uTGF5ZXJEaWRNb3VudCAmJiBkZWwub25MYXllckRpZE1vdW50KCk7IC8vIC0tIGNhbGxiYWNrXG5cdFx0dGhpcy5uZWVkUmVkcmF3KCk7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0c2VsZi5fb25MYXllckRpZE1vdmUoKTtcblx0XHR9LCAwKTtcblx0fVxuXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRvblJlbW92ZSAobWFwOiBhbnkpIHtcblx0XHR2YXIgZGVsID0gdGhpcy5fZGVsZWdhdGUgfHwgdGhpcztcblx0XHRkZWwub25MYXllcldpbGxVbm1vdW50ICYmIGRlbC5vbkxheWVyV2lsbFVubW91bnQoKTsgLy8gLS0gY2FsbGJhY2tcblxuXG5cdFx0bWFwLmdldFBhbmVzKCkub3ZlcmxheVBhbmUucmVtb3ZlQ2hpbGQodGhpcy5fY2FudmFzKTtcblxuXHRcdG1hcC5vZmYodGhpcy5nZXRFdmVudHMoKSx0aGlzKTtcblxuXHRcdHRoaXMuX2NhbnZhcyA9IG51bGw7XG5cblx0fVxuXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGFkZFRvIChtYXA6IGFueSkge1xuXHRcdG1hcC5hZGRMYXllcih0aGlzKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdExhdExvblRvTWVyY2F0b3IgKGxhdGxvbjogTC5MYXRMbmcpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0eDogbGF0bG9uLmxuZyAqIDYzNzgxMzcgKiBNYXRoLlBJIC8gMTgwLFxuXHRcdFx0eTogTWF0aC5sb2coTWF0aC50YW4oKDkwICsgbGF0bG9uLmxhdCkgKiBNYXRoLlBJIC8gMzYwKSkgKiA2Mzc4MTM3XG5cdFx0fTtcblx0fVxuXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGRyYXdMYXllciAoKSB7XG5cdFx0Ly8gLS0gdG9kbyBtYWtlIHRoZSB2aWV3SW5mbyBwcm9wZXJ0aWVzICBmbGF0IG9iamVjdHMuXG5cdFx0dmFyIHNpemUgICA9IHRoaXMuX21hcC5nZXRTaXplKCk7XG5cdFx0dmFyIGJvdW5kcyA9IHRoaXMuX21hcC5nZXRCb3VuZHMoKTtcblx0XHR2YXIgem9vbSAgID0gdGhpcy5fbWFwLmdldFpvb20oKTtcblxuXHRcdHZhciBjZW50ZXIgPSB0aGlzLkxhdExvblRvTWVyY2F0b3IodGhpcy5fbWFwLmdldENlbnRlcigpKTtcblx0XHR2YXIgY29ybmVyID0gdGhpcy5MYXRMb25Ub01lcmNhdG9yKHRoaXMuX21hcC5jb250YWluZXJQb2ludFRvTGF0TG5nKHRoaXMuX21hcC5nZXRTaXplKCkpKTtcblxuXHRcdHZhciBkZWwgPSB0aGlzLl9kZWxlZ2F0ZSB8fCB0aGlzO1xuXHRcdGRlbC5vbkRyYXdMYXllciAmJiBkZWwub25EcmF3TGF5ZXIoIHtcblx0XHRcdGxheWVyIDogdGhpcyxcblx0XHRcdGNhbnZhczogdGhpcy5fY2FudmFzLFxuXHRcdFx0Ym91bmRzOiBib3VuZHMsXG5cdFx0XHRzaXplOiBzaXplLFxuXHRcdFx0em9vbTogem9vbSxcblx0XHRcdGNlbnRlciA6IGNlbnRlcixcblx0XHRcdGNvcm5lciA6IGNvcm5lclxuXHRcdH0pO1xuXHRcdHRoaXMuX2ZyYW1lID0gbnVsbDtcblx0fVxuXG5cdC8vIC0tIEwuRG9tVXRpbC5zZXRUcmFuc2Zvcm0gZnJvbSBsZWFmbGV0IDEuMC4wIHRvIHdvcmsgb24gMC4wLjdcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0X3NldFRyYW5zZm9ybSAoZWw6IGFueSwgb2Zmc2V0OiBhbnksIHNjYWxlOiBhbnkpIHtcblx0XHR2YXIgcG9zID0gb2Zmc2V0IHx8IG5ldyBMLlBvaW50KDAsIDApO1xuXG5cdFx0ZWwuc3R5bGVbTC5Eb21VdGlsLlRSQU5TRk9STV0gPVxuXHRcdFx0KEwuQnJvd3Nlci5pZTNkID9cblx0XHRcdCd0cmFuc2xhdGUoJyArIHBvcy54ICsgJ3B4LCcgKyBwb3MueSArICdweCknIDpcblx0XHRcdCd0cmFuc2xhdGUzZCgnICsgcG9zLnggKyAncHgsJyArIHBvcy55ICsgJ3B4LDApJykgK1xuXHRcdFx0KHNjYWxlID8gJyBzY2FsZSgnICsgc2NhbGUgKyAnKScgOiAnJyk7XG5cdH1cblxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRfYW5pbWF0ZVpvb20gKGU6IGFueSkge1xuXHRcdHZhciBzY2FsZSA9IHRoaXMuX21hcC5nZXRab29tU2NhbGUoZS56b29tKTtcblx0XHQvLyAtLSBkaWZmZXJlbnQgY2FsYyBvZiBvZmZzZXQgaW4gbGVhZmxldCAxLjAuMCBhbmQgMC4wLjcgdGhhbmtzIGZvciAxLjAuMC1yYzIgY2FsYyBAamR1Z2dhbjFcblx0XHR2YXIgb2Zmc2V0ID0gTC5MYXllciA/IHRoaXMuX21hcC5fbGF0TG5nVG9OZXdMYXllclBvaW50KHRoaXMuX21hcC5nZXRCb3VuZHMoKS5nZXROb3J0aFdlc3QoKSwgZS56b29tLCBlLmNlbnRlcikgOlxuXHRcdFx0dGhpcy5fbWFwLl9nZXRDZW50ZXJPZmZzZXQoZS5jZW50ZXIpLl9tdWx0aXBseUJ5KC1zY2FsZSkuc3VidHJhY3QodGhpcy5fbWFwLl9nZXRNYXBQYW5lUG9zKCkpO1xuXG5cdFx0TC5Eb21VdGlsLnNldFRyYW5zZm9ybSh0aGlzLl9jYW52YXMsIG9mZnNldCwgc2NhbGUpO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTC5DYW52YXNMYXllci50cyIsImltcG9ydCBXaW5keSBmcm9tICcuL3dpbmR5JztcbmRlY2xhcmUgdmFyIEw6IGFueTtcbmltcG9ydCAqIGFzIHZlbG9jaXR5Y3NzIGZyb20gJy4vbGVhZmxldC12ZWxvY2l0eS5jc3MnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlbG9jaXR5Q29udHJvbCB7XG4gIHByaXZhdGUgb3B0aW9uczogYW55O1xuICBwcml2YXRlIF93aW5keTogV2luZHkgPSBudWxsO1xuICBwcml2YXRlIF9tYXA6IGFueSA9IG51bGw7XG4gIHByaXZhdGUgX2RlbGVnYXRlOiBhbnk7XG4gIHByaXZhdGUgX2NvbnRhaW5lcjogYW55ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBwb3NpdGlvbjogJ2JvdHRvbWxlZnQnLFxuICAgICAgZW1wdHlTdHJpbmc6ICdVbmF2YWlsYWJsZScsXG4gICAgICAvLyBDb3VsZCBiZSBhbnkgY29tYmluYXRpb24gb2YgJ2JlYXJpbmcnIChhbmdsZSB0b3dhcmQgd2hpY2ggdGhlIGZsb3cgZ29lcykgb3IgJ21ldGVvJyAoYW5nbGUgZnJvbSB3aGljaCB0aGUgZmxvdyBjb21lcylcbiAgICAgIC8vIGFuZCAnQ1cnIChhbmdsZSB2YWx1ZSBpbmNyZWFzZXMgY2xvY2std2lzZSkgb3IgJ0NDVycgKGFuZ2xlIHZhbHVlIGluY3JlYXNlcyBjb3VudGVyIGNsb2NrLXdpc2UpXG4gICAgICBhbmdsZUNvbnZlbnRpb246ICdiZWFyaW5nQ0NXJyxcblx0ICAgIC8vIENvdWxkIGJlICdtL3MnIGZvciBtZXRlciBwZXIgc2Vjb25kLCAnay9oJyBmb3Iga2lsb21ldGVyIHBlciBob3VyIG9yICdrdCcgZm9yIGtub3RzXG5cdCAgICBzcGVlZFVuaXQ6ICdtL3MnXG4gICAgfTtcbiAgfVxuXG4gIHNldFdpbmR5KF93aW5keTphbnkpe1xuICAgIGlmKCF0aGlzLl93aW5keSAmJiBfd2luZHkpIHRoaXMuX3dpbmR5ID0gX3dpbmR5O1xuICB9XG5cbiAgc2V0T3B0aW9ucyhvcHRpb25zOmFueSl7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIG9uQWRkKG1hcDogYW55KSB7XG4gICAgdGhpcy5fbWFwID0gbWFwO1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsIHZlbG9jaXR5Y3NzLmxlYWZsZXRDb250cm9sVmVsb2NpdHkpO1xuICAgIEwuRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKTtcbiAgICB0aGlzLl9tYXAub24oJ21vdXNlbW92ZScsIHRoaXMuZHJhd1dpbmRTcGVlZCwgdGhpcyk7XG4gICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lbXB0eVN0cmluZztcbiAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xuICB9XG5cbiAgb25SZW1vdmUobWFwOiBhbnkpIHtcbiAgICB0aGlzLl9tYXAub2ZmKCdtb3VzZW1vdmUnLCB0aGlzLmRyYXdXaW5kU3BlZWQsIHRoaXMpO1xuICB9XG5cbiAgdmVjdG9yVG9TcGVlZCh1TXM6IG51bWJlciwgdk1zOiBudW1iZXIsIHVuaXQ6IHN0cmluZykge1xuICAgIHZhciB2ZWxvY2l0eUFicyA9IE1hdGguc3FydChNYXRoLnBvdyh1TXMsIDIpICsgTWF0aC5wb3codk1zLCAyKSk7XG4gICAgLy8gRGVmYXVsdCBpcyBtL3NcbiAgICBpZiAodW5pdCA9PT0gJ2svaCcpIHtcbiAgICAgIHJldHVybiB0aGlzLm1ldGVyU2VjMmtpbG9tZXRlckhvdXIodmVsb2NpdHlBYnMpO1xuICAgIH0gZWxzZSBpZiAodW5pdCA9PT0gJ2t0Jykge1xuICAgICAgcmV0dXJuIHRoaXMubWV0ZXJTZWMyS25vdHModmVsb2NpdHlBYnMpO1xuICAgIH0gZWxzZSBpZiAodW5pdCA9PT0gJ21waCcpIHtcbiAgICAgIHJldHVybiB0aGlzLm1ldGVyU2VjMm1pbGVIb3VyKHZlbG9jaXR5QWJzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZlbG9jaXR5QWJzO1xuICAgIH1cbiAgfVxuXG4gIHZlY3RvclRvRGVncmVlcyh1TXM6IG51bWJlciwgdk1zOiBudW1iZXIsIGFuZ2xlQ29udmVudGlvbjogc3RyaW5nKSB7XG4gICAgLy8gRGVmYXVsdCBhbmdsZSBjb252ZW50aW9uIGlzIENXXG4gICAgaWYgKGFuZ2xlQ29udmVudGlvbi5lbmRzV2l0aCgnQ0NXJykpIHtcbiAgICAgIC8vIHZNcyBjb21lcyBvdXQgdXBzaWRlLWRvd24uLlxuICAgICAgdk1zID0gdk1zID4gMCA/IHZNcyA9IC12TXMgOiBNYXRoLmFicyh2TXMpO1xuICAgIH1cbiAgICB2YXIgdmVsb2NpdHlBYnMgPSBNYXRoLnNxcnQoTWF0aC5wb3codU1zLCAyKSArIE1hdGgucG93KHZNcywgMikpO1xuXG4gICAgdmFyIHZlbG9jaXR5RGlyID0gTWF0aC5hdGFuMih1TXMgLyB2ZWxvY2l0eUFicywgdk1zIC8gdmVsb2NpdHlBYnMpO1xuICAgIHZhciB2ZWxvY2l0eURpclRvRGVncmVlcyA9IHZlbG9jaXR5RGlyICogMTgwIC8gTWF0aC5QSSArIDE4MDtcblxuICAgIGlmIChhbmdsZUNvbnZlbnRpb24gPT09ICdiZWFyaW5nQ1cnIHx8IGFuZ2xlQ29udmVudGlvbiA9PT0gJ21ldGVvQ0NXJykge1xuICAgICAgdmVsb2NpdHlEaXJUb0RlZ3JlZXMgKz0gMTgwO1xuICAgICAgaWYgKHZlbG9jaXR5RGlyVG9EZWdyZWVzID49IDM2MCkgdmVsb2NpdHlEaXJUb0RlZ3JlZXMgLT0gMzYwO1xuICAgIH1cblxuICAgIHJldHVybiB2ZWxvY2l0eURpclRvRGVncmVlcztcbiAgfVxuXG4gIG1ldGVyU2VjMktub3RzKG1ldGVyczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG1ldGVycyAvIDAuNTE0XG4gIH1cblxuICBtZXRlclNlYzJraWxvbWV0ZXJIb3VyKG1ldGVyczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG1ldGVycyAqIDMuNlxuICB9XG5cbiAgbWV0ZXJTZWMybWlsZUhvdXIobWV0ZXJzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbWV0ZXJzICogMi4yMzY5NFxuICB9XG5cbiAgZHJhd1dpbmRTcGVlZChldjogYW55KSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5fbWFwLmNvbnRhaW5lclBvaW50VG9MYXRMbmcoTC5wb2ludChldi5jb250YWluZXJQb2ludC54LCBldi5jb250YWluZXJQb2ludC55KSk7XG4gICAgdmFyIGdyaWRWYWx1ZSA9IHRoaXMuX3dpbmR5LmludGVycG9sYXRlKHBvcy5sbmcsIHBvcy5sYXQpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IFwiXCI7XG4gICAgaWYgKGdyaWRWYWx1ZSAmJiAhaXNOYU4oZ3JpZFZhbHVlWzBdKSAmJiAhaXNOYU4oZ3JpZFZhbHVlWzFdKSAmJiBncmlkVmFsdWVbMl0pIHtcbiAgICAgIHRlbXBsYXRlID0gXCI8c3Ryb25nPiAgRGlyZWN0aW9uOiA8L3N0cm9uZz5cIiArXG4gICAgICAgIHRoaXMudmVjdG9yVG9EZWdyZWVzKGdyaWRWYWx1ZVswXSwgZ3JpZFZhbHVlWzFdLCB0aGlzLm9wdGlvbnMuYW5nbGVDb252ZW50aW9uKS50b0ZpeGVkKDEpICtcbiAgICAgICAgXCLCsFwiICsgXCIgPHRoaXNzdHJvbmc+ICBTcGVlZDogPC9zdHJvbmc+XCIgK1xuICAgICAgICB0aGlzLnZlY3RvclRvU3BlZWQoZ3JpZFZhbHVlWzBdLCBncmlkVmFsdWVbMV0sIHRoaXMub3B0aW9ucy5zcGVlZFVuaXQpLnRvRml4ZWQoMSkrIGAgJHt0aGlzLm9wdGlvbnMuc3BlZWRVbml0fWA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYodGhpcy5vcHRpb25zLmVtcHR5U3RyaW5nKVxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMub3B0aW9ucy5lbXB0eVN0cmluZztcbiAgICB9XG4gICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTC5Db250cm9sVmVsb2NpdHkudHMiLCJpbXBvcnQgQ2FudmFzQm91bmQgZnJvbSBcIi4vY2FudmFzQm91bmRcIjtcclxuaW1wb3J0IE1hcEJvdW5kIGZyb20gXCIuL21hcEJvdW5kXCI7XHJcbmltcG9ydCBXaW5keSBmcm9tIFwiLi93aW5keVwiO1xyXG5pbXBvcnQgQ2FudmFzTGF5ZXIgZnJvbSBcIi4vTC5DYW52YXNMYXllclwiO1xyXG5pbXBvcnQgVmVsb2NpdHlMYXllciBmcm9tIFwiLi9MLlZlbG9jaXR5TGF5ZXJcIjtcclxuaW1wb3J0IFZlbG9jaXR5Q29udHJvbCBmcm9tICcuL0wuQ29udHJvbFZlbG9jaXR5JztcclxuXHJcbig8YW55PndpbmRvdykuQ2FudmFzQm91bmQgPSBDYW52YXNCb3VuZDtcclxuKDxhbnk+d2luZG93KS5NYXBCb3VuZCA9IE1hcEJvdW5kO1xyXG4oPGFueT53aW5kb3cpLldpbmR5ID0gV2luZHk7XHJcblxyXG5kZWNsYXJlIHZhciBMOiBhbnk7XHJcblxyXG5MLkNhbnZhc0xheWVyID0gKEwuTGF5ZXIgPyBMLkxheWVyIDogTC5DbGFzcykuZXh0ZW5kKG5ldyBDYW52YXNMYXllcigpKTtcclxuTC5jYW52YXNMYXllciA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gbmV3IEwuQ2FudmFzTGF5ZXIoKTtcclxufTtcclxuXHJcbkwuQ29udHJvbFZlbG9jaXR5ID0gKEwuQ29udHJvbCkuZXh0ZW5kKG5ldyBWZWxvY2l0eUNvbnRyb2woKSk7XHJcbkwuY29udHJvbFZlbG9jaXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIG5ldyBMLkNvbnRyb2xWZWxvY2l0eSgpO1xyXG59O1xyXG5cclxuTC5WZWxvY2l0eUxheWVyID0gKEwuTGF5ZXIgPyBMLkxheWVyIDogTC5DbGFzcykuZXh0ZW5kKG5ldyBWZWxvY2l0eUxheWVyKCkpO1xyXG5MLnZlbG9jaXR5TGF5ZXIgPSBmdW5jdGlvbihvcHRpb25zOiBhbnkpIHtcclxuXHRyZXR1cm4gbmV3IEwuVmVsb2NpdHlMYXllcihvcHRpb25zKTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFydGljdWxlIHtcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xuICAgIHB1YmxpYyB5OiBudW1iZXI7XG4gICAgcHVibGljIGFnZTogbnVtYmVyO1xuICAgIHB1YmxpYyBtYXhBZ2U6IG51bWJlcjtcbiAgICBwdWJsaWMgeHQ6IG51bWJlcjtcbiAgICBwdWJsaWMgeXQ6IG51bWJlcjtcbiAgICBwdWJsaWMgaW50ZW5zaXR5OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgbWF4QWdlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy5hZ2UgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXhBZ2UpO1xuICAgICAgICB0aGlzLm1heEFnZSA9IG1heEFnZTtcbiAgICB9XG5cbiAgICByZXNldCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLmFnZSA9IDA7XG4gICAgfVxuXG4gICAgZ2V0IGlzRGVhZCAoKSA6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZ2UgPiB0aGlzLm1heEFnZTtcbiAgICB9XG5cbiAgICBncm93ICgpIHtcbiAgICAgICAgdGhpcy5hZ2UrKztcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhcnRpY2xlLnRzIiwiaW1wb3J0IFZlY3RvciBmcm9tIFwiLi92ZWN0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG4gICAgcHJpdmF0ZSBkYXRhOiBWZWN0b3JbXTtcbiAgICBwcml2YXRlIM+GMDogbnVtYmVyO1xuICAgIHByaXZhdGUgzrswOiBudW1iZXI7XG4gICAgcHJpdmF0ZSDOlM67OiBudW1iZXI7XG4gICAgcHJpdmF0ZSDOlM+GOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBoZWlnaHQ6IG51bWJlcjtcbiAgICBwcml2YXRlIHdpZHRoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvciAoZGF0YTogVmVjdG9yW10sIM+GMDogbnVtYmVyLCDOuzA6IG51bWJlciwgzpTPhjogbnVtYmVyLCDOlM67OiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCB3aWR0aDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMuz4YwID0gz4YwO1xuICAgICAgICB0aGlzLs67MCA9IM67MDtcbiAgICAgICAgdGhpcy7OlM67ID0gzpTOuztcbiAgICAgICAgdGhpcy7OlM+GID0gLSDOlM+GOyAgLy8gc2Nhbm1vZGUgNjRcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWVSYW5nZSAoKSA6IG51bWJlcltdIHtcbiAgICAgICAgaWYgKCF0aGlzLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gWzAsIDBdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBtaW4gPSB0aGlzLmRhdGFbMF0uaW50ZW5zaXR5O1xuICAgICAgICBsZXQgbWF4ID0gdGhpcy5kYXRhWzBdLmludGVuc2l0eTtcbiAgICAgICAgdGhpcy5kYXRhLmZvckVhY2goKHZhbHVlOiBWZWN0b3IpID0+IHtcbiAgICAgICAgICAgIG1pbiA9IE1hdGgubWluKG1pbiwgdmFsdWUuaW50ZW5zaXR5KTtcbiAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KG1heCwgdmFsdWUuaW50ZW5zaXR5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBbbWluLCBtYXhdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgdmVjdG9yIGF0IGFueSBwb2ludFxuICAgICAqIEBwYXJhbSDOuyBMb25naXR1ZGVcbiAgICAgKiBAcGFyYW0gz4YgTGF0aXR1ZGVcbiAgICAgKi9cbiAgICBnZXQgKM67OiBudW1iZXIsIM+GOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBmzrsgPSB0aGlzLmZsb29yTW9kKM67IC0gdGhpcy7OuzAsIDM2MCkgLyB0aGlzLs6Uzrs7ICAvLyBjYWxjdWxhdGUgbG9uZ2l0dWRlIGluZGV4IGluIHdyYXBwZWQgcmFuZ2UgWzAsIDM2MClcbiAgICAgICAgY29uc3QgZs+GID0gKHRoaXMuz4YwIC0gz4YpIC8gdGhpcy7OlM+GOyAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIGxhdGl0dWRlIGluZGV4IGluIGRpcmVjdGlvbiArOTAgdG8gLTkwXG5cbiAgICAgICAgY29uc3Qgac67ID0gTWF0aC5mbG9vcihmzrspIC8vIGNvbCBuXG4gICAgICAgIGxldCBqzrsgPSBpzrsgKyAxOyAgICAgICAgLy8gY29sIG4rMVxuICAgICAgICBpZiAoas67ID49IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgIGrOuyA9IHRoaXMuzrswO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGnPhiA9IE1hdGguZmxvb3IoZs+GKSAvLyBsaW5lIG1cbiAgICAgICAgbGV0IGrPhiA9IGnPhiArIDE7ICAgICAgICAvLyBsaW5lIG0rMVxuICAgICAgICBpZiAoas+GID49IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICBqz4YgPSBpz4Y7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2zrsgPSBmzrsgLSBpzrs7ICAgLy8gY29sIHZhcmlhdGlvbiBbMC4uMV1cbiAgICAgICAgY29uc3Qgds+GID0gZs+GIC0gac+GOyAgIC8vIGxpbmUgdmFyaWF0aW9uIFswLi4xXVxuXG4gICAgICAgIGlmIChpzrs+PTAgJiYgac+GPj0wICYmIGnOuzx0aGlzLndpZHRoICYmIGnPhjx0aGlzLmhlaWdodCkge1xuICAgICAgICAgIGxldCBnMDAgPSB0aGlzLmRhdGFbac67ICsgac+GICogdGhpcy53aWR0aF07XG4gICAgICAgICAgbGV0IGcxMCA9IHRoaXMuZGF0YVtqzrsgKyBpz4YgKiB0aGlzLndpZHRoXTtcblxuICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWUoZzAwKSAmJiB0aGlzLmlzVmFsdWUoZzEwKSl7XG4gICAgICAgICAgICBsZXQgZzAxID0gdGhpcy5kYXRhW2nOuyArIGrPhiAqIHRoaXMud2lkdGhdO1xuICAgICAgICAgICAgbGV0IGcxMSA9IHRoaXMuZGF0YVtqzrsgKyBqz4YgKiB0aGlzLndpZHRoXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWUoZzAxKSAmJiB0aGlzLmlzVmFsdWUoZzExKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnRlcnBvbGF0aW9uIChcbiAgICAgICAgICAgICAgICAgIHbOuyxcbiAgICAgICAgICAgICAgICAgIHbPhixcbiAgICAgICAgICAgICAgICAgIGcwMCwgLy9sMGMwXG4gICAgICAgICAgICAgICAgICBnMTAsIC8vbDBjMVxuICAgICAgICAgICAgICAgICAgZzAxLCAvL2wxYzBcbiAgICAgICAgICAgICAgICAgIGcxMSAgLy9sMWNsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoMCwwKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludGVycG9sYXRlIHZhbHVlXG4gICAgICogQHBhcmFtIHggdmFyaWF0aW9uIGJldHdlZW4gZzAqIGFuZCBnMSpcbiAgICAgKiBAcGFyYW0geSB2YXJpYXRpb24gYmV0d2VlbiBnKjAgZGFucyBnKjFcbiAgICAgKiBAcGFyYW0gZzAwIHBvaW50IGF0IGNvbF8wIGFuZCBsaW5lXzBcbiAgICAgKiBAcGFyYW0gZzEwIHBvaW50IGF0IGNvbF8xIGFuZCBsaW5lXzBcbiAgICAgKiBAcGFyYW0gZzAxIHBvaW50IGF0IGNvbF8wIGFuZCBsaW5lXzFcbiAgICAgKiBAcGFyYW0gZzExIHBvaW50IGF0IGNvbF8xIGFuZCBsaW5lXzFcbiAgICAgKiBAcmV0dXJuIGludGVycG9sYXRlZCB2ZWN0b3JcbiAgICAgKi9cbiAgICBpbnRlcnBvbGF0aW9uICh4OiBudW1iZXIsIHk6IG51bWJlciwgZzAwOiBWZWN0b3IsIGcxMDpWZWN0b3IsIGcwMTogVmVjdG9yLCBnMTE6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHZhciByeCA9ICgxIC0geCk7XG4gICAgICAgIHZhciByeSA9ICgxIC0geSk7XG4gICAgICAgIHZhciBhID0gcnggKiByeSxcbiAgICAgICAgICAgIGIgPSB4ICogcnksXG4gICAgICAgICAgICBjID0gcnggKiB5LFxuICAgICAgICAgICAgZCA9IHggKiB5O1xuICAgICAgICB2YXIgdSA9IGcwMC51ICogYSArIGcxMC51ICogYiArIGcwMS51ICogYyArIGcxMS51ICogZDtcbiAgICAgICAgdmFyIHYgPSBnMDAudiAqIGEgKyBnMTAudiAqIGIgKyBnMDEudiAqIGMgKyBnMTEudiAqIGQ7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHUsIHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEN1c3RvbSBtb2R1bG9cblx0ICogQHJldHVybnMge251bWJlcn0gcmV0dXJucyByZW1haW5kZXIgb2YgZmxvb3JlZCBkaXZpc2lvbiwgaS5lLiwgZmxvb3IoYSAvIG4pLiBVc2VmdWwgZm9yIGNvbnNpc3RlbnQgbW9kdWxvXG5cdCAqICAgICAgICAgIG9mIG5lZ2F0aXZlIG51bWJlcnMuIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01vZHVsb19vcGVyYXRpb24uXG5cdCAqL1xuXHRmbG9vck1vZCAoYTogbnVtYmVyLCBuOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdHJldHVybiBhIC0gbiAqIE1hdGguZmxvb3IoYSAvIG4pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgaWYgeCBpcyBhIHZhbHVlXG5cdCAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgbm90IG51bGwgYW5kIG5vdCB1bmRlZmluZWQuXG5cdCAqL1xuXHRpc1ZhbHVlICh4OiBhbnkpOiBib29sZWFuIHtcblx0XHRyZXR1cm4geCAhPT0gbnVsbCAmJiB4ICE9PSB1bmRlZmluZWQ7XG5cdH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZ3JpZC50cyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yU2NhbGUge1xuICAgIHByaXZhdGUgc2NhbGU6IHN0cmluZ1tdID0gW1xuICAgIFwicmdiKDM2LDEwNCwgMTgwKVwiLFxuXHRcdFwicmdiKDYwLDE1NywgMTk0KVwiLFxuXHRcdFwicmdiKDEyOCwyMDUsMTkzIClcIixcblx0XHRcInJnYigxNTEsMjE4LDE2OCApXCIsXG5cdFx0XCJyZ2IoMTk4LDIzMSwxODEpXCIsXG5cdFx0XCJyZ2IoMjM4LDI0NywyMTcpXCIsXG5cdFx0XCJyZ2IoMjU1LDIzOCwxNTkpXCIsXG5cdFx0XCJyZ2IoMjUyLDIxNywxMjUpXCIsXG5cdFx0XCJyZ2IoMjU1LDE4MiwxMDApXCIsXG5cdFx0XCJyZ2IoMjUyLDE1MCw3NSlcIixcblx0XHRcInJnYigyNTAsMTEyLDUyKVwiLFxuXHRcdFwicmdiKDI0NSw2NCwzMilcIixcblx0XHRcInJnYigyMzcsNDUsMjgpXCIsXG5cdFx0XCJyZ2IoMjIwLDI0LDMyKVwiLFxuXHRcdFwicmdiKDE4MCwwLDM1KVwiXG4gICAgXVxuICAgIHByaXZhdGUgbWluVmFsdWU6IG51bWJlcjtcbiAgICBwcml2YXRlIG1heFZhbHVlOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihtaW5WYWx1ZTogbnVtYmVyLCBtYXhWYWx1ZTogbnVtYmVyLCBzY2FsZT86IHN0cmluZ1tdKSB7XG4gICAgICAgIHRoaXMuc2V0TWluTWF4KG1pblZhbHVlLCBtYXhWYWx1ZSk7XG4gICAgICAgIGlmICgoc2NhbGUgaW5zdGFuY2VvZiBBcnJheSkgJiYgc2NhbGUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNaW5NYXggKG1pblZhbHVlOiBudW1iZXIsIG1heFZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5taW5WYWx1ZSA9IG1pblZhbHVlO1xuICAgICAgICB0aGlzLm1heFZhbHVlID0gbWF4VmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0IHNpemUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2FsZS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0Q29sb3JJbmRleCh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHZhbHVlIDw9IHRoaXMubWluVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSA+PSB0aGlzLm1heFZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FsZS5sZW5ndGgtMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2NhbGUubGVuZ3RoICogKHZhbHVlIC0gdGhpcy5taW5WYWx1ZSkgLyAodGhpcy5tYXhWYWx1ZSAtIHRoaXMubWluVmFsdWUpO1xuICAgICAgICBpZiAoaW5kZXggPDApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleD4gdGhpcy5zY2FsZS5sZW5ndGgtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUubGVuZ3RoLTE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoaW5kZXgpO1xuICAgIH1cblxuICAgIGNvbG9yQXQoaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlW2luZGV4XTtcbiAgICB9XG5cbiAgICBnZXRDb2xvcih2YWx1ZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGVbdGhpcy5nZXRDb2xvckluZGV4KHZhbHVlKV07XG4gICAgfVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29sb3JTY2FsZS50cyIsImltcG9ydCBDb2xvclNjYWxlIGZyb20gXCIuL2NvbG9yU2NhbGVcIjtcbmltcG9ydCBQYXJ0aWN1bGUgZnJvbSBcIi4vcGFydGljbGVcIjtcbmltcG9ydCBWZWN0b3IgZnJvbSBcIi4vdmVjdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuaW1hdGlvbkJ1Y2tldCB7XG4gICAgcHJpdmF0ZSBjb2xvclNjYWxlOiBDb2xvclNjYWxlO1xuICAgIHByaXZhdGUgYnVja2V0czogUGFydGljdWxlW11bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IgKGNvbG9yU2NhbGU6IENvbG9yU2NhbGUpIHtcbiAgICAgICAgdGhpcy5jb2xvclNjYWxlID0gY29sb3JTY2FsZTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPGNvbG9yU2NhbGUuc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJ1Y2tldHMucHVzaChbXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5idWNrZXRzLmZvckVhY2goKHBhcnRpY3VsZVNldDogUGFydGljdWxlW10pID0+IHtcbiAgICAgICAgICAgIHBhcnRpY3VsZVNldC5zcGxpY2UoMCwgcGFydGljdWxlU2V0Lmxlbmd0aClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGQgKHA6IFBhcnRpY3VsZSwgdjogVmVjdG9yKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jb2xvclNjYWxlLmdldENvbG9ySW5kZXgocC5pbnRlbnNpdHkpXG4gICAgICAgIGlmIChpbmRleDwwIHx8IGluZGV4Pj0gdGhpcy5idWNrZXRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHAueHQgPSBwLnggKyB2LnU7XG4gICAgICAgIHAueXQgPSBwLnkgKyB2LnY7XG4gICAgICAgIHRoaXMuYnVja2V0c1tpbmRleF0ucHVzaChwKTtcbiAgICB9XG5cbiAgICBkcmF3IChjb250ZXh0MkQ6IGFueSkge1xuICAgICAgICB0aGlzLmJ1Y2tldHMuZm9yRWFjaCgoYnVja2V0OiBQYXJ0aWN1bGVbXSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoYnVja2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0MkQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgY29udGV4dDJELnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvclNjYWxlLmNvbG9yQXQoaSk7XG4gICAgICAgICAgICAgICAgYnVja2V0LmZvckVhY2goZnVuY3Rpb24ocGFydGljbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDJELm1vdmVUbyhwYXJ0aWNsZS54LCBwYXJ0aWNsZS55KTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDJELmxpbmVUbyhwYXJ0aWNsZS54dCwgcGFydGljbGUueXQpO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS54ID0gcGFydGljbGUueHQ7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnkgPSBwYXJ0aWNsZS55dDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0MkQuc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYW5pbWF0aW9uQnVja2V0LnRzIiwiaW1wb3J0IFdpbmR5IGZyb20gJy4vd2luZHknO1xyXG5pbXBvcnQgQ2FudmFzQm91bmQgZnJvbSAnLi9jYW52YXNCb3VuZCdcclxuaW1wb3J0IE1hcEJvdW5kIGZyb20gJy4vbWFwQm91bmQnO1xyXG5pbXBvcnQgTGF5ZXIgZnJvbSBcIi4vbGF5ZXJcIjtcclxuaW1wb3J0IENhbnZhc0xheWVyIGZyb20gJy4vTC5DYW52YXNMYXllcic7XHJcbmltcG9ydCBWZWxvY2l0eUNvbnRyb2wgZnJvbSAnLi9MLkNvbnRyb2xWZWxvY2l0eSdcclxuZGVjbGFyZSB2YXIgTDogYW55O1xyXG5cclxuY29uc3QgTF9DYW52YXNMYXllciA9IChMLkxheWVyID8gTC5MYXllciA6IEwuQ2xhc3MpLmV4dGVuZChuZXcgQ2FudmFzTGF5ZXIoKSk7XHJcbmNvbnN0IExfY2FudmFzTGF5ZXIgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gbmV3IExfQ2FudmFzTGF5ZXIoKTtcclxufTtcclxuXHJcbmNvbnN0IExfQ29udHJvbFZlbG9jaXR5ID0gKEwuQ29udHJvbCkuZXh0ZW5kKG5ldyBWZWxvY2l0eUNvbnRyb2wpO1xyXG5jb25zdCBMX2NvbnRyb2xWZWxvY2l0eSA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiBuZXcgTF9Db250cm9sVmVsb2NpdHkoKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlbG9jaXR5TGF5ZXIge1xyXG5cclxuICBwcml2YXRlIG9wdGlvbnM6IGFueTtcclxuICBwcml2YXRlIF9tYXA6IGFueSA9IG51bGw7XHJcbiAgcHJpdmF0ZSBfY2FudmFzTGF5ZXI6IGFueSA9IG51bGw7XHJcbiAgcHJpdmF0ZSBfd2luZHk6IFdpbmR5ID0gbnVsbDtcclxuICBwcml2YXRlIF9jb250ZXh0OiBhbnkgPSBudWxsO1xyXG4gIHByaXZhdGUgX2Rpc3BsYXlUaW1lb3V0OiBudW1iZXIgPSAwO1xyXG4gIHByaXZhdGUgX21vdXNlQ29udHJvbDogYW55ICA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICBkaXNwbGF5VmFsdWVzOiB0cnVlLFxyXG4gICAgICBkaXNwbGF5T3B0aW9uczoge1xyXG4gICAgICAgIHZlbG9jaXR5VHlwZTogJ1ZlbG9jaXR5JyxcclxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbWxlZnQnLFxyXG4gICAgICAgIGVtcHR5U3RyaW5nOiAnTm8gdmVsb2NpdHkgZGF0YScsXHJcblx0XHRcdFx0YW5nbGVDb252ZW50aW9uOiAnYmVhcmluZ0NDVycsXHJcblx0XHRcdFx0c3BlZWRVbml0OiAnbS9zJ1xyXG4gICAgICB9LFxyXG4gICAgICBtYXhWZWxvY2l0eTogMTAsIC8vIHVzZWQgdG8gYWxpZ24gY29sb3Igc2NhbGVcclxuICAgICAgY29sb3JTY2FsZTogbnVsbCxcclxuICAgICAgZGF0YTogbnVsbFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUob3B0aW9uczogYW55KSB7XHJcbiAgICBMLlV0aWwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIG9uQWRkKG1hcDogYW55KSB7XHJcbiAgICAvLyBjcmVhdGUgY2FudmFzLCBhZGQgb3ZlcmxheSBjb250cm9sXHJcbiAgICB0aGlzLl9jYW52YXNMYXllciA9IExfY2FudmFzTGF5ZXIoKS5kZWxlZ2F0ZSh0aGlzKTtcclxuICAgIHRoaXMuX2NhbnZhc0xheWVyLmFkZFRvKG1hcCk7XHJcblxyXG4gICAgdGhpcy5fbWFwID0gbWFwO1xyXG4gIH1cclxuXHJcbiAgb25SZW1vdmUobWFwOiBhbnkpIHtcclxuICAgIHRoaXMuX2Rlc3Ryb3lXaW5kKCk7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhKGRhdGE6IGFueSkge1xyXG4gICAgdGhpcy5vcHRpb25zLmRhdGEgPSBkYXRhO1xyXG5cclxuICAgIGlmICh0aGlzLl93aW5keSkge1xyXG4gICAgICB0aGlzLl93aW5keS5zZXREYXRhKGRhdGEpO1xyXG4gICAgICB0aGlzLl9jbGVhckFuZFJlc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAoPGFueT50aGlzKS5maXJlKCdsb2FkJyk7XHJcbiAgfVxyXG5cclxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQUklWQVRFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG4gIG9uRHJhd0xheWVyKG92ZXJsYXk6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAoIXRoaXMuX3dpbmR5KSB7XHJcbiAgICAgIHRoaXMuX2luaXRXaW5keSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZGF0YSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX2Rpc3BsYXlUaW1lb3V0KSBjbGVhclRpbWVvdXQoc2VsZi5fZGlzcGxheVRpbWVvdXQpO1xyXG5cclxuICAgIHRoaXMuX2Rpc3BsYXlUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgc2VsZi5fc3RhcnRXaW5keSgpO1xyXG4gICAgfSwgMTUwKTsgLy8gc2hvd2luZyB2ZWxvY2l0eSBpcyBkZWxheWVkXHJcbiAgfVxyXG5cclxuICBfc3RhcnRXaW5keSgpIHtcclxuICAgIHZhciBib3VuZHMgPSB0aGlzLl9tYXAuZ2V0Qm91bmRzKCk7XHJcbiAgICB2YXIgc2l6ZSA9IHRoaXMuX21hcC5nZXRTaXplKCk7XHJcblxyXG4gICAgLy8gYm91bmRzLCB3aWR0aCwgaGVpZ2h0LCBleHRlbnRcclxuICAgIHRoaXMuX3dpbmR5LnN0YXJ0KFxyXG4gICAgICBuZXcgTGF5ZXIoXHJcbiAgICAgICAgbmV3IE1hcEJvdW5kKFxyXG4gICAgICAgICAgYm91bmRzLl9ub3J0aEVhc3QubGF0LFxyXG4gICAgICAgICAgYm91bmRzLl9ub3J0aEVhc3QubG5nLFxyXG4gICAgICAgICAgYm91bmRzLl9zb3V0aFdlc3QubGF0LFxyXG4gICAgICAgICAgYm91bmRzLl9zb3V0aFdlc3QubG5nXHJcbiAgICAgICAgKSxcclxuICAgICAgICBuZXcgQ2FudmFzQm91bmQoMCwgMCwgc2l6ZS54LCBzaXplLnkpXHJcbiAgICAgIClcclxuXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgX2luaXRXaW5keSgpIHtcclxuXHJcbiAgICAvLyB3aW5keSBvYmplY3QsIGNvcHkgb3B0aW9uc1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9ICg8YW55Pk9iamVjdCkuYXNzaWduKHsgY2FudmFzOiB0aGlzLl9jYW52YXNMYXllci5fY2FudmFzIH0sIHRoaXMub3B0aW9ucyk7XHJcbiAgICB0aGlzLl93aW5keSA9IG5ldyBXaW5keShvcHRpb25zKTtcclxuXHJcbiAgICAvLyBwcmVwYXJlIGNvbnRleHQgZ2xvYmFsIHZhciwgc3RhcnQgZHJhd2luZ1xyXG4gICAgdGhpcy5fY29udGV4dCA9IHRoaXMuX2NhbnZhc0xheWVyLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuX2NhbnZhc0xheWVyLl9jYW52YXMuY2xhc3NMaXN0LmFkZChcInZlbG9jaXR5LW92ZXJsYXlcIik7XHJcbiAgICAoPGFueT50aGlzKS5vbkRyYXdMYXllcigpO1xyXG5cclxuICAgIC8vVE9ETyA6IEZpZ3VyZSBvdXQgd2h5IHRoZSBldmVudCBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGxheWVyIGlzIHJlbW92ZWRcclxuICAgIHRoaXMuX21hcC5vbignZHJhZ3N0YXJ0JywgKCkgPT4ge1xyXG4gICAgICBpZih0aGlzLl93aW5keSlcclxuICAgICAgICB0aGlzLl93aW5keS5zdG9wKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9tYXAub24oJ2RyYWdlbmQnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuX2NsZWFyQW5kUmVzdGFydCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fbWFwLm9uKCd6b29tc3RhcnQnLCAoKSA9PiB7XHJcbiAgICAgIGlmKHRoaXMuX3dpbmR5KVxyXG4gICAgICAgIHRoaXMuX3dpbmR5LnN0b3AoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX21hcC5vbignem9vbWVuZCcsICgpID0+IHtcclxuICAgICAgdGhpcy5fY2xlYXJBbmRSZXN0YXJ0KCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuX21hcC5vbigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLl9jbGVhcldpbmQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX2luaXRNb3VzZUhhbmRsZXIoKTtcclxuICB9XHJcblxyXG4gIF9pbml0TW91c2VIYW5kbGVyKCkge1xyXG4gICAgaWYgKCF0aGlzLl9tb3VzZUNvbnRyb2wgJiYgdGhpcy5vcHRpb25zLmRpc3BsYXlWYWx1ZXMpIHtcclxuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuZGlzcGxheU9wdGlvbnMgfHwge307XHJcbiAgICAgIG9wdGlvbnNbJ2xlYWZsZXRWZWxvY2l0eSddID0gdGhpcztcclxuICAgICAgdGhpcy5fbW91c2VDb250cm9sID0gTF9jb250cm9sVmVsb2NpdHkoKTtcclxuICAgICAgdGhpcy5fbW91c2VDb250cm9sLnNldFdpbmR5KHRoaXMuX3dpbmR5KTtcclxuICAgICAgdGhpcy5fbW91c2VDb250cm9sLnNldE9wdGlvbnModGhpcy5vcHRpb25zLmRpc3BsYXlPcHRpb25zKTtcclxuICAgICAgdGhpcy5fbW91c2VDb250cm9sLmFkZFRvKHRoaXMuX21hcCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfY2xlYXJBbmRSZXN0YXJ0KCkge1xyXG4gICAgaWYgKHRoaXMuX2NvbnRleHQpIHRoaXMuX2NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIDMwMDAsIDMwMDApO1xyXG4gICAgaWYgKHRoaXMuX3dpbmR5KSB0aGlzLl9zdGFydFdpbmR5KCk7XHJcbiAgfVxyXG5cclxuICBfY2xlYXJXaW5kKCkge1xyXG4gICAgaWYgKHRoaXMuX3dpbmR5KSB0aGlzLl93aW5keS5zdG9wKCk7XHJcbiAgICBpZiAodGhpcy5fY29udGV4dCkgdGhpcy5fY29udGV4dC5jbGVhclJlY3QoMCwgMCwgMzAwMCwgMzAwMCk7XHJcbiAgfVxyXG5cclxuICBfZGVzdHJveVdpbmQoKSB7XHJcbiAgICBpZiAodGhpcy5fZGlzcGxheVRpbWVvdXQpXHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9kaXNwbGF5VGltZW91dCk7XHJcbiAgICBpZiAodGhpcy5fd2luZHkpXHJcbiAgICAgIHRoaXMuX3dpbmR5LnN0b3AoKTtcclxuICAgIGlmICh0aGlzLl9jb250ZXh0KVxyXG4gICAgICB0aGlzLl9jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCAzMDAwLCAzMDAwKTtcclxuICAgIGlmICh0aGlzLl9tb3VzZUNvbnRyb2wpXHJcbiAgICAgIHRoaXMuX21hcC5yZW1vdmVDb250cm9sKHRoaXMuX21vdXNlQ29udHJvbCk7XHJcbiAgICB0aGlzLl9tb3VzZUNvbnRyb2wgPSBudWxsO1xyXG4gICAgdGhpcy5fd2luZHkgPSBudWxsO1xyXG4gICAgdGhpcy5fbWFwLnJlbW92ZUxheWVyKHRoaXMuX2NhbnZhc0xheWVyKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0wuVmVsb2NpdHlMYXllci50cyIsImltcG9ydCBNYXBCb3VuZCBmcm9tIFwiLi9tYXBCb3VuZFwiO1xuaW1wb3J0IENhbnZhc0JvdW5kIGZyb20gXCIuL2NhbnZhc0JvdW5kXCI7XG5pbXBvcnQgVmVjdG9yIGZyb20gXCIuL3ZlY3RvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBsYXllciB7XG5cbiAgICBwdWJsaWMgbWFwQm91bmQ6IE1hcEJvdW5kO1xuICAgIHB1YmxpYyBjYW52YXNCb3VuZDogQ2FudmFzQm91bmQ7XG5cbiAgICBjb25zdHJ1Y3RvcihtYXBCb3VuZDogTWFwQm91bmQsIGNhbnZhc0JvdW5kOiBDYW52YXNCb3VuZCkge1xuICAgICAgICB0aGlzLmNhbnZhc0JvdW5kID0gY2FudmFzQm91bmQ7XG4gICAgICAgIHRoaXMubWFwQm91bmQgPSBtYXBCb3VuZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGdlb2Nvb3JkaW5hdGUgZnJvbSBjYW52YXMgcG9pbnRcbiAgICAgKiBAcGFyYW0geCBcbiAgICAgKiBAcGFyYW0geSBcbiAgICAgKiByZXR1cm4gW2xuZywgbGF0XVxuICAgICAqL1xuICAgIGNhbnZhc1RvTWFwICh4OiBudW1iZXIsIHk6IG51bWJlcik6IG51bWJlcltdIHtcbiAgICAgICAgY29uc3QgbWFwTG9uRGVsdGEgPSB0aGlzLm1hcEJvdW5kLmVhc3QgLSB0aGlzLm1hcEJvdW5kLndlc3Q7XG4gICAgICAgIGNvbnN0IHdvcmxkTWFwUmFkaXVzID0gKHRoaXMuY2FudmFzQm91bmQud2lkdGggLyB0aGlzLnJhZDJkZWcobWFwTG9uRGVsdGEpKSAqIDM2MC8oMiAqIE1hdGguUEkpO1xuICAgICAgICBjb25zdCBtYXBPZmZzZXRZID0gKCB3b3JsZE1hcFJhZGl1cyAvIDIgKiBNYXRoLmxvZyggKDEgKyBNYXRoLnNpbih0aGlzLm1hcEJvdW5kLnNvdXRoKSApIC8gKDEgLSBNYXRoLnNpbih0aGlzLm1hcEJvdW5kLnNvdXRoKSkgICkpO1xuICAgICAgICBjb25zdCBlcXVhdG9yWSA9IHRoaXMuY2FudmFzQm91bmQuaGVpZ2h0ICsgbWFwT2Zmc2V0WTtcbiAgICAgICAgY29uc3QgYSA9IChlcXVhdG9yWS15KS93b3JsZE1hcFJhZGl1cztcblxuICAgICAgICBjb25zdCDPhiA9IDE4MC9NYXRoLlBJICogKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoYSkpIC0gTWF0aC5QSS8yKTtcbiAgICAgICAgY29uc3QgzrsgPSB0aGlzLnJhZDJkZWcodGhpcy5tYXBCb3VuZC53ZXN0KSArIHggLyB0aGlzLmNhbnZhc0JvdW5kLndpZHRoICogdGhpcy5yYWQyZGVnKG1hcExvbkRlbHRhKTtcbiAgICAgICAgcmV0dXJuIFvOuywgz4ZdO1xuICAgIH07XG4gICAgICAgIFxuICAgIG1lcmNZICjPhjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubG9nKCBNYXRoLnRhbiggz4YgLyAyICsgTWF0aC5QSSAvIDQgKSApO1xuICAgIH07XG4gICAgICAgIFxuICAgIC8qKlxuICAgICAqIFByb2plY3QgYSBwb2ludCBvbiB0aGUgbWFwXG4gICAgICogQHBhcmFtIM67IExvbmdpdHVkZVxuICAgICAqIEBwYXJhbSDPhiBMYXRpdHVkZVxuICAgICAqIEByZXR1cm4gW3gsIHldXG4gICAgICovXG4gICAgbWFwVG9DYW52YXMgKM67OiBudW1iZXIsIM+GOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgICAgIGNvbnN0IHltaW4gPSB0aGlzLm1lcmNZKHRoaXMubWFwQm91bmQuc291dGgpO1xuICAgICAgICBjb25zdCB5bWF4ID0gdGhpcy5tZXJjWSh0aGlzLm1hcEJvdW5kLm5vcnRoKTtcbiAgICAgICAgY29uc3QgeEZhY3RvciA9IHRoaXMuY2FudmFzQm91bmQud2lkdGggLyAoIHRoaXMubWFwQm91bmQuZWFzdCAtIHRoaXMubWFwQm91bmQud2VzdCApO1xuICAgICAgICBjb25zdCB5RmFjdG9yID0gdGhpcy5jYW52YXNCb3VuZC5oZWlnaHQgLyAoIHltYXggLSB5bWluICk7XG5cbiAgICAgICAgbGV0IHkgPSB0aGlzLm1lcmNZKHRoaXMuZGVnMnJhZCjPhikgKTtcbiAgICAgICAgY29uc3QgeCA9ICh0aGlzLmRlZzJyYWQozrspIC0gdGhpcy5tYXBCb3VuZC53ZXN0KSAqIHhGYWN0b3I7XG4gICAgICAgIHkgPSAoeW1heCAtIHkpICogeUZhY3RvcjtcbiAgICAgICAgcmV0dXJuIFt4LCB5XTtcbiAgICB9O1xuXG5cbiAgICBkZWcycmFkIChkZWc6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xuICAgIH07XG5cbiAgICByYWQyZGVnIChyYWQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gzrsgTG9uZ2l0dWRlXG4gICAgICogQHBhcmFtIM+GIExhdGl0dWRlXG4gICAgICogQHBhcmFtIHggXG4gICAgICogQHBhcmFtIHkgXG4gICAgICogQHJldHVybiBbXVxuICAgICAqL1xuICAgIGRpc3RvcnRpb24gKM67OiBudW1iZXIsIM+GOiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCDPhCA9IDIgKiBNYXRoLlBJO1xuICAgICAgICBjb25zdCBIID0gTWF0aC5wb3coMTAsIC01LjIpO1xuICAgICAgICBjb25zdCBozrsgPSDOuyA8IDAgPyBIIDogLUg7XG4gICAgICAgIGNvbnN0IGjPhiA9IM+GIDwgMCA/IEggOiAtSDtcblxuICAgICAgICBjb25zdCBwzrsgPSB0aGlzLm1hcFRvQ2FudmFzKM67ICsgaM67LCDPhik7XG4gICAgICAgIGNvbnN0IHDPhiA9IHRoaXMubWFwVG9DYW52YXMozrssIM+GICsgaM+GKTtcblxuICAgICAgICAvLyBNZXJpZGlhbiBzY2FsZSBmYWN0b3IgKHNlZSBTbnlkZXIsIGVxdWF0aW9uIDQtMyksIHdoZXJlIFIgPSAxLiBUaGlzIGhhbmRsZXMgaXNzdWUgd2hlcmUgbGVuZ3RoIG9mIDHCuiDOu1xuICAgICAgICAvLyBjaGFuZ2VzIGRlcGVuZGluZyBvbiDPhi4gV2l0aG91dCB0aGlzLCB0aGVyZSBpcyBhIHBpbmNoaW5nIGVmZmVjdCBhdCB0aGUgcG9sZXMuXG4gICAgICAgIGNvbnN0IGsgPSBNYXRoLmNvcyjPhiAvIDM2MCAqIM+EKTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIChwzrtbMF0gLSB4KSAvIGjOuyAvIGssXG4gICAgICAgICAgICAocM67WzFdIC0geSkgLyBozrsgLyBrLFxuICAgICAgICAgICAgKHDPhlswXSAtIHgpIC8gaM+GLFxuICAgICAgICAgICAgKHDPhlsxXSAtIHkpIC8gaM+GXG4gICAgICAgIF07XG4gICAgfVxuICAgICAgXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlIGRpc3RvcnRpb24gb2YgdGhlIHdpbmQgdmVjdG9yIGNhdXNlZCBieSB0aGUgc2hhcGUgb2YgdGhlIHByb2plY3Rpb24gYXQgcG9pbnQgKHgsIHkpLiBUaGUgd2luZFxuICAgICAqIHZlY3RvciBpcyBtb2RpZmllZCBpbiBwbGFjZSBhbmQgcmV0dXJuZWQgYnkgdGhpcyBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0gzrsgXG4gICAgICogQHBhcmFtIM+GIFxuICAgICAqIEBwYXJhbSB4IFxuICAgICAqIEBwYXJhbSB5IFxuICAgICAqIEBwYXJhbSBzY2FsZSBzY2FsZSBmYWN0b3JcbiAgICAgKiBAcGFyYW0gd2luZCBbdSwgdl1cbiAgICAgKiBAcmV0dXJuIFtdXG4gICAgICovXG4gICAgZGlzdG9ydCAozrs6IG51bWJlciwgz4Y6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHNjYWxlOiBudW1iZXIsIHdpbmQ6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHUgPSB3aW5kLnUgKiBzY2FsZTtcbiAgICAgICAgY29uc3QgdiA9IHdpbmQudiAqIHNjYWxlO1xuICAgICAgICBjb25zdCBkID0gdGhpcy5kaXN0b3J0aW9uKM67LCDPhiwgeCwgeSk7XG5cbiAgICAgICAgLy8gU2NhbGUgZGlzdG9ydGlvbiB2ZWN0b3JzIGJ5IHUgYW5kIHYsIHRoZW4gYWRkLlxuICAgICAgICB3aW5kLnUgPSBkWzBdICogdSArIGRbMl0gKiB2O1xuICAgICAgICB3aW5kLnYgPSBkWzFdICogdSArIGRbM10gKiB2O1xuICAgICAgICByZXR1cm4gd2luZDtcbiAgICB9XG4gIFxuXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xheWVyLnRzIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy90eXBpbmdzLWZvci1jc3MtbW9kdWxlcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMSEuL2xlYWZsZXQtdmVsb2NpdHkuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvdHlwaW5ncy1mb3ItY3NzLW1vZHVsZXMtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTEhLi9sZWFmbGV0LXZlbG9jaXR5LmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL3R5cGluZ3MtZm9yLWNzcy1tb2R1bGVzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0xIS4vbGVhZmxldC12ZWxvY2l0eS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2xlYWZsZXQtdmVsb2NpdHkuY3NzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5fMklPVWV5WXJROTV0QkkzdjgyWmpXayB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNyk7XFxuICBwYWRkaW5nOiAwIDVweDtcXG4gIG1hcmdpbjogMCAhaW1wb3J0YW50O1xcbiAgY29sb3I6ICMzMzM7XFxuICBmb250OiAxMXB4LzEuNSBcXFwiSGVsdmV0aWNhIE5ldWVcXFwiLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5leHBvcnRzLmxvY2FscyA9IHtcblx0XCJsZWFmbGV0Q29udHJvbFZlbG9jaXR5XCI6IFwiXzJJT1VleVlyUTk1dEJJM3Y4MlpqV2tcIlxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90eXBpbmdzLWZvci1jc3MtbW9kdWxlcy1sb2FkZXIvbGliP3tcIm1vZHVsZXNcIjp0cnVlLFwibmFtZWRFeHBvcnRcIjp0cnVlfSEuL3NyYy9sZWFmbGV0LXZlbG9jaXR5LmNzc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBzdHlsZVRhcmdldCA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0Ly8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblx0XHRcdGlmIChzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG5cdFx0XHRcdFx0Ly8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRzdHlsZVRhcmdldCA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSBcImJvb2xlYW5cIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKSB7XG5cdFx0dmFyIG5leHRTaWJsaW5nID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8gKyBcIiBcIiArIG9wdGlvbnMuaW5zZXJ0QXQuYmVmb3JlKTtcblx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBuZXh0U2libGluZyk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiW1N0eWxlIExvYWRlcl1cXG5cXG4gSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcgKCdvcHRpb25zLmluc2VydEF0JykgZm91bmQuXFxuIE11c3QgYmUgJ3RvcCcsICdib3R0b20nLCBvciBPYmplY3QuXFxuIChodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlciNpbnNlcnRhdClcXG5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==