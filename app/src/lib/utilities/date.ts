import "temporal-polyfill/global"

/**
 * get the current timestamp
 * - for epoch, use `Temporal.Now.instant().epochMilliseconds`,
 * - for string, use `Temporal.Now.instant().toString()`,
 * - other formats are available: `Temporal.Now.instant().toJSON()`, `Temporal.Now.instant().toZonedDateTime()`, etc.
 * @docs https://tc39.es/proposal-temporal/docs/now.html
 */
export const getCurrentTimestamp = (): string => {
  const now = Temporal.Now.instant()
  return now
    .toZonedDateTimeISO("UTC")
    .toString({
      offset: "never",
      timeZoneName: "never",
      smallestUnit: "second"
    })
    .replace("Z", "+00:00")
}

export const getCurrentISODateTime = () => Temporal.Now.plainDateTimeISO().toString()

export const isoTimestampToEpoch = (timestamp: string) =>
  Temporal.Instant.from(timestamp).epochMilliseconds

export const epochToIsoTimestamp = (epoch: number) =>
  Temporal.Instant.fromEpochMilliseconds(epoch).toString()

export const formatTimestamp = (timestamp: string) =>
  Temporal.Instant.from(timestamp).toZonedDateTimeISO("UTC").toString({
    offset: "never",
    timeZoneName: "never",
    smallestUnit: "second"
  })

export const currentUtcTimestamp = () => Temporal.Now.plainDateTimeISO("UTC").toString()

export const currentUtcTimestampWithBuffer = ({
  milliseconds = 0
}: { milliseconds?: number } = {}) =>
  Temporal.Now.plainDateTimeISO("UTC").add({ milliseconds }).toString()

// yyyy-mm-dd hh:mm:ss
export function toPrettyDateTimeFormat(timestamp: string, { local = false } = {}) {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat("en-CA", {
    hour12: false,
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: local ? undefined : "UTC"
  })
    .format(date)
    .replaceAll(",", "")
}

// https://stackoverflow.com/a/17415677
export function toIsoString(date: Date) {
  const pad = (num: number) => (num < 10 ? "0" : "") + num

  // @ts-ignore
  return (
    // biome-ignore lint/style/useTemplate: would be illegible
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  )
}
