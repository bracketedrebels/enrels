import 'jasmine';

import { ERDomain } from './erdomain.class';
import { defaultLinkTypeOptions } from './erdomain.consts';


describe(`Entities Relationships Domain`, () => {

    let domain = new ERDomain();
    let customized = `customized`;
    let standard = `default`;
    let configuration = { transitive: true, commutative: true };

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
        expect(domain.getLinkTypeInfo(standard).transitive).toEqual(defaultLinkTypeOptions.transitive);
        expect(domain.getLinkTypeInfo(standard).commutative).toEqual(defaultLinkTypeOptions.commutative);
    });
    it(`should have ${customized} link type to be defined correctly`, () => {
        expect(domain.getLinkTypeInfo(customized).transitive).toEqual(configuration.transitive);
        expect(domain.getLinkTypeInfo(customized).commutative).toEqual(configuration.commutative);
    });
    it(`should throw an error if adding already registered link type`, () => {
        expect(() => domain.addLinkType(standard)).toThrowError();
    });
    it(`should throw an error when editing unregistered link type`, () => {
        expect(() => domain.editLinkType('unregistered', {})).toThrowError();
    });
    it(`should successfully edit a registered link`, () => {
        domain.editLinkType(customized, { commutative: !configuration.commutative });
        expect(domain.getLinkTypeInfo(customized).transitive).toEqual(configuration.transitive);
        expect(domain.getLinkTypeInfo(customized).commutative).toEqual(!configuration.commutative);
    });
    it(`should successfully remove a link inconsistently`, () => {
        domain.removeLinkType(customized, false);
        expect(domain.hasLinkType(customized)).toBeFalsy();
    });
    it(`should successfully remove a link consistently`, () => {
        // @TODO
    });
});
