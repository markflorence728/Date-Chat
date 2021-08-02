import moment from "moment-timezone";

export const formatMessageTime = (timestampInSeconds: number): string => {
  if (!timestampInSeconds) {
    return '--:--'
  }

  const timezoneOffset = new Date().getTimezoneOffset() * 60;

  const todayStr = moment.unix(Date.now() / 1000).tz('America/Los_Angeles').format('Y-M-D');
  const todayTimestampInSecondes = (new Date(todayStr)).getTime() / 1000 + timezoneOffset;
  const yesterdayTimestampInSeconds = todayTimestampInSecondes - 86400;

  if (timestampInSeconds > todayTimestampInSecondes) {
    return 'Today ' + moment.unix(timestampInSeconds).tz('America/Los_Angeles').format('h:mm a');
  } else if (timestampInSeconds > yesterdayTimestampInSeconds) {
    return 'Yesterday ' + moment.unix(timestampInSeconds).tz('America/Los_Angeles').format('h:mm a');
  }

  return moment.unix(timestampInSeconds).tz('America/Los_Angeles').format('MMM Do, h:mm a');
}
