import React from 'react'
import { ModalHeader, OrbiterCard, OrbiterShow } from '@orbiter-finance/ui'
import { twMerge } from 'tailwind-merge'

export const Modal = ({
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
    isHiddenMaskModal,
}: any) => {
    return (
        <OrbiterShow when={!!show}>
            <div className="w-screen h-screen flex justify-center items-center fixed top-0 left-0 z-[var(--modal-bg-z-index)] bg-[var(--o-color-black)] opacity-60"></div>
            <div
                onClick={(event) => {
                    event.stopPropagation()
                    onClose && onClose()
                    onShowChange && onShowChange(false)
                }}
                className={twMerge(
                    'w-full h-full flex justify-center fixed z-[var(--modal-z-index)] top-0 right-0 bottom-0 left-0 sm:items-center items-end ',
                )}
            >
                <OrbiterCard
                    isBorder={isBorder}
                    className={twMerge(
                        'w-full  flex flex-col bg-[var(--o-color-gray-800)] rounded-none sm:rounded-3xl rounded-t-3xl p-0 pt-0 px-4 pb-4 max-h-screen',
                        containerClassName,
                    )}
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
    )
}
