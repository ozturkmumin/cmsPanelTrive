'use client'

import React, { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === 'error' ? 'bg-red-50 border-red-200 text-red-700' 
    : type === 'success' ? 'bg-green-50 border-green-200 text-green-700'
    : 'bg-blue-50 border-blue-200 text-blue-700'

  const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'

  return (
    <div 
      className={`fixed top-24 right-8 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className={`px-6 py-3 rounded-lg shadow-xl border flex items-center gap-3 ${bgColor}`}>
        <span>{icon}</span>
        <p className="font-medium text-sm">{message}</p>
      </div>
    </div>
  )
}

