import { createContext } from "react";

export interface GenericInterface<T> {
    setter: (value: T) => void;
    value: T
}

export interface swipeInfo {
    swiped: Boolean,
    accept: Boolean
}

export const StackContext = createContext<GenericInterface<swipeInfo>>(undefined)