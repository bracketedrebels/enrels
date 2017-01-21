"use strict";
var graphlib_1 = require("graphlib");
var assign = require("object-assign");
var ERDomain = (function () {
    function ERDomain(store) {
        // @internal
        this.linkTypes = {};
        this.graph = store || new graphlib_1.Graph({ directed: true, multigraph: true });
    }
    /** Registers new link type.
     *  @argument mark - link type name. Must be unique among all of links types within the current domain.
     *  @argument options - link type properties.
     */
    ERDomain.prototype.addLinkType = function (mark, options) {
        this.validateLinkTypeExistence(mark, true);
        this.linkTypes[mark] = assign({}, { mutual: false, transitive: false }, options); // immutable assignation
    };
    /** Updates properties of already registered link type.
     *  @argument mark - link type name.
     *  @argument options - new link type properties. Specified will override old ones, others will stay unchanged.
     */
    ERDomain.prototype.editLinkType = function (mark, options) {
        this.validateLinkTypeExistence(mark, false);
        this.linkTypes[mark] = assign({}, this.linkTypes[mark], options); // immutable assignation
    };
    /** Get full list of link types names registered within the domain. */
    ERDomain.prototype.getLinkTypes = function () {
        return Object.keys(this.linkTypes);
    };
    /** Get registered link type options.
     *  @argument mark - link type name
     *  @argument silent - if true, no exception will be throwed in case of specified link type does not exist.
     */
    ERDomain.prototype.getLinkTypeInfo = function (mark, silent) {
        if (silent === void 0) { silent = false; }
        if (!silent) {
            this.validateLinkTypeExistence(mark);
        }
        return this.linkTypes[mark] || null;
    };
    /** Detecting, whether current domain has a registered link type with specified mark or not.
     *  @argument mark - link type name
     */
    ERDomain.prototype.hasLinkType = function (mark) {
        return mark in this.linkTypes;
    };
    /** Removes registered link type.
     *  @argument mark - registered link type name.
     *  @argument consistent - if true, type removing is consistent. It means, that all links of this type will be also removed.
     */
    ERDomain.prototype.removeLinkType = function (mark, consistent) {
        if (consistent === void 0) { consistent = true; }
        this.removeLinkTypeIfRequired(mark, consistent);
    };
    /** Connect two entities by link of specified type and assign specified value on this link.
     *
     *  @argument entities - pair of strings that identify entities
     *  @argument linkType - name of link type, that will be used to link entities
     *  @argument value - value, to assign on created link
     */
    ERDomain.prototype.link = function (linkType, entities, value) {
        this.linkEntities(linkType, entities, value);
    };
    /**
     * Gives you an information whether entities has link of specified type. If no type specified
     * it looks for link of any type between specified entities.
     *
     * @returns whether pair if antites connected via link of specified type.
     */
    ERDomain.prototype.areLinked = function (entities, linkType) {
        return this.graph.hasEdge(entities[0], entities[1], linkType);
    };
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
    ERDomain.prototype.unlink = function (entities, linkType) {
        this.unlinkEntities(entities, linkType);
    };
    /**
     * Removes all links of specified type (or simply all links if no type specified)
     * within the domain.
     *
     * @argument linkType - name of link type.
     */
    ERDomain.prototype.unlinkAll = function (linkType) {
        this.removeAllLinksOfType(linkType);
    };
    /** Add entity to domain.
     *  @argument mark - entity identifier. Must be unique among all of link types within the current domain.
     *  @argument value - value to assign to entity.
     */
    ERDomain.prototype.addEntity = function (mark, value) {
        this.validateEntityExistence(mark, true);
        this.graph.setNode(mark, value);
    };
    /** Update entity assigned value.
     *  @argument mark - entity identifier.
     *  @argument value - new value to assign to entity.
     */
    ERDomain.prototype.editEntity = function (mark, value) {
        this.validateEntityExistence(mark, false);
        this.graph.setNode(mark, value);
    };
    /** Detect whether an entity with specified mark exists within the domain. */
    ERDomain.prototype.hasEntity = function (mark) {
        return this.graph.hasNode(mark);
    };
    /** Remove entity from domain. Removing entity unlinks all related entities from it.
     *  @argument mark - entity identifier.
     */
    ERDomain.prototype.removeEntity = function (mark) {
        this.graph.removeNode(mark);
    };
    /** Acquire existed entity details.
     *  @argument mark - entity name
     *  @argument silent - if true, no exception will be throwed in case of specified entity does not exist.
     */
    ERDomain.prototype.getEntityDetails = function (mark, silent) {
        if (silent === void 0) { silent = false; }
        if (!silent) {
            this.validateEntityExistence(mark, false);
        }
        return this.graph.node(mark);
    };
    // @internal
    ERDomain.prototype.removeAllLinksOfType = function (type) {
        var _this = this;
        this.graph.edges()
            .filter(function (edge) { return type !== undefined ? edge.name === type : true; })
            .forEach(function (edge) { return _this.graph.removeEdge(edge); });
    };
    // @internal
    ERDomain.prototype.removeLinkTypeIfRequired = function (mark, consistent) {
        if (this.linkTypes[mark]) {
            if (consistent) {
                this.removeAllLinksOfType(mark);
            }
            delete this.linkTypes[mark];
        }
    };
    // @internal
    ERDomain.prototype.validateLinkTypeExistence = function (mark, invertValidation) {
        if (invertValidation === void 0) { invertValidation = false; }
        if (!invertValidation && !(mark in this.linkTypes)) {
            throw new Error("Link type with mark " + mark + " is not registered");
        }
        else if (invertValidation && mark in this.linkTypes) {
            throw new Error("Link type with mark " + mark + " already registered.");
        }
    };
    // @internal
    ERDomain.prototype.validateEntityExistence = function (mark, invertValidation) {
        if (invertValidation === void 0) { invertValidation = false; }
        if (!invertValidation && !(this.graph.hasNode(mark))) {
            throw new Error("Entity marked as '" + mark + "' does not exsist.");
        }
        else if (invertValidation && this.graph.hasNode(mark)) {
            throw new Error("Entity marked as '" + mark + "' already exists.");
        }
    };
    // @internal
    ERDomain.prototype.linkEntities = function (linkType, entities, value) {
        var _this = this;
        var lSource = entities[0];
        var lTarget = entities[1];
        if (!this.hasLinkType(linkType)) {
            this.addLinkType(linkType);
        }
        if (!this.hasEntity(lSource)) {
            this.addEntity(lSource);
        }
        if (!this.hasEntity(lTarget)) {
            this.addEntity(lTarget);
        }
        var _a = this.findConnectors(linkType, lSource, lTarget), sources = _a[0], targets = _a[1];
        var lLinkTypeInfo = this.linkTypes[linkType];
        sources.forEach(function (v) {
            targets.forEach(function (w) {
                _this.graph.setEdge(v, w, value, linkType);
                if (lLinkTypeInfo.mutual) {
                    _this.graph.setEdge(w, v, value, linkType);
                }
            });
        });
    };
    // @internal
    ERDomain.prototype.findConnectors = function (type, from, to) {
        var lLinkTypeInfo = this.linkTypes[type];
        var lSources = [from];
        var lTargets = [to];
        if (lLinkTypeInfo.transitive) {
            lSources = this.findTransitiveConnectedEntities(type, lSources, true);
            lTargets = this.findTransitiveConnectedEntities(type, lTargets, false);
        }
        return [lSources, lTargets];
    };
    // @internal
    ERDomain.prototype.findTransitiveConnectedEntities = function (linkType, sources, sink) {
        var lEntities = sources.slice();
        var lSources = sources.slice();
        // nonrecursive algorithm
        while (lSources.length) {
            this.getLinkedEntities(lSources.pop(), lEntities, linkType, sink)
                .forEach(function (v) { return (lEntities.push(v), lSources.unshift(v)); });
        }
        return lEntities;
    };
    // @internal
    ERDomain.prototype.getLinkedEntities = function (source, exclude, linkType, sink) {
        var edges = sink ? this.graph.inEdges(source) : this.graph.outEdges(source);
        return edges && edges
            .filter(function (e) { return linkType ? e.name === linkType : true; })
            .map(function (e) { return sink ? e.v : e.w; })
            .filter(function (w) { return exclude.indexOf(w) < 0; }) || [];
    };
    // @internal
    ERDomain.prototype.unlinkEntities = function (entities, linkType) {
        var _this = this;
        var lUnlinkingEdge = typeof entities === 'string' ? [entities] : entities;
        var lEdgesToUnlink = this.graph.outEdges(lUnlinkingEdge[0], lUnlinkingEdge[1] || undefined);
        lEdgesToUnlink = lEdgesToUnlink && linkType && lEdgesToUnlink.filter(function (edge) { return edge.name === linkType; }) || [];
        lEdgesToUnlink.forEach(function (edge) { return _this.graph.removeEdge(edge); });
    };
    return ERDomain;
}());
exports.ERDomain = ERDomain;
