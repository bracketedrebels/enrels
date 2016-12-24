export interface ERDomainLinkTypeOptions {
    commutative?: boolean;
    transitive?: boolean;
}

export interface ERDomainLinkTypesDict {
    [k: string]: ERDomainLinkTypeOptions
}
