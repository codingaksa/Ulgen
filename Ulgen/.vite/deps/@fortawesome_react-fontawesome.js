import { __commonJS, __toESM } from "./chunk-DbKvDyjX.js";
import { require_react } from "./react-Dzmm40ca.js";

//#region node_modules/@fortawesome/fontawesome-svg-core/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/*!
* Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com
* License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
* Copyright 2025 Fonticons, Inc.
*/
function _arrayLikeToArray(r, a$1) {
	(null == a$1 || a$1 > r.length) && (a$1 = r.length);
	for (var e$1 = 0, n$1 = Array(a$1); e$1 < a$1; e$1++) n$1[e$1] = r[e$1];
	return n$1;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _classCallCheck(a$1, n$1) {
	if (!(a$1 instanceof n$1)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e$1, r) {
	for (var t$1 = 0; t$1 < r.length; t$1++) {
		var o$1 = r[t$1];
		o$1.enumerable = o$1.enumerable || !1, o$1.configurable = !0, "value" in o$1 && (o$1.writable = !0), Object.defineProperty(e$1, _toPropertyKey(o$1.key), o$1);
	}
}
function _createClass(e$1, r, t$1) {
	return r && _defineProperties(e$1.prototype, r), t$1 && _defineProperties(e$1, t$1), Object.defineProperty(e$1, "prototype", { writable: !1 }), e$1;
}
function _createForOfIteratorHelper(r, e$1) {
	var t$1 = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (!t$1) {
		if (Array.isArray(r) || (t$1 = _unsupportedIterableToArray(r)) || e$1 && r && "number" == typeof r.length) {
			t$1 && (r = t$1);
			var n$1 = 0, F$1 = function() {};
			return {
				s: F$1,
				n: function() {
					return n$1 >= r.length ? { done: !0 } : {
						done: !1,
						value: r[n$1++]
					};
				},
				e: function(r$1) {
					throw r$1;
				},
				f: F$1
			};
		}
		throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	var o$1, a$1 = !0, u$1 = !1;
	return {
		s: function() {
			t$1 = t$1.call(r);
		},
		n: function() {
			var r$1 = t$1.next();
			return a$1 = r$1.done, r$1;
		},
		e: function(r$1) {
			u$1 = !0, o$1 = r$1;
		},
		f: function() {
			try {
				a$1 || null == t$1.return || t$1.return();
			} finally {
				if (u$1) throw o$1;
			}
		}
	};
}
function _defineProperty(e$1, r, t$1) {
	return (r = _toPropertyKey(r)) in e$1 ? Object.defineProperty(e$1, r, {
		value: t$1,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e$1[r] = t$1, e$1;
}
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l$2) {
	var t$1 = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t$1) {
		var e$1, n$1, i$1, u$1, a$1 = [], f$2 = !0, o$1 = !1;
		try {
			if (i$1 = (t$1 = t$1.call(r)).next, 0 === l$2) {
				if (Object(t$1) !== t$1) return;
				f$2 = !1;
			} else for (; !(f$2 = (e$1 = i$1.call(t$1)).done) && (a$1.push(e$1.value), a$1.length !== l$2); f$2 = !0);
		} catch (r$1) {
			o$1 = !0, n$1 = r$1;
		} finally {
			try {
				if (!f$2 && null != t$1.return && (u$1 = t$1.return(), Object(u$1) !== u$1)) return;
			} finally {
				if (o$1) throw n$1;
			}
		}
		return a$1;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e$1, r) {
	var t$1 = Object.keys(e$1);
	if (Object.getOwnPropertySymbols) {
		var o$1 = Object.getOwnPropertySymbols(e$1);
		r && (o$1 = o$1.filter(function(r$1) {
			return Object.getOwnPropertyDescriptor(e$1, r$1).enumerable;
		})), t$1.push.apply(t$1, o$1);
	}
	return t$1;
}
function _objectSpread2(e$1) {
	for (var r = 1; r < arguments.length; r++) {
		var t$1 = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t$1), !0).forEach(function(r$1) {
			_defineProperty(e$1, r$1, t$1[r$1]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e$1, Object.getOwnPropertyDescriptors(t$1)) : ownKeys(Object(t$1)).forEach(function(r$1) {
			Object.defineProperty(e$1, r$1, Object.getOwnPropertyDescriptor(t$1, r$1));
		});
	}
	return e$1;
}
function _slicedToArray(r, e$1) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e$1) || _unsupportedIterableToArray(r, e$1) || _nonIterableRest();
}
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t$1, r) {
	if ("object" != typeof t$1 || !t$1) return t$1;
	var e$1 = t$1[Symbol.toPrimitive];
	if (void 0 !== e$1) {
		var i$1 = e$1.call(t$1, r || "default");
		if ("object" != typeof i$1) return i$1;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t$1);
}
function _toPropertyKey(t$1) {
	var i$1 = _toPrimitive(t$1, "string");
	return "symbol" == typeof i$1 ? i$1 : i$1 + "";
}
function _typeof(o$1) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$2) {
		return typeof o$2;
	} : function(o$2) {
		return o$2 && "function" == typeof Symbol && o$2.constructor === Symbol && o$2 !== Symbol.prototype ? "symbol" : typeof o$2;
	}, _typeof(o$1);
}
function _unsupportedIterableToArray(r, a$1) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a$1);
		var t$1 = {}.toString.call(r).slice(8, -1);
		return "Object" === t$1 && r.constructor && (t$1 = r.constructor.name), "Map" === t$1 || "Set" === t$1 ? Array.from(r) : "Arguments" === t$1 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t$1) ? _arrayLikeToArray(r, a$1) : void 0;
	}
}
var noop = function noop$3() {};
var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
	mark: noop,
	measure: noop
};
try {
	if (typeof window !== "undefined") _WINDOW = window;
	if (typeof document !== "undefined") _DOCUMENT = document;
	if (typeof MutationObserver !== "undefined") _MUTATION_OBSERVER = MutationObserver;
	if (typeof performance !== "undefined") _PERFORMANCE = performance;
} catch (e$1) {}
var _ref$userAgent = (_WINDOW.navigator || {}).userAgent, userAgent = _ref$userAgent === void 0 ? "" : _ref$userAgent;
var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var MUTATION_OBSERVER = _MUTATION_OBSERVER;
var PERFORMANCE = _PERFORMANCE;
WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === "function" && typeof DOCUMENT.createElement === "function";
var IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
var _dt;
var E = /fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/, _ = /Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i;
var q = {
	classic: {
		fa: "solid",
		fas: "solid",
		"fa-solid": "solid",
		far: "regular",
		"fa-regular": "regular",
		fal: "light",
		"fa-light": "light",
		fat: "thin",
		"fa-thin": "thin",
		fab: "brands",
		"fa-brands": "brands"
	},
	duotone: {
		fa: "solid",
		fad: "solid",
		"fa-solid": "solid",
		"fa-duotone": "solid",
		fadr: "regular",
		"fa-regular": "regular",
		fadl: "light",
		"fa-light": "light",
		fadt: "thin",
		"fa-thin": "thin"
	},
	sharp: {
		fa: "solid",
		fass: "solid",
		"fa-solid": "solid",
		fasr: "regular",
		"fa-regular": "regular",
		fasl: "light",
		"fa-light": "light",
		fast: "thin",
		"fa-thin": "thin"
	},
	"sharp-duotone": {
		fa: "solid",
		fasds: "solid",
		"fa-solid": "solid",
		fasdr: "regular",
		"fa-regular": "regular",
		fasdl: "light",
		"fa-light": "light",
		fasdt: "thin",
		"fa-thin": "thin"
	},
	slab: {
		"fa-regular": "regular",
		faslr: "regular"
	},
	"slab-press": {
		"fa-regular": "regular",
		faslpr: "regular"
	},
	thumbprint: {
		"fa-light": "light",
		fatl: "light"
	},
	whiteboard: {
		"fa-semibold": "semibold",
		fawsb: "semibold"
	},
	notdog: {
		"fa-solid": "solid",
		fans: "solid"
	},
	"notdog-duo": {
		"fa-solid": "solid",
		fands: "solid"
	},
	etch: {
		"fa-solid": "solid",
		faes: "solid"
	},
	jelly: {
		"fa-regular": "regular",
		fajr: "regular"
	},
	"jelly-fill": {
		"fa-regular": "regular",
		fajfr: "regular"
	},
	"jelly-duo": {
		"fa-regular": "regular",
		fajdr: "regular"
	},
	chisel: {
		"fa-regular": "regular",
		facr: "regular"
	},
	utility: {
		"fa-semibold": "semibold",
		fausb: "semibold"
	},
	"utility-duo": {
		"fa-semibold": "semibold",
		faudsb: "semibold"
	},
	"utility-fill": {
		"fa-semibold": "semibold",
		faufsb: "semibold"
	}
}, H = {
	GROUP: "duotone-group",
	SWAP_OPACITY: "swap-opacity",
	PRIMARY: "primary",
	SECONDARY: "secondary"
}, Q = [
	"fa-classic",
	"fa-duotone",
	"fa-sharp",
	"fa-sharp-duotone",
	"fa-thumbprint",
	"fa-whiteboard",
	"fa-notdog",
	"fa-notdog-duo",
	"fa-chisel",
	"fa-etch",
	"fa-jelly",
	"fa-jelly-fill",
	"fa-jelly-duo",
	"fa-slab",
	"fa-slab-press",
	"fa-utility",
	"fa-utility-duo",
	"fa-utility-fill"
], i = "classic", t = "duotone", d = "sharp", l = "sharp-duotone", f = "chisel", n = "etch", h = "jelly", o = "jelly-duo", u = "jelly-fill", g = "notdog", s = "notdog-duo", y = "slab", m = "slab-press", e = "thumbprint", p = "utility", a = "utility-duo", w = "utility-fill", x = "whiteboard", b = "Classic", c = "Duotone", I = "Sharp", F = "Sharp Duotone", v = "Chisel", S = "Etch", A = "Jelly", P = "Jelly Duo", j = "Jelly Fill", B = "Notdog", N = "Notdog Duo", k = "Slab", D = "Slab Press", T = "Thumbprint", C = "Utility", W = "Utility Duo", K = "Utility Fill", R = "Whiteboard", rt = [
	i,
	t,
	d,
	l,
	f,
	n,
	h,
	o,
	u,
	g,
	s,
	y,
	m,
	e,
	p,
	a,
	w,
	x
];
_dt = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_dt, i, b), t, c), d, I), l, F), f, v), n, S), h, A), o, P), u, j), g, B), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_dt, s, N), y, k), m, D), e, T), p, C), a, W), w, K), x, R);
var gt = {
	classic: {
		900: "fas",
		400: "far",
		normal: "far",
		300: "fal",
		100: "fat"
	},
	duotone: {
		900: "fad",
		400: "fadr",
		300: "fadl",
		100: "fadt"
	},
	sharp: {
		900: "fass",
		400: "fasr",
		300: "fasl",
		100: "fast"
	},
	"sharp-duotone": {
		900: "fasds",
		400: "fasdr",
		300: "fasdl",
		100: "fasdt"
	},
	slab: { 400: "faslr" },
	"slab-press": { 400: "faslpr" },
	whiteboard: { 600: "fawsb" },
	thumbprint: { 300: "fatl" },
	notdog: { 900: "fans" },
	"notdog-duo": { 900: "fands" },
	etch: { 900: "faes" },
	chisel: { 400: "facr" },
	jelly: { 400: "fajr" },
	"jelly-fill": { 400: "fajfr" },
	"jelly-duo": { 400: "fajdr" },
	utility: { 600: "fausb" },
	"utility-duo": { 600: "faudsb" },
	"utility-fill": { 600: "faufsb" }
};
var Ct = {
	"Font Awesome 7 Free": {
		900: "fas",
		400: "far"
	},
	"Font Awesome 7 Pro": {
		900: "fas",
		400: "far",
		normal: "far",
		300: "fal",
		100: "fat"
	},
	"Font Awesome 7 Brands": {
		400: "fab",
		normal: "fab"
	},
	"Font Awesome 7 Duotone": {
		900: "fad",
		400: "fadr",
		normal: "fadr",
		300: "fadl",
		100: "fadt"
	},
	"Font Awesome 7 Sharp": {
		900: "fass",
		400: "fasr",
		normal: "fasr",
		300: "fasl",
		100: "fast"
	},
	"Font Awesome 7 Sharp Duotone": {
		900: "fasds",
		400: "fasdr",
		normal: "fasdr",
		300: "fasdl",
		100: "fasdt"
	},
	"Font Awesome 7 Jelly": {
		400: "fajr",
		normal: "fajr"
	},
	"Font Awesome 7 Jelly Fill": {
		400: "fajfr",
		normal: "fajfr"
	},
	"Font Awesome 7 Jelly Duo": {
		400: "fajdr",
		normal: "fajdr"
	},
	"Font Awesome 7 Slab": {
		400: "faslr",
		normal: "faslr"
	},
	"Font Awesome 7 Slab Press": {
		400: "faslpr",
		normal: "faslpr"
	},
	"Font Awesome 7 Thumbprint": {
		300: "fatl",
		normal: "fatl"
	},
	"Font Awesome 7 Notdog": {
		900: "fans",
		normal: "fans"
	},
	"Font Awesome 7 Notdog Duo": {
		900: "fands",
		normal: "fands"
	},
	"Font Awesome 7 Etch": {
		900: "faes",
		normal: "faes"
	},
	"Font Awesome 7 Chisel": {
		400: "facr",
		normal: "facr"
	},
	"Font Awesome 7 Whiteboard": {
		600: "fawsb",
		normal: "fawsb"
	},
	"Font Awesome 7 Utility": {
		600: "fausb",
		normal: "fausb"
	},
	"Font Awesome 7 Utility Duo": {
		600: "faudsb",
		normal: "faudsb"
	},
	"Font Awesome 7 Utility Fill": {
		600: "faufsb",
		normal: "faufsb"
	}
};
var Ut = new Map([
	["classic", {
		defaultShortPrefixId: "fas",
		defaultStyleId: "solid",
		styleIds: [
			"solid",
			"regular",
			"light",
			"thin",
			"brands"
		],
		futureStyleIds: [],
		defaultFontWeight: 900
	}],
	["duotone", {
		defaultShortPrefixId: "fad",
		defaultStyleId: "solid",
		styleIds: [
			"solid",
			"regular",
			"light",
			"thin"
		],
		futureStyleIds: [],
		defaultFontWeight: 900
	}],
	["sharp", {
		defaultShortPrefixId: "fass",
		defaultStyleId: "solid",
		styleIds: [
			"solid",
			"regular",
			"light",
			"thin"
		],
		futureStyleIds: [],
		defaultFontWeight: 900
	}],
	["sharp-duotone", {
		defaultShortPrefixId: "fasds",
		defaultStyleId: "solid",
		styleIds: [
			"solid",
			"regular",
			"light",
			"thin"
		],
		futureStyleIds: [],
		defaultFontWeight: 900
	}],
	["chisel", {
		defaultShortPrefixId: "facr",
		defaultStyleId: "regular",
		styleIds: ["regular"],
		futureStyleIds: [],
		defaultFontWeight: 400
	}],
	["etch", {
		defaultShortPrefixId: "faes",
		defaultStyleId: "solid",
		styleIds: ["solid"],
		futureStyleIds: [],
		defaultFontWeight: 900
	}],
	["jelly", {
		defaultShortPrefixId: "fajr",
		defaultStyleId: "regular",
		styleIds: ["regular"],
		futureStyleIds: [],
		defaultFontWeight: 400
	}],
	["jelly-duo", {
		defaultShortPrefixId: "fajdr",
		defaultStyleId: "regular",
		styleIds: ["regular"],
		futureStyleIds: [],
		defaultFontWeight: 400
	}],
	["jelly-fill", {
		defaultShortPrefixId: "fajfr",
		defaultStyleId: "regular",
		styleIds: ["regular"],
		futureStyleIds: [],
		defaultFontWeight: 400
	}],
	["notdog", {
		defaultShortPrefixId: "fans",
		defaultStyleId: "solid",
		styleIds: ["solid"],
		futureStyleIds: [],
		defaultFontWeight: 900
	}],
	["notdog-duo", {
		defaultShortPrefixId: "fands",
		defaultStyleId: "solid",
		styleIds: ["solid"],
		futureStyleIds: [],
		defaultFontWeight: 900
	}],
	["slab", {
		defaultShortPrefixId: "faslr",
		defaultStyleId: "regular",
		styleIds: ["regular"],
		futureStyleIds: [],
		defaultFontWeight: 400
	}],
	["slab-press", {
		defaultShortPrefixId: "faslpr",
		defaultStyleId: "regular",
		styleIds: ["regular"],
		futureStyleIds: [],
		defaultFontWeight: 400
	}],
	["thumbprint", {
		defaultShortPrefixId: "fatl",
		defaultStyleId: "light",
		styleIds: ["light"],
		futureStyleIds: [],
		defaultFontWeight: 300
	}],
	["utility", {
		defaultShortPrefixId: "fausb",
		defaultStyleId: "semibold",
		styleIds: ["semibold"],
		futureStyleIds: [],
		defaultFontWeight: 600
	}],
	["utility-duo", {
		defaultShortPrefixId: "faudsb",
		defaultStyleId: "semibold",
		styleIds: ["semibold"],
		futureStyleIds: [],
		defaultFontWeight: 600
	}],
	["utility-fill", {
		defaultShortPrefixId: "faufsb",
		defaultStyleId: "semibold",
		styleIds: ["semibold"],
		futureStyleIds: [],
		defaultFontWeight: 600
	}],
	["whiteboard", {
		defaultShortPrefixId: "fawsb",
		defaultStyleId: "semibold",
		styleIds: ["semibold"],
		futureStyleIds: [],
		defaultFontWeight: 600
	}]
]), _t = {
	chisel: { regular: "facr" },
	classic: {
		brands: "fab",
		light: "fal",
		regular: "far",
		solid: "fas",
		thin: "fat"
	},
	duotone: {
		light: "fadl",
		regular: "fadr",
		solid: "fad",
		thin: "fadt"
	},
	etch: { solid: "faes" },
	jelly: { regular: "fajr" },
	"jelly-duo": { regular: "fajdr" },
	"jelly-fill": { regular: "fajfr" },
	notdog: { solid: "fans" },
	"notdog-duo": { solid: "fands" },
	sharp: {
		light: "fasl",
		regular: "fasr",
		solid: "fass",
		thin: "fast"
	},
	"sharp-duotone": {
		light: "fasdl",
		regular: "fasdr",
		solid: "fasds",
		thin: "fasdt"
	},
	slab: { regular: "faslr" },
	"slab-press": { regular: "faslpr" },
	thumbprint: { light: "fatl" },
	utility: { semibold: "fausb" },
	"utility-duo": { semibold: "faudsb" },
	"utility-fill": { semibold: "faufsb" },
	whiteboard: { semibold: "fawsb" }
};
var Yt = [
	"fak",
	"fa-kit",
	"fakd",
	"fa-kit-duotone"
], qt = {
	kit: {
		fak: "kit",
		"fa-kit": "kit"
	},
	"kit-duotone": {
		fakd: "kit-duotone",
		"fa-kit-duotone": "kit-duotone"
	}
}, Ht = ["kit"];
_defineProperty(_defineProperty({}, "kit", "Kit"), "kit-duotone", "Kit Duotone");
var ol = {
	kit: { "fa-kit": "fak" },
	"kit-duotone": { "fa-kit-duotone": "fakd" }
};
var dl = {
	"Font Awesome Kit": {
		400: "fak",
		normal: "fak"
	},
	"Font Awesome Kit Duotone": {
		400: "fakd",
		normal: "fakd"
	}
}, fl = {
	kit: { fak: "fa-kit" },
	"kit-duotone": { fakd: "fa-kit-duotone" }
};
var ul = {
	kit: { kit: "fak" },
	"kit-duotone": { "kit-duotone": "fakd" }
};
var _ml;
var l$1 = {
	GROUP: "duotone-group",
	SWAP_OPACITY: "swap-opacity",
	PRIMARY: "primary",
	SECONDARY: "secondary"
}, f$1 = [
	"fa-classic",
	"fa-duotone",
	"fa-sharp",
	"fa-sharp-duotone",
	"fa-thumbprint",
	"fa-whiteboard",
	"fa-notdog",
	"fa-notdog-duo",
	"fa-chisel",
	"fa-etch",
	"fa-jelly",
	"fa-jelly-fill",
	"fa-jelly-duo",
	"fa-slab",
	"fa-slab-press",
	"fa-utility",
	"fa-utility-duo",
	"fa-utility-fill"
];
_ml = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_ml, "classic", "Classic"), "duotone", "Duotone"), "sharp", "Sharp"), "sharp-duotone", "Sharp Duotone"), "chisel", "Chisel"), "etch", "Etch"), "jelly", "Jelly"), "jelly-duo", "Jelly Duo"), "jelly-fill", "Jelly Fill"), "notdog", "Notdog"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_ml, "notdog-duo", "Notdog Duo"), "slab", "Slab"), "slab-press", "Slab Press"), "thumbprint", "Thumbprint"), "utility", "Utility"), "utility-duo", "Utility Duo"), "utility-fill", "Utility Fill"), "whiteboard", "Whiteboard");
_defineProperty(_defineProperty({}, "kit", "Kit"), "kit-duotone", "Kit Duotone");
var $t$1 = {
	classic: {
		"fa-brands": "fab",
		"fa-duotone": "fad",
		"fa-light": "fal",
		"fa-regular": "far",
		"fa-solid": "fas",
		"fa-thin": "fat"
	},
	duotone: {
		"fa-regular": "fadr",
		"fa-light": "fadl",
		"fa-thin": "fadt"
	},
	sharp: {
		"fa-solid": "fass",
		"fa-regular": "fasr",
		"fa-light": "fasl",
		"fa-thin": "fast"
	},
	"sharp-duotone": {
		"fa-solid": "fasds",
		"fa-regular": "fasdr",
		"fa-light": "fasdl",
		"fa-thin": "fasdt"
	},
	slab: { "fa-regular": "faslr" },
	"slab-press": { "fa-regular": "faslpr" },
	whiteboard: { "fa-semibold": "fawsb" },
	thumbprint: { "fa-light": "fatl" },
	notdog: { "fa-solid": "fans" },
	"notdog-duo": { "fa-solid": "fands" },
	etch: { "fa-solid": "faes" },
	jelly: { "fa-regular": "fajr" },
	"jelly-fill": { "fa-regular": "fajfr" },
	"jelly-duo": { "fa-regular": "fajdr" },
	chisel: { "fa-regular": "facr" },
	utility: { "fa-semibold": "fausb" },
	"utility-duo": { "fa-semibold": "faudsb" },
	"utility-fill": { "fa-semibold": "faufsb" }
}, z = {
	classic: [
		"fas",
		"far",
		"fal",
		"fat",
		"fad"
	],
	duotone: [
		"fadr",
		"fadl",
		"fadt"
	],
	sharp: [
		"fass",
		"fasr",
		"fasl",
		"fast"
	],
	"sharp-duotone": [
		"fasds",
		"fasdr",
		"fasdl",
		"fasdt"
	],
	slab: ["faslr"],
	"slab-press": ["faslpr"],
	whiteboard: ["fawsb"],
	thumbprint: ["fatl"],
	notdog: ["fans"],
	"notdog-duo": ["fands"],
	etch: ["faes"],
	jelly: ["fajr"],
	"jelly-fill": ["fajfr"],
	"jelly-duo": ["fajdr"],
	chisel: ["facr"],
	utility: ["fausb"],
	"utility-duo": ["faudsb"],
	"utility-fill": ["faufsb"]
}, Ht$1 = {
	classic: {
		fab: "fa-brands",
		fad: "fa-duotone",
		fal: "fa-light",
		far: "fa-regular",
		fas: "fa-solid",
		fat: "fa-thin"
	},
	duotone: {
		fadr: "fa-regular",
		fadl: "fa-light",
		fadt: "fa-thin"
	},
	sharp: {
		fass: "fa-solid",
		fasr: "fa-regular",
		fasl: "fa-light",
		fast: "fa-thin"
	},
	"sharp-duotone": {
		fasds: "fa-solid",
		fasdr: "fa-regular",
		fasdl: "fa-light",
		fasdt: "fa-thin"
	},
	slab: { faslr: "fa-regular" },
	"slab-press": { faslpr: "fa-regular" },
	whiteboard: { fawsb: "fa-semibold" },
	thumbprint: { fatl: "fa-light" },
	notdog: { fans: "fa-solid" },
	"notdog-duo": { fands: "fa-solid" },
	etch: { faes: "fa-solid" },
	jelly: { fajr: "fa-regular" },
	"jelly-fill": { fajfr: "fa-regular" },
	"jelly-duo": { fajdr: "fa-regular" },
	chisel: { facr: "fa-regular" },
	utility: { fausb: "fa-semibold" },
	"utility-duo": { faudsb: "fa-semibold" },
	"utility-fill": { faufsb: "fa-semibold" }
}, Zt$1 = [
	"fa",
	"fas",
	"far",
	"fal",
	"fat",
	"fad",
	"fadr",
	"fadl",
	"fadt",
	"fab",
	"fass",
	"fasr",
	"fasl",
	"fast",
	"fasds",
	"fasdr",
	"fasdl",
	"fasdt",
	"faslr",
	"faslpr",
	"fawsb",
	"fatl",
	"fans",
	"fands",
	"faes",
	"fajr",
	"fajfr",
	"fajdr",
	"facr",
	"fausb",
	"faudsb",
	"faufsb"
].concat(f$1, [
	"fa-solid",
	"fa-regular",
	"fa-light",
	"fa-thin",
	"fa-duotone",
	"fa-brands",
	"fa-semibold"
]), G$1 = [
	"solid",
	"regular",
	"light",
	"thin",
	"duotone",
	"brands",
	"semibold"
], O$1 = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10
], V$1 = O$1.concat([
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20
]), to = [].concat(_toConsumableArray(Object.keys(z)), G$1, [
	"aw",
	"fw",
	"pull-left",
	"pull-right"
], [
	"2xs",
	"xs",
	"sm",
	"lg",
	"xl",
	"2xl",
	"beat",
	"border",
	"fade",
	"beat-fade",
	"bounce",
	"flip-both",
	"flip-horizontal",
	"flip-vertical",
	"flip",
	"inverse",
	"layers",
	"layers-bottom-left",
	"layers-bottom-right",
	"layers-counter",
	"layers-text",
	"layers-top-left",
	"layers-top-right",
	"li",
	"pull-end",
	"pull-start",
	"pulse",
	"rotate-180",
	"rotate-270",
	"rotate-90",
	"rotate-by",
	"shake",
	"spin-pulse",
	"spin-reverse",
	"spin",
	"stack-1x",
	"stack-2x",
	"stack",
	"ul",
	"width-auto",
	"width-fixed",
	l$1.GROUP,
	l$1.SWAP_OPACITY,
	l$1.PRIMARY,
	l$1.SECONDARY
]).concat(O$1.map(function(t$1) {
	return "".concat(t$1, "x");
})).concat(V$1.map(function(t$1) {
	return "w-".concat(t$1);
}));
var ro = {
	"Font Awesome 5 Free": {
		900: "fas",
		400: "far"
	},
	"Font Awesome 5 Pro": {
		900: "fas",
		400: "far",
		normal: "far",
		300: "fal"
	},
	"Font Awesome 5 Brands": {
		400: "fab",
		normal: "fab"
	},
	"Font Awesome 5 Duotone": { 900: "fad" }
};
var NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
var UNITS_IN_GRID = 16;
var DEFAULT_CSS_PREFIX = "fa";
var DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
var DATA_FA_I2SVG = "data-fa-i2svg";
var DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
var DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
var DATA_PREFIX = "data-prefix";
var DATA_ICON = "data-icon";
var HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
var MUTATION_APPROACH_ASYNC = "async";
var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = [
	"HTML",
	"HEAD",
	"STYLE",
	"SCRIPT"
];
var PSEUDO_ELEMENTS = [
	"::before",
	"::after",
	":before",
	":after"
];
var PRODUCTION = function() {
	try {
		return false;
	} catch (e$$1) {
		return false;
	}
}();
function familyProxy(obj) {
	return new Proxy(obj, { get: function get(target, prop) {
		return prop in target ? target[prop] : target[i];
	} });
}
var _PREFIX_TO_STYLE = _objectSpread2({}, q);
_PREFIX_TO_STYLE[i] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, { "fa-duotone": "duotone" }), q[i]), qt["kit"]), qt["kit-duotone"]);
var PREFIX_TO_STYLE = familyProxy(_PREFIX_TO_STYLE);
var _STYLE_TO_PREFIX = _objectSpread2({}, _t);
_STYLE_TO_PREFIX[i] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, { duotone: "fad" }), _STYLE_TO_PREFIX[i]), ul["kit"]), ul["kit-duotone"]);
var STYLE_TO_PREFIX = familyProxy(_STYLE_TO_PREFIX);
var _PREFIX_TO_LONG_STYLE = _objectSpread2({}, Ht$1);
_PREFIX_TO_LONG_STYLE[i] = _objectSpread2(_objectSpread2({}, _PREFIX_TO_LONG_STYLE[i]), fl["kit"]);
var PREFIX_TO_LONG_STYLE = familyProxy(_PREFIX_TO_LONG_STYLE);
var _LONG_STYLE_TO_PREFIX = _objectSpread2({}, $t$1);
_LONG_STYLE_TO_PREFIX[i] = _objectSpread2(_objectSpread2({}, _LONG_STYLE_TO_PREFIX[i]), ol["kit"]);
familyProxy(_LONG_STYLE_TO_PREFIX);
var ICON_SELECTION_SYNTAX_PATTERN = E;
var LAYERS_TEXT_CLASSNAME = "fa-layers-text";
var FONT_FAMILY_PATTERN = _;
var _FONT_WEIGHT_TO_PREFIX = _objectSpread2({}, gt);
familyProxy(_FONT_WEIGHT_TO_PREFIX);
var ATTRIBUTES_WATCHED_FOR_MUTATION = [
	"class",
	"data-prefix",
	"data-icon",
	"data-fa-transform",
	"data-fa-mask"
];
var DUOTONE_CLASSES = H;
var RESERVED_CLASSES = [].concat(_toConsumableArray(Ht), _toConsumableArray(to));
var initial = WINDOW.FontAwesomeConfig || {};
function getAttrConfig(attr) {
	var element = DOCUMENT.querySelector("script[" + attr + "]");
	if (element) return element.getAttribute(attr);
}
function coerce(val) {
	if (val === "") return true;
	if (val === "false") return false;
	if (val === "true") return true;
	return val;
}
if (DOCUMENT && typeof DOCUMENT.querySelector === "function") [
	["data-family-prefix", "familyPrefix"],
	["data-css-prefix", "cssPrefix"],
	["data-family-default", "familyDefault"],
	["data-style-default", "styleDefault"],
	["data-replacement-class", "replacementClass"],
	["data-auto-replace-svg", "autoReplaceSvg"],
	["data-auto-add-css", "autoAddCss"],
	["data-search-pseudo-elements", "searchPseudoElements"],
	["data-search-pseudo-elements-warnings", "searchPseudoElementsWarnings"],
	["data-search-pseudo-elements-full-scan", "searchPseudoElementsFullScan"],
	["data-observe-mutations", "observeMutations"],
	["data-mutate-approach", "mutateApproach"],
	["data-keep-original-source", "keepOriginalSource"],
	["data-measure-performance", "measurePerformance"],
	["data-show-missing-icons", "showMissingIcons"]
].forEach(function(_ref) {
	var _ref2 = _slicedToArray(_ref, 2), attr = _ref2[0], key = _ref2[1];
	var val = coerce(getAttrConfig(attr));
	if (val !== void 0 && val !== null) initial[key] = val;
});
var _default = {
	styleDefault: "solid",
	familyDefault: i,
	cssPrefix: DEFAULT_CSS_PREFIX,
	replacementClass: DEFAULT_REPLACEMENT_CLASS,
	autoReplaceSvg: true,
	autoAddCss: true,
	searchPseudoElements: false,
	searchPseudoElementsWarnings: true,
	searchPseudoElementsFullScan: false,
	observeMutations: true,
	mutateApproach: "async",
	keepOriginalSource: true,
	measurePerformance: false,
	showMissingIcons: true
};
if (initial.familyPrefix) initial.cssPrefix = initial.familyPrefix;
var _config = _objectSpread2(_objectSpread2({}, _default), initial);
if (!_config.autoReplaceSvg) _config.observeMutations = false;
var config = {};
Object.keys(_default).forEach(function(key) {
	Object.defineProperty(config, key, {
		enumerable: true,
		set: function set(val) {
			_config[key] = val;
			_onChangeCb.forEach(function(cb) {
				return cb(config);
			});
		},
		get: function get() {
			return _config[key];
		}
	});
});
Object.defineProperty(config, "familyPrefix", {
	enumerable: true,
	set: function set(val) {
		_config.cssPrefix = val;
		_onChangeCb.forEach(function(cb) {
			return cb(config);
		});
	},
	get: function get() {
		return _config.cssPrefix;
	}
});
WINDOW.FontAwesomeConfig = config;
var _onChangeCb = [];
function onChange(cb) {
	_onChangeCb.push(cb);
	return function() {
		_onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
	};
}
var d$2 = UNITS_IN_GRID;
var meaninglessTransform = {
	size: 16,
	x: 0,
	y: 0,
	rotate: 0,
	flipX: false,
	flipY: false
};
function insertCss(css$1) {
	if (!css$1 || !IS_DOM) return;
	var style = DOCUMENT.createElement("style");
	style.setAttribute("type", "text/css");
	style.innerHTML = css$1;
	var headChildren = DOCUMENT.head.childNodes;
	var beforeChild = null;
	for (var i$1 = headChildren.length - 1; i$1 > -1; i$1--) {
		var child = headChildren[i$1];
		var tagName = (child.tagName || "").toUpperCase();
		if (["STYLE", "LINK"].indexOf(tagName) > -1) beforeChild = child;
	}
	DOCUMENT.head.insertBefore(style, beforeChild);
	return css$1;
}
var idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function nextUniqueId() {
	var size = 12;
	var id = "";
	while (size-- > 0) id += idPool[Math.random() * 62 | 0];
	return id;
}
function toArray(obj) {
	var array = [];
	for (var i$1 = (obj || []).length >>> 0; i$1--;) array[i$1] = obj[i$1];
	return array;
}
function classArray(node) {
	if (node.classList) return toArray(node.classList);
	else return (node.getAttribute("class") || "").split(" ").filter(function(i$1) {
		return i$1;
	});
}
function htmlEscape(str) {
	return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function joinAttributes(attributes) {
	return Object.keys(attributes || {}).reduce(function(acc, attributeName) {
		return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
	}, "").trim();
}
function joinStyles(styles$3) {
	return Object.keys(styles$3 || {}).reduce(function(acc, styleName) {
		return acc + "".concat(styleName, ": ").concat(styles$3[styleName].trim(), ";");
	}, "");
}
function transformIsMeaningful(transform) {
	return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref) {
	var transform = _ref.transform, containerWidth = _ref.containerWidth, iconWidth = _ref.iconWidth;
	var outer = { transform: "translate(".concat(containerWidth / 2, " 256)") };
	var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
	var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
	var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
	var inner = { transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate) };
	var path = { transform: "translate(".concat(iconWidth / 2 * -1, " -256)") };
	return {
		outer,
		inner,
		path
	};
}
function transformForCss(_ref2) {
	var transform = _ref2.transform, _ref2$width = _ref2.width, width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width, _ref2$height = _ref2.height, height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height, _ref2$startCentered = _ref2.startCentered, startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
	var val = "";
	if (startCentered && IS_IE) val += "translate(".concat(transform.x / d$2 - width / 2, "em, ").concat(transform.y / d$2 - height / 2, "em) ");
	else if (startCentered) val += "translate(calc(-50% + ".concat(transform.x / d$2, "em), calc(-50% + ").concat(transform.y / d$2, "em)) ");
	else val += "translate(".concat(transform.x / d$2, "em, ").concat(transform.y / d$2, "em) ");
	val += "scale(".concat(transform.size / d$2 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d$2 * (transform.flipY ? -1 : 1), ") ");
	val += "rotate(".concat(transform.rotate, "deg) ");
	return val;
}
var baseStyles = ":root, :host {\n  --fa-font-solid: normal 900 1em/1 \"Font Awesome 7 Free\";\n  --fa-font-regular: normal 400 1em/1 \"Font Awesome 7 Free\";\n  --fa-font-light: normal 300 1em/1 \"Font Awesome 7 Pro\";\n  --fa-font-thin: normal 100 1em/1 \"Font Awesome 7 Pro\";\n  --fa-font-duotone: normal 900 1em/1 \"Font Awesome 7 Duotone\";\n  --fa-font-duotone-regular: normal 400 1em/1 \"Font Awesome 7 Duotone\";\n  --fa-font-duotone-light: normal 300 1em/1 \"Font Awesome 7 Duotone\";\n  --fa-font-duotone-thin: normal 100 1em/1 \"Font Awesome 7 Duotone\";\n  --fa-font-brands: normal 400 1em/1 \"Font Awesome 7 Brands\";\n  --fa-font-sharp-solid: normal 900 1em/1 \"Font Awesome 7 Sharp\";\n  --fa-font-sharp-regular: normal 400 1em/1 \"Font Awesome 7 Sharp\";\n  --fa-font-sharp-light: normal 300 1em/1 \"Font Awesome 7 Sharp\";\n  --fa-font-sharp-thin: normal 100 1em/1 \"Font Awesome 7 Sharp\";\n  --fa-font-sharp-duotone-solid: normal 900 1em/1 \"Font Awesome 7 Sharp Duotone\";\n  --fa-font-sharp-duotone-regular: normal 400 1em/1 \"Font Awesome 7 Sharp Duotone\";\n  --fa-font-sharp-duotone-light: normal 300 1em/1 \"Font Awesome 7 Sharp Duotone\";\n  --fa-font-sharp-duotone-thin: normal 100 1em/1 \"Font Awesome 7 Sharp Duotone\";\n  --fa-font-slab-regular: normal 400 1em/1 \"Font Awesome 7 Slab\";\n  --fa-font-slab-press-regular: normal 400 1em/1 \"Font Awesome 7 Slab Press\";\n  --fa-font-whiteboard-semibold: normal 600 1em/1 \"Font Awesome 7 Whiteboard\";\n  --fa-font-thumbprint-light: normal 300 1em/1 \"Font Awesome 7 Thumbprint\";\n  --fa-font-notdog-solid: normal 900 1em/1 \"Font Awesome 7 Notdog\";\n  --fa-font-notdog-duo-solid: normal 900 1em/1 \"Font Awesome 7 Notdog Duo\";\n  --fa-font-etch-solid: normal 900 1em/1 \"Font Awesome 7 Etch\";\n  --fa-font-jelly-regular: normal 400 1em/1 \"Font Awesome 7 Jelly\";\n  --fa-font-jelly-fill-regular: normal 400 1em/1 \"Font Awesome 7 Jelly Fill\";\n  --fa-font-jelly-duo-regular: normal 400 1em/1 \"Font Awesome 7 Jelly Duo\";\n  --fa-font-chisel-regular: normal 400 1em/1 \"Font Awesome 7 Chisel\";\n  --fa-font-utility-semibold: normal 600 1em/1 \"Font Awesome 7 Utility\";\n  --fa-font-utility-duo-semibold: normal 600 1em/1 \"Font Awesome 7 Utility Duo\";\n  --fa-font-utility-fill-semibold: normal 600 1em/1 \"Font Awesome 7 Utility Fill\";\n}\n\n.svg-inline--fa {\n  box-sizing: content-box;\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n  width: var(--fa-width, 1.25em);\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285714em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left,\n.svg-inline--fa .fa-pull-start {\n  float: inline-start;\n  margin-inline-end: var(--fa-pull-margin, 0.3em);\n}\n.svg-inline--fa.fa-pull-right,\n.svg-inline--fa .fa-pull-end {\n  float: inline-end;\n  margin-inline-start: var(--fa-pull-margin, 0.3em);\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));\n  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: var(--fa-width, 1.25em);\n}\n.fa-layers .svg-inline--fa {\n  inset: 0;\n  margin: auto;\n  position: absolute;\n  transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-counter-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-xs {\n  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-sm {\n  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-lg {\n  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-xl {\n  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-2xl {\n  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-width-auto {\n  --fa-width: auto;\n}\n\n.fa-fw,\n.fa-width-fixed {\n  --fa-width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-inline-start: var(--fa-li-margin, 2.5em);\n  padding-inline-start: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n/* Heads Up: Bordered Icons will not be supported in the future!\n  - This feature will be deprecated in the next major release of Font Awesome (v8)!\n  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.\n*/\n/* Notes:\n* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)\n* --@{v.$css-prefix}-border-padding =\n  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)\n  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)\n*/\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.0625em);\n  box-sizing: var(--fa-border-box-sizing, content-box);\n  padding: var(--fa-border-padding, 0.1875em 0.25em);\n}\n\n.fa-pull-left,\n.fa-pull-start {\n  float: inline-start;\n  margin-inline-end: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right,\n.fa-pull-end {\n  float: inline-end;\n  margin-inline-start: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  animation-name: fa-beat;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  animation-name: fa-bounce;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  animation-name: fa-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  animation-name: fa-beat-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  animation-name: fa-flip;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  animation-name: fa-shake;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  animation-name: fa-spin;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 2s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  animation-name: fa-spin;\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n  .fa-bounce,\n  .fa-fade,\n  .fa-beat-fade,\n  .fa-flip,\n  .fa-pulse,\n  .fa-shake,\n  .fa-spin,\n  .fa-spin-pulse {\n    animation: none !important;\n    transition: none !important;\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    transform: scale(1);\n  }\n  45% {\n    transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-shake {\n  0% {\n    transform: rotate(-15deg);\n  }\n  4% {\n    transform: rotate(15deg);\n  }\n  8%, 24% {\n    transform: rotate(-18deg);\n  }\n  12%, 28% {\n    transform: rotate(18deg);\n  }\n  16% {\n    transform: rotate(-22deg);\n  }\n  20% {\n    transform: rotate(22deg);\n  }\n  32% {\n    transform: rotate(-12deg);\n  }\n  36% {\n    transform: rotate(12deg);\n  }\n  40%, 100% {\n    transform: rotate(0deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  transform: rotate(var(--fa-rotate-angle, 0));\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.svg-inline--fa.fa-inverse {\n  fill: var(--fa-inverse, #fff);\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  line-height: 2em;\n  position: relative;\n  vertical-align: middle;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  --fa-width: 1.25em;\n  height: 1em;\n  width: var(--fa-width);\n}\n.svg-inline--fa.fa-stack-2x {\n  --fa-width: 2.5em;\n  height: 2em;\n  width: var(--fa-width);\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  inset: 0;\n  margin: auto;\n  position: absolute;\n  z-index: var(--fa-stack-z-index, auto);\n}";
function css() {
	var dcp = DEFAULT_CSS_PREFIX;
	var drc = DEFAULT_REPLACEMENT_CLASS;
	var fp = config.cssPrefix;
	var rc = config.replacementClass;
	var s$1 = baseStyles;
	if (fp !== dcp || rc !== drc) {
		var dPatt = new RegExp("\\.".concat(dcp, "\\-"), "g");
		var customPropPatt = new RegExp("\\--".concat(dcp, "\\-"), "g");
		var rPatt = new RegExp("\\.".concat(drc), "g");
		s$1 = s$1.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
	}
	return s$1;
}
var _cssInserted = false;
function ensureCss() {
	if (config.autoAddCss && !_cssInserted) {
		insertCss(css());
		_cssInserted = true;
	}
}
var InjectCSS = {
	mixout: function mixout() {
		return { dom: {
			css,
			insertCss: ensureCss
		} };
	},
	hooks: function hooks() {
		return {
			beforeDOMElementCreation: function beforeDOMElementCreation() {
				ensureCss();
			},
			beforeI2svg: function beforeI2svg() {
				ensureCss();
			}
		};
	}
};
var w$2 = WINDOW || {};
if (!w$2[NAMESPACE_IDENTIFIER]) w$2[NAMESPACE_IDENTIFIER] = {};
if (!w$2[NAMESPACE_IDENTIFIER].styles) w$2[NAMESPACE_IDENTIFIER].styles = {};
if (!w$2[NAMESPACE_IDENTIFIER].hooks) w$2[NAMESPACE_IDENTIFIER].hooks = {};
if (!w$2[NAMESPACE_IDENTIFIER].shims) w$2[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w$2[NAMESPACE_IDENTIFIER];
var functions = [];
var _listener = function listener() {
	DOCUMENT.removeEventListener("DOMContentLoaded", _listener);
	loaded = 1;
	functions.map(function(fn) {
		return fn();
	});
};
var loaded = false;
if (IS_DOM) {
	loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
	if (!loaded) DOCUMENT.addEventListener("DOMContentLoaded", _listener);
}
function domready(fn) {
	if (!IS_DOM) return;
	loaded ? setTimeout(fn, 0) : functions.push(fn);
}
function toHtml(abstractNodes) {
	var tag = abstractNodes.tag, _abstractNodes$attrib = abstractNodes.attributes, attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib, _abstractNodes$childr = abstractNodes.children, children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;
	if (typeof abstractNodes === "string") return htmlEscape(abstractNodes);
	else return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(""), "</").concat(tag, ">");
}
function iconFromMapping(mapping, prefix, iconName) {
	if (mapping && mapping[prefix] && mapping[prefix][iconName]) return {
		prefix,
		iconName,
		icon: mapping[prefix][iconName]
	};
}
/**
* Internal helper to bind a function known to have 4 arguments
* to a given context.
*/
var bindInternal4 = function bindInternal4$1(func, thisContext) {
	return function(a$1, b$1, c$1, d$1) {
		return func.call(thisContext, a$1, b$1, c$1, d$1);
	};
};
/**
* # Reduce
*
* A fast object `.reduce()` implementation.
*
* @param  {Object}   subject      The object to reduce over.
* @param  {Function} fn           The reducer function.
* @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
* @param  {Object}   thisContext  The context for the reducer.
* @return {mixed}                 The final result.
*/
var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
	var keys = Object.keys(subject), length = keys.length, iterator = thisContext !== void 0 ? bindInternal4(fn, thisContext) : fn, i$1, key, result;
	if (initialValue === void 0) {
		i$1 = 1;
		result = subject[keys[0]];
	} else {
		i$1 = 0;
		result = initialValue;
	}
	for (; i$1 < length; i$1++) {
		key = keys[i$1];
		result = iterator(result, subject[key], key, subject);
	}
	return result;
};
/**
* Return hexadecimal string for a unicode character
* Returns `null` when more than one character (not bytes!) are passed
* For example: 'K' → '7B'
*/
function toHex(unicode) {
	if (_toConsumableArray(unicode).length !== 1) return null;
	return unicode.codePointAt(0).toString(16);
}
function normalizeIcons(icons) {
	return Object.keys(icons).reduce(function(acc, iconName) {
		var icon$1 = icons[iconName];
		if (!!icon$1.icon) acc[icon$1.iconName] = icon$1.icon;
		else acc[iconName] = icon$1;
		return acc;
	}, {});
}
function defineIcons(prefix, icons) {
	var _params$skipHooks = (arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}).skipHooks, skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
	var normalized = normalizeIcons(icons);
	if (typeof namespace.hooks.addPack === "function" && !skipHooks) namespace.hooks.addPack(prefix, normalizeIcons(icons));
	else namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
	/**
	* Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
	* of new styles we needed to differentiate between them. Prefix `fa` is now an alias
	* for `fas` so we'll ease the upgrade process for our users by automatically defining
	* this as well.
	*/
	if (prefix === "fas") defineIcons("fa", icons);
}
var styles = namespace.styles, shims = namespace.shims;
var FAMILY_NAMES = Object.keys(PREFIX_TO_LONG_STYLE);
var PREFIXES_FOR_FAMILY = FAMILY_NAMES.reduce(function(acc, familyId) {
	acc[familyId] = Object.keys(PREFIX_TO_LONG_STYLE[familyId]);
	return acc;
}, {});
var _defaultUsablePrefix = null;
var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};
var _byOldUnicode = {};
var _byAlias = {};
function isReserved(name) {
	return ~RESERVED_CLASSES.indexOf(name);
}
function getIconName(cssPrefix, cls) {
	var parts = cls.split("-");
	var prefix = parts[0];
	var iconName = parts.slice(1).join("-");
	if (prefix === cssPrefix && iconName !== "" && !isReserved(iconName)) return iconName;
	else return null;
}
var build = function build$1() {
	var lookup = function lookup$1(reducer) {
		return reduce(styles, function(o$$1, style, prefix) {
			o$$1[prefix] = reduce(style, reducer, {});
			return o$$1;
		}, {});
	};
	_byUnicode = lookup(function(acc, icon$1, iconName) {
		if (icon$1[3]) acc[icon$1[3]] = iconName;
		if (icon$1[2]) icon$1[2].filter(function(a$$1) {
			return typeof a$$1 === "number";
		}).forEach(function(alias) {
			acc[alias.toString(16)] = iconName;
		});
		return acc;
	});
	_byLigature = lookup(function(acc, icon$1, iconName) {
		acc[iconName] = iconName;
		if (icon$1[2]) icon$1[2].filter(function(a$$1) {
			return typeof a$$1 === "string";
		}).forEach(function(alias) {
			acc[alias] = iconName;
		});
		return acc;
	});
	_byAlias = lookup(function(acc, icon$1, iconName) {
		var aliases = icon$1[2];
		acc[iconName] = iconName;
		aliases.forEach(function(alias) {
			acc[alias] = iconName;
		});
		return acc;
	});
	var hasRegular = "far" in styles || config.autoFetchSvg;
	var shimLookups = reduce(shims, function(acc, shim) {
		var maybeNameMaybeUnicode = shim[0];
		var prefix = shim[1];
		var iconName = shim[2];
		if (prefix === "far" && !hasRegular) prefix = "fas";
		if (typeof maybeNameMaybeUnicode === "string") acc.names[maybeNameMaybeUnicode] = {
			prefix,
			iconName
		};
		if (typeof maybeNameMaybeUnicode === "number") acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
			prefix,
			iconName
		};
		return acc;
	}, {
		names: {},
		unicodes: {}
	});
	_byOldName = shimLookups.names;
	_byOldUnicode = shimLookups.unicodes;
	_defaultUsablePrefix = getCanonicalPrefix(config.styleDefault, { family: config.familyDefault });
};
onChange(function(c$$1) {
	_defaultUsablePrefix = getCanonicalPrefix(c$$1.styleDefault, { family: config.familyDefault });
});
build();
function byUnicode(prefix, unicode) {
	return (_byUnicode[prefix] || {})[unicode];
}
function byLigature(prefix, ligature) {
	return (_byLigature[prefix] || {})[ligature];
}
function byAlias(prefix, alias) {
	return (_byAlias[prefix] || {})[alias];
}
function byOldName(name) {
	return _byOldName[name] || {
		prefix: null,
		iconName: null
	};
}
function byOldUnicode(unicode) {
	var oldUnicode = _byOldUnicode[unicode];
	var newUnicode = byUnicode("fas", unicode);
	return oldUnicode || (newUnicode ? {
		prefix: "fas",
		iconName: newUnicode
	} : null) || {
		prefix: null,
		iconName: null
	};
}
function getDefaultUsablePrefix() {
	return _defaultUsablePrefix;
}
var emptyCanonicalIcon = function emptyCanonicalIcon$1() {
	return {
		prefix: null,
		iconName: null,
		rest: []
	};
};
function getFamilyId(values) {
	var family = i;
	var famProps = FAMILY_NAMES.reduce(function(acc, familyId) {
		acc[familyId] = "".concat(config.cssPrefix, "-").concat(familyId);
		return acc;
	}, {});
	rt.forEach(function(familyId) {
		if (values.includes(famProps[familyId]) || values.some(function(v$$1) {
			return PREFIXES_FOR_FAMILY[familyId].includes(v$$1);
		})) family = familyId;
	});
	return family;
}
function getCanonicalPrefix(styleOrPrefix) {
	var _params$family = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).family, family = _params$family === void 0 ? i : _params$family;
	var style = PREFIX_TO_STYLE[family][styleOrPrefix];
	if (family === t && !styleOrPrefix) return "fad";
	var prefix = STYLE_TO_PREFIX[family][styleOrPrefix] || STYLE_TO_PREFIX[family][style];
	var defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
	return prefix || defined || null;
}
function moveNonFaClassesToRest(classNames) {
	var rest = [];
	var iconName = null;
	classNames.forEach(function(cls) {
		var result = getIconName(config.cssPrefix, cls);
		if (result) iconName = result;
		else if (cls) rest.push(cls);
	});
	return {
		iconName,
		rest
	};
}
function sortedUniqueValues(arr) {
	return arr.sort().filter(function(value, index, arr$1) {
		return arr$1.indexOf(value) === index;
	});
}
var _faCombinedClasses = Zt$1.concat(Yt);
function getCanonicalIcon(values) {
	var _params$skipLookups = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).skipLookups, skipLookups = _params$skipLookups === void 0 ? false : _params$skipLookups;
	var givenPrefix = null;
	var faStyleOrFamilyClasses = sortedUniqueValues(values.filter(function(cls) {
		return _faCombinedClasses.includes(cls);
	}));
	var nonStyleOrFamilyClasses = sortedUniqueValues(values.filter(function(cls) {
		return !_faCombinedClasses.includes(cls);
	}));
	var faStyles = faStyleOrFamilyClasses.filter(function(cls) {
		givenPrefix = cls;
		return !Q.includes(cls);
	});
	var _faStyles$ = _slicedToArray(faStyles, 1)[0], styleFromValues = _faStyles$ === void 0 ? null : _faStyles$;
	var family = getFamilyId(faStyleOrFamilyClasses);
	var canonical = _objectSpread2(_objectSpread2({}, moveNonFaClassesToRest(nonStyleOrFamilyClasses)), {}, { prefix: getCanonicalPrefix(styleFromValues, { family }) });
	return _objectSpread2(_objectSpread2(_objectSpread2({}, canonical), getDefaultCanonicalPrefix({
		values,
		family,
		styles,
		config,
		canonical,
		givenPrefix
	})), applyShimAndAlias(skipLookups, givenPrefix, canonical));
}
function applyShimAndAlias(skipLookups, givenPrefix, canonical) {
	var prefix = canonical.prefix, iconName = canonical.iconName;
	if (skipLookups || !prefix || !iconName) return {
		prefix,
		iconName
	};
	var shim = givenPrefix === "fa" ? byOldName(iconName) : {};
	var aliasIconName = byAlias(prefix, iconName);
	iconName = shim.iconName || aliasIconName || iconName;
	prefix = shim.prefix || prefix;
	if (prefix === "far" && !styles["far"] && styles["fas"] && !config.autoFetchSvg) prefix = "fas";
	return {
		prefix,
		iconName
	};
}
var newCanonicalFamilies = rt.filter(function(familyId) {
	return familyId !== i || familyId !== t;
});
var newCanonicalStyles = Object.keys(Ht$1).filter(function(key) {
	return key !== i;
}).map(function(key) {
	return Object.keys(Ht$1[key]);
}).flat();
function getDefaultCanonicalPrefix(prefixOptions) {
	var values = prefixOptions.values, family = prefixOptions.family, canonical = prefixOptions.canonical, _prefixOptions$givenP = prefixOptions.givenPrefix, givenPrefix = _prefixOptions$givenP === void 0 ? "" : _prefixOptions$givenP, _prefixOptions$styles = prefixOptions.styles, styles$3 = _prefixOptions$styles === void 0 ? {} : _prefixOptions$styles, _prefixOptions$config = prefixOptions.config, config$$1 = _prefixOptions$config === void 0 ? {} : _prefixOptions$config;
	var isDuotoneFamily = family === t;
	var valuesHasDuotone = values.includes("fa-duotone") || values.includes("fad");
	var defaultFamilyIsDuotone = config$$1.familyDefault === "duotone";
	var canonicalPrefixIsDuotone = canonical.prefix === "fad" || canonical.prefix === "fa-duotone";
	if (!isDuotoneFamily && (valuesHasDuotone || defaultFamilyIsDuotone || canonicalPrefixIsDuotone)) canonical.prefix = "fad";
	if (values.includes("fa-brands") || values.includes("fab")) canonical.prefix = "fab";
	if (!canonical.prefix && newCanonicalFamilies.includes(family)) {
		if (Object.keys(styles$3).find(function(key) {
			return newCanonicalStyles.includes(key);
		}) || config$$1.autoFetchSvg) {
			canonical.prefix = Ut.get(family).defaultShortPrefixId;
			canonical.iconName = byAlias(canonical.prefix, canonical.iconName) || canonical.iconName;
		}
	}
	if (canonical.prefix === "fa" || givenPrefix === "fa") canonical.prefix = getDefaultUsablePrefix() || "fas";
	return canonical;
}
var Library = /* @__PURE__ */ function() {
	function Library$1() {
		_classCallCheck(this, Library$1);
		this.definitions = {};
	}
	return _createClass(Library$1, [
		{
			key: "add",
			value: function add() {
				var _this = this;
				for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) definitions[_key] = arguments[_key];
				var additions = definitions.reduce(this._pullDefinitions, {});
				Object.keys(additions).forEach(function(key) {
					_this.definitions[key] = _objectSpread2(_objectSpread2({}, _this.definitions[key] || {}), additions[key]);
					defineIcons(key, additions[key]);
					var longPrefix = PREFIX_TO_LONG_STYLE[i][key];
					if (longPrefix) defineIcons(longPrefix, additions[key]);
					build();
				});
			}
		},
		{
			key: "reset",
			value: function reset() {
				this.definitions = {};
			}
		},
		{
			key: "_pullDefinitions",
			value: function _pullDefinitions(additions, definition) {
				var normalized = definition.prefix && definition.iconName && definition.icon ? { 0: definition } : definition;
				Object.keys(normalized).map(function(key) {
					var _normalized$key = normalized[key], prefix = _normalized$key.prefix, iconName = _normalized$key.iconName, icon$1 = _normalized$key.icon;
					var aliases = icon$1[2];
					if (!additions[prefix]) additions[prefix] = {};
					if (aliases.length > 0) aliases.forEach(function(alias) {
						if (typeof alias === "string") additions[prefix][alias] = icon$1;
					});
					additions[prefix][iconName] = icon$1;
				});
				return additions;
			}
		}
	]);
}();
var _plugins = [];
var _hooks = {};
var providers = {};
var defaultProviderKeys = Object.keys(providers);
function registerPlugins(nextPlugins, _ref) {
	var obj = _ref.mixoutsTo;
	_plugins = nextPlugins;
	_hooks = {};
	Object.keys(providers).forEach(function(k$1) {
		if (defaultProviderKeys.indexOf(k$1) === -1) delete providers[k$1];
	});
	_plugins.forEach(function(plugin) {
		var mixout = plugin.mixout ? plugin.mixout() : {};
		Object.keys(mixout).forEach(function(tk) {
			if (typeof mixout[tk] === "function") obj[tk] = mixout[tk];
			if (_typeof(mixout[tk]) === "object") Object.keys(mixout[tk]).forEach(function(sk) {
				if (!obj[tk]) obj[tk] = {};
				obj[tk][sk] = mixout[tk][sk];
			});
		});
		if (plugin.hooks) {
			var hooks = plugin.hooks();
			Object.keys(hooks).forEach(function(hook) {
				if (!_hooks[hook]) _hooks[hook] = [];
				_hooks[hook].push(hooks[hook]);
			});
		}
		if (plugin.provides) plugin.provides(providers);
	});
	return obj;
}
function chainHooks(hook, accumulator) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
	(_hooks[hook] || []).forEach(function(hookFn) {
		accumulator = hookFn.apply(null, [accumulator].concat(args));
	});
	return accumulator;
}
function callHooks(hook) {
	for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
	(_hooks[hook] || []).forEach(function(hookFn) {
		hookFn.apply(null, args);
	});
}
function callProvided() {
	var hook = arguments[0];
	var args = Array.prototype.slice.call(arguments, 1);
	return providers[hook] ? providers[hook].apply(null, args) : void 0;
}
function findIconDefinition(iconLookup) {
	if (iconLookup.prefix === "fa") iconLookup.prefix = "fas";
	var iconName = iconLookup.iconName;
	var prefix = iconLookup.prefix || getDefaultUsablePrefix();
	if (!iconName) return;
	iconName = byAlias(prefix, iconName) || iconName;
	return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}
