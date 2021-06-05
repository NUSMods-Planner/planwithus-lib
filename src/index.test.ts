import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { should } from "chai";

import { initVerifiers } from "./";

const ajv = new Ajv({
  allErrors: true, // necessary for ajv-errors
  allowUnionTypes: true,
});
ajvErrors(ajv);

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

export { ajv };
