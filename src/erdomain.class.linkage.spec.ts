import 'jasmine';

import { ERDomain } from './erdomain.class';


describe(`Linkage functionality`, () => {

    let domain = new ERDomain();
    let simple = `simple`;
    let transitive = `transitive`;
    let mutual = `mutual`;
    let complex = 'transitive and mutual';
    let a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f',
        g = 'g', h = 'h', i = 'i', j = 'j', k = 'k', l = 'l';

    beforeAll(() => {
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
        domain.link(simple, [a, b]);
        expect(domain.areLinked([a, b], simple)).toBeTruthy();
        expect(domain.areLinked([b, a], simple)).toBeFalsy()
        expect(domain.areLinked([a, c], simple)).toBeFalsy();
    });
    it(`should link entities via ${mutual} link correctly`, () => {
        domain.link(mutual, [b, c]);
        expect(domain.areLinked([b, c], mutual)).toBeTruthy();
        expect(domain.areLinked([c, b], mutual)).toBeTruthy();
    });
    it(`should have no transitiveness when linking via ${mutual} link`, () => {
        domain.link(mutual, [a, b]);
        expect(domain.areLinked([a, b], mutual)).toBeTruthy();
        expect(domain.areLinked([b, a], mutual)).toBeTruthy()
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
        expect(domain.areLinked([c, b], transitive)).toBeFalsy();
        expect(domain.areLinked([b, a], transitive)).toBeFalsy()
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
        domain.link(complex, [e, f]);
        domain.link(complex, [d, e]);
        domain.link(complex, [c, d]);
        let lConnectionsToVerify: [[string, string]] = [
            [a, d], [d, a], [a, e], [e, a], [a, f], [f, a],
            [b, d], [d, b], [b, e], [e, b], [b, f], [f, b],
            [c, d], [d, c], [c, e], [e, c], [c, f], [f, c],
        ]
        lConnectionsToVerify.forEach( conn => {
            expect(domain.areLinked(conn, complex)).toBeTruthy();    
        } );
    });
    // it(`should corectly join ${mutual} components together`, () => {
    //     domain.link(mutual, [g, h]);
    //     domain.link(mutual, [h, i]);
    //     domain.link(mutual, [j, k]);
    //     domain.link(mutual, [k, l]);
    //     domain.link(mutual, [i, j]);
    // });
});
