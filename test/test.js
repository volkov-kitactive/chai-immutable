'use strict';

// From http://stackoverflow.com/a/728694
function clone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  const copy = obj.constructor();
  for (const attr in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, attr)) {
      copy[attr] = obj[attr];
    }
  }
  return copy;
}

// These can be global if they are coming from a browser environment, so `let`
// cannot be used here.
var chai; // eslint-disable-line no-var
var chaiImmutable; // eslint-disable-line no-var
var Immutable; // eslint-disable-line no-var

if (!chai) {
  chai = require('chai');
  chaiImmutable = require('../chai-immutable');
  Immutable = require('immutable');
  chai.use(chaiImmutable);
}

const clonedImmutable = clone(Immutable);

const assert = chai.assert;
const expect = chai.expect;
const List = Immutable.List;
const Map = Immutable.Map;
const Set = Immutable.Set;
const Stack = Immutable.Stack;

/*!
 * Test helper to check that a given function (wrapping the assertion) will
 * fail.
 */
function fail(fn, msg) {
  if (msg) {
    expect(fn).to.throw(chai.AssertionError, msg);
  } else {
    expect(fn).to.throw(chai.AssertionError);
  }
}

describe('chai-immutable', function () { // eslint-disable-line prefer-arrow-callback
  const list3 = List.of(1, 2, 3);
  const deepMap = new Map({ foo: 'bar', list: List.of(1, 2, 3) });
  const sameDeepMap = new Map({ foo: 'bar', list: List.of(1, 2, 3) });
  const differentDeepMap = new Map({ foo: 'bar', list: List.of(42) });
  const clonedImmutableList = clonedImmutable.List.of(1, 2, 3);

  describe('BDD interface', function () { // eslint-disable-line prefer-arrow-callback
    describe('empty property', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given an empty collection', function () { // eslint-disable-line prefer-arrow-callback
        expect(new List()).to.be.empty;
      });

      it('should pass using `not` given a non-empty collection', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.be.empty;
      });

      it('should not affect the original assertions', function () { // eslint-disable-line prefer-arrow-callback
        expect([]).to.be.empty;
        expect('').to.be.empty;
        expect({}).to.be.empty;
      });

      it('should fail given a non-empty collection', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.be.empty);
      });

      it('should fail using `not` given an empty collection', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(new List()).to.not.be.empty);
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        expect(new clonedImmutable.List()).to.be.empty;
      });
    });

    describe('equal method', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given equal values', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.equal(List.of(1, 2, 3));
      });

      it('should pass using `not` given different values', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.equal(new List());
      });

      it('aliases of equal should also work', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.equal(List.of(1, 2, 3));
        expect(list3).to.not.equal(new List());
        expect(list3).to.equals(List.of(1, 2, 3));
        expect(list3).to.not.equals(new List());
        expect(list3).to.eq(List.of(1, 2, 3));
        expect(list3).to.not.eq(new List());
        expect(list3).to.eql(List.of(1, 2, 3));
        expect(list3).to.eqls(List.of(1, 2, 3));
        expect(list3).to.not.eql(new List());
        expect(list3).to.not.eqls(new List());
        expect(list3).to.deep.equal(List.of(1, 2, 3));
        expect(list3).to.not.deep.equal(new List());
      });

      it('should not affect the original assertions', function () { // eslint-disable-line prefer-arrow-callback
        expect('hello').to.equal('hello');
        expect(42).to.equal(42);
        expect(1).to.not.equal(true);
        expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
        expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
      });

      it('should pass given deeply equal values', function () { // eslint-disable-line prefer-arrow-callback
        expect(deepMap).to.equal(sameDeepMap);
        expect(deepMap).to.equals(sameDeepMap);
        expect(deepMap).to.eq(sameDeepMap);
        expect(deepMap).to.eql(sameDeepMap);
        expect(deepMap).to.eqls(sameDeepMap);
        expect(deepMap).to.deep.equal(sameDeepMap);
      });

      it('should pass using `not` given deeply different values', function () { // eslint-disable-line prefer-arrow-callback
        expect(deepMap).to.not.equal(differentDeepMap);
        expect(deepMap).to.not.equals(differentDeepMap);
        expect(deepMap).to.not.eq(differentDeepMap);
        expect(deepMap).to.not.eql(differentDeepMap);
        expect(deepMap).to.not.eqls(differentDeepMap);
        expect(deepMap).to.not.deep.equal(differentDeepMap);
      });

      it('should pass using `not` given a non-Immutable value', function () { // eslint-disable-line prefer-arrow-callback
        expect([]).to.not.equal(new List());
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () { // eslint-disable-line prefer-arrow-callback
        const actual = new Map({ foo: 'foo foo foo foo foo foo foo foo' });
        const expected = new Map({ bar: 'bar bar bar bar bar bar bar bar' });
        // AssertionError: expected { Object (foo) } to equal { Object (bar) }
        // + expected - actual
        //
        //  {
        // -  "foo": "foo foo foo foo foo foo foo foo"
        // +  "bar": "bar bar bar bar bar bar bar bar"
        //  }
        fail(
          () => expect(actual).to.equal(expected),
          'expected { Object (foo) } to equal { Object (bar) }'
        );
      });

      it('should fail given a non-Immutable value', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect([]).to.equal(new List()));
      });

      it('should fail given different values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.equal(new List()));
      });

      it('should fail using `not` given equal values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.not.equal(List.of(1, 2, 3)));
      });

      it('should fail given deeply different values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(deepMap).to.equal(differentDeepMap));
        fail(() => expect(deepMap).to.equals(differentDeepMap));
        fail(() => expect(deepMap).to.eq(differentDeepMap));
        fail(() => expect(deepMap).to.eql(differentDeepMap));
        fail(() => expect(deepMap).to.eqls(differentDeepMap));
        fail(() => expect(deepMap).to.deep.equal(differentDeepMap));
      });

      it('should fail using `not` given deeply equal values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(deepMap).to.not.equal(sameDeepMap));
        fail(() => expect(deepMap).to.not.equals(sameDeepMap));
        fail(() => expect(deepMap).to.not.eq(sameDeepMap));
        fail(() => expect(deepMap).to.not.eql(sameDeepMap));
        fail(() => expect(deepMap).to.not.eqls(sameDeepMap));
        fail(() => expect(deepMap).to.not.deep.equal(sameDeepMap));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        expect(clonedImmutableList).to.equal(List.of(1, 2, 3));
      });
    });

    describe('include method', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given an existing value', function () { // eslint-disable-line prefer-arrow-callback
        expect(new List([1, 2, 3])).to.include(2);
      });

      it('should pass using `not` given an inexisting value', function () { // eslint-disable-line prefer-arrow-callback
        expect(new List([1, 2, 3])).to.not.include(42);
      });

      it('should chain and pass given an existing key', function () { // eslint-disable-line prefer-arrow-callback
        expect(new Map({ foo: 'bar', hello: 'world' })).to.include.keys('foo');
      });

      it('should chain and pass using `not` given an inexisting key', function () { // eslint-disable-line prefer-arrow-callback
        expect(new Map({ foo: 'bar', hello: 'world' }))
          .to.not.include.keys('not-foo');
      });

      it('aliases of include should also work', function () { // eslint-disable-line prefer-arrow-callback
        expect(new List([1, 2, 3])).contain(2);
        expect(new List([1, 2, 3])).not.contain(42);
        expect(new List([1, 2, 3])).contains(2);
        expect(new List([1, 2, 3])).not.contains(42);
        expect(new List([1, 2, 3])).includes(2);
        expect(new List([1, 2, 3])).not.includes(42);
      });

      it('should not affect the original assertions', function () { // eslint-disable-line prefer-arrow-callback
        expect([1, 2, 3]).to.include(2);
        expect('foobar').to.contain('foo');
        expect({ foo: 'bar', hello: 'world' }).to.include.keys('foo');
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () { // eslint-disable-line prefer-arrow-callback
        const lengthyMap = new Map({ foo: 'foo foo foo foo foo foo foo foo ' });
        fail(
          () => expect(lengthyMap).to.include('not-foo'),
          /(foo ){8}/
        );
      });

      it('should fail given an inexisting value', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(new List([1, 2, 3])).to.include(42));
      });

      it('should fail using `not` given an existing value', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(new List([1, 2, 3])).not.to.include(2));
      });

      it('should chain and fail given an inexisting key', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(new Map({ foo: 'bar', hello: 'world' }))
          .to.include.keys('not-foo'));
      });

      it('should chain and fail using `not` given an existing key', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(new Map({ foo: 'bar', hello: 'world' }))
          .to.not.include.keys('foo'));
      });
    });

    describe('keys method', function () { // eslint-disable-line prefer-arrow-callback
      const obj = { x: 1, y: 2 };
      const map = new Map(obj);

      it('should pass given an existing key', function () { // eslint-disable-line prefer-arrow-callback
        expect(new Map({ x: 1 })).to.have.key('x');
        expect({ x: 1 }).to.have.key('x');
      });

      it('should pass using `not` given an inexisting key', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.not.have.key('z');
        expect(obj).to.not.have.key('z');
      });

      it('should pass given multiple existing keys', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.keys('x', 'y');
        expect(obj).to.have.keys('x', 'y');
      });

      it('should pass using `not` given multiple inexisting keys', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.not.have.keys('z1', 'z2');
        expect(obj).to.not.have.keys('z1', 'z2');
      });

      it('should accept an Array of keys to check against', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.keys(['x', 'y']);
        expect(obj).to.have.keys(['x', 'y']);
      });

      it('should accept a List of keys to check against', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.keys(new List(['x', 'y']));
      });

      it('should accept a Set of keys to check against', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.keys(new Set(['x', 'y']));
      });

      it('should accept a Stack of keys to check against', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.keys(new Stack(['x', 'y']));
      });

      it('should accept an Object to check against', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.keys({ x: 6, y: 7 });
        expect(obj).to.have.keys({ x: 6, y: 7 });
      });

      it('should accept a Map to check against', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.keys(new Map({ x: 6, y: 7 }));
      });

      it('should pass using `any` given an existing key', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.any.keys('x', 'z');
        expect(obj).to.have.any.keys('x', 'z');
      });

      it('should pass using `not` and `any` given inexisting keys', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.not.have.any.keys('z1', 'z2');
        expect(obj).to.not.have.any.keys('z1', 'z2');
      });

      it('should pass using `all` given existing keys', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.have.all.keys('x', 'y');
        expect(obj).to.have.all.keys('x', 'y');
      });

      it('should pass using `not` and `all` given inexisting keys', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.not.have.all.keys('z1', 'y');
        expect(obj).to.not.have.all.keys('z1', 'y');
      });

      it('should pass using `contain` given an existing key', function () { // eslint-disable-line prefer-arrow-callback
        expect(map).to.contain.key('x');
        expect(obj).to.contain.key('x');
      });

      it('should not affect the original assertions', function () { // eslint-disable-line prefer-arrow-callback
        expect({ x: 1, y: 2 }).to.have.any.keys('x', 'z');
        expect({ x: 1, y: 2 }).to.have.any.keys('x');
        expect({ x: 1, y: 2 }).to.contain.any.keys('y', 'z');
        expect({ x: 1, y: 2 }).to.contain.any.keys(['x']);
        expect({ x: 1, y: 2 }).to.contain.any.keys({ x: 6 });
        expect({ x: 1, y: 2 }).to.have.all.keys(['x', 'y']);
        expect({ x: 1, y: 2 }).to.have.all.keys({ x: 6, y: 7 });
        expect({ x: 1, y: 2, z: 3 }).to.contain.all.keys(['x', 'y']);
        expect({ x: 1, y: 2, z: 3 }).to.contain.all.keys({ x: 6 });
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () { // eslint-disable-line prefer-arrow-callback
        const lengthyMap = new Map({ foo: 'foo foo foo foo foo foo foo foo ' });
        fail(
          () => expect(lengthyMap).to.have.keys('not-foo'),
          /(foo ){8}/
        );
      });

      it('should fail given an inexisting key', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(new Map({ x: 1 })).to.have.key('z'));
        fail(() => expect({ x: 1 }).to.have.key('z'));
      });

      it('should fail given multiple inexisting keys', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(map).to.have.keys('z1', 'z2'));
        fail(() => expect(obj).to.have.keys('z1', 'z2'));
      });

      it('should fail using `not` given multiple existing keys', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(map).to.not.have.keys('x', 'y'));
        fail(() => expect(obj).to.not.have.keys('x', 'y'));
      });

      it('should fail using `any` given inexisting keys', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(map).to.have.any.keys('z1', 'z2'));
        fail(() => expect(obj).to.have.any.keys('z1', 'z2'));
      });

      it('should fail using `not` and `any` given an existing key', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(map).to.not.have.any.keys('x', 'z'));
        fail(() => expect(obj).to.not.have.any.keys('x', 'z'));
      });

      it('should fail using `all` given an inexisting key', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(map).to.have.all.keys('z1', 'y'));
        fail(() => expect(obj).to.have.all.keys('z1', 'y'));
      });

      it('should fail using `not` and `all` given existing keys', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(map).to.not.have.all.keys('x', 'y'));
        fail(() => expect(obj).to.not.have.all.keys('x', 'y'));
      });

      it('should fail using `contain` given an inexisting key', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(map).to.contain.key('z'));
        fail(() => expect(obj).to.contain.key('z'));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        expect(new clonedImmutable.Map({ x: 1 })).to.have.key('x');
      });
    });

    describe('property property', function () { // eslint-disable-line prefer-arrow-callback
      it('should not affect the original assertion', function () { // eslint-disable-line prefer-arrow-callback
        expect({ x: 1 }).to.have.property('x', 1);
      });

      it('should not affect the original assertion using `not`', function () { // eslint-disable-line prefer-arrow-callback
        expect({ x: 1 }).not.to.have.property('z');
        expect({ x: 1 }).not.to.have.property('z', 42);
      });

      // All following tests assert against regular `.property` and
      // `.deep.property`. In the Immutable world, these are supposed to carry
      // the same meaning (similar to `.equal` vs. `.deep.equal`).
      const obj = Immutable.fromJS({ x: 1 });
      const nestedObj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });

      it('should fail given an inexisting property', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(obj).to.have.property('z'));
        fail(() => expect(obj).to.have.deep.property('z'));
      });

      it('should pass using `not` given an inexisting property', function () { // eslint-disable-line prefer-arrow-callback
        expect(obj).not.to.have.property('z');
        expect(obj).not.to.have.deep.property('z');
      });

      it('should pass using `not` given an inexisting property and value', function () { // eslint-disable-line prefer-arrow-callback
        expect(obj).not.to.have.property('z', 42);
        expect(obj).not.to.have.deep.property('z', 42);
      });

      it('should pass given an existing property', function () { // eslint-disable-line prefer-arrow-callback
        expect(obj).to.have.property('x');
        expect(obj).to.have.deep.property('x');
      });

      it('should fail using `not` given an existing property', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(obj).not.to.have.property('x'));
        fail(() => expect(obj).not.to.have.deep.property('x'));
      });

      it('should fail given a property with a bad value', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(obj).to.have.property('x', 'different'));
        fail(() => expect(obj).to.have.deep.property('x', 'different'));
      });

      it('should pass given a property with the good value', function () { // eslint-disable-line prefer-arrow-callback
        expect(obj).to.have.property('x', 1);
        expect(obj).to.have.deep.property('x', 1);
      });

      it('should pass given an immutable value', function () { // eslint-disable-line prefer-arrow-callback
        const obj2 = Immutable.fromJS({ foo: { bar: 42 } });
        expect(obj2).to.have.property('foo', new Map({ bar: 42 }));
        expect(obj2).to.have.deep.property('foo', new Map({ bar: 42 }));
      });

      it('should change the subject to the value of that property', function () { // eslint-disable-line prefer-arrow-callback
        const sub = nestedObj.get('y');
        expect(nestedObj).to.have.property('y').that.equal(sub);
        expect(nestedObj).to.have.deep.property('y').that.equal(sub);
      });

      describe('using the `nested` flag', function () { // eslint-disable-line prefer-arrow-callback
        it('should not affect the original assertion', function () { // eslint-disable-line prefer-arrow-callback
          expect({ x: 1, y: { x: 2, y: 3 } }).to.have.nested.property('y.x', 2);
          expect({ x: 1, y: { x: 2, y: 3 } })
            .to.have.nested.deep.property('y.x', 2);
        });

        it('should not affect the original assertion using `not`', function () { // eslint-disable-line prefer-arrow-callback
          expect({ x: 1, y: { x: 2 } }).not.to.have.nested.property('z.z');
          expect({ x: 1, y: { x: 2 } }).not.to.have.nested.deep.property('z.z');
          expect({ x: 1, y: { x: 2 } }).not.to.have.nested.property('z.z', 42);
          expect({ x: 1, y: { x: 2 } })
            .not.to.have.nested.deep.property('z.z', 42);
        });

        it('should fail given an inexisting property', function () { // eslint-disable-line prefer-arrow-callback
          fail(() => expect(nestedObj).to.have.nested.property(['y', 'z']));
          fail(() => expect(nestedObj)
            .to.have.nested.deep.property(['y', 'z']));
        });

        it('should pass using `not` given an inexisting property', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj).not.to.have.nested.property(['y', 'z']);
          expect(nestedObj).not.to.have.nested.deep.property(['y', 'z']);
        });

        it('should pass using `not` given an inexisting property and value', function () { // eslint-disable-line prefer-arrow-callback
          expect(obj).not.to.have.nested.property(['y', 'x'], 'different');
          expect(obj).not.to.have.nested.deep.property(['y', 'x'], 'different');
        });

        it('should pass given an existing property', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj).to.have.nested.property(['y', 'x']);
          expect(nestedObj).to.have.nested.deep.property(['y', 'x']);
        });

        it('should pass given an index', function () { // eslint-disable-line prefer-arrow-callback
          const obj2 = Immutable.fromJS({ items: ['a', 'b', 'c'] });
          expect(obj2).to.have.nested.property(['items', 2], 'c');
          expect(obj2).to.have.nested.deep.property(['items', 2], 'c');
        });

        it('should fail using `not` given an existing property', function () { // eslint-disable-line prefer-arrow-callback
          fail(() => expect(nestedObj).not.to.have.nested.property(['y', 'x']));
          fail(() => expect(nestedObj)
            .not.to.have.nested.deep.property(['y', 'x']));
        });

        it('should fail given a property with a bad value', function () { // eslint-disable-line prefer-arrow-callback
          fail(() => expect(nestedObj)
            .to.have.nested.property(['y', 'x'], 'different'));
          fail(() => expect(nestedObj)
            .to.have.nested.deep.property(['y', 'x'], 'different'));
        });

        it('should pass given a property with the good value', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj).to.have.nested.property(['y', 'x'], 2);
          expect(nestedObj).to.have.nested.deep.property(['y', 'x'], 2);
        });

        it('should fail using `not` given a property with good value', function () { // eslint-disable-line prefer-arrow-callback
          fail(() => expect(nestedObj)
            .not.to.have.nested.property(['y', 'x'], 2));
          fail(() => expect(nestedObj)
            .not.to.have.nested.deep.property(['y', 'x'], 2));
        });

        it('should pass using `not` given a property with a bad value', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj)
            .not.to.have.nested.property(['y', 'x'], 'different');
          expect(nestedObj)
            .not.to.have.nested.deep.property(['y', 'x'], 'different');
        });

        it('should pass given an immutable value', function () { // eslint-disable-line prefer-arrow-callback
          const nestedObj2 = Immutable.fromJS({ foo: [{ bar: 42 }] });
          expect(nestedObj2)
            .to.have.nested.property('foo[0]', new Map({ bar: 42 }));
          expect(nestedObj2)
            .to.have.nested.deep.property('foo[0]', new Map({ bar: 42 }));
        });
      });

      describe('given a string-based path', function () { // eslint-disable-line prefer-arrow-callback
        const nestedObj2 = Immutable.fromJS({
          items: [
            { name: 'Jane' },
            { name: 'John' },
            { name: 'Jim' },
          ],
        });

        it('should pass using `nested` given a single index', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj2.get('items')).to.have.nested.property('[1]')
            .that.equals(new Map({ name: 'John' }));
          expect(nestedObj2.get('items')).to.have.nested.deep.property('[1]')
            .that.equals(new Map({ name: 'John' }));
        });

        it('should pass using `nested` given a single key', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj2).to.have.nested.property('items')
            .that.equals(new List([
              new Map({ name: 'Jane' }),
              new Map({ name: 'John' }),
              new Map({ name: 'Jim' }),
            ]));
          expect(nestedObj2).to.have.nested.deep.property('items')
            .that.equals(new List([
              new Map({ name: 'Jane' }),
              new Map({ name: 'John' }),
              new Map({ name: 'Jim' }),
            ]));
        });

        it('should pass using `nested` starting with an index', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj2.get('items'))
            .to.have.nested.property('[0].name', 'Jane');
          expect(nestedObj2.get('items'))
            .to.have.nested.deep.property('[0].name', 'Jane');
        });

        it('should pass using `nested` ending with an index', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj2).to.have.nested.property('items[1]')
            .that.equals(new Map({ name: 'John' }));
          expect(nestedObj2).to.have.nested.deep.property('items[1]')
            .that.equals(new Map({ name: 'John' }));
        });

        it('should pass using `nested` given mix of keys and indices', function () { // eslint-disable-line prefer-arrow-callback
          expect(nestedObj2).to.have.nested.property('items[2].name', 'Jim');
          expect(nestedObj2)
            .to.have.nested.deep.property('items[2].name', 'Jim');
        });

        it('should expect unescaped path strings', function () { // eslint-disable-line prefer-arrow-callback
          const css = new Map({ '.link[target]': 42 });
          expect(css).to.have.property('.link[target]', 42);
          expect(css).to.have.deep.property('.link[target]', 42);
        });

        it('should expect escaped path strings using `nested`', function () { // eslint-disable-line prefer-arrow-callback
          const nestedCss = new Map({ '.link': new Map({ '[target]': 42 }) });
          expect(nestedCss).to.have.nested.property('\\.link.\\[target\\]', 42);
          expect(nestedCss)
            .to.have.nested.deep.property('\\.link.\\[target\\]', 42);
        });
      });
    });

    describe('size method', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given the right size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size(3);
      });

      it('should pass using `not` given the wrong size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.have.size(42);
      });

      it('should also work with alias sizeOf', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.sizeOf(3);
        expect(list3).to.not.have.sizeOf(42);
      });

      it('should fail given the wrong size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.have.size(42));
      });

      it('should fail using `not` given the right size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.not.have.size(3));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        expect(clonedImmutableList).to.have.size(3);
      });
    });

    describe('size property', function () { // eslint-disable-line prefer-arrow-callback
      it('above should pass given a good min size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.above(2);
      });

      it('above should pass using `not` given a bad min size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.have.size.above(42);
      });

      it('aliases of above should also work', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.gt(2);
        expect(list3).to.have.size.greaterThan(2);
        expect(list3).to.not.have.size.gt(42);
        expect(list3).to.not.have.size.greaterThan(42);
      });

      it('should not affect the original assertions of above', function () { // eslint-disable-line prefer-arrow-callback
        expect('foo').to.have.length.above(2);
        expect([1, 2, 3]).to.have.length.above(2);
      });

      it('above should fail given a bad min size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.have.size.above(42));
      });

      it('above should fail using `not` given a good min size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.not.have.size.above(2));
      });

      it('below should pass given a good max size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.below(42);
      });

      it('below should pass using `not` given a bad max size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.have.size.below(1);
      });

      it('aliases of below should also work', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.lt(4);
        expect(list3).to.have.size.lessThan(4);
        expect(list3).to.not.have.size.lt(1);
        expect(list3).to.not.have.size.lessThan(1);
      });

      it('should not affect the original assertions of below', function () { // eslint-disable-line prefer-arrow-callback
        expect('foo').to.have.length.below(4);
        expect([1, 2, 3]).to.have.length.below(4);
      });

      it('below should fail given a bad max size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.have.size.below(1));
      });

      it('below should fail using `not` given a good max size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.not.have.size.below(42));
      });

      it('within should pass given a good range', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.within(2, 42);
      });

      it('within should pass using `not` given a bad range', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.have.size.within(10, 20);
      });

      it('should not affect the original assertions of within', function () { // eslint-disable-line prefer-arrow-callback
        expect('foo').to.have.length.within(2, 4);
        expect([1, 2, 3]).to.have.length.within(2, 4);
      });

      it('within should fail given a bad range', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.have.size.within(10, 20));
      });

      it('within should fail using `not` given a good range', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.not.have.size.within(2, 42));
      });

      it('least should pass given a good min size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.of.at.least(2);
      });

      it('least should pass using `not` given a bad min size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.have.size.of.at.least(42);
      });

      it('aliases of least should also work', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.gte(2);
        expect(list3).to.not.have.size.gte(42);
      });

      it('should not affect the original assertions of least', function () { // eslint-disable-line prefer-arrow-callback
        expect('foo').to.have.length.of.at.least(2);
        expect([1, 2, 3]).to.have.length.of.at.least(3);
      });

      it('least should fail given a bad min size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.have.size.of.at.least(42));
      });

      it('least should fail using `not` given a good min size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.not.have.size.of.at.least(2));
      });

      it('most should pass given a good max size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.of.at.most(42);
      });

      it('most should pass using `not` given a bad max size', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.not.have.size.of.at.most(2);
      });

      it('aliases of most should also work', function () { // eslint-disable-line prefer-arrow-callback
        expect(list3).to.have.size.lte(42);
        expect(list3).to.not.have.size.lte(2);
      });

      it('should not affect the original assertions of most', function () { // eslint-disable-line prefer-arrow-callback
        expect('foo').to.have.length.of.at.most(4);
        expect([1, 2, 3]).to.have.length.of.at.most(3);
      });

      it('most should fail given a good max size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.have.size.of.at.most(2));
      });

      it('most should fail using `not` given a bad max size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => expect(list3).to.not.have.size.of.at.most(42));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        expect(clonedImmutableList).to.have.size.above(2);
      });
    });
  });

  describe('TDD interface', function () { // eslint-disable-line prefer-arrow-callback
    describe('equal assertion', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given equal values', function () { // eslint-disable-line prefer-arrow-callback
        assert.equal(list3, List.of(1, 2, 3));
      });

      it('should pass given deeply equal values', function () { // eslint-disable-line prefer-arrow-callback
        assert.equal(deepMap, sameDeepMap);
      });

      it('should not affect the original assertion', function () { // eslint-disable-line prefer-arrow-callback
        assert.equal(42, 42);
        assert.equal(3, '3');
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () { // eslint-disable-line prefer-arrow-callback
        const actual = new Map({ foo: 'foo foo foo foo foo foo foo foo ' });
        const expected = new Map({ bar: 'bar bar bar bar bar bar bar bar ' });
        // AssertionError: expected { Object (foo) } to equal { Object (bar) }
        // + expected - actual
        //
        //  {
        // -  "foo": "foo foo foo foo foo foo foo foo"
        // +  "bar": "bar bar bar bar bar bar bar bar"
        //  }
        fail(
          () => assert.equal(actual, expected),
          'expected { Object (foo) } to equal { Object (bar) }'
        );
      });

      it('should fail given a non-Immutable value', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.equal([], new List()));
      });

      it('should fail given different values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.equal(list3, new List()));
      });

      it('should fail given deeply different values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.equal(deepMap, differentDeepMap));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        assert.equal(clonedImmutableList, List.of(1, 2, 3));
      });
    });

    describe('notEqual assertion', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given different values', function () { // eslint-disable-line prefer-arrow-callback
        assert.notEqual(list3, new List());
      });

      it('should pass given deeply different values', function () { // eslint-disable-line prefer-arrow-callback
        assert.notEqual(deepMap, differentDeepMap);
      });

      it('should not affect the original assertion', function () { // eslint-disable-line prefer-arrow-callback
        assert.notEqual('oui', 'non');
        assert.notEqual({ foo: 'bar' }, { foo: 'bar' });
      });

      it('should pass given a non-Immutable value', function () { // eslint-disable-line prefer-arrow-callback
        assert.notEqual([], new List());
      });

      it('should fail given equal values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.notEqual(list3, List.of(1, 2, 3)));
      });

      it('should fail given deeply equal values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.notEqual(deepMap, sameDeepMap));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        assert.notEqual(clonedImmutableList, List.of());
      });
    });

    describe('unoverridden strictEqual and deepEqual assertions', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given equal values', function () { // eslint-disable-line prefer-arrow-callback
        assert.strictEqual(list3, List.of(1, 2, 3));
        assert.deepEqual(list3, List.of(1, 2, 3));
      });

      it('should pass given deeply equal values', function () { // eslint-disable-line prefer-arrow-callback
        assert.strictEqual(deepMap, sameDeepMap);
        assert.deepEqual(deepMap, sameDeepMap);
      });

      it('should fail given different values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.strictEqual(list3, new List()));
        fail(() => assert.deepEqual(list3, new List()));
      });

      it('should fail given deeply different values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.strictEqual(deepMap, differentDeepMap));
        fail(() => assert.deepEqual(deepMap, differentDeepMap));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        assert.strictEqual(clonedImmutableList, List.of(1, 2, 3));
        assert.deepEqual(clonedImmutableList, List.of(1, 2, 3));
      });
    });

    describe('unoverridden notStrictEqual and notDeepEqual assertions', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given different values', function () { // eslint-disable-line prefer-arrow-callback
        assert.notStrictEqual(list3, new List());
        assert.notDeepEqual(list3, new List());
      });

      it('should pass given deeply different values', function () { // eslint-disable-line prefer-arrow-callback
        assert.notStrictEqual(deepMap, differentDeepMap);
        assert.notDeepEqual(deepMap, differentDeepMap);
      });

      it('should fail given equal values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.notStrictEqual(list3, List.of(1, 2, 3)));
        fail(() => assert.notDeepEqual(list3, List.of(1, 2, 3)));
      });

      it('should fail given deeply equal values', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.notStrictEqual(deepMap, sameDeepMap));
        fail(() => assert.notDeepEqual(deepMap, sameDeepMap));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        assert.notStrictEqual(clonedImmutableList, new List());
        assert.notDeepEqual(clonedImmutableList, new List());
      });
    });

    describe('property assertions', function () { // eslint-disable-line prefer-arrow-callback
      const obj = Immutable.fromJS({ x: 1 });
      const nestedObj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });

      it('should pass for existing property', function () { // eslint-disable-line prefer-arrow-callback
        assert.property(obj, 'x');
      });

      it('should fail for missing property', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.property(obj, 'z'));
      });

      it('should pass for missing property using `not`', function () { // eslint-disable-line prefer-arrow-callback
        assert.notProperty(obj, 'z');
      });

      it('should fail for existing property using `not`', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.notProperty(obj, 'x'));
      });

      it('should pass for existing property and value', function () { // eslint-disable-line prefer-arrow-callback
        assert.propertyVal(obj, 'x', 1);
        assert.deepPropertyVal(obj, 'x', 1);
      });

      it('should fail for wrong property or value', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.propertyVal(obj, 'z', 1));
        fail(() => assert.deepPropertyVal(obj, 'z', 1));
        fail(() => assert.propertyVal(obj, 'x', 42));
        fail(() => assert.deepPropertyVal(obj, 'x', 42));
      });

      it('should pass for wrong property or value using `not`', function () { // eslint-disable-line prefer-arrow-callback
        assert.notPropertyVal(obj, 'z', 1);
        assert.notDeepPropertyVal(obj, 'z', 1);
        assert.notPropertyVal(obj, 'x', 42);
        assert.notDeepPropertyVal(obj, 'x', 42);
      });

      it('should fail for existing property and value using `not`', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.notPropertyVal(obj, 'x', 1));
        fail(() => assert.notDeepPropertyVal(obj, 'x', 1));
      });

      it('should succeed for equal nested property', function () { // eslint-disable-line prefer-arrow-callback
        assert.nestedProperty(nestedObj, ['y', 'x']);
      });

      it('should fail for unequal nested property', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.nestedPropertyVal(nestedObj, ['y', 'x'], 42));
        fail(() => assert.deepNestedPropertyVal(nestedObj, ['y', 'x'], 42));
      });
    });

    describe('sizeOf assertion', function () { // eslint-disable-line prefer-arrow-callback
      it('should pass given the right size', function () { // eslint-disable-line prefer-arrow-callback
        assert.sizeOf(list3, 3);
      });

      it('should work with empty collections', function () { // eslint-disable-line prefer-arrow-callback
        assert.sizeOf(new List(), 0);
      });

      it('should fail given the wrong size', function () { // eslint-disable-line prefer-arrow-callback
        fail(() => assert.sizeOf(list3, 42));
      });

      it('should work if using different copies of Immutable', function () { // eslint-disable-line prefer-arrow-callback
        assert.sizeOf(clonedImmutableList, 3);
      });
    });
  });
});
