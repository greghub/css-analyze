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
                {
                    'p': 'background-image',
                    'v': 'linear-gradient(-128deg, rgba(255, 181, 32, 0.93) 3%, rgba(239, 39, 153, 0.93) 88%, rgba(237, 18, 171, 0.93) 100%)'
                },
                {
                    'p': 'display',
                    'v': 'flex'
                },
                {
                    'p': 'width',
                    'v': '100%'
                },
                {
                    'p': 'height',
                    'v': '100%'
                },
                {
                    'p': 'justify-content',
                    'v': 'center'
                },
                {
                    'p': 'align-items',
                    'v': 'center'
                }
            ],
            [
                {
                    'p': 'transition',
                    'v': 'all 0.3s ease'
                },
                {
                    'p': 'background-color',
                    'v': '#FFC145'
                },
                {
                    'p': 'height',
                    'v': '144px'
                },
                {
                    'p': 'width',
                    'v': '144px'
                },
                {
                    'p': 'border-radius',
                    'v': '72px'
                },
                {
                    'p': 'box-shadow',
                    'v': '0 4px 16px 0 rgba(0, 0, 0, 0.07)'
                },
                {
                    'p': 'cursor',
                    'v': 'pointer'
                }
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
