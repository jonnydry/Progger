import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScaleReference } from "@/components/ScaleReference";

vi.mock("@/components/ScaleDiagram", () => ({
  __esModule: true,
  default: ({ scaleInfo }: { scaleInfo: { name: string } }) => (
    <div data-testid="scale-diagram">{scaleInfo.name}</div>
  ),
}));

describe("ScaleReference", () => {
  it("renders root and scale selectors and a diagram without AI", async () => {
    render(<ScaleReference />);

    expect(screen.getByText(/Full-neck 3-note-per-string/i)).toBeInTheDocument();
    expect(await screen.findByTestId("scale-diagram")).toHaveTextContent(/C Major/i);
  });

  it("updates the diagram when scale type changes", async () => {
    render(<ScaleReference />);

    const scaleSelect = screen.getByLabelText("Scale");
    fireEvent.click(scaleSelect);

    const dorianOption = await screen.findByRole("option", { name: /^Dorian$/i });
    fireEvent.click(dorianOption);

    expect(await screen.findByTestId("scale-diagram")).toHaveTextContent(/Dorian/i);
  });
});
