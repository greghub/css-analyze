/* eslint-disable no-undef */
import Parser from '../src/Parser';
import css_test from './css_test'

const assert = require('assert');

describe('Parsing CSS', () => {
    const parser = new Parser();

    it('can set and CSS', () => {
        parser.setCSS('body');
        assert.equal(parser.getCSS(), 'body');
    });

    it('can parse CSS', () => {
        parser.setCSS(css_test);
        assert.deepEqual(parser.parseCSS(), [
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
});
