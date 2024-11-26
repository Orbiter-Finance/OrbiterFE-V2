
import React, { Fragment, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { cn } from '../utils/cn.js';
import { OrbiterShow } from '../OrbiterShow/index.js';
import { ProgressSkeleton } from '../ProgressSkeleton.js';

const path = {
    CHAIN: "/icon/chain/",
    TOKEN: "/icon/token/"
};

interface OrbiterIconType extends HTMLAttributes<HTMLImageElement> {
    type: "CHAIN" | "TOKEN";
    iconId: string;
}
export function OrbiterIcon({
    type,
    iconId,
    className,
    ...rest
}: OrbiterIconType) {

    const [error, setError] = useState(false);
    const [isOnLoad, setIsOnLoad] = useState(false);
    const src = `https://cdn.orbiter.finance${path[type]}${iconId}.svg`;

    useEffect(() => {
        setError(false);
    }, [iconId]);

    return (
        <Fragment key={iconId}>
            <OrbiterShow when={
                error
            }
                fallback={
                    <div className='flex justify-center items-center'>
                        <OrbiterShow
                            when={!isOnLoad}
                        >
                            <div className={
                                cn("w-6 h-6", className, 'rounded-full flex justify-center items-center')
                            }>

                                <ProgressSkeleton />
                            </div>

                        </OrbiterShow>

                        <img
                            src={src}
                            alt={iconId}
                            width={24}
                            height={24}
                            className={
                                cn(!isOnLoad ? "w-0 h-0" : cn("w-6 h-6", className))
                            }
                            onError={(event) => {
                                setError(true);
                                setIsOnLoad(true);
                            }}
                            onLoad={(event) => {
                                setIsOnLoad(true);
                            }}
                            {...rest}
                        />
                    </div>
                }
            >
                <svg className="w-6 h-6" width="120.000000" height="120.000000" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <defs>
                        <clipPath id="clip5897_5471">
                            <rect rx="60.000000" width="120.000000" height="120.000000" fill="white" fillOpacity="0" />
                        </clipPath>
                    </defs>
                    <rect rx="60.000000" width="120.000000" height="120.000000" fill="#111111" fillOpacity="1.000000" />
                    <g clipPath="url(#clip5897_5471)">
                        <path d="M12 60C12 33.49 33.49 12 60 12C86.5 12 108 33.49 108 60C108 86.5 86.5 108 60 108C33.49 108 12 86.5 12 60ZM19.2 60C19.2 37.46 37.46 19.2 60 19.2C82.53 19.2 100.8 37.46 100.8 60C100.8 82.53 82.53 100.8 60 100.8C37.46 100.8 19.2 82.53 19.2 60Z" fill="#545454" fillOpacity="1.000000" fillRule="evenodd" />
                        <path d="M46.69 40.69C45.65 42.07 44.83 43.63 44.22 45.35C43.5 47.42 44.55 49.62 46.6 50.35C48.66 51.08 50.84 50.02 51.57 47.95C51.94 46.89 52.45 45.96 53.1 45.16C53.75 44.36 54.56 43.68 55.53 43.11C56.5 42.53 57.49 42.16 58.49 41.97C59.5 41.78 60.56 41.79 61.67 41.98C62.77 42.17 63.77 42.52 64.66 43.03C65.55 43.55 66.36 44.24 67.08 45.1C67.8 45.97 68.34 46.88 68.69 47.85C69.04 48.82 69.21 49.87 69.21 51C69.2 52.11 68.78 53.27 67.96 54.37C67.15 55.46 65.98 56.52 64.46 57.54C63.29 58.33 62 59.04 60.58 59.67C60.14 59.87 59.71 60.05 59.31 60.2C59.12 60.27 58.99 60.32 58.9 60.35C56.83 61.05 55.75 63.23 56.44 65.31C57.13 67.39 59.29 68.48 61.36 67.79C61.55 67.72 61.79 67.64 62.08 67.53C62.62 67.32 63.17 67.09 63.74 66.83C65.57 66.02 67.25 65.09 68.78 64.06C71.04 62.54 72.84 60.88 74.19 59.07C75.06 57.91 75.72 56.7 76.19 55.44C76.53 54.53 76.76 53.6 76.89 52.65C76.96 52.11 77 51.57 77 51.01C77 49.19 76.74 47.44 76.21 45.79C76.14 45.58 76.08 45.38 76 45.17C75.93 44.97 75.85 44.77 75.77 44.57C75.11 42.96 74.2 41.45 73.03 40.05C71.86 38.66 70.55 37.49 69.08 36.57C68.9 36.45 68.72 36.34 68.53 36.24C68.34 36.13 68.16 36.02 67.97 35.92C66.43 35.12 64.77 34.56 62.98 34.25C61.19 33.95 59.44 33.91 57.73 34.16C57.52 34.19 57.31 34.22 57.1 34.26C56.88 34.3 56.67 34.34 56.46 34.39C54.78 34.77 53.15 35.42 51.59 36.35C50.02 37.28 48.66 38.39 47.51 39.69C47.37 39.85 47.23 40.01 47.09 40.18C46.96 40.35 46.82 40.52 46.69 40.69Z" fill="#545454" fillOpacity="1.000000" fillRule="evenodd" />
                        <path d="M65 79C65 81.75 62.75 84 60 84C57.24 84 55 81.75 55 79C55 76.24 57.24 74 60 74C62.75 74 65 76.24 65 79Z" fill="#545454" fillOpacity="1.000000" fillRule="evenodd" />
                    </g>
                </svg>

            </OrbiterShow>
        </Fragment>

    );
}