var library = new Library();
var api = {
	noAuto: function noAuto() {
		config.autoReplaceSvg = false;
		config.observeMutations = false;
		callHooks("noAuto");
	},
	config,
	dom: {
		i2svg: function i2svg() {
			var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			if (IS_DOM) {
				callHooks("beforeI2svg", params);
				callProvided("pseudoElements2svg", params);
				return callProvided("i2svg", params);
			} else return Promise.reject(/* @__PURE__ */ new Error("Operation requires a DOM of some kind."));
		},
		watch: function watch() {
			var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			var autoReplaceSvgRoot = params.autoReplaceSvgRoot;
			if (config.autoReplaceSvg === false) config.autoReplaceSvg = true;
			config.observeMutations = true;
			domready(function() {
				autoReplace({ autoReplaceSvgRoot });
				callHooks("watch", params);
			});
		}
	},
	parse: { icon: function icon$1(_icon) {
		if (_icon === null) return null;
		if (_typeof(_icon) === "object" && _icon.prefix && _icon.iconName) return {
			prefix: _icon.prefix,
			iconName: byAlias(_icon.prefix, _icon.iconName) || _icon.iconName
		};
		if (Array.isArray(_icon) && _icon.length === 2) {
			var iconName = _icon[1].indexOf("fa-") === 0 ? _icon[1].slice(3) : _icon[1];
			var prefix = getCanonicalPrefix(_icon[0]);
			return {
				prefix,
				iconName: byAlias(prefix, iconName) || iconName
			};
		}
		if (typeof _icon === "string" && (_icon.indexOf("".concat(config.cssPrefix, "-")) > -1 || _icon.match(ICON_SELECTION_SYNTAX_PATTERN))) {
			var canonicalIcon = getCanonicalIcon(_icon.split(" "), { skipLookups: true });
			return {
				prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
				iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
			};
		}
		if (typeof _icon === "string") {
			var _prefix = getDefaultUsablePrefix();
			return {
				prefix: _prefix,
				iconName: byAlias(_prefix, _icon) || _icon
			};
		}
	} },
	library,
	findIconDefinition,
	toHtml
};
var autoReplace = function autoReplace$1() {
	var _params$autoReplaceSv = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).autoReplaceSvgRoot, autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv;
	if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({ node: autoReplaceSvgRoot });
};
function domVariants(val, abstractCreator) {
	Object.defineProperty(val, "abstract", { get: abstractCreator });
	Object.defineProperty(val, "html", { get: function get() {
		return val.abstract.map(function(a$1) {
			return toHtml(a$1);
		});
	} });
	Object.defineProperty(val, "node", { get: function get() {
		if (!IS_DOM) return void 0;
		var container = DOCUMENT.createElement("div");
		container.innerHTML = val.html;
		return container.children;
	} });
	return val;
}
function asIcon(_ref) {
	var children = _ref.children, main = _ref.main, mask = _ref.mask, attributes = _ref.attributes, styles$3 = _ref.styles, transform = _ref.transform;
	if (transformIsMeaningful(transform) && main.found && !mask.found) {
		var width = main.width, height = main.height;
		var offset = {
			x: width / height / 2,
			y: .5
		};
		attributes["style"] = joinStyles(_objectSpread2(_objectSpread2({}, styles$3), {}, { "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em") }));
	}
	return [{
		tag: "svg",
		attributes,
		children
	}];
}
function asSymbol(_ref) {
	var prefix = _ref.prefix, iconName = _ref.iconName, children = _ref.children, attributes = _ref.attributes, symbol = _ref.symbol;
	var id = symbol === true ? "".concat(prefix, "-").concat(config.cssPrefix, "-").concat(iconName) : symbol;
	return [{
		tag: "svg",
		attributes: { style: "display: none;" },
		children: [{
			tag: "symbol",
			attributes: _objectSpread2(_objectSpread2({}, attributes), {}, { id }),
			children
		}]
	}];
}
function isLabeled(attributes) {
	return [
		"aria-label",
		"aria-labelledby",
		"title",
		"role"
	].some(function(label) {
		return label in attributes;
	});
}
function makeInlineSvgAbstract(params) {
	var _params$icons = params.icons, main = _params$icons.main, mask = _params$icons.mask, prefix = params.prefix, iconName = params.iconName, transform = params.transform, symbol = params.symbol, maskId = params.maskId, extra = params.extra, _params$watchable = params.watchable, watchable = _params$watchable === void 0 ? false : _params$watchable;
	var _ref = mask.found ? mask : main, width = _ref.width, height = _ref.height;
	var attrClass = [config.replacementClass, iconName ? "".concat(config.cssPrefix, "-").concat(iconName) : ""].filter(function(c$1) {
		return extra.classes.indexOf(c$1) === -1;
	}).filter(function(c$1) {
		return c$1 !== "" || !!c$1;
	}).concat(extra.classes).join(" ");
	var content = {
		children: [],
		attributes: _objectSpread2(_objectSpread2({}, extra.attributes), {}, {
			"data-prefix": prefix,
			"data-icon": iconName,
			"class": attrClass,
			"role": extra.attributes.role || "img",
			"viewBox": "0 0 ".concat(width, " ").concat(height)
		})
	};
	if (!isLabeled(extra.attributes) && !extra.attributes["aria-hidden"]) content.attributes["aria-hidden"] = "true";
	if (watchable) content.attributes[DATA_FA_I2SVG] = "";
	var args = _objectSpread2(_objectSpread2({}, content), {}, {
		prefix,
		iconName,
		main,
		mask,
		maskId,
		transform,
		symbol,
		styles: _objectSpread2({}, extra.styles)
	});
	var _ref2 = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
		children: [],
		attributes: {}
	} : callProvided("generateAbstractIcon", args) || {
		children: [],
		attributes: {}
	}, children = _ref2.children, attributes = _ref2.attributes;
	args.children = children;
	args.attributes = attributes;
	if (symbol) return asSymbol(args);
	else return asIcon(args);
}
function makeLayersTextAbstract(params) {
	var content = params.content, width = params.width, height = params.height, transform = params.transform, extra = params.extra, _params$watchable2 = params.watchable, watchable = _params$watchable2 === void 0 ? false : _params$watchable2;
	var attributes = _objectSpread2(_objectSpread2({}, extra.attributes), {}, { class: extra.classes.join(" ") });
	if (watchable) attributes[DATA_FA_I2SVG] = "";
	var styles$3 = _objectSpread2({}, extra.styles);
	if (transformIsMeaningful(transform)) {
		styles$3["transform"] = transformForCss({
			transform,
			startCentered: true,
			width,
			height
		});
		styles$3["-webkit-transform"] = styles$3["transform"];
	}
	var styleString = joinStyles(styles$3);
	if (styleString.length > 0) attributes["style"] = styleString;
	var val = [];
	val.push({
		tag: "span",
		attributes,
		children: [content]
	});
	return val;
}
function makeLayersCounterAbstract(params) {
	var content = params.content, extra = params.extra;
	var attributes = _objectSpread2(_objectSpread2({}, extra.attributes), {}, { class: extra.classes.join(" ") });
	var styleString = joinStyles(extra.styles);
	if (styleString.length > 0) attributes["style"] = styleString;
	var val = [];
	val.push({
		tag: "span",
		attributes,
		children: [content]
	});
	return val;
}
var styles$1 = namespace.styles;
function asFoundIcon(icon$1) {
	var width = icon$1[0];
	var height = icon$1[1];
	var _icon$slice = icon$1.slice(4), vectorData = _slicedToArray(_icon$slice, 1)[0];
	var element = null;
	if (Array.isArray(vectorData)) element = {
		tag: "g",
		attributes: { class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.GROUP) },
		children: [{
			tag: "path",
			attributes: {
				class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
				fill: "currentColor",
				d: vectorData[0]
			}
		}, {
			tag: "path",
			attributes: {
				class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
				fill: "currentColor",
				d: vectorData[1]
			}
		}]
	};
	else element = {
		tag: "path",
		attributes: {
			fill: "currentColor",
			d: vectorData
		}
	};
	return {
		found: true,
		width,
		height,
		icon: element
	};
}
var missingIconResolutionMixin = {
	found: false,
	width: 512,
	height: 512
};
function maybeNotifyMissing(iconName, prefix) {
	if (!PRODUCTION && !config.showMissingIcons && iconName) console.error("Icon with name \"".concat(iconName, "\" and prefix \"").concat(prefix, "\" is missing."));
}
function findIcon(iconName, prefix) {
	var givenPrefix = prefix;
	if (prefix === "fa" && config.styleDefault !== null) prefix = getDefaultUsablePrefix();
	return new Promise(function(resolve, reject) {
		if (givenPrefix === "fa") {
			var shim = byOldName(iconName) || {};
			iconName = shim.iconName || iconName;
			prefix = shim.prefix || prefix;
		}
		if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
			var icon$1 = styles$1[prefix][iconName];
			return resolve(asFoundIcon(icon$1));
		}
		maybeNotifyMissing(iconName, prefix);
		resolve(_objectSpread2(_objectSpread2({}, missingIconResolutionMixin), {}, { icon: config.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {} }));
	});
}
var noop$1 = function noop$3() {};
var p$2 = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
	mark: noop$1,
	measure: noop$1
};
var preamble = "FA \"7.1.0\"";
var begin = function begin$1(name) {
	p$2.mark("".concat(preamble, " ").concat(name, " begins"));
	return function() {
		return end(name);
	};
};
var end = function end$1(name) {
	p$2.mark("".concat(preamble, " ").concat(name, " ends"));
	p$2.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
};
var perf = {
	begin,
	end
};
var noop$2 = function noop$3() {};
function isWatched(node) {
	return typeof (node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null) === "string";
}
function hasPrefixAndIcon(node) {
	var prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
	var icon$1 = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
	return prefix && icon$1;
}
function hasBeenReplaced(node) {
	return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
}
function getMutator() {
	if (config.autoReplaceSvg === true) return mutators.replace;
	return mutators[config.autoReplaceSvg] || mutators.replace;
}
function createElementNS(tag) {
	return DOCUMENT.createElementNS("http://www.w3.org/2000/svg", tag);
}
function createElement(tag) {
	return DOCUMENT.createElement(tag);
}
function convertSVG(abstractObj) {
	var _params$ceFn = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).ceFn, ceFn = _params$ceFn === void 0 ? abstractObj.tag === "svg" ? createElementNS : createElement : _params$ceFn;
	if (typeof abstractObj === "string") return DOCUMENT.createTextNode(abstractObj);
	var tag = ceFn(abstractObj.tag);
	Object.keys(abstractObj.attributes || []).forEach(function(key) {
		tag.setAttribute(key, abstractObj.attributes[key]);
	});
	(abstractObj.children || []).forEach(function(child) {
		tag.appendChild(convertSVG(child, { ceFn }));
	});
	return tag;
}
function nodeAsComment(node) {
	var comment = " ".concat(node.outerHTML, " ");
	comment = "".concat(comment, "Font Awesome fontawesome.com ");
	return comment;
}
var mutators = {
	replace: function replace$1(mutation) {
		var node = mutation[0];
		if (node.parentNode) {
			mutation[1].forEach(function(abstract) {
				node.parentNode.insertBefore(convertSVG(abstract), node);
			});
			if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
				var comment = DOCUMENT.createComment(nodeAsComment(node));
				node.parentNode.replaceChild(comment, node);
			} else node.remove();
		}
	},
	nest: function nest(mutation) {
		var node = mutation[0];
		var abstract = mutation[1];
		if (~classArray(node).indexOf(config.replacementClass)) return mutators.replace(mutation);
		var forSvg = new RegExp("".concat(config.cssPrefix, "-.*"));
		delete abstract[0].attributes.id;
		if (abstract[0].attributes.class) {
			var splitClasses = abstract[0].attributes.class.split(" ").reduce(function(acc, cls) {
				if (cls === config.replacementClass || cls.match(forSvg)) acc.toSvg.push(cls);
				else acc.toNode.push(cls);
				return acc;
			}, {
				toNode: [],
				toSvg: []
			});
			abstract[0].attributes.class = splitClasses.toSvg.join(" ");
			if (splitClasses.toNode.length === 0) node.removeAttribute("class");
			else node.setAttribute("class", splitClasses.toNode.join(" "));
		}
		var newInnerHTML = abstract.map(function(a$1) {
			return toHtml(a$1);
		}).join("\n");
		node.setAttribute(DATA_FA_I2SVG, "");
		node.innerHTML = newInnerHTML;
	}
};
function performOperationSync(op) {
	op();
}
function perform(mutations, callback) {
	var callbackFunction = typeof callback === "function" ? callback : noop$2;
	if (mutations.length === 0) callbackFunction();
	else {
		var frame = performOperationSync;
		if (config.mutateApproach === MUTATION_APPROACH_ASYNC) frame = WINDOW.requestAnimationFrame || performOperationSync;
		frame(function() {
			var mutator = getMutator();
			var mark = perf.begin("mutate");
			mutations.map(mutator);
			mark();
			callbackFunction();
		});
	}
}
var disabled = false;
function disableObservation() {
	disabled = true;
}
function enableObservation() {
	disabled = false;
}
var mo = null;
function observe(options) {
	if (!MUTATION_OBSERVER) return;
	if (!config.observeMutations) return;
	var _options$treeCallback = options.treeCallback, treeCallback = _options$treeCallback === void 0 ? noop$2 : _options$treeCallback, _options$nodeCallback = options.nodeCallback, nodeCallback = _options$nodeCallback === void 0 ? noop$2 : _options$nodeCallback, _options$pseudoElemen = options.pseudoElementsCallback, pseudoElementsCallback = _options$pseudoElemen === void 0 ? noop$2 : _options$pseudoElemen, _options$observeMutat = options.observeMutationsRoot, observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat;
	mo = new MUTATION_OBSERVER(function(objects) {
		if (disabled) return;
		var defaultPrefix = getDefaultUsablePrefix();
		toArray(objects).forEach(function(mutationRecord) {
			if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
				if (config.searchPseudoElements) pseudoElementsCallback(mutationRecord.target);
				treeCallback(mutationRecord.target);
			}
			if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config.searchPseudoElements) pseudoElementsCallback([mutationRecord.target], true);
			if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
				if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
					var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)), prefix = _getCanonicalIcon.prefix, iconName = _getCanonicalIcon.iconName;
					mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
					if (iconName) mutationRecord.target.setAttribute(DATA_ICON, iconName);
				} else if (hasBeenReplaced(mutationRecord.target)) nodeCallback(mutationRecord.target);
			}
		});
	});
	if (!IS_DOM) return;
	mo.observe(observeMutationsRoot, {
		childList: true,
		attributes: true,
		characterData: true,
		subtree: true
	});
}
function disconnect() {
	if (!mo) return;
	mo.disconnect();
}
function styleParser(node) {
	var style = node.getAttribute("style");
	var val = [];
	if (style) val = style.split(";").reduce(function(acc, style$1) {
		var styles$3 = style$1.split(":");
		var prop = styles$3[0];
		var value = styles$3.slice(1);
		if (prop && value.length > 0) acc[prop] = value.join(":").trim();
		return acc;
	}, {});
	return val;
}
function classParser(node) {
	var existingPrefix = node.getAttribute("data-prefix");
	var existingIconName = node.getAttribute("data-icon");
	var innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
	var val = getCanonicalIcon(classArray(node));
	if (!val.prefix) val.prefix = getDefaultUsablePrefix();
	if (existingPrefix && existingIconName) {
		val.prefix = existingPrefix;
		val.iconName = existingIconName;
	}
	if (val.iconName && val.prefix) return val;
	if (val.prefix && innerText.length > 0) val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
	if (!val.iconName && config.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) val.iconName = node.firstChild.data;
	return val;
}
function attributesParser(node) {
	return toArray(node.attributes).reduce(function(acc, attr) {
		if (acc.name !== "class" && acc.name !== "style") acc[attr.name] = attr.value;
		return acc;
	}, {});
}
function blankMeta() {
	return {
		iconName: null,
		prefix: null,
		transform: meaninglessTransform,
		symbol: false,
		mask: {
			iconName: null,
			prefix: null,
			rest: []
		},
		maskId: null,
		extra: {
			classes: [],
			styles: {},
			attributes: {}
		}
	};
}
function parseMeta(node) {
	var parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { styleParser: true };
	var _classParser = classParser(node), iconName = _classParser.iconName, prefix = _classParser.prefix, extraClasses = _classParser.rest;
	var extraAttributes = attributesParser(node);
	var pluginMeta = chainHooks("parseNodeAttributes", {}, node);
	var extraStyles = parser.styleParser ? styleParser(node) : [];
	return _objectSpread2({
		iconName,
		prefix,
		transform: meaninglessTransform,
		mask: {
			iconName: null,
			prefix: null,
			rest: []
		},
		maskId: null,
		symbol: false,
		extra: {
			classes: extraClasses,
			styles: extraStyles,
			attributes: extraAttributes
		}
	}, pluginMeta);
}
var styles$2 = namespace.styles;
function generateMutation(node) {
	var nodeMeta = config.autoReplaceSvg === "nest" ? parseMeta(node, { styleParser: false }) : parseMeta(node);
	if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) return callProvided("generateLayersText", node, nodeMeta);
	else return callProvided("generateSvgReplacementMutation", node, nodeMeta);
}
function getKnownPrefixes() {
	return [].concat(_toConsumableArray(Yt), _toConsumableArray(Zt$1));
}
function onTree(root) {
	var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
	if (!IS_DOM) return Promise.resolve();
	var htmlClassList = DOCUMENT.documentElement.classList;
	var hclAdd = function hclAdd$1(suffix) {
		return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
	};
	var hclRemove = function hclRemove$1(suffix) {
		return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
	};
	var prefixes = config.autoFetchSvg ? getKnownPrefixes() : Q.concat(Object.keys(styles$2));
	if (!prefixes.includes("fa")) prefixes.push("fa");
	var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes.map(function(p$$1) {
		return ".".concat(p$$1, ":not([").concat(DATA_FA_I2SVG, "])");
	})).join(", ");
	if (prefixesDomQuery.length === 0) return Promise.resolve();
	var candidates = [];
	try {
		candidates = toArray(root.querySelectorAll(prefixesDomQuery));
	} catch (e$$1) {}
	if (candidates.length > 0) {
		hclAdd("pending");
		hclRemove("complete");
	} else return Promise.resolve();
	var mark = perf.begin("onTree");
	var mutations = candidates.reduce(function(acc, node) {
		try {
			var mutation = generateMutation(node);
			if (mutation) acc.push(mutation);
		} catch (e$$1) {
			if (!PRODUCTION) {
				if (e$$1.name === "MissingIcon") console.error(e$$1);
			}
		}
		return acc;
	}, []);
	return new Promise(function(resolve, reject) {
		Promise.all(mutations).then(function(resolvedMutations) {
			perform(resolvedMutations, function() {
				hclAdd("active");
				hclAdd("complete");
				hclRemove("pending");
				if (typeof callback === "function") callback();
				mark();
				resolve();
			});
		}).catch(function(e$$1) {
			mark();
			reject(e$$1);
		});
	});
}
function onNode(node) {
	var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
	generateMutation(node).then(function(mutation) {
		if (mutation) perform([mutation], callback);
	});
}
function resolveIcons(next) {
	return function(maybeIconDefinition) {
		var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
		var mask = params.mask;
		if (mask) mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
		return next(iconDefinition, _objectSpread2(_objectSpread2({}, params), {}, { mask }));
	};
}
var render = function render$1(iconDefinition) {
	var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$symbol = params.symbol, symbol = _params$symbol === void 0 ? false : _params$symbol, _params$mask = params.mask, mask = _params$mask === void 0 ? null : _params$mask, _params$maskId = params.maskId, maskId = _params$maskId === void 0 ? null : _params$maskId, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles$3 = _params$styles === void 0 ? {} : _params$styles;
	if (!iconDefinition) return;
	var prefix = iconDefinition.prefix, iconName = iconDefinition.iconName, icon$1 = iconDefinition.icon;
	return domVariants(_objectSpread2({ type: "icon" }, iconDefinition), function() {
		callHooks("beforeDOMElementCreation", {
			iconDefinition,
			params
		});
		return makeInlineSvgAbstract({
			icons: {
				main: asFoundIcon(icon$1),
				mask: mask ? asFoundIcon(mask.icon) : {
					found: false,
					width: null,
					height: null,
					icon: {}
				}
			},
			prefix,
			iconName,
			transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
			symbol,
			maskId,
			extra: {
				attributes,
				styles: styles$3,
				classes
			}
		});
	});
};
var ReplaceElements = {
	mixout: function mixout() {
		return { icon: resolveIcons(render) };
	},
	hooks: function hooks() {
		return { mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
			accumulator.treeCallback = onTree;
			accumulator.nodeCallback = onNode;
			return accumulator;
		} };
	},
	provides: function provides(providers$$1) {
		providers$$1.i2svg = function(params) {
			var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node, _params$callback = params.callback;
			return onTree(node, _params$callback === void 0 ? function() {} : _params$callback);
		};
		providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
			var iconName = nodeMeta.iconName, prefix = nodeMeta.prefix, transform = nodeMeta.transform, symbol = nodeMeta.symbol, mask = nodeMeta.mask, maskId = nodeMeta.maskId, extra = nodeMeta.extra;
			return new Promise(function(resolve, reject) {
				Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
					found: false,
					width: 512,
					height: 512,
					icon: {}
				})]).then(function(_ref) {
					var _ref2 = _slicedToArray(_ref, 2), main = _ref2[0], mask$1 = _ref2[1];
					resolve([node, makeInlineSvgAbstract({
						icons: {
							main,
							mask: mask$1
						},
						prefix,
						iconName,
						transform,
						symbol,
						maskId,
						extra,
						watchable: true
					})]);
				}).catch(reject);
			});
		};
		providers$$1.generateAbstractIcon = function(_ref3) {
			var children = _ref3.children, attributes = _ref3.attributes, main = _ref3.main, transform = _ref3.transform, styles$3 = _ref3.styles;
			var styleString = joinStyles(styles$3);
			if (styleString.length > 0) attributes["style"] = styleString;
			var nextChild;
			if (transformIsMeaningful(transform)) nextChild = callProvided("generateAbstractTransformGrouping", {
				main,
				transform,
				containerWidth: main.width,
				iconWidth: main.width
			});
			children.push(nextChild || main.icon);
			return {
				children,
				attributes
			};
		};
	}
};
var Layers = { mixout: function mixout() {
	return { layer: function layer$1(assembler) {
		var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		var _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes;
		return domVariants({ type: "layer" }, function() {
			callHooks("beforeDOMElementCreation", {
				assembler,
				params
			});
			var children = [];
			assembler(function(args) {
				Array.isArray(args) ? args.map(function(a$1) {
					children = children.concat(a$1.abstract);
				}) : children = children.concat(args.abstract);
			});
			return [{
				tag: "span",
				attributes: { class: ["".concat(config.cssPrefix, "-layers")].concat(_toConsumableArray(classes)).join(" ") },
				children
			}];
		});
	} };
} };
var LayersCounter$1 = { mixout: function mixout() {
	return { counter: function counter$1(content) {
		var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		var _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles$3 = _params$styles === void 0 ? {} : _params$styles;
		return domVariants({
			type: "counter",
			content
		}, function() {
			callHooks("beforeDOMElementCreation", {
				content,
				params
			});
			return makeLayersCounterAbstract({
				content: content.toString(),
				title,
				extra: {
					attributes,
					styles: styles$3,
					classes: ["".concat(config.cssPrefix, "-layers-counter")].concat(_toConsumableArray(classes))
				}
			});
		});
	} };
} };
var LayersText$1 = {
	mixout: function mixout() {
		return { text: function text$1(content) {
			var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles$3 = _params$styles === void 0 ? {} : _params$styles;
			return domVariants({
				type: "text",
				content
			}, function() {
				callHooks("beforeDOMElementCreation", {
					content,
					params
				});
				return makeLayersTextAbstract({
					content,
					transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
					extra: {
						attributes,
						styles: styles$3,
						classes: ["".concat(config.cssPrefix, "-layers-text")].concat(_toConsumableArray(classes))
					}
				});
			});
		} };
	},
	provides: function provides(providers$$1) {
		providers$$1.generateLayersText = function(node, nodeMeta) {
			var transform = nodeMeta.transform, extra = nodeMeta.extra;
			var width = null;
			var height = null;
			if (IS_IE) {
				var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
				var boundingClientRect = node.getBoundingClientRect();
				width = boundingClientRect.width / computedFontSize;
				height = boundingClientRect.height / computedFontSize;
			}
			return Promise.resolve([node, makeLayersTextAbstract({
				content: node.innerHTML,
				width,
				height,
				transform,
				extra,
				watchable: true
			})]);
		};
	}
};
var CLEAN_CONTENT_PATTERN = new RegExp("\"", "ug");
var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
var _FONT_FAMILY_WEIGHT_TO_PREFIX = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, { FontAwesome: {
	normal: "fas",
	400: "fas"
} }), Ct), ro), dl);
var FONT_FAMILY_WEIGHT_TO_PREFIX = Object.keys(_FONT_FAMILY_WEIGHT_TO_PREFIX).reduce(function(acc, key) {
	acc[key.toLowerCase()] = _FONT_FAMILY_WEIGHT_TO_PREFIX[key];
	return acc;
}, {});
var FONT_FAMILY_WEIGHT_FALLBACK = Object.keys(FONT_FAMILY_WEIGHT_TO_PREFIX).reduce(function(acc, fontFamily) {
	var weights = FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamily];
	acc[fontFamily] = weights[900] || _toConsumableArray(Object.entries(weights))[0][1];
	return acc;
}, {});
function hexValueFromContent(content) {
	var cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
	return toHex(_toConsumableArray(cleaned)[0] || "");
}
function isSecondaryLayer(styles$3) {
	var hasStylisticSet = styles$3.getPropertyValue("font-feature-settings").includes("ss01");
	var cleaned = styles$3.getPropertyValue("content").replace(CLEAN_CONTENT_PATTERN, "");
	var codePoint = cleaned.codePointAt(0);
	var isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
	var isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
	return isPrependTen || isDoubled || hasStylisticSet;
}
function getPrefix(fontFamily, fontWeight) {
	var fontFamilySanitized = fontFamily.replace(/^['"]|['"]$/g, "").toLowerCase();
	var fontWeightInteger = parseInt(fontWeight);
	var fontWeightSanitized = isNaN(fontWeightInteger) ? "normal" : fontWeightInteger;
	return (FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamilySanitized] || {})[fontWeightSanitized] || FONT_FAMILY_WEIGHT_FALLBACK[fontFamilySanitized];
}
function replaceForPosition(node, position) {
	var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
	return new Promise(function(resolve, reject) {
		if (node.getAttribute(pendingAttribute) !== null) return resolve();
		var alreadyProcessedPseudoElement = toArray(node.children).filter(function(c$$1) {
			return c$$1.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
		})[0];
		var styles$3 = WINDOW.getComputedStyle(node, position);
		var fontFamily = styles$3.getPropertyValue("font-family");
		var fontFamilyMatch = fontFamily.match(FONT_FAMILY_PATTERN);
		var fontWeight = styles$3.getPropertyValue("font-weight");
		var content = styles$3.getPropertyValue("content");
		if (alreadyProcessedPseudoElement && !fontFamilyMatch) {
			node.removeChild(alreadyProcessedPseudoElement);
			return resolve();
		} else if (fontFamilyMatch && content !== "none" && content !== "") {
			var _content = styles$3.getPropertyValue("content");
			var prefix = getPrefix(fontFamily, fontWeight);
			var hexValue = hexValueFromContent(_content);
			var isV4 = fontFamilyMatch[0].startsWith("FontAwesome");
			var isSecondary = isSecondaryLayer(styles$3);
			var iconName = byUnicode(prefix, hexValue);
			var iconIdentifier = iconName;
			if (isV4) {
				var iconName4 = byOldUnicode(hexValue);
				if (iconName4.iconName && iconName4.prefix) {
					iconName = iconName4.iconName;
					prefix = iconName4.prefix;
				}
			}
			if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
				node.setAttribute(pendingAttribute, iconIdentifier);
				if (alreadyProcessedPseudoElement) node.removeChild(alreadyProcessedPseudoElement);
				var meta = blankMeta();
				var extra = meta.extra;
				extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
				findIcon(iconName, prefix).then(function(main) {
					var abstract = makeInlineSvgAbstract(_objectSpread2(_objectSpread2({}, meta), {}, {
						icons: {
							main,
							mask: emptyCanonicalIcon()
						},
						prefix,
						iconName: iconIdentifier,
						extra,
						watchable: true
					}));
					var element = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg");
					if (position === "::before") node.insertBefore(element, node.firstChild);
					else node.appendChild(element);
					element.outerHTML = abstract.map(function(a$$1) {
						return toHtml(a$$1);
					}).join("\n");
					node.removeAttribute(pendingAttribute);
					resolve();
				}).catch(reject);
			} else resolve();
		} else resolve();
	});
}
function replace(node) {
	return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
}
function processable(node) {
	return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
}
var hasPseudoElement = function hasPseudoElement$1(selector) {
	return !!selector && PSEUDO_ELEMENTS.some(function(pseudoSelector) {
		return selector.includes(pseudoSelector);
	});
};
var parseCSSRuleForPseudos = function parseCSSRuleForPseudos$1(selectorText) {
	if (!selectorText) return [];
	var selectorSet = /* @__PURE__ */ new Set();
	var selectors = selectorText.split(/,(?![^()]*\))/).map(function(s$$1) {
		return s$$1.trim();
	});
	selectors = selectors.flatMap(function(selector$1) {
		return selector$1.includes("(") ? selector$1 : selector$1.split(",").map(function(s$$1) {
			return s$$1.trim();
		});
	});
	var _iterator = _createForOfIteratorHelper(selectors), _step;
	try {
		for (_iterator.s(); !(_step = _iterator.n()).done;) {
			var selector = _step.value;
			if (hasPseudoElement(selector)) {
				var selectorWithoutPseudo = PSEUDO_ELEMENTS.reduce(function(acc, pseudoSelector) {
					return acc.replace(pseudoSelector, "");
				}, selector);
				if (selectorWithoutPseudo !== "" && selectorWithoutPseudo !== "*") selectorSet.add(selectorWithoutPseudo);
			}
		}
	} catch (err) {
		_iterator.e(err);
	} finally {
		_iterator.f();
	}
	return selectorSet;
};
function searchPseudoElements(root) {
	var useAsNodeList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
	if (!IS_DOM) return;
	var nodeList;
	if (useAsNodeList) nodeList = root;
	else if (config.searchPseudoElementsFullScan) nodeList = root.querySelectorAll("*");
	else {
		var selectorSet = /* @__PURE__ */ new Set();
		var _iterator2 = _createForOfIteratorHelper(document.styleSheets), _step2;
		try {
			for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
				var stylesheet = _step2.value;
				try {
					var _iterator3 = _createForOfIteratorHelper(stylesheet.cssRules), _step3;
					try {
						for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
							var rule = _step3.value;
							var parsedSelectors = parseCSSRuleForPseudos(rule.selectorText);
							var _iterator4 = _createForOfIteratorHelper(parsedSelectors), _step4;
							try {
								for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
									var selector = _step4.value;
									selectorSet.add(selector);
								}
							} catch (err) {
								_iterator4.e(err);
							} finally {
								_iterator4.f();
							}
						}
					} catch (err) {
						_iterator3.e(err);
					} finally {
						_iterator3.f();
					}
				} catch (e$$1) {
					if (config.searchPseudoElementsWarnings) console.warn("Font Awesome: cannot parse stylesheet: ".concat(stylesheet.href, " (").concat(e$$1.message, ")\nIf it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin=\"anonymous\" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false."));
				}
			}
		} catch (err) {
			_iterator2.e(err);
		} finally {
			_iterator2.f();
		}
		if (!selectorSet.size) return;
		var cleanSelectors = Array.from(selectorSet).join(", ");
		try {
			nodeList = root.querySelectorAll(cleanSelectors);
		} catch (_unused) {}
	}
	return new Promise(function(resolve, reject) {
		var operations = toArray(nodeList).filter(processable).map(replace);
		var end$1 = perf.begin("searchPseudoElements");
		disableObservation();
		Promise.all(operations).then(function() {
			end$1();
			enableObservation();
			resolve();
		}).catch(function() {
			end$1();
			enableObservation();
			reject();
		});
	});
}
var PseudoElements = {
	hooks: function hooks() {
		return { mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
			accumulator.pseudoElementsCallback = searchPseudoElements;
			return accumulator;
		} };
	},
	provides: function provides(providers$1) {
		providers$1.pseudoElements2svg = function(params) {
			var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node;
			if (config.searchPseudoElements) searchPseudoElements(node);
		};
	}
};
var _unwatched = false;
var MutationObserver$1 = {
	mixout: function mixout() {
		return { dom: { unwatch: function unwatch() {
			disableObservation();
			_unwatched = true;
		} } };
	},
	hooks: function hooks() {
		return {
			bootstrap: function bootstrap() {
				observe(chainHooks("mutationObserverCallbacks", {}));
			},
			noAuto: function noAuto() {
				disconnect();
			},
			watch: function watch(params) {
				var observeMutationsRoot = params.observeMutationsRoot;
				if (_unwatched) enableObservation();
				else observe(chainHooks("mutationObserverCallbacks", { observeMutationsRoot }));
			}
		};
	}
};
var parseTransformString = function parseTransformString$1(transformString) {
	return transformString.toLowerCase().split(" ").reduce(function(acc, n$1) {
		var parts = n$1.toLowerCase().split("-");
		var first = parts[0];
		var rest = parts.slice(1).join("-");
		if (first && rest === "h") {
			acc.flipX = true;
			return acc;
		}
		if (first && rest === "v") {
			acc.flipY = true;
			return acc;
		}
		rest = parseFloat(rest);
		if (isNaN(rest)) return acc;
		switch (first) {
			case "grow":
				acc.size = acc.size + rest;
				break;
			case "shrink":
				acc.size = acc.size - rest;
				break;
			case "left":
				acc.x = acc.x - rest;
				break;
			case "right":
				acc.x = acc.x + rest;
				break;
			case "up":
				acc.y = acc.y - rest;
				break;
			case "down":
				acc.y = acc.y + rest;
				break;
			case "rotate":
				acc.rotate = acc.rotate + rest;
				break;
		}
		return acc;
	}, {
		size: 16,
		x: 0,
		y: 0,
		flipX: false,
		flipY: false,
		rotate: 0
	});
};
var PowerTransforms = {
	mixout: function mixout() {
		return { parse: { transform: function transform(transformString) {
			return parseTransformString(transformString);
		} } };
	},
	hooks: function hooks() {
		return { parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
			var transformString = node.getAttribute("data-fa-transform");
			if (transformString) accumulator.transform = parseTransformString(transformString);
			return accumulator;
		} };
	},
	provides: function provides(providers$1) {
		providers$1.generateAbstractTransformGrouping = function(_ref) {
			var main = _ref.main, transform = _ref.transform, containerWidth = _ref.containerWidth, iconWidth = _ref.iconWidth;
			var outer = { transform: "translate(".concat(containerWidth / 2, " 256)") };
			var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
			var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
			var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
			var inner = { transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate) };
			var path = { transform: "translate(".concat(iconWidth / 2 * -1, " -256)") };
			var operations = {
				outer,
				inner,
				path
			};
			return {
				tag: "g",
				attributes: _objectSpread2({}, operations.outer),
				children: [{
					tag: "g",
					attributes: _objectSpread2({}, operations.inner),
					children: [{
						tag: main.icon.tag,
						children: main.icon.children,
						attributes: _objectSpread2(_objectSpread2({}, main.icon.attributes), operations.path)
					}]
				}]
			};
		};
	}
};
var ALL_SPACE = {
	x: 0,
	y: 0,
	width: "100%",
	height: "100%"
};
function fillBlack(abstract) {
	var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
	if (abstract.attributes && (abstract.attributes.fill || force)) abstract.attributes.fill = "black";
	return abstract;
}
function deGroup(abstract) {
	if (abstract.tag === "g") return abstract.children;
	else return [abstract];
}
registerPlugins([
	InjectCSS,
	ReplaceElements,
	Layers,
	LayersCounter$1,
	LayersText$1,
	PseudoElements,
	MutationObserver$1,
	PowerTransforms,
	{
		hooks: function hooks() {
			return { parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
				var maskData = node.getAttribute("data-fa-mask");
				var mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map(function(i$1) {
					return i$1.trim();
				}));
				if (!mask.prefix) mask.prefix = getDefaultUsablePrefix();
				accumulator.mask = mask;
				accumulator.maskId = node.getAttribute("data-fa-mask-id");
				return accumulator;
			} };
		},
		provides: function provides(providers$1) {
			providers$1.generateAbstractMask = function(_ref) {
				var children = _ref.children, attributes = _ref.attributes, main = _ref.main, mask = _ref.mask, explicitMaskId = _ref.maskId, transform = _ref.transform;
				var mainWidth = main.width, mainPath = main.icon;
				var maskWidth = mask.width, maskPath = mask.icon;
				var trans = transformForSvg({
					transform,
					containerWidth: maskWidth,
					iconWidth: mainWidth
				});
				var maskRect = {
					tag: "rect",
					attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, { fill: "white" })
				};
				var maskInnerGroupChildrenMixin = mainPath.children ? { children: mainPath.children.map(fillBlack) } : {};
				var maskInnerGroup = {
					tag: "g",
					attributes: _objectSpread2({}, trans.inner),
					children: [fillBlack(_objectSpread2({
						tag: mainPath.tag,
						attributes: _objectSpread2(_objectSpread2({}, mainPath.attributes), trans.path)
					}, maskInnerGroupChildrenMixin))]
				};
				var maskOuterGroup = {
					tag: "g",
					attributes: _objectSpread2({}, trans.outer),
					children: [maskInnerGroup]
				};
				var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
				var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
				var maskTag = {
					tag: "mask",
					attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
						id: maskId,
						maskUnits: "userSpaceOnUse",
						maskContentUnits: "userSpaceOnUse"
					}),
					children: [maskRect, maskOuterGroup]
				};
				var defs = {
					tag: "defs",
					children: [{
						tag: "clipPath",
						attributes: { id: clipId },
						children: deGroup(maskPath)
					}, maskTag]
				};
				children.push(defs, {
					tag: "rect",
					attributes: _objectSpread2({
						"fill": "currentColor",
						"clip-path": "url(#".concat(clipId, ")"),
						"mask": "url(#".concat(maskId, ")")
					}, ALL_SPACE)
				});
				return {
					children,
					attributes
				};
			};
		}
	},
	{ provides: function provides(providers$1) {
		var reduceMotion = false;
		if (WINDOW.matchMedia) reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
		providers$1.missingIconAbstract = function() {
			var gChildren = [];
			var FILL = { fill: "currentColor" };
			var ANIMATION_BASE = {
				attributeType: "XML",
				repeatCount: "indefinite",
				dur: "2s"
			};
			gChildren.push({
				tag: "path",
				attributes: _objectSpread2(_objectSpread2({}, FILL), {}, { d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z" })
			});
			var OPACITY_ANIMATE = _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, { attributeName: "opacity" });
			var dot = {
				tag: "circle",
				attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
					cx: "256",
					cy: "364",
					r: "28"
				}),
				children: []
			};
			if (!reduceMotion) dot.children.push({
				tag: "animate",
				attributes: _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
					attributeName: "r",
					values: "28;14;28;28;14;28;"
				})
			}, {
				tag: "animate",
				attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, { values: "1;0;1;1;0;1;" })
			});
			gChildren.push(dot);
			gChildren.push({
				tag: "path",
				attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
					opacity: "1",
					d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
				}),
				children: reduceMotion ? [] : [{
					tag: "animate",
					attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, { values: "1;0;0;0;0;1;" })
				}]
			});
			if (!reduceMotion) gChildren.push({
				tag: "path",
				attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
					opacity: "0",
					d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
				}),
				children: [{
					tag: "animate",
					attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, { values: "0;0;1;1;0;0;" })
				}]
			});
			return {
				tag: "g",
				attributes: { class: "missing" },
				children: gChildren
			};
		};
	} },
	{ hooks: function hooks() {
		return { parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
			var symbolData = node.getAttribute("data-fa-symbol");
			accumulator["symbol"] = symbolData === null ? false : symbolData === "" ? true : symbolData;
			return accumulator;
		} };
	} }
], { mixoutsTo: api });
var noAuto$1 = api.noAuto;
var config$1 = api.config;
var library$1 = api.library;
var dom$1 = api.dom;
var parse$1 = api.parse;
var findIconDefinition$1 = api.findIconDefinition;
var toHtml$1 = api.toHtml;
var icon = api.icon;
var layer = api.layer;
var text = api.text;
var counter = api.counter;

