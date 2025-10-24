declare module 'react-big-calendar' {
  import { Component } from 'react';

  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  
  export interface Event {
    id?: string | number;
    title: string;
    start: Date;
    end: Date;
    resource?: unknown;
    allDay?: boolean;
  }

  export interface CalendarProps<TEvent = Event, TResource = object> {
    localizer: unknown;
    events: TEvent[];
    startAccessor: string;
    endAccessor: string;
    view?: View;
    onView?: (view: View) => void;
    date?: Date;
    onNavigate?: (date: Date) => void;
    onSelectEvent?: (event: TEvent) => void;
    onSelectSlot?: (slotInfo: unknown) => void;
    selectable?: boolean;
    eventPropGetter?: (event: TEvent) => unknown;
    components?: {
      event?: React.ComponentType<{ event: TEvent }>;
      [key: string]: unknown;
    };
    messages?: {
      [key: string]: string | ((total: number) => string);
    };
    step?: number;
    timeslots?: number;
    [key: string]: unknown;
  }

  export class Calendar<TEvent = Event, TResource = object> extends Component<CalendarProps<TEvent, TResource>> {}

  export function momentLocalizer(moment: unknown): unknown;
}
