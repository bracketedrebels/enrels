import 'jasmine';

import { ERDomain } from './erdomain.class';



describe(`Entities Relationships Domain`, () => {

    let domain = new ERDomain();
    let unknown = `unknown`;
    let nonlabeled = `nonlabeled`;
    let simpleLabeled = `labeled-simple`;
    let complexLabeled = `labeled-complex`;

    let labels = {
        simple: 42,
        complex: [42]
    };

    beforeAll(() => {
        domain.addEntity(nonlabeled);
        domain.addEntity(simpleLabeled, labels.simple);
        domain.addEntity(complexLabeled, labels.complex);
    });

    it(`should create an instance`, () => {
        expect(domain).toBeTruthy();
    });
    it(`should correctly detect whether entity exists in the domain or not`, () => {
        expect(domain.hasEntity(nonlabeled)).toBeTruthy();
        expect(domain.hasEntity(simpleLabeled)).toBeTruthy();
        expect(domain.hasEntity(complexLabeled)).toBeTruthy();
        expect(domain.hasEntity(unknown)).toBeFalsy();
    });
    it(`should raise an error when adding already existed entity`, () => {
        expect(() => domain.addEntity(nonlabeled)).toThrowError();
    });
    it(`should raise an error when getting details of unexisted entity`, () => {
        expect(() => domain.getEntityDetails(unknown)).toThrowError();
    });
    it(`should return undefined as details of unexisted entity in silent mode`, () => {
        expect(domain.getEntityDetails(unknown, true)).toBeUndefined();
    });
    it(`should correctly aquire entities info`, () => {
        expect(domain.getEntityDetails(nonlabeled)).toBeUndefined();
        expect(domain.getEntityDetails(simpleLabeled)).toEqual(labels.simple);
        expect(domain.getEntityDetails(complexLabeled)).toEqual(labels.complex);
    });
    it(`should raise an error when editing unexisted entity`, () => {
        expect(() => domain.editEntity(unknown, labels.simple)).toThrowError();
    });
    it(`should successfully edit existing entity`, () => {
        domain.editEntity(simpleLabeled, labels.simple + 1);
        expect(domain.getEntityDetails(simpleLabeled)).toEqual(labels.simple + 1);
        let lNewComplexValue = labels.complex.map( v => v * 2 )
        domain.editEntity(complexLabeled, lNewComplexValue);
        expect(domain.getEntityDetails(complexLabeled)).toEqual(lNewComplexValue);
    });
    it(`should succesfully remove entities`, () => {
        domain.removeEntity(simpleLabeled);
        domain.removeEntity(complexLabeled);
        expect(domain.hasEntity(simpleLabeled)).toBeFalsy();
        expect(domain.hasEntity(complexLabeled)).toBeFalsy();
    });
});
