import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { add, endOfWeek, format, startOfWeek, sub } from "date-fns";
import { describe, expect, it } from "vitest";
import { Calendar } from "../Calendar";
import { MonthCalendar } from "../MonthCalendar";
import { axe } from "vitest-axe";

describe("integration: calendar with monthcalendar", () => {
  const setup = () => {
    userEvent.setup();
    const { container } = render(
      <Calendar value={new Date(0)}>
        <Calendar.Header>
          <Calendar.Button action="previous year">{"<<"}</Calendar.Button>
          <Calendar.Button action="previous month">{"<"}</Calendar.Button>

          <Calendar.Title />

          <Calendar.Button action="next month">{">"}</Calendar.Button>
          <Calendar.Button action="next year">{">>"}</Calendar.Button>
        </Calendar.Header>

        <MonthCalendar.Grid>
          <MonthCalendar.ColumnHeader />

          <MonthCalendar.GridCell />
        </MonthCalendar.Grid>
      </Calendar>
    );

    return () => axe(container);
  };



  it(
    "when click previous/next month, should change the month and year displayed in the calendar"
  , async () => {
    const axe = setup();

    const nextMonth = screen.getByRole("button", { name: /next month/ });
    const prevMonth = screen.getByRole("button", { name: /previous month/ });
    const nextYear = screen.getByRole("button", { name: /next year/ });
    const prevYear = screen.getByRole("button", { name: /previous year/ });

    expect(screen.getAllByRole(/(grid)?cell/).at(4)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(nextMonth);
    expect(screen.getAllByRole(/(grid)?cell/).at(0)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("28");
    expect(screen.getByRole("heading")).toHaveTextContent("February 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(prevMonth);
    expect(screen.getAllByRole(/(grid)?cell/).at(4)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(nextYear);
    expect(screen.getAllByRole(/(grid)?cell/).at(5)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1971");
    expect(await axe()).toHaveNoViolations();

    await userEvent.click(prevYear);
    expect(screen.getAllByRole(/(grid)?cell/).at(4)).toHaveTextContent("01");
    expect(screen.getAllByRole(/(grid)?cell/).at(-1)).toHaveTextContent("31");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();
  });

  it("user can change month/year using keyboard", async () => {
    const axe = setup();

    await userEvent.keyboard("{PageDown}");
    expect(screen.getByRole("heading")).toHaveTextContent("February 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.keyboard("{PageUp}");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();

    await userEvent.keyboard("{Shift>}{PageDown}{/Shift}");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1971");
    expect(await axe()).toHaveNoViolations();

    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    expect(screen.getByRole("heading")).toHaveTextContent("January 1970");
    expect(await axe()).toHaveNoViolations();
  });
});
