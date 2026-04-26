import { format, parseISO, differenceInMinutes, differenceInHours } from "date-fns";

/**
 * Format a date to a readable string.
 * @param {Date|string} date
 * @param {string} fmt - date-fns format string
 */
export const formatDate = (date, fmt = "dd MMM yyyy") => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
};

/**
 * Format a date for display in booking cards.
 */
export const formatBookingDate = (date) => formatDate(date, "EEE, dd MMM yyyy");

/**
 * Format time from datetime string.
 */
export const formatTime = (datetime) => {
  if (!datetime) return "";
  const d = typeof datetime === "string" ? parseISO(datetime) : datetime;
  return format(d, "hh:mm a");
};

/**
 * Calculate duration between two datetimes.
 */
export const formatDuration = (departure, arrival) => {
  if (!departure || !arrival) return "";
  const dep = typeof departure === "string" ? parseISO(departure) : departure;
  const arr = typeof arrival === "string" ? parseISO(arrival) : arrival;
  const mins = differenceInMinutes(arr, dep);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs === 0) return `${remMins}m`;
  if (remMins === 0) return `${hrs}h`;
  return `${hrs}h ${remMins}m`;
};

/**
 * Format a date to ISO string (YYYY-MM-DD).
 */
export const toISODate = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "yyyy-MM-dd");
};

/**
 * Format relative time (e.g., "2 hours ago").
 */
export const timeAgo = (date) => {
  const d = typeof date === "string" ? parseISO(date) : date;
  const hours = differenceInHours(new Date(), d);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return formatDate(d);
};