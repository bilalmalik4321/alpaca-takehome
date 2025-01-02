import { render } from "@testing-library/react";
import GenerateNotes from "../GenerateNotes";

describe("GenerateNotes Component", () => {
  it("renders without crashing", () => {
    render(<GenerateNotes />);
  });
});
