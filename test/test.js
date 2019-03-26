/* eslint-disable no-undef */
import Parser from '../src/Parser';
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
});
