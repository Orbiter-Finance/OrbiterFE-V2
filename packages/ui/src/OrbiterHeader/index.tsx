import React from 'react';
import { cn } from '../utils/cn';
import { HeaderTypes } from './header.type';
import { OrbiterShow } from '../OrbiterShow';

export const OrbiterHeader: React.FC<HeaderTypes> = ({
    logo,
    menu,
    tools,
    className,
    ...rest
}) => {
    return (
        <div className={
            cn("w-full p-4 flex justify-between items-center", className)
        }
        {...rest}
        >
            <div className="flex justify-start items-center flex-1">
                <OrbiterShow
                    when={!!logo}
                >
                    {logo}
                </OrbiterShow>
                <OrbiterShow
                    when={!!menu}
                >
                    <div className='justify-start items-center flex-1 hidden sm:flex'>
                        {menu}
                    </div>
                </OrbiterShow>
            </div>

            <div className="flex justify-end items-center">
                <OrbiterShow
                    when={!!tools}
                >
                    {tools}
                </OrbiterShow>
            </div>
        </div>
    );
}
