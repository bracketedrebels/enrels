import { Graph } from 'graphlib';
import * as assign from 'object-assign';



export class ERDomain {
    /** 
     * Registers new link type.
     * @argument mark - link type name. Must be unique among all of links types within the current domain.
     * @argument options - link type properties.
     * @returns current ERDomain instance
     */
    public addLinkType(mark: string, options?: ERDomainLinkTypeOptions): ERDomain {
        this.validateLinkTypeExistence(mark, true);
        this.linkTypes[mark] = assign({}, { mutual: false, transitive: false }, options); // immutable assignation
        return this;
    }

    /** 
     * Updates properties of already registered link type.
     * @argument mark - link type name.
     * @argument options - new link type properties. Specified will override old ones, others will stay unchanged.
     * @returns current ERDomain instance
     */
    public editLinkType(mark: string, options: ERDomainLinkTypeOptions): ERDomain {
        this.validateLinkTypeExistence(mark, false);
        this.linkTypes[mark] = assign({}, this.linkTypes[mark], options); // immutable assignation
        return this;
    }

    /**
     * Get full list of link types names registered within the domain.
     * @return list of all link types names registered
     */
    public getLinkTypes(): string[] {
        return Object.keys(this.linkTypes);
    }

    /** 
     * Get registered link type options.
     * @argument mark - link type name
     * @argument silent - if true, no exception will be throwed in case of specified link type does not exist.
     * @returns link type details or null if lik type is not registered
     */
    public getLinkTypeInfo(mark: string, silent = false): ERDomainLinkTypeOptions | null {
        if (!silent) { this.validateLinkTypeExistence(mark); }
        return this.linkTypes[mark] || null;
    }

    /**
     * Detecting, whether current domain has a registered link type with specified mark or not.
     * @argument mark - link type name
     * @returns true if link type registered, false otherwise
     */
    public hasLinkType(mark: string): boolean {
        return mark in this.linkTypes;
    }

    /** 
     * Removes registered link type.
     * @argument mark - registered link type name.
     * @argument consistent - if true, type removing is consistent. It means, that all links of this type will be also removed.
     * @returns current ERDomain instance
     */
    public removeLinkType(mark: string, consistent = true): ERDomain {
        this.removeLinkTypeIfRequired(mark, consistent);
        return this;
    }

    /** 
     * Connect two entities by link of specified type and assign specified value on this link.
     * @argument entities - pair of strings that identify entities
     * @argument linkType - name of link type, that will be used to link entities
     * @argument value - value, to assign on created link
     * @returns current ERDomain instance
     */
    public link(linkType: string, entities: [string, string], value?: any): ERDomain {
        this.linkEntities(linkType, entities, value);
        return this;
    }

    /**
     * Gives you an information whether entities has link of specified type. If no type specified
     * it looks for link of any type between specified entities.
     * @argument entities - pair of entities names to test.
     * @argument linkType - name of link that chold connect entitied.
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
     * @argument linkType - name of link type, links of which will be removed.
     * @argument entities - list of entities or single entity to unlink.
     * @returns current ERDomain instance
     */
    public unlink(entities: string | [string, string], linkType?: string): ERDomain {
        this.unlinkEntities(entities, linkType);
        return this;
    }

    /**
     * Removes all links of specified type (or simply all links if no type specified)
     * within the domain.
     * @argument linkType - name of link type.
     * @returns current ERDomain instance
     */
    public unlinkAll(linkType?: string): ERDomain {
        this.removeAllLinksOfType(linkType);
        return this;
    }

    /**
     * Add entity to domain.
     * @argument mark - entity identifier. Must be unique among all of link types within the current domain.
     * @argument value - value to assign to entity.
     * @returns current ERDomain instance
     */
    public addEntity(mark: string, value?: any): ERDomain {
        this.validateEntityExistence(mark, true);
        this.graph.setNode(mark, value);
        return this;
    }

    /**
     * Update entity assigned value.
     * @argument mark - entity identifier.
     * @argument value - new value to assign to entity.
     * @returns current ERDomain instance
     */
    public editEntity(mark: string, value?: any): ERDomain {
        this.validateEntityExistence(mark, false);
        this.graph.setNode(mark, value);
        return this;
    }

    /**
     * Detect whether an entity with specified mark exists within the domain.
     * @argument mark - entity name.
     * @returns whether domain has an entity with specified name or not.
     */
    public hasEntity(mark: string): boolean {
        return this.graph.hasNode(mark);
    }

