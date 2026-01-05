'use client'

import React, { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const input = modalRef.current?.querySelector('input')
      if (input) {
        setTimeout(() => input.focus(), 50)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-40 transition-opacity"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform transition-all scale-100 border border-gray-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