//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = /* @__PURE__ */ __commonJS({ "node_modules/react/cjs/react-jsx-runtime.development.js": ((exports) => {
	(function() {
		function getComponentNameFromType(type) {
			if (null == type) return null;
			if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
			if ("string" === typeof type) return type;
			switch (type) {
				case REACT_FRAGMENT_TYPE: return "Fragment";
				case REACT_PROFILER_TYPE: return "Profiler";
				case REACT_STRICT_MODE_TYPE: return "StrictMode";
				case REACT_SUSPENSE_TYPE: return "Suspense";
				case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
				case REACT_ACTIVITY_TYPE: return "Activity";
			}
			if ("object" === typeof type) switch ("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
				case REACT_PORTAL_TYPE: return "Portal";
				case REACT_CONTEXT_TYPE: return type.displayName || "Context";
				case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
				case REACT_FORWARD_REF_TYPE:
					var innerType = type.render;
					type = type.displayName;
					type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
					return type;
				case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
				case REACT_LAZY_TYPE:
					innerType = type._payload;
					type = type._init;
					try {
						return getComponentNameFromType(type(innerType));
					} catch (x$1) {}
			}
			return null;
		}
		function testStringCoercion(value) {
			return "" + value;
		}
		function checkKeyStringCoercion(value) {
			try {
				testStringCoercion(value);
				var JSCompiler_inline_result = !1;
			} catch (e$1) {
				JSCompiler_inline_result = !0;
			}
			if (JSCompiler_inline_result) {
				JSCompiler_inline_result = console;
				var JSCompiler_temp_const = JSCompiler_inline_result.error;
				var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
				JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
				return testStringCoercion(value);
			}
		}
		function getTaskName(type) {
			if (type === REACT_FRAGMENT_TYPE) return "<>";
			if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
			try {
				var name = getComponentNameFromType(type);
				return name ? "<" + name + ">" : "<...>";
			} catch (x$1) {
				return "<...>";
			}
		}
		function getOwner() {
			var dispatcher = ReactSharedInternals.A;
			return null === dispatcher ? null : dispatcher.getOwner();
		}
		function UnknownOwner() {
			return Error("react-stack-top-frame");
		}
		function hasValidKey(config$2) {
			if (hasOwnProperty.call(config$2, "key")) {
				var getter = Object.getOwnPropertyDescriptor(config$2, "key").get;
				if (getter && getter.isReactWarning) return !1;
			}
			return void 0 !== config$2.key;
		}
		function defineKeyPropWarningGetter(props, displayName) {
			function warnAboutAccessingKey() {
				specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
			}
			warnAboutAccessingKey.isReactWarning = !0;
			Object.defineProperty(props, "key", {
				get: warnAboutAccessingKey,
				configurable: !0
			});
		}
		function elementRefGetterWithDeprecationWarning() {
			var componentName = getComponentNameFromType(this.type);
			didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
			componentName = this.props.ref;
			return void 0 !== componentName ? componentName : null;
		}
		function ReactElement(type, key, props, owner, debugStack, debugTask) {
			var refProp = props.ref;
			type = {
				$$typeof: REACT_ELEMENT_TYPE,
				type,
				key,
				props,
				_owner: owner
			};
			null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
				enumerable: !1,
				get: elementRefGetterWithDeprecationWarning
			}) : Object.defineProperty(type, "ref", {
				enumerable: !1,
				value: null
			});
			type._store = {};
			Object.defineProperty(type._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			});
			Object.defineProperty(type, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			});
			Object.defineProperty(type, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: debugStack
			});
			Object.defineProperty(type, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: debugTask
			});
			Object.freeze && (Object.freeze(type.props), Object.freeze(type));
			return type;
		}
		function jsxDEVImpl(type, config$2, maybeKey, isStaticChildren, debugStack, debugTask) {
			var children = config$2.children;
			if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
				for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++) validateChildKeys(children[isStaticChildren]);
				Object.freeze && Object.freeze(children);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else validateChildKeys(children);
			if (hasOwnProperty.call(config$2, "key")) {
				children = getComponentNameFromType(type);
				var keys = Object.keys(config$2).filter(function(k$1) {
					return "key" !== k$1;
				});
				isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
				didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
			}
			children = null;
			void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
			hasValidKey(config$2) && (checkKeyStringCoercion(config$2.key), children = "" + config$2.key);
			if ("key" in config$2) {
				maybeKey = {};
				for (var propName in config$2) "key" !== propName && (maybeKey[propName] = config$2[propName]);
			} else maybeKey = config$2;
			children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
			return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
		}
		function validateChildKeys(node) {
			isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
		}
		function isValidElement(object) {
			return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		var React$1 = require_react(), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
			return null;
		};
		React$1 = { react_stack_bottom_frame: function(callStackForError) {
			return callStackForError();
		} };
		var specialPropKeyWarningShown;
		var didWarnAboutElementRef = {};
		var unknownOwnerDebugStack = React$1.react_stack_bottom_frame.bind(React$1, UnknownOwner)();
		var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
		var didWarnAboutKeySpread = {};
		exports.Fragment = REACT_FRAGMENT_TYPE;
		exports.jsx = function(type, config$2, maybeKey) {
			var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
			return jsxDEVImpl(type, config$2, maybeKey, !1, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
		};
		exports.jsxs = function(type, config$2, maybeKey) {
			var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
			return jsxDEVImpl(type, config$2, maybeKey, !0, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
		};
	})();
}) });

