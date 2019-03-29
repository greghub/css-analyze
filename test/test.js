/* eslint-disable no-undef */
import Parser from '../src/Parser';
import ExternalCssGetter from '../src/ExternalCssGetter';
import css_test from './css_test'

const assert = require('assert');

describe('Parsing CSS', () => {
    it('can set and CSS', () => {
        Parser.setCSS('body');
        assert.equal(Parser.getCSS(), 'body');
    });

    it('can parse CSS', () => {
        Parser.setCSS(css_test);
        assert.deepEqual(Parser.parseCSS(), [
            [
                'background-image',
                'display',
                'width',
                'height',
                'justify-content',
                'align-items'
            ],
            [
                'transition',
                'background-color',
                'height',
                'width',
                'border-radius',
                'box-shadow',
                'cursor'
            ]
        ]);
    });

    it('can get unknown properties', () => {
        assert.deepEqual(Parser.getUnknownProperties(), ['unknown-property']);
    });
});

describe('Can get external CSS', () => {
    it('can get one CSS file URL', () => {
        assert.deepEqual(
            ExternalCssGetter.getURLs('https://codepen.io/gregh/pen/xqWwqz.css'),
            ['https://codepen.io/gregh/pen/xqWwqz.css']
        );
    });

    it('can get multiple CSS files URLs', () => {
        assert.deepEqual(
            ExternalCssGetter.getURLs(['https://codepen.io/gregh/pen/xqWwqz.css', 'https://codepen.io/gregh/pen/rjbmXb.css']),
            ['https://codepen.io/gregh/pen/xqWwqz.css', 'https://codepen.io/gregh/pen/rjbmXb.css']
        );
    });

    it('can get one CSS file', async () => {
        assert.equal('body { }', await ExternalCssGetter.getCssFiles('https://gist.githubusercontent.com/greghub/d7d241c3ec26a8cc1642dd125f6149f4/raw/4153119209e7353b5d6b565e497d155434c097be/css_analyzer_test_1'));
    });

    it('can get CSS files', async () => {
        assert.equal('body { }.flex { display: flex; }',
            await ExternalCssGetter.getCssFiles([
                'https://gist.githubusercontent.com/greghub/d7d241c3ec26a8cc1642dd125f6149f4/raw/4153119209e7353b5d6b565e497d155434c097be/css_analyzer_test_1',
                'https://gist.githubusercontent.com/greghub/e30d96ff0132dd1daedbf7ed45329877/raw/7bf224c6681de162e9e66591c8f3b6b4ec802ca7/css_analyzer_test_2'
            ])
        );
    });
});
