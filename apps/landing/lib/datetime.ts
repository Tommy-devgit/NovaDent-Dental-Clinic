import { fromZonedTime } from "date-fns-tz";

const CLINIC_TIME_ZONE = "Europe/London";

/**
 * Interpret a `YYYY-MM-DD` date + `HH:mm` time as clinic-local (Europe/London) wall-clock
 * and return the corresponding UTC instant. Parsing `new Date("...T...")` on the server would
 * use the server's timezone, drifting appointments by the UTC offset (and breaking across BST/GMT).
 */
export function parseLondonDateTime(date: string, time: string): Date {
  return fromZonedTime(`${date}T${time}`, CLINIC_TIME_ZONE);
}
