let Parser = {
    css: '',

    setCSS: function setCSS(css) {
        this.css = css;
        return this;
    },

    getCSS: function getCSS() {
        return this.css;
    },

    parseCSS: function parseCSS () {
        const exp = new RegExp(/{[^}]*}/, 'g'); // gs
        const results = this.css.match(exp);
        const properties = [];

        results.forEach((result) => {
            const e = new RegExp(/([a-z-]+):/, 'gi');
            properties.push(result.match(e).map(item => item.replace(':', '')));
        });

        return properties;
    }
};

export default Parser;
