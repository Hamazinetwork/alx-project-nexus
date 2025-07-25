import React from 'react'
import { ButtonProps } from '@/interfaces';

const Button: React.FC<ButtonProps> = ({style, title}) => {
  return (
    <div>
      <button className={style}>{title}</button>
    </div>
  )
}

export default Button;
