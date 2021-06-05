import { should } from "chai";

import { initVerifiers } from "./";

should();

describe("initVerifiers", () => {
  it("should parse all blocks with no errors", () =>
    initVerifiers.should.not.throw());

  it("should produce primary, second & minor verifiers", async () => {
    const verifiers = await initVerifiers();
    verifiers.should.have.property("primary");
    verifiers.should.have.property("second");
    verifiers.should.have.property("minor");
  });
});
