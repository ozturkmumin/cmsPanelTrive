'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useSearchParams } from 'next/navigation'
import { Page, Block } from '@/types/pageBuilder'
import { getPage } from '@/lib/pages'
import BlockLibrary from './BlockLibrary'
import BlockEditor from './BlockEditor'
import PagePreview from './PagePreview'
import PageToolbar from './PageToolbar'

export default function PageBuilder() {
  const searchParams = useSearchParams()
  const pageId = searchParams.get('page')
  const [currentPage, setCurrentPage] = useState<Page>({
    id: 'new-page',
    name: 'New Page',
    slug: 'new-page',
    blocks: [],
    meta: {
      title: 'New Page',
      description: '',
    },
  })
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pageId && pageId !== 'new-page') {
      loadPage(pageId)
    } else {
      // Reset to new page if no pageId
      setCurrentPage({
        id: 'new-page',
        name: 'New Page',
        slug: 'new-page',
        blocks: [],
        meta: {
          title: 'New Page',
          description: '',
        },
      })
    }
  }, [pageId])

  const loadPage = async (id: string) => {
    setLoading(true)
    try {
      const page = await getPage(id)
      if (page) {
        // Ensure blocks array exists and is properly formatted
        const loadedPage: Page = {
          ...page,
          blocks: Array.isArray(page.blocks) ? page.blocks.map((block: any) => ({
            ...block,
            order: typeof block.order === 'number' ? block.order : 0,
            data: block.data || {},
            styles: block.styles || {},
          })) : [],
          id: page.id || id,
        }
        console.log('Loaded page:', loadedPage)
        console.log('Blocks count:', loadedPage.blocks.length)
        console.log('Blocks:', loadedPage.blocks)
        setCurrentPage(loadedPage)
      } else {
        console.error('Page not found:', id)
        alert('Page not found. Creating new page.')
        setCurrentPage({
          id: 'new-page',
          name: 'New Page',
          slug: 'new-page',
          blocks: [],
          meta: { title: 'New Page', description: '' },
        })
      }
    } catch (error) {
      console.error('Error loading page:', error)
      alert('Failed to load page. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addBlock = useCallback((blockType: string, template: any) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: blockType as any,
      data: { ...template.defaultData },
      styles: { ...template.defaultStyles },
      order: currentPage.blocks.length,
    }
    
    setCurrentPage(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }))
  }, [currentPage.blocks.length])

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setCurrentPage(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      ),
    }))
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    setCurrentPage(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
    }))
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null)
    }
  }, [selectedBlock])

  const moveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    setCurrentPage(prev => {
      const newBlocks = [...prev.blocks]
      const draggedBlock = newBlocks[dragIndex]
      newBlocks.splice(dragIndex, 1)
      newBlocks.splice(hoverIndex, 0, draggedBlock)
      
      // Update order
      newBlocks.forEach((block, index) => {
        block.order = index
      })
      
      return { ...prev, blocks: newBlocks }
    })
  }, [])

  const duplicateBlock = useCallback((blockId: string) => {
    const block = currentPage.blocks.find(b => b.id === blockId)
    if (block) {
      const newBlock: Block = {
        ...block,
        id: `block-${Date.now()}`,
        order: currentPage.blocks.length,
      }
      setCurrentPage(prev => ({
        ...prev,
        blocks: [...prev.blocks, newBlock],
      }))
    }
  }, [currentPage.blocks])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-slate-600 font-medium">Loading page...</p>
          <p className="mt-2 text-sm text-slate-400">Preparing your page builder</p>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <PagePreview
        page={currentPage}
        onClose={() => setPreviewMode(false)}
      />
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <PageToolbar
          page={currentPage}
          onPageUpdate={setCurrentPage}
          onPreview={() => setPreviewMode(true)}
        />
        
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar - Block Library */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <BlockLibrary onAddBlock={addBlock} />
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white min-h-full shadow-lg">
              {!currentPage.blocks || currentPage.blocks.length === 0 ? (
                <div className="flex items-center justify-center h-96 animate-fade-in">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Start Building</h3>
                    <p className="text-slate-500 mb-6">Drag blocks from the left sidebar to start creating your page</p>
                    <div className="flex gap-2 justify-center">
                      <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
                        ← Drag & Drop
                      </div>
                    </div>
                    {pageId && (
                      <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-400 space-y-1">
                        <p>Page ID: {pageId}</p>
                        <p>Blocks: {currentPage.blocks?.length || 0}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {currentPage.blocks
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((block, index) => (
                      <BlockEditor
                        key={block.id}
                        block={block}
                        index={index}
                        isSelected={selectedBlock?.id === block.id}
                        onSelect={() => setSelectedBlock(block)}
                        onUpdate={(updates) => updateBlock(block.id, updates)}
                        onDelete={() => deleteBlock(block.id)}
                        onDuplicate={() => duplicateBlock(block.id)}
                        onMove={moveBlock}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Block Properties */}
          {selectedBlock && (
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <BlockProperties
                block={selectedBlock}
                onUpdate={(updates: Partial<Block>) => updateBlock(selectedBlock.id, updates)}
                onClose={() => setSelectedBlock(null)}
              />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  )
}

// Block Properties Panel
function BlockProperties({ block, onUpdate, onClose }: any) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Block Properties</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Data Fields */}
        {Object.keys(block.data).map(key => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {/* Add button for arrays */}
              {Array.isArray(block.data[key]) && (
                <button
                  onClick={() => {
                    const newArray = [...block.data[key], typeof block.data[key][0] === 'object' ? {} : '']
                    onUpdate({ data: { ...block.data, [key]: newArray } })
                  }}
                  className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  + Add
                </button>
              )}
            </div>
            {typeof block.data[key] === 'string' ? (
              key === 'content' || key === 'description' || key === 'subtitle' ? (
                <textarea
                  rows={key === 'content' ? 6 : 3}
                  value={block.data[key]}
                  onChange={(e) => onUpdate({
                    data: { ...block.data, [key]: e.target.value }
                  })}
                  placeholder={key}
                  className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2 resize-y"
                />
              ) : (
                <input
                  type={key.toLowerCase().includes('url') || key.toLowerCase().includes('image') || key.toLowerCase().includes('video') || key.toLowerCase().includes('link') ? 'url' : key.toLowerCase().includes('email') ? 'email' : key.toLowerCase().includes('phone') ? 'tel' : 'text'}
                  value={block.data[key]}
                  onChange={(e) => onUpdate({
                    data: { ...block.data, [key]: e.target.value }
                  })}
                  placeholder={
                    key === 'videoUrl' ? 'https://www.youtube.com/watch?v=...' : 
                    key === 'image' ? 'https://example.com/image.jpg' : 
                    key === 'buttonLink' ? 'https://example.com or #section' :
                    key === 'email' ? 'contact@example.com' :
                    key === 'phone' ? '+1 234 567 890' :
                    key
                  }
                  className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 p-2"
                />
              )
            ) : typeof block.data[key] === 'boolean' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={block.data[key]}
                  onChange={(e) => onUpdate({
                    data: { ...block.data, [key]: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Enable {key}</span>
              </label>
            ) : Array.isArray(block.data[key]) ? (
              <div className="space-y-2">
                {block.data[key].map((item: any, idx: number) => (
                  <div key={idx} className="p-2 border border-gray-200 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">Item {idx + 1}</span>
                      <button
                        onClick={() => {
                          const newArray = block.data[key].filter((_: any, i: number) => i !== idx)
                          onUpdate({ data: { ...block.data, [key]: newArray } })
                        }}
                        className="ml-auto text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    {typeof item === 'object' ? (
                      <div className="space-y-2">
                        {Object.keys(item).map(subKey => {
                          const subValue = item[subKey]
                          return (
                            <div key={subKey}>
                              <label className="block text-xs text-gray-600 mb-1">
                                {subKey.charAt(0).toUpperCase() + subKey.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              {Array.isArray(subValue) ? (
                                <div className="space-y-1">
                                  {subValue.map((subItem: any, subIdx: number) => (
                                    <div key={subIdx} className="flex gap-1">
                                      <input
                                        type="text"
                                        value={subItem}
                                        onChange={(e) => {
                                          const newArray = [...block.data[key]]
                                          const newSubArray = [...subValue]
                                          newSubArray[subIdx] = e.target.value
                                          newArray[idx] = { ...newArray[idx], [subKey]: newSubArray }
                                          onUpdate({ data: { ...block.data, [key]: newArray } })
                                        }}
                                        placeholder={`${subKey} ${subIdx + 1}`}
                                        className="flex-1 border-gray-300 rounded p-1.5 text-xs"
                                      />
                                      <button
                                        onClick={() => {
                                          const newArray = [...block.data[key]]
                                          const newSubArray = subValue.filter((_: any, i: number) => i !== subIdx)
                                          newArray[idx] = { ...newArray[idx], [subKey]: newSubArray }
                                          onUpdate({ data: { ...block.data, [key]: newArray } })
                                        }}
                                        className="text-xs text-red-600 hover:text-red-800 px-2"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      const newArray = [...block.data[key]]
                                      const newSubArray = [...subValue, '']
                                      newArray[idx] = { ...newArray[idx], [subKey]: newSubArray }
                                      onUpdate({ data: { ...block.data, [key]: newArray } })
                                    }}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                  >
                                    + Add {subKey}
                                  </button>
                                </div>
                              ) : typeof subValue === 'boolean' ? (
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={subValue}
                                    onChange={(e) => {
                                      const newArray = [...block.data[key]]
                                      newArray[idx] = { ...newArray[idx], [subKey]: e.target.checked }
                                      onUpdate({ data: { ...block.data, [key]: newArray } })
                                    }}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="text-xs text-gray-700">Enable {subKey}</span>
                                </label>
                              ) : (
                                <input
                                  type={
                                    subKey.toLowerCase().includes('url') || 
                                    subKey.toLowerCase().includes('image') || 
                                    subKey.toLowerCase().includes('avatar') || 
                                    subKey.toLowerCase().includes('link') ? 'url' : 
                                    subKey.toLowerCase().includes('email') ? 'email' : 
                                    subKey.toLowerCase().includes('phone') ? 'tel' :
                                    subKey.toLowerCase().includes('description') || subKey.toLowerCase().includes('text') ? 'text' : 'text'
                                  }
                                  value={subValue || ''}
                                  onChange={(e) => {
                                    const newArray = [...block.data[key]]
                                    newArray[idx] = { ...newArray[idx], [subKey]: e.target.value }
                                    onUpdate({ data: { ...block.data, [key]: newArray } })
                                  }}
                                  placeholder={
                                    subKey === 'image' || subKey === 'avatar' ? 'https://example.com/image.jpg' : 
                                    subKey === 'icon' ? '🚀 or emoji' :
                                    subKey
                                  }
                                  className="w-full border-gray-300 rounded p-2 text-sm"
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <input
                        type={key === 'images' ? 'url' : 'text'}
                        value={item}
                        onChange={(e) => {
                          const newArray = [...block.data[key]]
                          newArray[idx] = e.target.value
                          onUpdate({ data: { ...block.data, [key]: newArray } })
                        }}
                        placeholder={key === 'images' ? 'https://example.com/image.jpg' : 'Enter value'}
                        className="w-full border-gray-300 rounded p-2 text-sm"
                      />
                    )}
                  </div>
                ))}
                {block.data[key].length === 0 && (
                  <p className="text-sm text-gray-400 italic">No items. Click "+ Add" to add one.</p>
                )}
              </div>
            ) : null}
          </div>
        ))}

        {/* Styles */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Styles</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Background Color</label>
              <input
                type="color"
                value={block.styles?.backgroundColor || '#ffffff'}
                onChange={(e) => onUpdate({
                  styles: { ...block.styles, backgroundColor: e.target.value }
                })}
                className="w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Text Color</label>
              <input
                type="color"
                value={block.styles?.textColor || '#000000'}
                onChange={(e) => onUpdate({
                  styles: { ...block.styles, textColor: e.target.value }
                })}
                className="w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Padding</label>
              <input
                type="text"
                value={block.styles?.padding || '20px'}
                onChange={(e) => onUpdate({
                  styles: { ...block.styles, padding: e.target.value }
                })}
                placeholder="20px"
                className="w-full border-gray-300 rounded p-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

