import React from 'react'

const ButtonContent = ({ children, icon, style }) => (
  <span style={{ paddingRight: 10, fontWeight: 500, paddingLeft: icon ? 0 : 10, paddingTop: 10, paddingBottom: 10, ...style }}>{children}</span>
)

export default ButtonContent
