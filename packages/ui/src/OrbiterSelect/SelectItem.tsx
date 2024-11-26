import React from 'react';
import { OrbiterShow } from '../OrbiterShow';
import { cn } from '../utils/cn';
import { SelectItemTypes } from './select.type';
import { SquareArrowOutUpRight } from 'lucide-react';

export const SelectItem: React.FC<SelectItemTypes> = ({
    disabled,
    icon,
    label,
    viceLabel,
    linkIcon,
    link,
    right,
    active,
    tags,
    activityClassName,
    clickViceTitle
})  => {

    return (
        <div className={
            cn('flex justify-between w-full p-3 mt-1 rounded-xl', disabled ? "opacity-40" : "opacity-100 cursor-pointer hover:bg-[var(--o-color-gray-900)]", active ?  activityClassName : "")
        }>

            <div className='flex items-center flex-1'>
                <OrbiterShow
                    when={!!icon}
                >
                    <div className='mr-2'>
                        {icon}
                    </div>
                </OrbiterShow>

                <div>
                    <OrbiterShow
                        when={!!label}
                    >
                        <div className='o-font-500'>

                            {label}
                        </div>
                    </OrbiterShow>
                    <div className='cursor-pointer' onClick={(event)=>{
                        event.stopPropagation()
                        if (disabled) return;
                        clickViceTitle && clickViceTitle()
                        window.open(link, '_blank')
                    }}>
                        <OrbiterShow
                            when={!!viceLabel}
                        >
                            <div className='text-xs text-[var(--o-color-gray-400)] flex justify-start items-center'>
                                {viceLabel} <SquareArrowOutUpRight className='w-3 h-3 ml-1' stroke='var(--o-color-gray-400)'/>
                            </div>
                        </OrbiterShow>
                        <OrbiterShow
                            when={!!link}
                        >
                            <div>
                                {linkIcon}
                            </div>
                        </OrbiterShow>
                    </div>
                </div>

                <OrbiterShow
                when={!!tags}
                >
                    <div className='flex-1 flex justify-start mx-1'>
                        {tags}
                    </div>
                </OrbiterShow>
            </div>

            <div className='flex justify-center items-center'>{right}</div>
        </div>
    );
}
