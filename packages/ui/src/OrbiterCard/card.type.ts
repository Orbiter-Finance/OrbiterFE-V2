

import { HTMLAttributes } from "react";
import { ReactNode } from "react";

export interface CardHeaderType extends HTMLAttributes<HTMLDivElement> {
    left?: ReactNode
    right?: ReactNode
}

export interface CradTypes extends HTMLAttributes<HTMLDivElement> {
    isBorder?: boolean
    children?: ReactNode
}
