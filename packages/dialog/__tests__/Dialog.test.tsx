/// <reference types="vitest-axe/extend-expect" />
/// <reference types="vitest-dom/extend-expect" />

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { Dialog } from "../Dialog";
import { useRef, useState } from "react";

describe("<Dialog />", () => {
  describe("roles/states/properties", () => {
    it("the element that serves as the dialog container has a role of dialog.", () => {
      render(<Dialog data-testid="a" />);
      expect(screen.getByTestId("a")).toHaveAttribute("role", "dialog");
    });

    it("all elements required to operate the dialog are descendants of the element that has role dialog.", () => {
      render(
        <Dialog data-testid="a">
          <Dialog data-testid="b" />
        </Dialog>
      );
      expect(screen.getByTestId("a")).toHaveAttribute("role", "dialog");
      expect(screen.getByTestId("b")).toHaveAttribute("role", "dialog");
    });

    it("the dialog container element has aria-modal set to true.", () => {
      render(<Dialog data-testid="a" />);
      expect(screen.getByTestId("a")).toHaveAttribute("aria-modal", "true");
    });

    describe("the dialog has either:", () => {
      it("a value set for the aria-labelledby property that refers to a visible dialog title.", () => {
        render(
          <Dialog>
            <Dialog.Title>This is Title</Dialog.Title>
          </Dialog>
        );
        expect(screen.getByRole("dialog")).toHaveAttribute(
          "aria-labelledby",
          screen.getByText("This is Title").id
        );

        expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-label");
      });

      it("a label specified by aria-label.", () => {
        render(<Dialog aria-label="This is Title" />);

        expect(screen.getByRole("dialog")).toHaveAttribute(
          "aria-label",
          "This is Title"
        );
        expect(screen.getByRole("dialog")).not.toHaveAttribute(
          "aria-labelledby"
        );
      });
    });

    it(
      "optionally, the aria-describedby property is set on the element with the dialog role " +
        "to indicate which element or elements in the dialog contain content " +
        "that describes the primary purpose or message of the dialog.",
      () => {
        render(
          <Dialog aria-label="title">
            <Dialog.Description data-testid="desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
              at obcaecati, aliquid modi deserunt reprehenderit maiores nulla
              soluta itaque veritatis perspiciatis praesentium repellendus animi
              beatae expedita temporibus. Eaque, quae facilis?
            </Dialog.Description>
          </Dialog>
        );

        expect(screen.getByRole("dialog")).toHaveAttribute(
          "aria-describedby",
          screen.getByTestId("desc").id
        );
      }
    );
  });

  describe("keyboard interaction", () => {
    const setup = () => {
      user.setup();
      render(
        <Dialog aria-label="title">
          <input data-testid="element" type="checkbox" />
          <input data-testid="element" type="radio" />
          <input data-testid="element" type="number" />
        </Dialog>
      );
    };

    describe("dialog open", () => {
      it("when a dialog opens, focus moves to an element contained in the dialog", () => {
        setup();
        const [checkbox] = screen.getAllByTestId("element");
        expect(checkbox).toHaveFocus();
      });
    });

    describe("tab", () => {
      it("moves focus to the next tabbable element inside the dialog.", async () => {
        setup();
        const [checkbox, radio, number] = screen.getAllByTestId("element");
        expect(checkbox).toHaveFocus();
        await user.keyboard("{Tab}");
        expect(radio).toHaveFocus();
        await user.keyboard("{Tab}");
        expect(number).toHaveFocus();
        await user.keyboard("{Tab}");
        expect(checkbox).toHaveFocus();
      });

      it(
        "if focus is on the last tabbable element inside the dialog, " +
          "moves focus to the first tabbable element inside the dialog.",
        async () => {
          setup();
          const [checkbox, _, number] = screen.getAllByTestId("element");
          number.focus();
          expect(number).toHaveFocus();
          await user.keyboard("{Tab}");
          expect(checkbox).toHaveFocus();
        }
      );
    });

    describe("shift + tab", () => {
      it("moves focus to the previous tabbable element inside the dialog.", async () => {
        setup();
        const [checkbox, radio, number] = screen.getAllByTestId("element");
        expect(checkbox).toHaveFocus();
        await user.keyboard("{Shift>}{Tab}{/Shift}");
        expect(number).toHaveFocus();
        await user.keyboard("{Shift>}{Tab}{/Shift}");
        expect(radio).toHaveFocus();
        await user.keyboard("{Shift>}{Tab}{/Shift}");
        expect(checkbox).toHaveFocus();
      });

      it(
        "if focus is on the first tabbable element inside the dialog, " +
          "moves focus to the last tabbable element inside the dialog.",
        async () => {
          setup();
          const [checkbox, _, number] = screen.getAllByTestId("element");
          checkbox.focus();
          expect(checkbox).toHaveFocus();
          await user.keyboard("{Shift>}{Tab}{/Shift}");
          expect(number).toHaveFocus();
        }
      );
    });

    describe("escape", () => {
      const Comp = () => {
        const ref = useRef(null);
        const [open, setOpen] = useState(false);

        return (
          <>
            <button ref={ref} onClick={() => setOpen(true)}>
              Open Dialog
            </button>

            {open && (
              <Dialog
                data-testid="dialog"
                aria-label="title"
                previousFocusRef={ref}
                onDismiss={() => setOpen(false)}
              >
                <input data-testid="element" type="checkbox" />
                <input data-testid="element" type="radio" />
                <input data-testid="element" type="number" />
              </Dialog>
            )}
          </>
        );
      };

      it("closes the dialog.", async () => {
        user.setup();
        render(<Comp />);

        const button = screen.getByRole("button");
        await user.click(button);
        const dialog = screen.getByTestId("dialog");
        expect(dialog).toBeInTheDocument();

        await user.keyboard("{Escape}");
        expect(dialog).not.toBeInTheDocument();
        expect(button).toHaveFocus();
      });
    });
  });
});
