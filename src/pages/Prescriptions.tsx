import React, { useState, useRef } from 'react'
import { Prescription } from '../types'
import { MOCK_PRESCRIPTIONS, formatDate } from '../data'

const fileIcons: Record<string, React.ReactNode> = {
  pdf: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="1" width="14" height="18" rx="2" fill="#FDF1EE" stroke="#F0B9A5" strokeWidth="1.2" />
      <rect x="9" y="1" width="8" height="6" rx="1" fill="#F0B9A5" opacity="0.5" />
      <path d="M7 10h6M7 13h5M7 16h4" stroke="#D9502E" strokeWidth="1.2" strokeLinecap="round" />
      <text x="17" y="22" fontSize="7" fill="#D9502E" fontFamily="monospace" fontWeight="700">PDF</text>
    </svg>
  ),
  jpg: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="1" width="14" height="18" rx="2" fill="#EEF2FA" stroke="#A4BFE3" strokeWidth="1.2" />
      <circle cx="8.5" cy="8" r="2" fill="#A4BFE3" />
      <path d="M5 14l4-4 3 3 2-2 3 3" stroke="#3F6DAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  png: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="1" width="14" height="18" rx="2" fill="#EAF4EE" stroke="#C5E4D0" strokeWidth="1.2" />
      <circle cx="8.5" cy="8" r="2" fill="#C5E4D0" />
      <path d="M5 14l4-4 3 3 2-2 3 3" stroke="#3D8A5F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS)
  const [dragOver, setDragOver] = useState(false)
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().slice(0, 10))
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (files: File[]) => {
    const newPrescriptions: Prescription[] = files.map(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() as Prescription['fileType']
      return {
        id: `p-${Date.now()}-${Math.random()}`,
        filename: file.name,
        date: uploadDate,
        fileType: ['pdf', 'jpg', 'png'].includes(ext) ? ext : 'pdf',
      }
    })
    setPrescriptions(prev => [
      ...newPrescriptions.reverse(),
      ...prev,
    ])
  }

  const handleDelete = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  const sorted = [...prescriptions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div style={{ padding: '32px 32px 64px' }} className="">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 30, color: '#1A1814', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Prescriptions Vault
        </h1>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#9C9181', margin: 0 }}>
          Securely stored prescription documents — accessible only to you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="lg-grid-3">
        {/* Upload area */}
        <div>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 17, color: '#1A1814', margin: '0 0 16px' }}>
            Upload Document
          </h2>

          {/* Date */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Document date</label>
            <input
              type="date"
              value={uploadDate}
              onChange={e => setUploadDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#3D8A5F' : '#DDD6C5'}`,
              borderRadius: 12,
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(61,138,95,0.04)' : '#FAF8F4',
              transition: 'all 200ms ease',
            }}
          >
            <div style={{
              width: 48, height: 48,
              borderRadius: '50%',
              background: dragOver ? '#EAF4EE' : '#F0EDE6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              transition: 'background 200ms ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 14V3M7 7l4-4 4 4" stroke={dragOver ? '#3D8A5F' : '#9C9181'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" stroke={dragOver ? '#3D8A5F' : '#9C9181'} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: dragOver ? '#1C3D2E' : '#5C5448', margin: '0 0 4px' }}>
              {dragOver ? 'Drop to upload' : 'Drag & drop files here'}
            </p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9C9181', margin: '0 0 16px' }}>
              or click to browse
            </p>
            <div style={{
              display: 'inline-flex',
              gap: 6,
              background: '#F0EDE6',
              borderRadius: 6,
              padding: '5px 10px',
            }}>
              {['PDF', 'JPG', 'PNG'].map(t => (
                <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9C9181', letterSpacing: '0.04em' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          {/* Privacy note */}
          <div style={{
            marginTop: 14,
            padding: '10px 14px',
            background: '#EAF4EE',
            borderRadius: 8,
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <rect x="1" y="1" width="12" height="12" rx="3" stroke="#3D8A5F" strokeWidth="1.3" />
              <path d="M7 6v4M7 4.5v.5" stroke="#3D8A5F" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#3D8A5F', lineHeight: 1.5 }}>
              Documents are stored privately and never shared with third parties.
            </span>
          </div>
        </div>

        {/* Documents grid */}
        <div style={{ gridColumn: 'span 1' }} className="lg-col-span-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 17, color: '#1A1814', margin: 0 }}>
              Stored Documents
            </h2>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181' }}>
              {sorted.length} document{sorted.length !== 1 ? 's' : ''}
            </span>
          </div>

          {sorted.length === 0 ? (
            <div style={{
              background: '#FAF8F4',
              border: '2px dashed #DDD6C5',
              borderRadius: 14,
              padding: '64px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>📄</div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#9C9181', margin: '0 0 4px', fontWeight: 500 }}>
                No documents yet
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#B5B0A5', margin: 0 }}>
                Upload a prescription or lab report to get started
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {sorted.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    background: '#FAF8F4',
                    border: '1.5px solid #EDE8DC',
                    borderRadius: 12,
                    padding: '18px',
                    position: 'relative',
                    transition: 'box-shadow 180ms ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,61,46,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  {/* File icon */}
                  <div style={{ marginBottom: 12 }}>
                    {fileIcons[doc.fileType] ?? fileIcons.pdf}
                  </div>

                  {/* Filename */}
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#1A1814',
                    marginBottom: 4,
                    wordBreak: 'break-word',
                    lineHeight: 1.4,
                  }}>
                    {doc.filename}
                  </div>
                  {doc.notes && (
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9C9181', marginBottom: 4 }}>
                      {doc.notes}
                    </div>
                  )}
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181', marginBottom: 14 }}>
                    {formatDate(doc.date)}
                  </div>

                  {/* Actions */}
                  {deleteConfirm === doc.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        style={{ flex: 1, background: '#D9502E', color: '#FAF8F4', border: 'none', borderRadius: 6, padding: '6px 0', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 12 }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{ flex: 1, background: 'none', border: '1px solid #DDD6C5', borderRadius: 6, padding: '6px 0', cursor: 'pointer', color: '#9C9181', fontFamily: "'Outfit', sans-serif", fontSize: 12 }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        style={{ flex: 1, background: '#EAF4EE', color: '#244E3A', border: 'none', borderRadius: 6, padding: '7px 0', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500 }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(doc.id)}
                        style={{ background: 'none', border: '1px solid #EDE8DC', borderRadius: 6, padding: '7px 10px', cursor: 'pointer', color: '#9C9181', display: 'flex', alignItems: 'center', transition: 'all 160ms ease' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#F0B9A5'; e.currentTarget.style.color = '#D9502E' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE8DC'; e.currentTarget.style.color = '#9C9181' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 3.5h9M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M4.5 3.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Outfit', sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: '#5C5448',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1.5px solid #DDD6C5',
  borderRadius: 8,
  background: '#FDFBF7',
  fontFamily: "'Outfit', sans-serif",
  fontSize: 14,
  color: '#1A1814',
  outline: 'none',
  boxSizing: 'border-box',
}
