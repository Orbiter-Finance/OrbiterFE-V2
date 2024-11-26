import React from 'react'
import { OrbiterShow } from '@orbiter-finance/ui'
import { TRANSACTION_STATUS } from '../constant'

export const TransactionStatus: React.FC<{ status: number }> = ({
    status
}) => {
    return (
        <OrbiterShow
            when={status >= TRANSACTION_STATUS.TO_FAILED}
            fallback={
                <svg width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect rx="4.000000" width="16.000000" height="16.000000" fill="#002F6E" fillOpacity="1.000000" />
                    <path d="M11.09 10.65L8.5 9.1C8.05 8.84 7.69 8.19 7.69 7.67L7.69 4.25" stroke="#1487FD" strokeOpacity="1.000000" strokeWidth="1.500000" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
            }
        >
            <OrbiterShow
                when={status === TRANSACTION_STATUS.TO_FAILED}
                fallback={
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none">
                        <rect rx="4.000000" width="16.000000" height="16.000000" fill="#153D18" fillOpacity="1.000000" />
                        <path d="M4.45 8L6.81 10.35L11.54 5.64" stroke="var(--o-color-green-500)" strokeOpacity="1.000000" strokeWidth="1.500000" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                }
            >
                <svg width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect rx="4.000000" width="16.000000" height="16.000000" fill="#551921" fillOpacity="1.000000" />
                    <path id="Vector" d="M5 11L11 4.99" stroke="#FF5C5C" strokeOpacity="1.000000" strokeWidth="1.500000" strokeLinejoin="round" strokeLinecap="round" />
                    <path id="Vector" d="M10.99 10.99L5 5" stroke="#FF5C5C" strokeOpacity="1.000000" strokeWidth="1.500000" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
            </OrbiterShow>
        </OrbiterShow>

    )
}
