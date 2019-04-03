import props from './data/cssPropertyList';
import vals from './data/cssValueList';

const Analyzer = {
    data: '',

    findProp: function findProp(prop) {
        for (let p of props) {
            if (p.includes(prop)) {
                return true;
            }
        }

        return false;
    },
    findVal: function findVal(val) {
        for (let v of vals) {
            if (val.includes(v)) {
                return true;
            }
        }

        return false;
    },
};

export default Analyzer;