    /**
     * Remove entity from domain. Removing entity unlinks all related entities from it.
     * @argument mark - entity identifier.
     * @returns current ERDomain instance.
     */
    public removeEntity(mark: string): ERDomain {
        this.graph.removeNode(mark);
        return this;
    }

    /**
     * Acquire existed entity details.
     * @argument mark - entity name
     * @argument silent - if true, no exception will be throwed in case of specified entity does not exist.
     * @returns specified entity details or null if no such an entity found.
     */
    public getEntityDetails(mark: string, silent = false): any | null {
        if (!silent) { this.validateEntityExistence(mark, false); }
        return this.graph.node(mark);
    }

    /**
     * Creating a domain of entites and connections between them. Graph to store domain can be specified,
     * otherwise default store will be created.
     * @argument store - graph for storing the domain.
     */
    constructor(store?: Graph) {
        this.graph = store || new Graph({ directed: true, multigraph: true });
    }


    // @internal
    private graph: Graph;
    // @internal
    private linkTypes: ERDomainLinkTypesDict = {};

    // @internal
    private removeAllLinksOfType(type?: string): void {
        this.graph.edges()
            .filter( edge => type !== undefined ? edge.name === type : true )
            .forEach( edge => this.graph.removeEdge(edge) );
    }

    // @internal
    private removeLinkTypeIfRequired(mark: string, consistent: boolean): void {
        if (this.linkTypes[mark]) {
            if (consistent) { this.removeAllLinksOfType(mark); }
            delete this.linkTypes[mark];
        }
    }

    // @internal
    private validateLinkTypeExistence(mark: string, invertValidation = false): void {
        if (!invertValidation && !(mark in this.linkTypes)) {
            throw new Error(`Link type with mark ${mark} is not registered`);
        } else if (invertValidation && mark in this.linkTypes) {
            throw new Error(`Link type with mark ${mark} already registered.`);
        }
    }

    // @internal
    private validateEntityExistence(mark: string, invertValidation = false): void {
        if (!invertValidation && !(this.graph.hasNode(mark))) {
            throw new Error(`Entity marked as '${mark}' does not exsist.`);
        } else if (invertValidation && this.graph.hasNode(mark)) {
            throw new Error(`Entity marked as '${mark}' already exists.`);
        }
    }

    // @internal
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
            });
        });
    }

    // @internal
    private findConnectors(type: string, from: string, to: string): [string[], string[]] {
        let lLinkTypeInfo = this.linkTypes[type];
        let lSources = [from];
        let lTargets = [to];
        if (lLinkTypeInfo.transitive) {
            lSources = this.findTransitiveConnectedEntities(type, lSources, true);
            lTargets = this.findTransitiveConnectedEntities(type, lTargets, false);
        }
        return [lSources, lTargets];
    }

    // @internal
    private findTransitiveConnectedEntities(linkType: string, sources: string[], sink: boolean): string[] {
        let lEntities: string[] = sources.slice();
        let lSources: string[] = sources.slice();

        // nonrecursive algorithm
        while(lSources.length) {
            this.getLinkedEntities(<string>lSources.pop(), lEntities, linkType, sink)
                .forEach( v => (lEntities.push(v), lSources.unshift(v)) );
        }

        return lEntities;
    }

    // @internal
    private getLinkedEntities(source: string, exclude: string[], linkType: string, sink: boolean): string[] {
        let edges = sink ? this.graph.inEdges( source ) : this.graph.outEdges( source );
        return edges && edges
            .filter( e => linkType ? e.name === linkType : true )
            .map( e => sink ? e.v : e.w )
            .filter( w => exclude.indexOf(w) < 0 ) || [];
    }

    // @internal
    private unlinkEntities(entities: string | [string, string], linkType?: string): void {
        let lUnlinkingEdge = typeof entities === 'string' ? [entities] : entities;
        let lEdgesToUnlink = this.graph.outEdges(lUnlinkingEdge[0], lUnlinkingEdge[1] || undefined);
        lEdgesToUnlink = lEdgesToUnlink && linkType && lEdgesToUnlink.filter( edge => edge.name === linkType ) || [];
        lEdgesToUnlink.forEach( edge => this.graph.removeEdge(edge) );
    }
}

export interface ERDomainLinkTypeOptions {
    mutual?: boolean;
    transitive?: boolean;
}

interface ERDomainLinkTypesDict {
    [k: string]: ERDomainLinkTypeOptions;
}