//#endregion
//#region node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJS({ "node_modules/react/jsx-runtime.js": ((exports, module) => {
	module.exports = require_react_jsx_runtime_development();
}) });

//#endregion
//#region node_modules/@fortawesome/react-fontawesome/dist/index.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function _isNumerical(object) {
	object = object - 0;
	return object === object;
}
function camelize(string) {
	if (_isNumerical(string)) return string;
	string = string.replace(/[_-]+(.)?/g, (_$1, chr) => {
		return chr ? chr.toUpperCase() : "";
	});
	return string.charAt(0).toLowerCase() + string.slice(1);
}
function capitalize(val) {
	return val.charAt(0).toUpperCase() + val.slice(1);
}
var styleCache = /* @__PURE__ */ new Map();
var STYLE_CACHE_LIMIT = 1e3;
function styleToObject(style) {
	if (styleCache.has(style)) return styleCache.get(style);
	const result = {};
	let start = 0;
	const len = style.length;
	while (start < len) {
		const semicolonIndex = style.indexOf(";", start);
		const end$1 = semicolonIndex === -1 ? len : semicolonIndex;
		const pair = style.slice(start, end$1).trim();
		if (pair) {
			const colonIndex = pair.indexOf(":");
			if (colonIndex > 0) {
				const rawProp = pair.slice(0, colonIndex).trim();
				const value = pair.slice(colonIndex + 1).trim();
				if (rawProp && value) {
					const prop = camelize(rawProp);
					result[prop.startsWith("webkit") ? capitalize(prop) : prop] = value;
				}
			}
		}
		start = end$1 + 1;
	}
	if (styleCache.size === STYLE_CACHE_LIMIT) {
		const oldestKey = styleCache.keys().next().value;
		if (oldestKey) styleCache.delete(oldestKey);
	}
	styleCache.set(style, result);
	return result;
}
function convert(createElement$1, element, extraProps = {}) {
	if (typeof element === "string") return element;
	const children = (element.children || []).map((child) => {
		return convert(createElement$1, child);
	});
	const elementAttributes = element.attributes || {};
	const attrs = {};
	for (const [key, val] of Object.entries(elementAttributes)) switch (true) {
		case key === "class":
			attrs.className = val;
			break;
		case key === "style":
			attrs.style = styleToObject(String(val));
			break;
		case key.startsWith("aria-"):
		case key.startsWith("data-"):
			attrs[key.toLowerCase()] = val;
			break;
		default: attrs[camelize(key)] = val;
	}
	const { style: existingStyle, "aria-label": ariaLabel,...remaining } = extraProps;
	if (existingStyle) attrs.style = attrs.style ? {
		...attrs.style,
		...existingStyle
	} : existingStyle;
	if (ariaLabel) {
		attrs["aria-label"] = ariaLabel;
		attrs["aria-hidden"] = "false";
	}
	return createElement$1(element.tag, {
		...remaining,
		...attrs
	}, ...children);
}
var makeReactConverter = convert.bind(null, import_react.createElement);
var useAccessibilityId = (id, hasAccessibleProps) => {
	const generatedId = (0, import_react.useId)();
	return id || (hasAccessibleProps ? generatedId : void 0);
};
var Logger = class {
	constructor(scope = "react-fontawesome") {
		this.enabled = false;
		let IS_DEV = false;
		try {
			IS_DEV = typeof process !== "undefined" && true;
		} catch {}
		this.scope = scope;
		this.enabled = IS_DEV;
	}
	/**
	* Logs messages to the console if not in production.
	* @param args - The message and/or data to log.
	*/
	log(...args) {
		if (!this.enabled) return;
		console.log(`[${this.scope}]`, ...args);
	}
	/**
	* Logs warnings to the console if not in production.
	* @param args - The warning message and/or data to log.
	*/
	warn(...args) {
		if (!this.enabled) return;
		console.warn(`[${this.scope}]`, ...args);
	}
	/**
	* Logs errors to the console if not in production.
	* @param args - The error message and/or data to log.
	*/
	error(...args) {
		if (!this.enabled) return;
		console.error(`[${this.scope}]`, ...args);
	}
};
typeof process !== "undefined" && process.env.FA_VERSION;
var SVG_CORE_VERSION = "searchPseudoElementsFullScan" in config$1 ? "7.0.0" : "6.0.0";
var IS_VERSION_7_OR_LATER = Number.parseInt(SVG_CORE_VERSION) >= 7;
var DEFAULT_CLASSNAME_PREFIX = "fa";
var ANIMATION_CLASSES = {
	beat: "fa-beat",
	fade: "fa-fade",
	beatFade: "fa-beat-fade",
	bounce: "fa-bounce",
	shake: "fa-shake",
	spin: "fa-spin",
	spinPulse: "fa-spin-pulse",
	spinReverse: "fa-spin-reverse",
	pulse: "fa-pulse"
};
var PULL_CLASSES = {
	left: "fa-pull-left",
	right: "fa-pull-right"
};
var ROTATE_CLASSES = {
	"90": "fa-rotate-90",
	"180": "fa-rotate-180",
	"270": "fa-rotate-270"
};
var SIZE_CLASSES = {
	"2xs": "fa-2xs",
	xs: "fa-xs",
	sm: "fa-sm",
	lg: "fa-lg",
	xl: "fa-xl",
	"2xl": "fa-2xl",
	"1x": "fa-1x",
	"2x": "fa-2x",
	"3x": "fa-3x",
	"4x": "fa-4x",
	"5x": "fa-5x",
	"6x": "fa-6x",
	"7x": "fa-7x",
	"8x": "fa-8x",
	"9x": "fa-9x",
	"10x": "fa-10x"
};
var STYLE_CLASSES = {
	border: "fa-border",
	fixedWidth: "fa-fw",
	flip: "fa-flip",
	flipHorizontal: "fa-flip-horizontal",
	flipVertical: "fa-flip-vertical",
	inverse: "fa-inverse",
	rotateBy: "fa-rotate-by",
	swapOpacity: "fa-swap-opacity",
	widthAuto: "fa-width-auto"
};
var LAYER_CLASSES = { default: "fa-layers" };
function withPrefix(cls) {
	const prefix = config$1.cssPrefix || config$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX;
	return prefix === DEFAULT_CLASSNAME_PREFIX ? cls : cls.replace(new RegExp(`(?<=^|\\s)${DEFAULT_CLASSNAME_PREFIX}-`, "g"), `${prefix}-`);
}
function getClassListFromProps(props) {
	const { beat, fade, beatFade, bounce, shake, spin, spinPulse, spinReverse, pulse, fixedWidth, inverse, border, flip, size, rotation, pull, swapOpacity, rotateBy, widthAuto, className } = props;
	const result = [];
	if (className) result.push(...className.split(" "));
	if (beat) result.push(ANIMATION_CLASSES.beat);
	if (fade) result.push(ANIMATION_CLASSES.fade);
	if (beatFade) result.push(ANIMATION_CLASSES.beatFade);
	if (bounce) result.push(ANIMATION_CLASSES.bounce);
	if (shake) result.push(ANIMATION_CLASSES.shake);
	if (spin) result.push(ANIMATION_CLASSES.spin);
	if (spinReverse) result.push(ANIMATION_CLASSES.spinReverse);
	if (spinPulse) result.push(ANIMATION_CLASSES.spinPulse);
	if (pulse) result.push(ANIMATION_CLASSES.pulse);
	if (fixedWidth) result.push(STYLE_CLASSES.fixedWidth);
	if (inverse) result.push(STYLE_CLASSES.inverse);
	if (border) result.push(STYLE_CLASSES.border);
	if (flip === true) result.push(STYLE_CLASSES.flip);
	if (flip === "horizontal" || flip === "both") result.push(STYLE_CLASSES.flipHorizontal);
	if (flip === "vertical" || flip === "both") result.push(STYLE_CLASSES.flipVertical);
	if (size !== void 0 && size !== null) result.push(SIZE_CLASSES[size]);
	if (rotation !== void 0 && rotation !== null && rotation !== 0) result.push(ROTATE_CLASSES[rotation]);
	if (pull !== void 0 && pull !== null) result.push(PULL_CLASSES[pull]);
	if (swapOpacity) result.push(STYLE_CLASSES.swapOpacity);
	if (!IS_VERSION_7_OR_LATER) return result;
	if (rotateBy) result.push(STYLE_CLASSES.rotateBy);
	if (widthAuto) result.push(STYLE_CLASSES.widthAuto);
	return (config$1.cssPrefix || config$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX) === DEFAULT_CLASSNAME_PREFIX ? result : result.map(withPrefix);
}
var isIconDefinition = (icon$1) => typeof icon$1 === "object" && "icon" in icon$1 && !!icon$1.icon;
function normalizeIconArgs(icon$1) {
	if (!icon$1) return;
	if (isIconDefinition(icon$1)) return icon$1;
	return parse$1.icon(icon$1);
}
function typedObjectKeys(obj) {
	return Object.keys(obj);
}
var logger = new Logger("FontAwesomeIcon");
var DEFAULT_PROPS = {
	border: false,
	className: "",
	mask: void 0,
	maskId: void 0,
	fixedWidth: false,
	inverse: false,
	flip: false,
	icon: void 0,
	listItem: false,
	pull: void 0,
	pulse: false,
	rotation: void 0,
	rotateBy: false,
	size: void 0,
	spin: false,
	spinPulse: false,
	spinReverse: false,
	beat: false,
	fade: false,
	beatFade: false,
	bounce: false,
	shake: false,
	symbol: false,
	title: "",
	titleId: void 0,
	transform: void 0,
	swapOpacity: false,
	widthAuto: false
};
var DEFAULT_PROP_KEYS = new Set(Object.keys(DEFAULT_PROPS));
var FontAwesomeIcon = import_react.forwardRef((props, ref) => {
	const allProps = {
		...DEFAULT_PROPS,
		...props
	};
	const { icon: iconArgs, mask: maskArgs, symbol, title, titleId: titleIdFromProps, maskId: maskIdFromProps, transform } = allProps;
	const maskId = useAccessibilityId(maskIdFromProps, Boolean(maskArgs));
	const titleId = useAccessibilityId(titleIdFromProps, Boolean(title));
	const iconLookup = normalizeIconArgs(iconArgs);
	if (!iconLookup) {
		logger.error("Icon lookup is undefined", iconArgs);
		return null;
	}
	const classList = getClassListFromProps(allProps);
	const transformProps = typeof transform === "string" ? parse$1.transform(transform) : transform;
	const normalizedMaskArgs = normalizeIconArgs(maskArgs);
	const renderedIcon = icon(iconLookup, {
		...classList.length > 0 && { classes: classList },
		...transformProps && { transform: transformProps },
		...normalizedMaskArgs && { mask: normalizedMaskArgs },
		symbol,
		title,
		titleId,
		maskId
	});
	if (!renderedIcon) {
		logger.error("Could not find icon", iconLookup);
		return null;
	}
	const { abstract } = renderedIcon;
	const extraProps = { ref };
	for (const key of typedObjectKeys(allProps)) {
		if (DEFAULT_PROP_KEYS.has(key)) continue;
		extraProps[key] = allProps[key];
	}
	return makeReactConverter(abstract[0], extraProps);
});
FontAwesomeIcon.displayName = "FontAwesomeIcon";
var DEFAULT_CLASSNAMES = `${LAYER_CLASSES.default} ${STYLE_CLASSES.fixedWidth}`;
var FontAwesomeLayers = ({ children, className, size,...attributes }) => {
	const prefixedDefaultClasses = withPrefix(DEFAULT_CLASSNAMES);
	const classes = className ? `${prefixedDefaultClasses} ${className}` : prefixedDefaultClasses;
	const element = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		...attributes,
		className: classes,
		children
	});
	if (size) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: withPrefix(`fa-${size}`),
		children: element
	});
	return element;
};
var LayersText = ({ text: text$1, className, inverse, transform, style,...attributes }) => {
	const textAbstractElement = (0, import_react.useMemo)(() => {
		return text(text$1, {
			classes: [...className?.split(" ") || [], ...inverse ? [STYLE_CLASSES.inverse] : []],
			transform: typeof transform === "string" ? parse$1.transform(transform) : transform
		}).abstract[0];
	}, [
		text$1,
		transform,
		className,
		inverse
	]);
	return makeReactConverter(textAbstractElement, {
		...attributes,
		style
	});
};
var LayersCounter = ({ count, className, style,...attributes }) => {
	const counterAbstractElement = (0, import_react.useMemo)(() => counter(count, { classes: className?.split(" ") }).abstract[0], [count, className]);
	return makeReactConverter(counterAbstractElement, {
		...attributes,
		style
	});
};

//#endregion
export { FontAwesomeIcon, FontAwesomeLayers, LayersCounter, LayersText };
//# sourceMappingURL=@fortawesome_react-fontawesome.js.map