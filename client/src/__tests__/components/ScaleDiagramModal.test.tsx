import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ScaleDiagramModal from "@/components/ScaleDiagramModal";
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

describe("ScaleDiagramModal", () => {
  it("clamps selected position when scale changes to fewer positions", async () => {
    const { rerender } = render(
      <ScaleDiagramModal
        scaleInfo={mockScaleInfo()}
        musicalKey="C"
        isOpen
        onClose={() => {}}
      />,
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

    rerender(
      <ScaleDiagramModal
        scaleInfo={wholeTone}
        musicalKey="C"
        isOpen
        onClose={() => {}}
      />,
    );

    await waitFor(() => {
      const position2 = screen.getByRole("tab", { name: /position 2/i });
      expect(position2).toHaveAttribute("aria-pressed", "true");
    });
  });

  it("uses rootNote for displayed scale name when enharmonic differs", () => {
    render(
      <ScaleDiagramModal
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
        isOpen
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Bb Major")).toBeInTheDocument();
  });

  it("renders compact mode guidance chips in modal", () => {
    render(
      <ScaleDiagramModal
        scaleInfo={mockScaleInfo()}
        musicalKey="C"
        isOpen
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Formula")).toBeInTheDocument();
    expect(screen.getByText("1 2 3 4 5 6 7")).toBeInTheDocument();
    expect(screen.getByText("Relative")).toBeInTheDocument();
    expect(screen.getByText("C Major (I)")).toBeInTheDocument();
    expect(screen.queryByText(/Same notes as/i)).not.toBeInTheDocument();
  });
});
