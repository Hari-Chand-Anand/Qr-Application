export type SpareStatus = string;

/**
 * Ticket-style rows from Google Sheets CSV.
 * Headers must match exactly (preferred):
 * TicketID, Date, Status, Technician, Type, Category, Problem, Action Taken
 *
 * NOTE: Some sheets may use "ActionTaken" (no space). We support both.
 */
export type SpareRow = {
  TicketID: string;
  Date: string;
  Status: SpareStatus;
  Technician: string;
  Type: string;
  Category: string;
  Problem: string;
  "Action Taken"?: string;
  ActionTaken?: string;
};
