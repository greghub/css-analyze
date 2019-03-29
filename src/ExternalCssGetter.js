import axios from 'axios';

const ExternalCssGetter = {
    getURLs: function getURLs(urls) {
        if (typeof urls === 'string') {
            urls = [].concat(urls);
        }

        return urls;
    },

    getCssFiles: async function getCssFiles(urls) {
        urls = this.getURLs(urls);
        const requests = [];
        let result = '';

        urls.forEach((url) => {
            requests.push(axios.get(url))
        });

        const responses = await Promise.all(requests);

        responses.forEach((response) => {
            result += response.data;
        });

        return result;
    }
};

export default ExternalCssGetter;
