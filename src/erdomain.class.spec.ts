import 'jasmine';

import { ERDomain } from './erdomain.class';


describe("Entities Relationships Domain", () => {

    let domain = new ERDomain();

    beforeEach(() => {});

    it("should create an instance", () => {
        expect(domain).toBeTruthy();
    });
});
