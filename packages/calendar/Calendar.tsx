import {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  createContext,
  useId,
} from "react";
import type { Dispatch, ElementType } from "react";
import { format, sub, add, startOfWeek, endOfWeek } from "date-fns";
import { MonthCalendar } from "./MonthCalendar";
import { PCP } from "../utils/types";

type Control = "previous" | "next" | "start of" | "end of";
type Unit = "year" | "month" | "week" | "day";
type Action = `${Control} ${Unit}`;

function reducer(date: Date, action: Action) {
  if (action === "previous month") {
    return sub(date, { months: 1 });
  }
  if (action === "next month") {
    return add(date, { months: 1 });
  }
  if (action === "previous year") {
    return sub(date, { years: 1 });
  }
  if (action === "next year") {
    return add(date, { years: 1 });
  }
  if (action === "next week") {
    return add(date, { weeks: 1 });
  }
  if (action === "previous week") {
    return sub(date, { weeks: 1 });
  }
  if (action === "next day") {
    return add(date, { days: 1 });
  }
  if (action === "previous day") {
    return sub(date, { days: 1 });
  }
  if (action === "start of week") {
    return startOfWeek(date);
  }
  if (action === "end of week") {
    return endOfWeek(date);
  }
  return date;
}

const keymap = (dispatch: Dispatch<Action>) => (event: KeyboardEvent) => {
  const { shiftKey, key } = event;
  if (shiftKey && key === "PageUp") {
    return dispatch("previous year");
  }
  if (shiftKey && key === "PageDown") {
    return dispatch("next year");
  }
  if (key === "PageUp") {
    return dispatch("previous month");
  }
  if (key === "PageDown") {
    return dispatch("next month");
  }
  if (key === "ArrowDown") {
    return dispatch("next week");
  }
  if (key === "ArrowUp") {
    return dispatch("previous week");
  }
  if (key === "ArrowLeft") {
    return dispatch("previous day");
  }
  if (key === "ArrowRight") {
    return dispatch("next day");
  }
  if (key === "Home") {
    return dispatch("start of week");
  }
  if (key === "End") {
    return dispatch("end of week");
  }
};

export const Context = createContext<State | null>(null);
function useCalendarContext(error: string) {
  const context = useContext(Context);
  if (!context) {
    throw new Error(error);
  }
  return context;
}

interface State {
  focus: Date;
  dispatch: Dispatch<Action>;
  grid_label: string;
}

export type HeaderProps = PCP<"header", {}>;
function Header(props: HeaderProps) {
  useCalendarContext(
    `<Calendar.Header /> cannot be rendered outside <Calendar />`
  );
  return <header className={props.className}>{props.children}</header>;
}

type _ButtonProps = {
  action: Action;
};
export type ButtonProps = PCP<"button", _ButtonProps>;
function Button(props: ButtonProps) {
  const context = useCalendarContext(
    `<Calendar.Button /> cannot be rendered outside <Calendar />`
  );

  const { action, ...rest } = props;
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      context.dispatch(action);
      props.onClick?.(event);
    },
    [context, action, props]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Space") {
        context.dispatch(action);
        props.onKeyDown?.(event);
      }
    },
    [context, action, props]
  );

  return (
    <button
      {...rest}
      type="button"
      aria-label={action}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {props.children}
    </button>
  );
}

export type TitleProps<E extends ElementType> = PCP<E, {}>;
function Title<E extends ElementType>(props: TitleProps<E>) {
  const context = useCalendarContext(
    `<Calendar.Title /> cannot be rendered outside <Calendar />`
  );

  const { as, ...rest } = props;
  const Comp = as ?? "h2";
  const children = props.children ?? format(context.focus, "MMMM yyyy");

  return (
    <Comp {...rest} aria-live="polite" id={context.grid_label}>
      {children}
    </Comp>
  );
}

type _CalendarProps = { value?: Date };
export type CalendarProps<E extends ElementType = "div"> = PCP<
  E,
  _CalendarProps
>;

export function Calendar<E extends ElementType = "div">(
  props: CalendarProps<E>
) {
  const { value, as, ...rest } = props;
  const Comp = as ?? "div";

  const [focus, dispatch] = useReducer(reducer, value ?? new Date());
  useEffect(() => {
    const keydown = keymap(dispatch);
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("keydown", keydown);
    };
  }, [dispatch]);

  const id = useId();
  const context = {
    focus,
    dispatch,
    grid_label: id + "grid-label",
  };

  return (
    <Context.Provider value={context}>
      <Comp {...rest} />
    </Context.Provider>
  );
}

Calendar.Header = Header;
Calendar.Button = Button;
Calendar.Title = Title;
