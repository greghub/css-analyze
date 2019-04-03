import cssPropertyList from './data/cssPropertyList';

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
            const e = new RegExp(/([a-z-]+):([^;]+);/, 'gi');
            const props = [...result.matchAll(e)];
            const res = [];

            for (let i = 0; i < props.length; i++) {
                if (cssPropertyList.indexOf(props[i][1]) === -1) {
                    this.unknownProperties.push(props[i][1]);
                } else {
                    res.push({
                        p: props[i][1],
                        v: props[i][2].trim()
                    });
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
