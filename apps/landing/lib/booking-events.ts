export const OPEN_BOOKING_EVENT = "novadent:open-booking";

export interface OpenBookingDetail {
  prefill?: {
    patientName?: string;
    phone?: string;
    email?: string;
    reasonForVisit?: string;
  };
}

export function openBooking(detail?: OpenBookingDetail) {
  window.dispatchEvent(new CustomEvent<OpenBookingDetail>(OPEN_BOOKING_EVENT, { detail }));
}
