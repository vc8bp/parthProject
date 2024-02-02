import { IconButton, Tooltip } from '@mui/material'
import styled from "styled-components"
import React from 'react'

const StyledButton = styled(IconButton)`
    box-shadow: 0px 10px 20px rgba(0,0,0, 0.2);
    background-color: rgb(var(--darkBlue)) !important;
    color: white !important;
    pointer-events: all !important;
    &:disabled{
      cursor: not-allowed !important;
      background-color: rgb(var(--disabled)) !important;
    }
`

function IconBtn({children, tooltip, disabled, onClick}) {
  return (
    <Tooltip title={tooltip} >
        <StyledButton onClick={onClick} disabled={disabled}>
            {children}
        </StyledButton>
    </Tooltip>

  )
}

export default IconBtn