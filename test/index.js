/* global describe, it */

var nomralize = require('../');
require('should');

describe('BEMobject.expand', function () {
    it('should throw expection on empty object', function () {
        (function () {
            nomralize({});
        }).should.throw();
    });

    it('should properly handle string', function () {
        nomralize('block').should.eql([{
            block: 'block'
        }]);

        nomralize('block__elem').should.eql([{
            block: 'block',
            elem: 'elem'
        }]);

        nomralize('block__elem_mod').should.eql([{
            block: 'block',
            elem: 'elem',
            mod: 'mod'
        }]);

        nomralize('block__elem_mod_val').should.eql([{
            block: 'block',
            elem: 'elem',
            mod: 'mod',
            value: 'val'
        }]);

        nomralize('block_mod').should.eql([{
            block: 'block',
            mod: 'mod',
        }]);
        nomralize('block_mod_val').should.eql([{
            block: 'block',
            mod: 'mod',
            value: 'val'
        }]);
    });

    it('should properly handle single elem', function () {
        nomralize({ elem: 'singleElem' }).should.eql([{
            elem: 'singleElem'
        }]);
    });

    it('should properly handle multiple elements', function () {
        nomralize({ elems: ['row', 'cell'] }).should.eql([
            { elem: 'row' },
            { elem: 'cell' }
        ]);
    });

    it('should properly handle multiple elements with block', function () {
        nomralize({ block: 'b', elems: ['row', 'cell'] }).should.eql([
            { block: 'b', elem: 'row' },
            { block: 'b', elem: 'cell' }
        ]);
    });

    it('should properly handle single mod with value', function () {
        nomralize({ mod: 'color', value: 'white' }).should.eql([{
            mod: 'color', value: 'white'
        }]);
    });

    it('should properly handle multiple mods with single values', function () {
        nomralize({ mods: { color: 'white', position: 'top' }}).should.eql([
            { mod: 'color', value: 'white' },
            { mod: 'position', value: 'top' }
        ]);
    });

    it('should properly handle multiple mods with single values', function () {
        nomralize({ block: 'b', elem: 'e', mods: { color: 'white', position: 'top' }}).should.eql([
            { block: 'b', elem: 'e', mod: 'color', value: 'white' },
            { block: 'b', elem: 'e',mod: 'position', value: 'top' }
        ]);
    });

    it('should properly handle multiple mods with multiple values', function () {
        nomralize({ mods: { color: 'white', position: ['top', 'bottom'] }}).should.eql([
            { mod: 'color', value: 'white' },
            { mod: 'position', value: 'top' },
            { mod: 'position', value: 'bottom' }
        ]);
    });

    it('should throw exception when both `elem` and `elems` defined (also `mod` and `mods`)', function () {
        (function() { nomralize({ elem: '', elems: [] }); }).should.throw();
        (function() { nomralize({ mod: '', mods: [] }); }).should.throw();
    });

});
