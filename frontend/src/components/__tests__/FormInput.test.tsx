import { render, screen, fireEvent } from "@testing-library/react";
import { FormInput } from "../FormInput";

describe("FormInput Component", () => {
  it("renders the input field with the correct label", () => {
    render(
      <FormInput
        label="Patient Name"
        value=""
        onChange={() => {}}
        id="patient-name"
      />
    );
    expect(screen.getByLabelText("Patient Name:")).toBeInTheDocument();
  });

  it("updates the value on change", () => {
    const handleChange = jest.fn();
    render(
      <FormInput
        label="Patient Name"
        value=""
        onChange={handleChange}
        id="patient-name"
      />
    );
    const input = screen.getByLabelText("Patient Name:");
    fireEvent.change(input, { target: { value: "John Doe" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
