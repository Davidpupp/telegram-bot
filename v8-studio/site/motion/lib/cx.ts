/** Junta classes ignorando valores falsos. */
export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");
