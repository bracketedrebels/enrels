import { Graph, alg } from 'graphlib';
import * as assign from 'object-assign';

import { ERDomainLinkTypeOptions, ERDomainLinkTypesDict } from './erdomain.interfaces'; 
import { defaultLinkTypeOptions } from './erdomain.consts';


export class ERDomain {
    /** Registers new link type.
     *  @argument mark - link type name. Must be unique among all of links types within the current domain.
     *  @argument options - link type properties.
     */
    public addLinkType(mark: string, options?: ERDomainLinkTypeOptions): void {
        this.validateLinkTypeExistence(mark, true);
        this.linkTypes[mark] = assign({}, defaultLinkTypeOptions, options); // immutable assignation
    }
    
    /** Updates properties of already registered link type.
     *  @argument mark - link type name.
     *  @argument options - new link type properties. Specified will override old ones, others will stay unchanged.
     */
    public editLinkType(mark: string, options: ERDomainLinkTypeOptions): void {
        this.validateLinkTypeExistence(mark, false);
        this.linkTypes[mark] = assign(this.linkTypes[mark] || defaultLinkTypeOptions, options); // immutable assignation
    }

    /** Get full list of link types names registered within the domain. */
    public getLinkTypes(): string[] {
        return Object.keys(this.linkTypes);
    }

    /** Get registered link type options.
     *  @argument mark - link type name
     *  @argument silent - if true, no exception will be throwed in case of specified link type does not exist.
     */
    public getLinkTypeInfo(mark: string, silent = false): ERDomainLinkTypeOptions | null {
        if (!silent) { this.validateLinkTypeExistence(mark); }
        return this.linkTypes[mark] || null;
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

    /** Connect two entities by link of specified type and assign specified value on this link.
     * 
     *  @argument entities - pair of strings that identify entities
     *  @argument linkType - name of link type, that will be used to link entities
     *  @argument value - value, to assign on created link
     */
    public link(linkType: string, entities: [string, string], value?: any): void {
        this.linkEntities(linkType, entities, value);
    }

    /**
     * Gives you an information whether entities has link of specified type. If no type specified
     * it looks for link of any type between specified entities.
     * 
     * @returns whether pair if antites connected via link of specified type.
     */
    public areLinked(entities: [string, string], linkType?: string): boolean {
        return this.graph.hasEdge(entities[0], entities[1], linkType);
    }

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
    public unlink(entities: string | [string, string], linkType?: string): void {
        this.unlinkEntities(entities, linkType);
    }

    /**
     * Removes all links of specified type (or simply all links if no type specified)
     * within the domain.
     * 
     * @argument linkType - name of link type.
     */
    public unlinkAll(linkType?: string): void {
        this.removeAllLinksOfType(linkType);
    }

    /** Add entity to domain.
     *  @argument mark - entity identifier. Must be unique among all of link types within the current domain.
     *  @argument value - value to assign to entity.
     */
    public addEntity(mark: string, value?: any): void {
        this.validateEntityExistence(mark, true);
        this.graph.setNode(mark, value);
    }

    /** Update entity assigned value.
     *  @argument mark - entity identifier.
     *  @argument value - new value to assign to entity.
     */
    public editEntity(mark: string, value?: any): void {
        this.validateEntityExistence(mark, false);
        this.graph.setNode(mark, value);
    }

    /** Detect whether an entity with specified mark exists within the domain. */
    public hasEntity(mark: string): boolean {
        return this.graph.hasNode(mark);
    }

    /** Remove entity from domain. Removing entity unlinks all related entities from it.
     *  @argument mark - entity identifier.
     */
    public removeEntity(mark: string): void {
        this.graph.removeNode(mark);
    }

    /** Acquire existed entity details.
     *  @argument mark - entity name
     *  @argument silent - if true, no exception will be throwed in case of specified entity does not exist.
     */
    public getEntityDetails(mark: string, silent = false): any | void {
        if (!silent) { this.validateEntityExistence(mark, false); }
        return this.graph.node(mark);
    }



    private graph: Graph = new Graph({ directed: true, multigraph: true });
    private linkTypes: ERDomainLinkTypesDict = {};

    private removeAllLinksOfType(type?: string): void {
        this.graph.edges()
            .filter( edge => type !== undefined ? edge.name === type : true )
            .forEach( edge => this.graph.removeEdge(edge) );
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

    private validateEntityExistence(mark: string, invertValidation = false): void {
        if (!invertValidation && !(this.graph.hasNode(mark))) {
            throw new Error(`Entity marked as '${mark}' does not exsist.`);
        } else if (invertValidation && this.graph.hasNode(mark)) {
            throw new Error(`Entity marked as '${mark}' already exists.`);
        }
    }

    private linkEntities(linkType: string, entities: [string, string], value?: any): void {
        let lSource = entities[0];
        let lTarget = entities[1];
        if (!this.hasLinkType(linkType)) { this.addLinkType(linkType); }
        if (!this.hasEntity(lSource)) { this.addEntity(lSource); }
        if (!this.hasEntity(lTarget)) { this.addEntity(lTarget); }
        let [sources, targets] = this.findConnectors(linkType, lSource, lTarget);
        let lLinkTypeInfo = this.linkTypes[linkType];
        sources.forEach( v => {
            targets.forEach( w => {
                this.graph.setEdge(v, w, value, linkType);
                if (lLinkTypeInfo.mutual) {
                    this.graph.setEdge(w, v, value, linkType);
                }    
            })
        } )
    }

    private findConnectors(type: string, from: string, to: string): [string[], string[]] {
        let lLinkTypeInfo = this.linkTypes[type];
        let lSources = [from];
        let lTargets = [to];
        if (lLinkTypeInfo.transitive) {
            lSources = this.findTransitiveConnectedEntities(type, lSources, lSources, true);
            lTargets = this.findTransitiveConnectedEntities(type, lTargets, lTargets, false);
        }
        return [lSources, lTargets];
    }

    private findTransitiveConnectedEntities(linkType: string, sources: string[], accumulator: string[], sink?: boolean): string[] {
        let lNewlyLinkedEntities: string[] = [];
        sources.forEach( v => {
            let lLinkedEntities = this.getLinkedEntities(v, accumulator, linkType);
            lNewlyLinkedEntities = lNewlyLinkedEntities.concat(lLinkedEntities);
            accumulator = accumulator.concat(lLinkedEntities);
        } );
        if (lNewlyLinkedEntities.length > 0) {
            accumulator = accumulator.concat(lNewlyLinkedEntities);
            return this.findTransitiveConnectedEntities(linkType, lNewlyLinkedEntities, accumulator);
        }
        return accumulator;
    }

    private getLinkedEntities(source: string, exclude: string[] = [], linkType?: string, sink?: boolean): string[] {
        let edges = sink === undefined
            ? this.graph.nodeEdges( source )
            : sink ? this.graph.inEdges( source ) : this.graph.outEdges( source );
        return edges && edges
            .filter( e => linkType ? e.name === linkType : true )
            .map( e => e.w )
            .filter( w => exclude.indexOf(w) < 0 );
    }

    private unlinkEntities(entities: string | [string, string], linkType?: string): void {
        let lUnlinkingEdge = [].concat(entities);
        let lEdgesToUnlink = this.graph.outEdges(lUnlinkingEdge[0], lUnlinkingEdge[1] || undefined);
        lEdgesToUnlink = lEdgesToUnlink && linkType && lEdgesToUnlink.filter( edge => edge.name === linkType ) || [];
        lEdgesToUnlink.forEach( edge => this.graph.removeEdge(edge) );
    }
}
