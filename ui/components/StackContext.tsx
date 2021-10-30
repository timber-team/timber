import { createContext } from "react";

export interface GenericInterface<T> {
    setter: (value: T) => void;
    value: T
}

export interface swipeInfo {
    swiped: number,
    accept: Boolean
}

export const StackContext = createContext<GenericInterface<swipeInfo>>(undefined)