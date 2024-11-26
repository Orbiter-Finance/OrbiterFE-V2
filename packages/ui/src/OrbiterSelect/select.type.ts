import { HTMLAttributes } from "react";
import { ReactNode } from "react";


export interface SelectItemTypes extends HTMLAttributes<HTMLDivElement> {
    itemKey: string,
    itemName: string,
    disabled?: boolean
    active?: boolean
    icon?: any
    label: ReactNode
    viceLabel?: string
    linkIcon?: string
    link?: string
    right?: ReactNode
    tags?: ReactNode
    activityClassName?: string
    clickViceTitle?: ()=> void
}

export interface SelectTypes extends HTMLAttributes<HTMLDivElement> {
    selectTitle?: ReactNode
    amount?: number
    list: SelectItemTypes[],
    renderItem?: (params: SelectItemTypes) => ReactNode
    onSelectChange?: (params: SelectItemTypes) => void
    itemClick?: (params: SelectItemTypes) => void
}
