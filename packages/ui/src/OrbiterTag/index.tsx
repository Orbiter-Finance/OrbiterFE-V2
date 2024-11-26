import React, { ImgHTMLAttributes } from 'react'
import VC from "./Vc.svg"
import NEW from "./NEW.svg"
import HOT from "./HOT.svg"
import GASSUBSIDY from "./GASSUBSIDY.svg"

const tagList = {
  VC,
  HOT,
  NEW,
  GASSUBSIDY
}

export type TagType = keyof typeof tagList

export interface OrbiterTagType extends ImgHTMLAttributes<HTMLImageElement> {
  tag: TagType
}

export const OrbiterTag: React.FC<OrbiterTagType> = ({
  tag,
  ...rest
}) => {

  const Tag = tagList[tag]

  return (
    <div className='flex justify-start items-center'>
      <img {...rest} src={Tag} />
    </div>
  )
}
