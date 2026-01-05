'use client'

import React, { useCallback } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Block } from '@/types/pageBuilder'
import BlockRenderer from './BlockRenderer'

interface BlockEditorProps {
  block: Block
  index: number
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (dragIndex: number, hoverIndex: number) => void
}

export default function BlockEditor({
  block,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
}: BlockEditorProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'block',
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  const dragDropRef = useCallback((node: HTMLDivElement | null) => {
    drag(drop(node))
  }, [drag, drop])

  return (
    <div
      ref={dragDropRef}
      className={`relative group border-2 rounded-lg transition-all ${
        isSelected
          ? 'border-indigo-500 shadow-lg'
          : 'border-transparent hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      {/* Block Actions */}
      <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          className="p-2 bg-white rounded shadow-md hover:bg-gray-50 text-gray-600 hover:text-indigo-600"
          title="Duplicate"
        >
          📋
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-2 bg-white rounded shadow-md hover:bg-red-50 text-gray-600 hover:text-red-600"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {/* Drag Handle */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <div className="p-2 bg-white rounded shadow-md text-gray-400">
          ⋮⋮
        </div>
      </div>

      {/* Block Content */}
      <div style={block.styles}>
        <BlockRenderer block={block} />
      </div>
    </div>
  )
}

