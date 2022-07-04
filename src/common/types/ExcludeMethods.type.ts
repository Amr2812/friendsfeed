export type ExcludeMethods<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
>;
