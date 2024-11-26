
import React, { useEffect, useRef } from 'react'
import { cn } from '../utils/cn'
import { ModalENUMType, ModalTypes } from './modal.type'

import { OrbiterShow } from '../OrbiterShow'

import { ModalHeader } from './ModalHeader'
import { OrbiterCard } from '../OrbiterCard'
import { CradTypes } from '../OrbiterCard/card.type'

export const OrbiterModal: React.FC<ModalTypes & CradTypes> = ({
    type = ModalENUMType.PAGE,
    show,
    containerClassName,
    headerRender,
    headerLabel,
    headerIcon,
    close,
    onClose,
    onShowChange,
    children,
    isBorder,
    isHiddenMaskModal
}) => {

    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (typeof document !== "undefined") {
            if (show && ref?.current) {
                document.body.addEventListener("touchmove", (event: TouchEvent) => {
                    event.stopPropagation()
                })
                document.body.style.overflow = "hidden"
                if (!document.getElementById("orbiter-modal-card")) {
                    ref.current.id = "orbiter-modal-card"
                    document.body.appendChild(ref.current)
                }
            } else {
                document.body.style.overflow = "visable"
            }
        }
        return () => {
            if (typeof document !== "undefined") {

                if (ref?.current && ref?.current?.id) {
                    console.log("111111", document.querySelector(`body > #orbiter-modal-card`), ref.current)
                    if (document.querySelector(`body > #${ref?.current?.id}`)) {
                        try {
                            document.body.removeChild(ref.current)
                        } catch (error) {
                            console.log("error", error)
                        }
                    }
                }
            }
        }
    }, [show, ref])

    return (
        <div ref={ref}>
            <OrbiterShow
                when={!!show}
            >
                <OrbiterShow when={!isHiddenMaskModal}>
                    <div className='w-screen h-screen flex justify-center items-center fixed top-0 left-0 z-[var(--modal-bg-z-index)] bg-[var(--o-color-black)] opacity-60'></div>
                </OrbiterShow>
                <OrbiterShow
                    when={
                        type === ModalENUMType.PAGE
                    }
                    fallback={
                        <div className={
                            cn("flex justify-center items-end sm:items-center absolute w-full h-full z-[var(--modal-z-index)] top-0 left-0")
                        }
                            onClick={(event) => {
                                event.stopPropagation()
                                onClose && onClose()
                                onShowChange && onShowChange(false)
                            }}
                        >
                            <OrbiterCard
                                isBorder={isBorder}
                                className={
                                    cn("w-f max-h-[64vh]ull max-w-[24.5rem] sm:h-[40rem] sm:max-h-[40rem]  flex flex-col bg-[var(--o-color-gray-800)] rounded-none sm:rounded-3xl rounded-t-3xl p-0 pt-0 px-4 pb-4", containerClassName)
                                }
                            >
                                <ModalHeader
                                    headerLabel={headerLabel}
                                    headerIcon={headerIcon}
                                    close={close}
                                    onClose={onClose}
                                    onShowChange={onShowChange}
                                    headerRender={headerRender}
                                />

                                {children}
                            </OrbiterCard>
                        </div>
                    }
                >
                    <div
                        onClick={(event) => {
                            event.stopPropagation()
                            onClose && onClose()
                            onShowChange && onShowChange(false)
                        }}
                        className={
                            cn("w-full h-full flex justify-center items-end sm:items-center fixed z-[var(--modal-z-index)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")
                        }>
                        <OrbiterCard
                            isBorder={isBorder}
                            className={
                                cn("w-full max-h-[64vh] sm:max-w-[24.5rem] sm:h-[40rem] sm:max-h-[40rem]  flex flex-col bg-[var(--o-color-gray-800)] rounded-none orbiter-modal-card-animation-mobile sm:orbiter-modal-card-animation sm:rounded-3xl rounded-t-3xl p-0 pt-0 px-4 pb-4", containerClassName)
                            }
                        >
                            <ModalHeader
                                headerLabel={headerLabel}
                                headerIcon={headerIcon}
                                close={close}
                                onClose={onClose}
                                onShowChange={onShowChange}
                                headerRender={headerRender}
                            />

                            {children}
                        </OrbiterCard>
                    </div>
                </OrbiterShow>
            </OrbiterShow>
        </div>
    )
}
