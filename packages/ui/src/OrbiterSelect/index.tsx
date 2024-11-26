import React, { Fragment } from 'react';
import { SelectTypes } from './select.type';
import { OrbiterShow } from '../OrbiterShow';
import { SelectItem } from './SelectItem';
import { cn } from '../utils/cn';
export const OrbiterSelect:React.FC<SelectTypes> =({
    selectTitle,
    amount = 1,
    list,
    renderItem,
    className,
    onSelectChange,
    itemClick,
    ...rest
}) => {

    const width = amount && amount > 1 ? `calc((100 / amount) + "% - 4px")` : "100%";

    return (
        <div className={cn("w-full flex flex-col overflow-auto", className)} {...rest}>
            <OrbiterShow
                when={!!selectTitle}
            >
                {selectTitle}
            </OrbiterShow>
            <div className='w-full max-h-full'>
                <div className='flex flex-wrap'>
                    {
                        (list || []).map((item, index) => {
                            return <Fragment key={index}>
                                <OrbiterShow
                                when={!!renderItem}
                                fallback={
                                    <div
                                        key={index}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            itemClick && itemClick(item)
                                            if (item?.disabled || item?.active) return;
                                            onSelectChange && onSelectChange(item);
                                        }} style={{ width }}>
                                        <SelectItem
                                            {...item}
                                        />
                                    </div>
                                }
                            >
                                {renderItem && renderItem(item)}
                            </OrbiterShow>
                            </Fragment>;
                        })
                    }
                </div>
            </div>

        </div>
    );
}
