import React from "react";

export enum ModalENUMType {
    PAGE = "PAGE",
    ELEMENT = "ELEMENT",
}

export interface ModalHeaderTypes {
    headerRender?: React.ReactNode
    headerLabel?: React.ReactNode
    headerIcon?: React.ReactNode
    close?: React.ReactNode
    onClose?: ()=>void
    onShowChange?: (show: boolean)=>void
}

export interface BaseModalTypes extends ModalHeaderTypes {
    children?: React.ReactNode
    show?: boolean
    containerClassName?: string
    onShowChange?: (show: boolean)=>void
}

export interface ModalTypes extends BaseModalTypes {
    type?: ModalENUMType
    isHiddenMaskModal?: boolean
}