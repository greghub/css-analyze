import data from '../caniuse-data';
import props from './data/cssPropertyList';
import vals from './data/cssValueList';
import cssColors from './data/cssColors';
import Parser from './Parser';
import propertyData from './data/propertyData';
import valueData from './data/valueData';

const Analyzer = {
    data,
    findProp: function findProp(prop) {
        const result = [];

        for (let i = 0; i < props.length; i++) {
            if (props[i] === prop) {
                return [props[i]]; // if an exact match return it
            }
            if (props[i].includes(prop)) {
                result.push(props[i]); // if not find partly matching
            }
        }

        return result;
    },
    skipStaticValues: function skipStaticValues(val) {
        const regexpColor = /^#[a-f0-9]{3}([a-f0-9]{3})?$/; // color
        const regexpRGBA = /^(rgb(a)?\([0-9,. ]+\))$/; // rgba(0, 0, 0, 0.5)
        const regexpValueUnit = /^([0-9. ]+(px|%)?){1,4}\s?(rgb(a)?\([0-9,. ]+\))?$/; // 4px 2px 3 5 rgba(0, 0, 0, 0.5)
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

        for (let i = 0; i < vals.length; i++) {
            for (let j = 0; j < valuesFiltered.length; j++) {
                if (valuesFiltered[j] === vals[i]) {
                    return [vals[i]]; // if an exact match return it
                }
                if (new RegExp(`^${valuesFiltered[j]}`).test(vals[i])) {
                    result.push(vals[i]); // if not find partly matching
                }
            }
        }

        return result;
    },
    getPropsAndValues: function getPropsAndValues(css) {
        const parser = Object.create(Parser);
        parser.setCSS(css);
        const results = parser.parseCSS();

        const occurrences = [];

        results.forEach((sets) => {
            sets.forEach((set) => {
                const occurrence = {};
                if (Analyzer.findProp(set.p).length) {
                    occurrence.p = Analyzer.findProp(set.p);
                }
                if (Analyzer.findVal(set.v).length) {
                    occurrence.v = Analyzer.findVal(set.v);
                }

                // if occurrence has either a property or a value i.e not empty
                if (Object.getOwnPropertyNames(occurrence).length !== 0) {
                    occurrences.push(occurrence);
                }
            });
        });

        return occurrences;
    },
    getUsageData: function getUsageData(css) {
        const valsAndProps = this.getPropsAndValues(css);
        const result = [];

        valsAndProps.forEach((item) => {
            const d = {};

            if (typeof item.p !== 'undefined') {
                d[item.p] = item.p.map((p) => {
                    const key = Object.keys(propertyData).find(k => k === p);
                    return propertyData[key];
                });
            }
            if (typeof item.v !== 'undefined') {
                d[item.v] = item.v.map((v) => {
                    const key = Object.keys(valueData).find(k => k === v);
                    return valueData[key];
                });
            }

            result.push(d);
        });

        return result;
    }
};

export default Analyzer;
