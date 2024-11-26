import React from 'react';
import { ModalHeaderTypes } from './modal.type';
import {OrbiterShow} from '../OrbiterShow';

import { XIcon } from "lucide-react"

export const ModalHeader: React.FC<ModalHeaderTypes> = ({
  headerRender,
  headerLabel,
  headerIcon,
  close,
  onClose,
  onShowChange,
}) => {

  return (
    <OrbiterShow
      when={!headerRender}
      fallback={
        headerRender
      }
    >
      <div className='flex justify-between items-center w-full sm:pt-4 sm:pb-1 o-font-500 text-xl'>
        <div className='flex items-center flex-1'>
          <OrbiterShow
            when={!!headerIcon}
          >
            {headerIcon}
          </OrbiterShow>
          <OrbiterShow
            when={!!headerLabel}
          >
            {headerLabel}
          </OrbiterShow>
        </div>


        <div>
          <OrbiterShow
            when={!!close}
            fallback={
              <XIcon className='cursor-pointer' onClick={ (event) => {
                event.stopPropagation()
                onClose && onClose()
                onShowChange && onShowChange(false)
              }} />
            }
          >
            {close}
          </OrbiterShow>
        </div>

      </div>
    </OrbiterShow>
  );
}
