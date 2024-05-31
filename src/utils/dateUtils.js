import { format, fromUnixTime } from "date-fns";

const DEFAULT_DATE_FORMAT = "MMMM d, yyyy";

export const formatDate = (unixTimestamp, dateFormat = DEFAULT_DATE_FORMAT) => {
  const date = fromUnixTime(unixTimestamp / 1000);

  return format(date, dateFormat);
};
