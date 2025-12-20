"use client"

import type React from "react"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

import "./shiny-button.css"

export function ShinyButton({ children, onClick, className = "" }: ShinyButtonProps) {
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick}>
      <span>{children}</span>
    </button>
  )
}
