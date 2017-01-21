import 'jasmine';

import { ERDomain } from './erdomain.class';
import { combination } from 'js-combinatorics';

function truthyPack(domain: ERDomain, links: string[][], type: string) {
    links.forEach( (conn: [string, string]) => expect(domain.areLinked(conn, type)).toBeTruthy() );
}

function falsyPack(domain: ERDomain, links: string[][], type: string) {
    links.forEach( (conn: [string, string]) => expect(domain.areLinked(conn, type)).toBeFalsy() );
}

describe(`Linkage functionality`, () => {

    let domain: ERDomain;
    let simple = `simple`;
    let transitive = `transitive`;
    let mutual = `mutual`;
    let complex = 'transitive and mutual';
    let a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f';

    beforeEach(() => {
        domain = new ERDomain();
        domain.addLinkType(simple);
        domain.addLinkType(transitive, { transitive: true });
        domain.addLinkType(mutual, { mutual: true });
        domain.addLinkType(complex, { transitive: true, mutual: true });
    });

    it(`should create an instance`, () => {
        expect(domain).toBeTruthy();
    });
    it(`should link entities via ${simple} link correctly`, () => {
        domain.link(simple, [b, c]);
        expect(domain.areLinked([b, c], simple)).toBeTruthy();
    });
    it(`should have neither transitiveness nor mutuality when linking via ${simple} link`, () => {
        domain.link(simple, [b, c]);
        domain.link(simple, [a, b]);
        expect(domain.areLinked([a, b], simple)).toBeTruthy();
        expect(domain.areLinked([b, a], simple)).toBeFalsy();
        expect(domain.areLinked([a, c], simple)).toBeFalsy();
    });
    it(`should link entities via ${mutual} link correctly`, () => {
        domain.link(mutual, [b, c]);
        expect(domain.areLinked([b, c], mutual)).toBeTruthy();
        expect(domain.areLinked([c, b], mutual)).toBeTruthy();
    });
    it(`should have no transitiveness when linking via ${mutual} link`, () => {
        domain.link(mutual, [b, c]);
        domain.link(mutual, [a, b]);
        expect(domain.areLinked([a, b], mutual)).toBeTruthy();
        expect(domain.areLinked([b, a], mutual)).toBeTruthy();
        expect(domain.areLinked([a, c], mutual)).toBeFalsy();
        expect(domain.areLinked([c, a], mutual)).toBeFalsy();
    });
    it(`should link entities via ${transitive} link correctly`, () => {
        domain.link(transitive, [b, c]);
        domain.link(transitive, [a, b]);
        expect(domain.areLinked([b, c], transitive)).toBeTruthy();
        expect(domain.areLinked([a, b], transitive)).toBeTruthy();
        expect(domain.areLinked([a, c], transitive)).toBeTruthy();
    });
    it(`should have no mutuality when linking via ${transitive} link`, () => {
        domain.link(transitive, [b, c]);
        domain.link(transitive, [a, b]);
        expect(domain.areLinked([c, b], transitive)).toBeFalsy();
        expect(domain.areLinked([b, a], transitive)).toBeFalsy();
        expect(domain.areLinked([c, a], transitive)).toBeFalsy();
    });
    it(`should link entities via ${complex} link correctly`, () => {
        domain.link(complex, [b, c]);
        domain.link(complex, [a, b]);
        expect(domain.areLinked([b, c], complex)).toBeTruthy();
        expect(domain.areLinked([c, b], complex)).toBeTruthy();
        expect(domain.areLinked([a, b], complex)).toBeTruthy();
        expect(domain.areLinked([b, a], complex)).toBeTruthy();
        expect(domain.areLinked([a, c], complex)).toBeTruthy();
        expect(domain.areLinked([c, a], complex)).toBeTruthy();
    });
    it(`should corectly join ${complex} components together`, () => {
        domain.link(complex, [b, c]);
        domain.link(complex, [a, b]);
        domain.link(complex, [e, f]);
        domain.link(complex, [d, e]);
        domain.link(complex, [c, d]);

        combination([a, b, c, d, e, f], 2).forEach( (conn: [string, string]) => {
            expect(domain.areLinked(conn, complex)).toBeTruthy();
        } );
    });
    it(`should corectly join ${mutual} components together`, () => {
        domain.link(mutual, [b, c]);
        domain.link(mutual, [a, b]);
        domain.link(mutual, [e, f]);
        domain.link(mutual, [d, e]);
        domain.link(mutual, [c, d]);

        let lTruthyLinks = [ [b, c], [a, b], [e, f], [d, e], [c, d], [c, b], [b, a], [f, e], [e, d], [d, c] ];
        let lFalsyLinks = combination([a, b, c, d, e, f], 2).filter( t => !lTruthyLinks.some( e => t.toString() === e.toString() ));

        truthyPack(domain, lTruthyLinks, mutual);
        falsyPack(domain, lFalsyLinks, mutual);
    });
    it(`should corectly join ${transitive} components together`, () => {
        domain.link(transitive, [a, b]);
        domain.link(transitive, [b, c]);
        domain.link(transitive, [d, e]);
        domain.link(transitive, [e, f]);
        domain.link(transitive, [b, d]);

        let lTruthyLinks = [ [b, c], [a, b], [e, f], [d, e], [b, d], [a, d], [a, e], [a, f], [b, e], [b, f], [a, c], [d, f]];
        let lFalsyLinks = combination([a, b, c, d, e, f], 2).filter( t => !lTruthyLinks.some( e => t.toString() === e.toString() ));

        truthyPack(domain, lTruthyLinks, transitive);
        falsyPack(domain, lFalsyLinks, transitive);
    });
    it(`should corectly work with ${transitive} cycles`, () => {
        domain.link(transitive, [a, b]);
        domain.link(transitive, [b, c]);
        domain.link(transitive, [c, d]);
        domain.link(transitive, [d, e]);
        domain.link(transitive, [e, f]);
        domain.link(transitive, [f, a]);

        truthyPack(domain, combination([a, b, c, d, e, f], 2).toArray(), transitive);
    });
    it(`should corectly work with ${complex} cycles`, () => {
        domain.link(complex, [a, b]);
        domain.link(complex, [b, c]);
        domain.link(complex, [c, d]);
        domain.link(complex, [d, e]);
        domain.link(complex, [e, f]);
        domain.link(complex, [f, a]);

        truthyPack(domain, combination([a, b, c, d, e, f], 2).toArray(), complex);
    });
    it(`should corectly work with ${mutual} cycles`, () => {
        domain.link(mutual, [a, b]);
        domain.link(mutual, [b, c]);
        domain.link(mutual, [c, d]);
        domain.link(mutual, [d, e]);
        domain.link(mutual, [e, f]);
        domain.link(mutual, [f, a]);

        let lTruthyLinks = [ [a, b], [b, c], [c, d], [d, e], [e, f], [f, a], [b, a], [c, b], [d, c], [e, d], [f, e], [a, f] ];
        let lFalsyLinks = combination([a, b, c, d, e, f], 2).filter( t => !lTruthyLinks.some( e => t.toString() === e.toString() ));

        truthyPack(domain, lTruthyLinks, mutual);
        falsyPack(domain, lFalsyLinks, mutual);
    });
});
