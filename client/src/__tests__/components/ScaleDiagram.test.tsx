import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ScaleDiagram } from "@/components/ScaleDiagram";
import { SkeletonScaleDiagram } from "@/components/SkeletonScaleDiagram";
import type { ScaleInfo } from "@/types";

const mockScaleInfo = (overrides: Partial<ScaleInfo> = {}): ScaleInfo => ({
  name: "C Major",
  rootNote: "C",
  notes: ["C", "D", "E", "F", "G", "A", "B"],
  fingering: [
    [8, 10, 12],
    [8, 10, 12],
    [9, 10, 12],
    [9, 10, 12],
    [10, 12, 13],
    [8, 10, 12],
  ],
  ...overrides,
});

vi.mock("@/components/ScaleDiagramModal", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="scale-diagram-modal">
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

describe("ScaleDiagram", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal toggle and view buttons", async () => {
    // Mock mobile viewport for expand button to be visible
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });
    window.dispatchEvent(new Event("resize"));

    render(<ScaleDiagram scaleInfo={mockScaleInfo()} musicalKey="C" />);

    expect(
      screen.getByRole("button", { name: /pattern/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /map/i })).toBeInTheDocument();

    // Wait for mobile detection effect to run
    await vi.waitFor(() => {
      const expandButton = screen.queryByLabelText(/expand to full view/i);
      expect(expandButton).toBeInTheDocument();
    });

    const expandButton = screen.getByLabelText(/expand to full view/i);
    fireEvent.click(expandButton);
    expect(
      await screen.findByTestId("scale-diagram-modal"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/close/i));
    expect(screen.queryByTestId("scale-diagram-modal")).not.toBeInTheDocument();

    // Restore window width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("displays position selector when multiple positions exist", () => {
    const multiPositionScale: ScaleInfo = {
      ...mockScaleInfo(),
      fingering: [
        [8, 10, 12],
        [8, 10, 12],
        [9, 10, 12],
        [9, 10, 12],
        [10, 12, 13],
        [8, 10, 12],
      ],
    };

    render(<ScaleDiagram scaleInfo={multiPositionScale} musicalKey="C" />);

    expect(screen.getByText(/Pos:/)).toBeInTheDocument();
  });

  it("clamps selected position when scale changes to fewer positions", async () => {
    const { rerender } = render(
      <ScaleDiagram scaleInfo={mockScaleInfo()} musicalKey="C" />,
    );

    fireEvent.click(screen.getByRole("tab", { name: /position 7/i }));

    const wholeTone: ScaleInfo = {
      name: "C Whole Tone",
      rootNote: "C",
      notes: ["C", "D", "E", "F#", "G#", "A#"],
      fingering: [
        [2, 4, 6],
        [3, 5, 7],
        [4, 6, 8],
        [5, 7, 9],
        [5, 7, 9],
        [2, 4, 6],
      ],
    };

    rerender(<ScaleDiagram scaleInfo={wholeTone} musicalKey="C" />);

    await waitFor(() => {
      const position2 = screen.getByRole("tab", { name: /position 2/i });
      expect(position2).toHaveAttribute("aria-pressed", "true");
    });
  });

  it("uses rootNote for displayed scale name when enharmonic differs", () => {
    render(
      <ScaleDiagram
        scaleInfo={{
          name: "A# Major",
          rootNote: "Bb",
          notes: ["Bb", "C", "D", "Eb", "F", "G", "A"],
          fingering: [
            [6, 8, 10],
            [6, 8, 10],
            [7, 8, 10],
            [7, 8, 10],
            [8, 10, 11],
            [6, 8, 10],
          ],
        }}
        musicalKey="Bb"
      />,
    );

    expect(screen.getByText("Bb Major")).toBeInTheDocument();
  });
});
