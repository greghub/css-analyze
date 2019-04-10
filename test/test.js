/* eslint-disable no-undef,max-len */
import Parser from '../src/Parser';
import ExternalCssGetter from '../src/ExternalCssGetter';
import Analyzer from '../src/Analyzer';
import cssTest from './css_test';

const assert = require('assert');

describe('Parsing CSS', () => {
    it('can set and CSS', () => {
        Parser.setCSS('body');
        assert.equal(Parser.getCSS(), 'body');
    });

    it('can parse CSS', () => {
        Parser.setCSS(cssTest);
        assert.deepEqual(Parser.parseCSS(), [
            [
                {
                    p: 'background-image',
                    v: 'linear-gradient(-128deg, rgba(255, 181, 32, 0.93) 3%, rgba(239, 39, 153, 0.93) 88%, rgba(237, 18, 171, 0.93) 100%)'
                },
                {
                    p: 'display',
                    v: 'flex'
                },
                {
                    p: 'width',
                    v: '100%'
                },
                {
                    p: 'height',
                    v: '100%'
                },
                {
                    p: 'justify-content',
                    v: 'center'
                },
                {
                    p: 'align-items',
                    v: 'center'
                }
            ],
            [
                {
                    p: 'transition',
                    v: 'all 0.3s ease'
                },
                {
                    p: 'background-color',
                    v: '#FFC145'
                },
                {
                    p: 'height',
                    v: '144px'
                },
                {
                    p: 'width',
                    v: '144px'
                },
                {
                    p: 'border-radius',
                    v: '72px'
                },
                {
                    p: 'box-shadow',
                    v: '0 4px 16px 0 rgba(0, 0, 0, 0.07)'
                },
                {
                    p: 'cursor',
                    v: 'pointer'
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
            ]));
    });
});

describe('Analyze CSS', () => {
    it('can find property in the properties list: background', () => {
        assert.notDeepEqual([], Analyzer.findProp('background'));
    });
    it('cannot find property in the properties list: --bg-color', () => {
        assert.deepEqual([], Analyzer.findProp('--bg-color'));
    });
    it('cannot find property in the properties list: width', () => {
        assert.deepEqual(['width'], Analyzer.findProp('width'));
    });
    it('can find value in the values list: scale', () => {
        assert.notDeepEqual([], Analyzer.findVal('scale(1.2)'));
    });
    it('cannot find value in the values list: #fa55cd', () => {
        assert.equal(true, Analyzer.skipStaticValues('#fa55cd'));
    });
    it('cannot find value in the values list: #fff', () => {
        assert.equal(true, Analyzer.skipStaticValues('#fff'));
    });
    it('cannot find value in the values list: red', () => {
        assert.equal(true, Analyzer.skipStaticValues('red'));
    });
    it('cannot find value in the values list: 12px 0px 0 8px', () => {
        assert.equal(true, Analyzer.skipStaticValues('12px 0px 0 8px'));
    });
    it('cannot find value in the values list: 4px 2px 3px 5px rgba(0, 0, 0, 0.5)', () => {
        assert.equal(true, Analyzer.skipStaticValues('4px 2px 3px 5px rgba(0, 0, 0, 0.5)'));
    });
    it('cannot find value in the values list: rgba(255, 255, 255, 0.7)', () => {
        assert.equal(true, Analyzer.skipStaticValues('rgba(255, 255, 255, 0.7)'));
    });
    it('cannot find value in the values list: 45deg', () => {
        assert.equal(false, Analyzer.skipStaticValues('45deg')); // false
    });
    it('cannot find value in the values list: 1.5', () => {
        assert.equal(true, Analyzer.skipStaticValues('1.5'));
    });
    it('cannot find value in the values list: 2rem', () => {
        assert.equal(false, Analyzer.skipStaticValues('2rem')); // false
    });
    it('cannot find value in the values list: 100%', () => {
        assert.equal(true, Analyzer.skipStaticValues('100%'));
    });
    it('cannot find value in the values list: url(\'https://adonisjs.com/docs/4.1/installation.jpg\')', () => {
        assert.equal(true, Analyzer.skipStaticValues('url(\'https://adonisjs.com/docs/4.1/installation.jpg\')'));
    });
    it('cannot find value in the values list: url("https://adonisjs.com/docs/4.1/installation.jpg")', () => {
        assert.equal(true, Analyzer.skipStaticValues('url("https://adonisjs.com/docs/4.1/installation.jpg")'));
    });
    it('cannot find value in the values list: "content"', () => {
        assert.equal(true, Analyzer.skipStaticValues('"content"'));
    });
    it('can find value in the values list: gradient', () => {
        assert.deepEqual(['deg'], Analyzer.findVal('linear-gradient(-128deg, rgba(255, 181, 32, 0.93) 3%, rgba(239, 39, 153, 0.93) 88%, rgba(237, 18, 171, 0.93) 100%);'));
    });
    it('can find value in the values list: gradient', () => {
        assert.deepEqual(['flex'], Analyzer.findVal('flex'));
    });
    it('can get data', () => {
        assert.deepEqual([{ p: ['background-image'], v: ['deg'] },
            { p: ['display'], v: ['flex'] },
            { p: ['width'] },
            { p: ['height'] },
            { p: ['justify-content'], v: ['center'] },
            { p: ['align-items'], v: ['center'] },
            { p: ['transition'] },
            { p: ['background-color'] },
            { p: ['height'] },
            { p: ['width'] },
            { p: ['border-radius'] },
            { p: ['box-shadow'] },
            { p: ['cursor'], v: ['pointer'] }], Analyzer.getPropsAndValues(cssTest));
    });
    it('can get usage data', () => {
        assert.deepEqual({
            'background-image': [
                'background-img-opts,object-fit'
            ],
            deg: [
                'css-image-orientation'
            ]
        }, Analyzer.getUsageData(cssTest)[0]);
    });
});
