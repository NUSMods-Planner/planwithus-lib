import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { should } from "chai";

import { initDirectories } from "./";

const ajv = new Ajv({
  allErrors: true, // necessary for ajv-errors
  allowUnionTypes: true,
});
ajvErrors(ajv);

should();

describe("initDirectories", () => {
  it("should parse all blocks with no errors", () =>
    initDirectories.should.not.throw());

  it("should produce primary, second & minor directories", async () => {
    const directories = initDirectories();
    directories.should.have.property("primary");
    directories.should.have.property("second");
    directories.should.have.property("minor");
  });
});

export { ajv };
