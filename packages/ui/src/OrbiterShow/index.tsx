
import React from 'react';

export const OrbiterShow: React.FC< {
  when?: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}> =({when, fallback = null, children})=> {
  return (
     when ? children : fallback
  )
}
