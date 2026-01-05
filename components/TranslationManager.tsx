'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from '@/contexts/TranslationContext'
import Header from './Header'
import TranslationTable from './TranslationTable'
import Dashboard from './Dashboard'
import Modal from './Modal'
import Toast from './Toast'
import UndoToast from './UndoToast'
import JsonModal from './JsonModal'
import AddPageModal from './modals/AddPageModal'
import AddLanguageModal from './modals/AddLanguageModal'
import LanguageManagerModal from './modals/LanguageManagerModal'
import ImportModal from './modals/ImportModal'
import AddSpaceModal from './modals/AddSpaceModal'
import AddTranslationModal from './modals/AddTranslationModal'
import RenamePageModal from './modals/RenamePageModal'
import RenameSpaceModal from './modals/RenameSpaceModal'
import RenameTranslationModal from './modals/RenameTranslationModal'
import EditTranslationModal from './modals/EditTranslationModal'
import ChangeOrderModal from './modals/ChangeOrderModal'
import ImportPreviewModal from './modals/ImportPreviewModal'

interface ToastState {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface UndoState {
  message: string
  onUndo: () => void
}

export default function TranslationManager() {
  const { translations, searchQuery, setSearchQuery, deletePage, deleteSpace, deleteTranslation } = useTranslation()
  const [toasts, setToasts] = useState<ToastState[]>([])
  const [undoState, setUndoState] = useState<UndoState | null>(null)
  const [modalType, setModalType] = useState<string | null>(null)
  const [modalProps, setModalProps] = useState<any>({})
  const [jsonModalOpen, setJsonModalOpen] = useState(false)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const showUndoToast = useCallback((message: string, onUndo: () => void) => {
    setUndoState({ message, onUndo })
  }, [])

  const closeUndoToast = useCallback(() => {
    setUndoState(null)
  }, [])

  const openModal = useCallback((type: string, props: any = {}) => {
    setModalType(type)
    setModalProps(props)
  }, [])

  const closeModal = useCallback(() => {
    setModalType(null)
    setModalProps({})
  }, [])

  const pages = useMemo(() => {
    return Object.keys(translations).sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }))
  }, [translations])

  return (
    <>
      <Header 
        onImportClick={() => openModal('import')}
        onGetJsonClick={() => setJsonModalOpen(true)}
        onLanguagesClick={() => openModal('languageManager')}
        onAddPageClick={() => openModal('addPage')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Dashboard />

      <TranslationTable 
        pages={pages}
        onAddSpace={(pageKey, path) => openModal('addSpace', { pageKey, path })}
        onAddTranslation={(pageKey, path) => openModal('addTranslation', { pageKey, path })}
        onRenamePage={(pageKey) => openModal('renamePage', { pageKey })}
        onDeletePage={(pageKey) => {
          deletePage(pageKey)
          showToast('Page deleted', 'success')
        }}
        onRenameSpace={(pageKey, path, oldKey) => openModal('renameSpace', { pageKey, path, oldKey })}
        onDeleteSpace={(pageKey, path, spaceKey) => {
          deleteSpace(pageKey, path, spaceKey)
          showUndoToast('Space deleted', () => {
            // Restore would need to be implemented
            showToast('Space restored', 'success')
          })
        }}
        onRenameTranslation={(pageKey, path, oldKey) => openModal('renameTranslation', { pageKey, path, oldKey })}
        onDeleteTranslation={(pageKey, path, key) => {
          deleteTranslation(pageKey, path, key)
          showUndoToast('Translation deleted', () => {
            // Restore would need to be implemented
            showToast('Translation restored', 'success')
          })
        }}
        onEditTranslation={(pageKey, path, key) => openModal('editTranslation', { pageKey, path, key })}
        onChangeOrder={(pageKey, path, key, type) => openModal('changeOrder', { pageKey, path, key, type })}
      />

      {/* Modals */}
      {modalType === 'addPage' && (
        <AddPageModal isOpen={true} onClose={closeModal} onSuccess={showToast} />
      )}
      {modalType === 'languageManager' && (
        <LanguageManagerModal isOpen={true} onClose={closeModal} onSuccess={showToast} />
      )}
      {modalType === 'addLanguage' && (
        <AddLanguageModal isOpen={true} onClose={closeModal} onSuccess={showToast} />
      )}
      {modalType === 'import' && (
        <ImportModal isOpen={true} onClose={closeModal} onSuccess={showToast} />
      )}
      {modalType === 'addSpace' && (
        <AddSpaceModal isOpen={true} onClose={closeModal} pageKey={modalProps.pageKey} path={modalProps.path} onSuccess={showToast} />
      )}
      {modalType === 'addTranslation' && (
        <AddTranslationModal isOpen={true} onClose={closeModal} pageKey={modalProps.pageKey} path={modalProps.path} onSuccess={showToast} />
      )}
      {modalType === 'renamePage' && (
        <RenamePageModal isOpen={true} onClose={closeModal} pageKey={modalProps.pageKey} onSuccess={showToast} />
      )}
      {modalType === 'renameSpace' && (
        <RenameSpaceModal isOpen={true} onClose={closeModal} pageKey={modalProps.pageKey} path={modalProps.path} oldKey={modalProps.oldKey} onSuccess={showToast} />
      )}
      {modalType === 'renameTranslation' && (
        <RenameTranslationModal isOpen={true} onClose={closeModal} pageKey={modalProps.pageKey} path={modalProps.path} oldKey={modalProps.oldKey} onSuccess={showToast} />
      )}
      {modalType === 'editTranslation' && (
        <EditTranslationModal isOpen={true} onClose={closeModal} pageKey={modalProps.pageKey} path={modalProps.path} key={modalProps.key} onSuccess={showToast} />
      )}
      {modalType === 'changeOrder' && (
        <ChangeOrderModal isOpen={true} onClose={closeModal} pageKey={modalProps.pageKey} path={modalProps.path} key={modalProps.key} type={modalProps.type} onSuccess={showToast} />
      )}
      {modalType === 'importPreview' && (
        <ImportPreviewModal isOpen={true} onClose={closeModal} diff={modalProps.diff} lang={modalProps.lang} data={modalProps.data} onSuccess={showToast} />
      )}

      {/* JSON Modal */}
      <JsonModal isOpen={jsonModalOpen} onClose={() => setJsonModalOpen(false)} />

      {/* Toasts */}
      {toasts.map(toast => (
        <Toast 
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}

      {/* Undo Toast */}
      {undoState && (
        <UndoToast
          message={undoState.message}
          onUndo={undoState.onUndo}
          onClose={closeUndoToast}
        />
      )}
    </>
  )
}

