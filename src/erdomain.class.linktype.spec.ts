import 'jasmine';

import { ERDomain } from './erdomain.class';


describe(`Linktypes operations`, () => {

    let domain = new ERDomain();
    let customized = `customized`;
    let standard = `default`;
    let configuration = { transitive: true, mutual: true };
    let a = 'a';
    let b = 'b';

    beforeAll(() => {
        domain.addLinkType(standard);
        domain.addLinkType(customized, configuration);
    });

    it(`should create an instance`, () => {
        expect(domain).toBeTruthy();
    });
    it(`should contain two link types`, () => {
        expect(domain.getLinkTypes().length).toEqual(2);
    });
    it(`should contain ${standard} link type`, () => {
        expect(domain.hasLinkType(standard)).toBeTruthy();
    });
    it(`should contain ${customized} link type`, () => {
        expect(domain.hasLinkType(customized)).toBeTruthy();
    });
    it(`should throw an error if getting detail of unregistered link type`, () => {
        expect(() => domain.getLinkTypeInfo('unregistered')).toThrowError();
    });
    it(`should return null if getting detail of unregistered link type in silence mode`, () => {
        expect(domain.getLinkTypeInfo('unregistered', true)).toBeNull();
    });
    it(`should have ${standard} link type to be correctly defined by default`, () => {
        expect(domain.getLinkTypeInfo(standard).transitive).toEqual(false);
        expect(domain.getLinkTypeInfo(standard).mutual).toEqual(false);
    });
    it(`should have ${customized} link type to be defined correctly`, () => {
        expect(domain.getLinkTypeInfo(customized).transitive).toEqual(configuration.transitive);
        expect(domain.getLinkTypeInfo(customized).mutual).toEqual(configuration.mutual);
    });
    it(`should throw an error if adding already registered link type`, () => {
        expect(() => domain.addLinkType(standard)).toThrowError();
    });
    it(`should throw an error when editing unregistered link type`, () => {
        expect(() => domain.editLinkType('unregistered', {})).toThrowError();
    });
    it(`should successfully edit a registered link`, () => {
        domain.editLinkType(customized, { mutual: !configuration.mutual });
        expect(domain.getLinkTypeInfo(customized).transitive).toEqual(configuration.transitive);
        expect(domain.getLinkTypeInfo(customized).mutual).toEqual(!configuration.mutual);
    });
    it(`should successfully remove a link inconsistently`, () => {
        domain.removeLinkType(customized, false);
        expect(domain.hasLinkType(customized)).toBeFalsy();
    });
    it(`should successfully remove a link consistently`, () => {
        domain.link(standard, [a, b]);
        domain.removeLinkType(standard, true);
        expect(domain.hasLinkType(standard)).toBeFalsy();
        expect(domain.areLinked([a, b], standard)).toBeFalsy();
    });
});
