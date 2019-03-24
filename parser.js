const Parser = {
    css: ``,
    parseCSS: function () {
        const exp = new RegExp(/{[^}]*}/, 'gs');
        const results = this.css.match(exp);
        const properties = [];

        results.forEach(result => {
            const e = new RegExp(/([a-z-]+):/, 'gi');
            properties.push(result.match(e).map(item => item.replace(':', '')));
        });

        return properties;
    }
};

window.Parser = Parser;
