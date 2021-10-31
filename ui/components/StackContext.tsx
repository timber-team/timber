import { createContext } from "react";

// Im im keeping this just incase I wanna stop prop drilling in the future
export interface GenericInterface<T> {
    setter: (value: T) => void;
    value: T
}

export interface swipeInfo {
    swiped: number,
    accept: Boolean
}

export const StackContext = createContext<GenericInterface<swipeInfo>>(undefined)