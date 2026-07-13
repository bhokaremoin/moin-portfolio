import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandChips } from "@/components/themes/terminal/command-chips";

describe("CommandChips", () => {
  it("renders quick commands and fires onRun with the command", async () => {
    const onRun = vi.fn();
    render(<CommandChips onRun={onRun} />);
    await userEvent.click(screen.getByRole("button", { name: "projects" }));
    expect(onRun).toHaveBeenCalledWith("projects");
  });

  it("includes core quick commands", () => {
    render(<CommandChips onRun={() => {}} />);
    ["about", "projects", "experience", "skills", "contact", "help"].forEach((c) => {
      expect(screen.getByRole("button", { name: c })).toBeInTheDocument();
    });
  });
});
