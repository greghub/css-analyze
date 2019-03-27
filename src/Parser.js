import cssPropertyList from './cssPropertyList';

const Parser = {
    css: '',
    unknownProperties: [],

    setCSS: function setCSS(css) {
        this.css = css;
        return this;
    },

    getCSS: function getCSS() {
        return this.css;
    },

    parseCSS: function parseCSS() {
        const exp = new RegExp(/{[^}]*}/, 'g'); // gs
        const results = this.css.match(exp);
        const properties = [];

        results.forEach((result) => {
            const e = new RegExp(/([a-z-]+):/, 'gi');
            const props = result.match(e).map(item => item.replace(':', ''));
            const res = [];

            for (let i = 0; i < props.length; i++) {
                if (cssPropertyList.indexOf(props[i]) === -1) {
                    this.unknownProperties.push(props[i]);
                } else {
                    res.push(props[i]);
                }
            }

            properties.push(res);
        });

        return properties;
    },

    getUnknownProperties: function getUnknownProperties() {
        return this.unknownProperties;
    }
};

export default Parser;
