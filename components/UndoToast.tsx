'use client'

import React, { useEffect, useState } from 'react'

interface UndoToastProps {
  message: string
  onUndo: () => void
  onClose: () => void
  duration?: number
}

export default function UndoToast({ message, onUndo, onClose, duration = 3000 }: UndoToastProps) {
  const [progress, setProgress] = useState(100)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          onClose()
          return 0
        }
        return prev - (100 / (duration / 50))
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isPaused, duration, onClose])

  return (
    <div 
      className="fixed top-8 right-8 z-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-slate-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 min-w-[300px] border border-slate-700">
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-[50ms] ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button 
          onClick={() => {
            onUndo()
            onClose()
          }}
          className="text-indigo-400 hover:text-indigo-300 font-bold px-3 py-1 rounded hover:bg-slate-800 transition-colors"
        >
          UNDO
        </button>
      </div>
    </div>
  )
}

