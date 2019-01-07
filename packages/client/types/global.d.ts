/** Global definitions for development **/

// for style loader
declare module '*.css';
declare module '*.scss';
declare module '*.svg';
declare module '*.jpg';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;

type ResolvePromise<T> = T extends Promise<infer U> ? U : T;
