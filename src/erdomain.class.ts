import { Graph } from 'graphlib';

import { ERDomainLinkTypeOptions, ERDomainLinkTypesDict } from './erdomain.interfaces'; 



export class ERDomain {
    /**
     * Registers new link type.
     * 
     * @argument mark - link type name. Must be unique among all of links types within the current domain.
     * @argument options - link type properties.
     */
    public registerLinkType(mark: string, options: ERDomainLinkTypeOptions): void {

    }
    
    /**
     * Updates properties of already registered link type.
     * 
     * @argument mark - link type name.
     * @argument options - new link type properties. Specified will override old ones, others will stay unchanged.
     */
    public editLinkType(mark: string, options: ERDomainLinkTypeOptions): void {

    }

    /**
     * Removes registered link type.
     * 
     * @argument mark - registered link type name.
     */
    public removeLinkType(mark: string):void {

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
    public unlink(entities: string | [string, string], linkType: string): void {

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
}