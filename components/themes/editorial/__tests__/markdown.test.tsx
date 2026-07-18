import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "@/components/themes/editorial/markdown";

describe("Markdown", () => {
  it("renders headings and lists", () => {
    render(<Markdown source={"# Title\n\nHello world\n\n- one\n- two"} />);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("renders bold inline", () => {
    render(<Markdown source={"a **b** c"} />);
    expect(screen.getByText("b").tagName).toBe("STRONG");
  });
});
