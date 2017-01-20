export interface ERDomainLinkTypeOptions {
    mutual?: boolean;
    transitive?: boolean;
}

export interface ERDomainLinkTypesDict {
    [k: string]: ERDomainLinkTypeOptions;
}
