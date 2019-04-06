import data from '../caniuse-data'
import props from './data/cssPropertyList';
import vals from './data/cssValueList';
import cssColors from './data/cssColors';
import Parser from "./Parser";

const Analyzer = {
    data,
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
        const regexpRGBA = /^(rgb(a)?\([0-9,. ]+\))$/; // rgba(0, 0, 0, 0.5)
        const regexpValueUnit = /^([0-9. ]+(px|%)?){1,4}\s?(rgb(a)?\([0-9,. ]+\))?$/; // 4px 2px 3px 5px rgba(0, 0, 0, 0.5)
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
    getPropsAndValues: function getPropsAndValues(css) {
        const parser = Object.create(Parser);
        parser.setCSS(css);
        const results = parser.parseCSS();

        const occurrences = [];

        results.forEach((sets) => {
            sets.forEach((set) => {
                const occurrence = {};
                if (Analyzer.findProp(set.p)) {
                    occurrence.p = Analyzer.findProp(set.p);
                }
                if (Analyzer.findVal(set.v)) {
                    occurrence.v = Analyzer.findVal(set.v);
                }

                // if occurrence has either a property or a value i.e not empty
                if (Object.getOwnPropertyNames(occurrence).length !== 0) {
                    occurrences.push(occurrence)
                }
            })
        });

        return occurrences;
    }
};

export default Analyzer;
