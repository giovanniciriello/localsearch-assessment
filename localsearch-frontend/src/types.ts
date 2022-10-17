export interface BusinessEntry {
  language: string;
  entry_type: string;
  local_entry_id: string;
  favorited: boolean;
  addresses: object[];
  tags: object[];
  displayed_what: string;
  displayed_where: string;
  opening_hours: OpeningTimeTable;
  creation_date: Date;
  modified_date: Date;
  _class: string;
  _update_process_type: string;
}

export interface OpeningTimeTable {
  days: OpeningDay;
  closed_on_holidays: boolean;
  open_by_arrangement: boolean;
}

export type OpeningDay = { [K in Day]?: OpeningDaySlot[] }

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface OpeningDaySlot {
  start: string;
  end: string;
  type: string;
}