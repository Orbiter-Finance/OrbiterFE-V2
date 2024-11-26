import React from 'react'
import { OrbiterShow } from '@orbiter-finance/ui'
import { TRANSACTION_STATUS } from '../constant'

export const TransactionConfirmStatus: React.FC<{ status: number, isTo?: boolean }> = ({
    status,
    isTo
}) => {

    return (
        <OrbiterShow
            when={status > (isTo ? TRANSACTION_STATUS.FROM_CHECK : TRANSACTION_STATUS.FROM_OKAY)}
            fallback={
                <OrbiterShow
                    when={!isTo || status === TRANSACTION_STATUS.FROM_CHECK}
                >
                    <svg className='o-dash-svg w-4 h-4' viewBox="25 25 50 50">
                        <circle className='o-dash-circle' fill='none' stroke='#FF5C5C' r="20" cy="50" cx="50" strokeWidth="2" strokeDashoffset="0" strokeDasharray="1 200" strokeLinecap='round'></circle>
                    </svg>
                </OrbiterShow>
            }
        >
            <OrbiterShow
                when={(status === TRANSACTION_STATUS.TO_FAILED) && isTo}
                fallback={
                    <svg width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <path id="Vector" d="M8 1.33C4.32 1.33 1.33 4.32 1.33 7.99C1.33 11.67 4.32 14.66 8 14.66C11.67 14.66 14.66 11.67 14.66 7.99C14.66 4.32 11.67 1.33 8 1.33ZM11.18 6.46L7.4 10.24C7.31 10.34 7.18 10.39 7.05 10.39C6.91 10.39 6.79 10.34 6.7 10.24L4.81 8.35C4.62 8.16 4.62 7.84 4.81 7.65C5 7.45 5.32 7.45 5.52 7.65L7.05 9.18L10.48 5.75C10.67 5.56 10.99 5.56 11.18 5.75C11.38 5.95 11.38 6.26 11.18 6.46Z" fill="#46B647" fillOpacity="1.000000" fillRule="nonzero" />
                        <g opacity="0.000000" />
                    </svg>
                }
            >
                <svg width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect rx="8.000000" width="16.000000" height="16.000000" fill="#551921" fillOpacity="1.000000" />
                    <path id="Vector" d="M5 11L11 4.99" stroke="#FF5C5C" strokeOpacity="1.000000" strokeWidth="1.500000" strokeLinejoin="round" strokeLinecap="round" />
                    <path id="Vector" d="M10.99 10.99L5 5" stroke="#FF5C5C" strokeOpacity="1.000000" strokeWidth="1.500000" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
            </OrbiterShow>
        </OrbiterShow>

    )
}
