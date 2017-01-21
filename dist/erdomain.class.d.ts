/// <reference types="graphlib" />
import { Graph } from 'graphlib';
export declare class ERDomain {
    /** Registers new link type.
     *  @argument mark - link type name. Must be unique among all of links types within the current domain.
     *  @argument options - link type properties.
     */
    addLinkType(mark: string, options?: ERDomainLinkTypeOptions): void;
    /** Updates properties of already registered link type.
     *  @argument mark - link type name.
     *  @argument options - new link type properties. Specified will override old ones, others will stay unchanged.
     */
    editLinkType(mark: string, options: ERDomainLinkTypeOptions): void;
    /** Get full list of link types names registered within the domain. */
    getLinkTypes(): string[];
    /** Get registered link type options.
     *  @argument mark - link type name
     *  @argument silent - if true, no exception will be throwed in case of specified link type does not exist.
     */
    getLinkTypeInfo(mark: string, silent?: boolean): ERDomainLinkTypeOptions | null;
    /** Detecting, whether current domain has a registered link type with specified mark or not.
     *  @argument mark - link type name
     */
    hasLinkType(mark: string): boolean;
    /** Removes registered link type.
     *  @argument mark - registered link type name.
     *  @argument consistent - if true, type removing is consistent. It means, that all links of this type will be also removed.
     */
    removeLinkType(mark: string, consistent?: boolean): void;
    /** Connect two entities by link of specified type and assign specified value on this link.
     *
     *  @argument entities - pair of strings that identify entities
     *  @argument linkType - name of link type, that will be used to link entities
     *  @argument value - value, to assign on created link
     */
    link(linkType: string, entities: [string, string], value?: any): void;
    /**
     * Gives you an information whether entities has link of specified type. If no type specified
     * it looks for link of any type between specified entities.
     *
     * @returns whether pair if antites connected via link of specified type.
     */
    areLinked(entities: [string, string], linkType?: string): boolean;
    /**
     * Removes a link between entities.
     * If specified pair of entities, removes link of specified type (or all links,
     * if no type specified) between them. If specified single entity, removes all
     * links of specified type (or just all links if no type specified) that specified
     * entity is source for.
     *
     *  @argument linkType - name of link type, links of which will be removed.
     *  @argument entities - list of entities or single entity to unlink.
     */
    unlink(entities: string | [string, string], linkType?: string): void;
    /**
     * Removes all links of specified type (or simply all links if no type specified)
     * within the domain.
     *
     * @argument linkType - name of link type.
     */
    unlinkAll(linkType?: string): void;
    /** Add entity to domain.
     *  @argument mark - entity identifier. Must be unique among all of link types within the current domain.
     *  @argument value - value to assign to entity.
     */
    addEntity(mark: string, value?: any): void;
    /** Update entity assigned value.
     *  @argument mark - entity identifier.
     *  @argument value - new value to assign to entity.
     */
    editEntity(mark: string, value?: any): void;
    /** Detect whether an entity with specified mark exists within the domain. */
    hasEntity(mark: string): boolean;
    /** Remove entity from domain. Removing entity unlinks all related entities from it.
     *  @argument mark - entity identifier.
     */
    removeEntity(mark: string): void;
    /** Acquire existed entity details.
     *  @argument mark - entity name
     *  @argument silent - if true, no exception will be throwed in case of specified entity does not exist.
     */
    getEntityDetails(mark: string, silent?: boolean): any | void;
    constructor(store?: Graph);
}
export interface ERDomainLinkTypeOptions {
    mutual?: boolean;
    transitive?: boolean;
}
