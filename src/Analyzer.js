import props from './data/cssPropertyList';
import vals from './data/cssValueList';

const Analyzer = {
    data: '',

    findProp: function findProp(prop) {
        const result = [];

        for (let p of props) {
            if (p === prop) {
                return [p]; // if an exact match return it
            }
            if (p.includes(prop)) {
                result.push(p); // if not find partly matching
            }
        }

        return result.length === 0 ? false : result;
    },
    skipStaticValues: function skipStaticValues(val) {
        const regexpColor = /^#[a-f0-9]{3}([a-f0-9]{3})?$/; // color
        const cssColors = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];
        const regexpRGBA = /^rgb(a?)([^)]+\))$/; // 4px 2px 3px 5px rgba(0, 0, 0, 0.5)
        const regexpValueUnit = /^[0-9.]+(px|%)?(\s[0-9.]+(px|%)?)?(\s[0-9.]+(px|%)?)?(\s[0-9.]+(px|%)?)?(\srgb(a?)([^)]+\)))?$/; // 4px 2px 3px 5px rgba(0, 0, 0, 0.5) @TODO needs refactor
        const regexpURL = /^url\((['"])[^'"]+(['"])\)$/;
        const regexpString = /^(['"])[^'"]+(['"])$/;
        if (regexpColor.test(val)) return true;
        if (cssColors.indexOf(val.toLowerCase()) !== -1) return true;
        if (regexpRGBA.test(val)) return true;
        if (regexpURL.test(val)) return true;
        if (regexpString.test(val)) return true;
        return regexpValueUnit.test(val);
    },
    findVal: function findVal(val) {
        if (this.skipStaticValues(val)) {
            return false;
        }

        const result = [];

        const regexp = /[a-z][a-z -]*/ig;
        const valuesFiltered = val.match(regexp).filter((v, i, a) => a.indexOf(v) === i);

        for (let v of vals) {
            for (let f of valuesFiltered) {
                if (f === v) {
                    return [v]; // if an exact match return it
                }
                if (new RegExp(`^${f}`).test(v)) {
                    result.push(v); // if not find partly matching
                }
            }
        }

        return result.length === 0 ? false : result;
    },
};

export default Analyzer;
