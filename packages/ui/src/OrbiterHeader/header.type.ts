import { HTMLAttributes, ReactNode } from "react";


export interface HeaderTypes  extends HTMLAttributes<HTMLDivElement> {
    logo?: ReactNode,
    menu?: ReactNode
    tools?: ReactNode
} 