import React from 'react'
export const StatusIcon = ({ status, type }: { status: number; type: string }) => {
    return status === 3 || type === 'user' ? (
        <svg
            width="16.000000"
            height="16.000000"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <desc>Created with Pixso.</desc>
            <defs />
            <rect
                id="画板 389"
                rx="4.000000"
                width="16.000000"
                height="16.000000"
                fill="#153D18"
                fillOpacity="1.000000"
            />
            <path
                id="Vector"
                d="M4.45 7.99L6.81 10.35L11.54 5.64"
                stroke="#46B647"
                strokeOpacity="1.000000"
                strokeWidth="1.500000"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    ) : (
        <svg
            width="16.000000"
            height="16.000000"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <desc>Created with Pixso.</desc>
            <defs />
            <rect
                id="画板 389"
                rx="4.000000"
                width="16.000000"
                height="16.000000"
                fill="#002F6E"
                fillOpacity="1.000000"
            />
            <path
                id="Vector"
                d="M11.09 10.65L8.5 9.1C8.05 8.84 7.69 8.19 7.69 7.67L7.69 4.25"
                stroke="#1487FD"
                strokeOpacity="1.000000"
                strokeWidth="1.500000"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    )
}

export const OPointIcon = () => {
    return (
        <svg
            width="16.000000"
            height="16.000000"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter
                    id="filter_734_186_dd"
                    x="1.599976"
                    y="1.863281"
                    width="12.800049"
                    height="12.278320"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx="2" dy="0" />
                    <feGaussianBlur stdDeviation="0" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                    <feBlend mode="normal" in2="shape" result="effect_innerShadow_1" />
                </filter>
                <filter
                    id="filter_734_187_dd"
                    x="6.000000"
                    y="5.599609"
                    width="4.800049"
                    height="5.200195"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dx="-1" dy="0" />
                    <feGaussianBlur stdDeviation="0" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                    <feBlend mode="normal" in2="shape" result="effect_innerShadow_1" />
                </filter>
            </defs>
            <path
                d="M12.72 0.79L12.72 2.41L14.13 2.41L14.13 4.03L16 4.03L16 11.96L14.13 11.96L14.13 13.58L12.72 13.58L12.72 15.2L9.52 15.2L9.52 16L6.47 16L6.47 15.2L3.27 15.2L3.27 13.58L1.86 13.58L1.86 11.96L0 11.96L0 4.03L1.86 4.03L1.86 2.41L3.27 2.41L3.27 0.79L6.47 0.79L6.47 0L9.52 0L9.52 0.79L12.72 0.79Z"
                fill="#CE3B2E"
                fillOpacity="1.000000"
                fillRule="evenodd"
            />
            <path
                d="M14.13 3.43L14.13 2.41L12.72 2.41L12.72 0.79L9.52 0.79L9.52 0L6.47 0L6.47 0.79L3.27 0.79L3.27 2.41L1.86 2.41L1.86 4.03L0 4.03L0 11.96L1.86 11.96L1.86 13.58L3.27 13.58L3.27 15.2L6.47 15.2L6.47 16L9.52 16L9.52 15.2L12.72 15.2L12.72 13.58L14.13 13.58L14.13 11.96L16 11.96L16 4.03L14.13 4.03L14.13 3.43ZM15.4 4.63L13.53 4.63L13.53 3.01L12.12 3.01L12.12 1.4L8.92 1.4L8.92 0.59L7.07 0.59L7.07 1.4L3.87 1.4L3.87 3.01L2.46 3.01L2.46 4.63L0.59 4.63L0.59 11.36L2.46 11.36L2.46 12.98L3.87 12.98L3.87 14.59L7.07 14.59L7.07 15.4L8.92 15.4L8.92 14.59L12.12 14.59L12.12 12.98L13.53 12.98L13.53 11.36L15.4 11.36L15.4 4.63Z"
                fill="#000000"
                fillOpacity="1.000000"
                fillRule="evenodd"
            />
            <g filter="url(#filter_734_186_dd)">
                <path
                    d="M11.19 2.4L11.19 4.03L12.57 4.03L12.57 5.66L14.4 5.66L14.4 10.33L12.57 10.33L12.57 11.96L11.19 11.96L11.19 13.6L9.19 13.6L9.19 14.14L6.8 14.14L6.8 13.6L4.8 13.6L4.8 11.96L3.42 11.96L3.42 10.33L1.59 10.33L1.59 5.66L3.42 5.66L3.42 4.03L4.8 4.03L4.8 2.4L6.8 2.4L6.8 1.86L9.19 1.86L9.19 2.4L11.19 2.4Z"
                    fill="#CE3B2E"
                    fillOpacity="1.000000"
                    fillRule="evenodd"
                />
            </g>
            <path
                d="M12.57 5.16L12.57 4.03L11.19 4.03L11.19 2.4L9.19 2.4L9.19 1.86L6.8 1.86L6.8 2.4L4.8 2.4L4.8 4.03L3.42 4.03L3.42 5.66L1.59 5.66L1.59 10.33L3.42 10.33L3.42 11.96L4.8 11.96L4.8 13.6L6.8 13.6L6.8 14.14L9.19 14.14L9.19 13.6L11.19 13.6L11.19 11.96L12.57 11.96L12.57 10.33L14.4 10.33L14.4 5.66L12.57 5.66L12.57 5.16ZM13.9 6.16L12.07 6.16L12.07 4.53L10.69 4.53L10.69 2.9L8.69 2.9L8.69 2.36L7.3 2.36L7.3 2.9L5.3 2.9L5.3 4.53L3.92 4.53L3.92 6.16L2.09 6.16L2.09 9.83L3.92 9.83L3.92 11.46L5.3 11.46L5.3 13.1L7.3 13.1L7.3 13.64L8.69 13.64L8.69 13.1L10.69 13.1L10.69 11.46L12.07 11.46L12.07 9.83L13.9 9.83L13.9 6.16Z"
                fill="#000000"
                fillOpacity="1.000000"
                fillRule="evenodd"
            />
            <g filter="url(#filter_734_187_dd)">
                <path
                    d="M7.09 6.79L7.09 5.59L8.61 5.59L9.7 5.59L9.7 6.79L10.8 6.79L10.8 8.39L10.8 9.59L9.7 9.59L9.7 10.79L8.61 10.79L7.09 10.79L7.09 9.59L6 9.59L6 8.39L6 6.79L7.09 6.79Z"
                    fill="#FFFFFF"
                    fillOpacity="1.000000"
                    fillRule="evenodd"
                />
            </g>
            <path d="" fill="#979797" fillOpacity="0" fillRule="evenodd" />
        </svg>
    )
}
