import { Graph } from 'graphlib';
import * as assign from 'object-assign';

import { ERDomainLinkTypeOptions, ERDomainLinkTypesDict } from './erdomain.interfaces'; 
import { defaultLinkTypeOptions } from './erdomain.consts';


export class ERDomain {
    /** Registers new link type.
     *  @argument mark - link type name. Must be unique among all of links types within the current domain.
     *  @argument options - link type properties.
     */
    public addLinkType(mark: string, options?: ERDomainLinkTypeOptions): void {
        this.registerLinkTypeIfNotExists(mark, options);
    }
    
    /** Updates properties of already registered link type.
     *  @argument mark - link type name.
     *  @argument options - new link type properties. Specified will override old ones, others will stay unchanged.
     */
    public editLinkType(mark: string, options: ERDomainLinkTypeOptions): void {
        this.editLinkTypeIfExists(mark, options);
    }

    /** Get full list of link types names registered within the domain. */
    public getLinkTypes(): string[] {
        return Object.keys(this.linkTypes);
    }

    /** Get registered link type options.
     *  @argument mark - link type name
     */
    public getLinkTypeInfo(mark: string, silent = false): ERDomainLinkTypeOptions | null {
        return this.acquireLinkTypeOptions(mark, silent);
    }

    /** Detecting, whether current domain has a registered link type with specified mark or not.
     *  @argument mark - link type name
     */
    public hasLinkType(mark: string): boolean {
        return mark in this.linkTypes;
    }

    /** Removes registered link type.
     *  @argument mark - registered link type name.
     *  @argument consistent - if true, type removing is consistent. It means, that all links of this type will be also removed.
     */
    public removeLinkType(mark: string, consistent = true): void {
        this.removeLinkTypeIfRequired(mark, consistent);
    }

    /**
     * Connect two entities by link of specified type and assign specified value on on this link.
     * 
     * @argument entities - pair of strings that identify entities
     * @argument linkType - name of link type, that will be used to link entities
     * @argument value - value, to assign on created link
     */
    public link(entities: [string, string], linkType: string, value?: any): void {

    }

    /**
     * If specified pair of entities, removes link of specified type between them.
     * If specified single entity, removes all links of specified type that specified entity is source for.
     * 
     * @argument entities - list of entities or single entity to unlink.
     * @argument linkType - name of link type, which links of will be removed.
     */
    public unlink(linkType: string, entities: string | [string, string]): void {

    }

    /** Removes all links of specified type within the domain.
     *  @argument linkType - name of link type.
     */
    public unlinkAll(linkType: string): void {
        this.removeAllLinksOfType(linkType);
    }

    /**
     * Add entity to domain.
     * 
     * @argument mark - entity identifier. Must be unique among all of link types within the current domain.
     * @argument value - value to assign to entity.
     */
    public addEntity(mark: string, value?: any): void {

    }

    /**
     * Update entity assigned value.
     * 
     * @argument mark - entity identifier.
     * @argument value - new value to assign to entity.
     */
    public editEntity(mark: string, value: any): void {

    }

    /**
     * Remove entity from domain. Removing entity unlinks all related entities from it.
     * 
     * @argument mark - entity identifier.
     */
    public removeEntity(mark: string): void {

    }



    private graph: Graph = new Graph();
    private linkTypes: ERDomainLinkTypesDict = {};

    private registerLinkTypeIfNotExists(mark: string, options?: ERDomainLinkTypeOptions): void {
        this.validateLinkTypeExistence(mark, true);
        this.linkTypes[mark] = assign(defaultLinkTypeOptions, options); // immutable assignation
    }

    private editLinkTypeIfExists(mark: string, options: ERDomainLinkTypeOptions): void {
        this.validateLinkTypeExistence(mark);
        this.linkTypes[mark] = assign(this.linkTypes[mark] || defaultLinkTypeOptions, options); // immutable assignation
    }

    private acquireLinkTypeOptions(mark: string, silent: boolean): ERDomainLinkTypeOptions | null {
        if (!silent) { this.validateLinkTypeExistence(mark); }
        return this.linkTypes[mark] || null;
    }

    private removeAllLinksOfType(type: string): void {

    }

    private removeLinkTypeIfRequired(mark: string, consistent: boolean): void {
        if (this.linkTypes[mark]) {
            if (consistent) { this.removeAllLinksOfType(mark); }
            delete this.linkTypes[mark];
        }
    }

    private validateLinkTypeExistence(mark: string, invertValidation = false): void {
        if (!invertValidation && !(mark in this.linkTypes)) {
            throw new Error(`Link type with mark ${mark} is not registered`);
        } else if (invertValidation && mark in this.linkTypes) {
            throw new Error(`Link type with mark ${mark} already registered.`);
        }
    }
}