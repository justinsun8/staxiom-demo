import React, { useState, useRef, useEffect } from 'react';
import './UploadDocuments.css';
import fileUploadService from '../../services/fileUploadService';
import documentTypes, { getRequiredDocuments, getStrengtheningDocuments } from '../../config/documentTypes';
import { useToast } from '../../contexts/ToastContext';

const UploadDocuments = ({ data, onUpdate, onNext, onBack }) => {
  const [uploadedFiles, setUploadedFiles] = useState(data.uploadedFiles || {});
  const [uploading, setUploading] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const { toast } = useToast();
  
  // Load previously uploaded files on mount
  useEffect(() => {
    const existingFiles = fileUploadService.getUploadedFiles();
    if (existingFiles.length > 0) {
      const filesMap = {};
      existingFiles.forEach(file => {
        if (!filesMap[file.documentType.id]) {
          filesMap[file.documentType.id] = [];
        }
        filesMap[file.documentType.id].push(file);
      });
      setUploadedFiles(filesMap);
    }
    
    // All categories start closed
    setExpandedCategories({});
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    // Process multiple files
    const uploadPromises = [];
    const isMultipleFiles = files.length > 1;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      // Find all matching document types across all categories
      const matchingDocs = [];
      
      Object.entries(documentTypes).forEach(([catKey, category]) => {
        category.documents.forEach(doc => {
          if (doc.acceptedFormats.includes(fileExtension)) {
            matchingDocs.push({ doc, category });
          }
        });
      });

      if (matchingDocs.length > 0) {
        // If file matches multiple document types, try to match by filename
        let bestMatch = matchingDocs[0];
        
        // Try to intelligently match based on filename
        const filename = file.name.toLowerCase();
        for (const match of matchingDocs) {
          const docName = match.doc.name.toLowerCase();
          const docId = match.doc.id.toLowerCase();
          
          // Check if filename contains keywords from document type
          if (filename.includes('w-2') || filename.includes('w2')) {
            if (docId.includes('w2')) {
              bestMatch = match;
              break;
            }
          } else if (filename.includes('tax') || filename.includes('1120') || filename.includes('1065')) {
            if (docId.includes('tax')) {
              bestMatch = match;
              break;
            }
          } else if (filename.includes('payroll')) {
            if (docId.includes('payroll')) {
              bestMatch = match;
              break;
            }
          }
        }
        
        uploadPromises.push(uploadFileForDocument(file, bestMatch.doc, bestMatch.category, isMultipleFiles));
      } else {
        toast.error(`File type ${fileExtension} not supported for ${file.name}`);
      }
    }
    
    // Upload all files in parallel
    const results = await Promise.allSettled(uploadPromises);
    
    // Show summary if multiple files
    if (files.length > 1) {
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      if (successCount === files.length) {
        toast.success(`Successfully uploaded ${successCount} files`);
      } else if (successCount > 0) {
        toast.warning(`Uploaded ${successCount} of ${files.length} files`);
      }
    }
  };

  const uploadFileForDocument = async (file, documentType, category, skipToast = false) => {
    try {
      setUploading(prev => ({ ...prev, [documentType.id]: true }));

      const result = await fileUploadService.uploadFile(file, documentType);
      
      if (result.success) {
        setUploadedFiles(prev => {
          const updated = { ...prev };
          if (!updated[documentType.id]) {
            updated[documentType.id] = [];
          }
          updated[documentType.id].push(result.metadata);
          return updated;
        });
        
        // Only show individual toast if not uploading multiple files
        if (!skipToast) {
          toast.success(`Uploaded ${file.name}`);
        }
        onUpdate({ uploadedFiles: uploadedFiles });
      }
    } catch (error) {
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [documentType.id]: false }));
    }
  };

  const handleDocumentUpload = async (documentType, category) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = documentType.acceptedFormats.join(',');
    input.multiple = true;
    input.onchange = async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        for (let i = 0; i < e.target.files.length; i++) {
          await uploadFileForDocument(e.target.files[i], documentType, category);
        }
      }
    };
    input.click();
  };

  const handleDeleteFile = async (fileId, documentTypeId) => {
    try {
      await fileUploadService.deleteFile(fileId);
      setUploadedFiles(prev => {
        const updated = { ...prev };
        if (updated[documentTypeId]) {
          updated[documentTypeId] = updated[documentTypeId].filter(f => f.id !== fileId);
          if (updated[documentTypeId].length === 0) {
            delete updated[documentTypeId];
          }
        }
        return updated;
      });
      toast.success('File removed successfully');
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  const isDocumentUploaded = (documentId) => {
    return uploadedFiles[documentId] && uploadedFiles[documentId].length > 0;
  };

  const getUploadedFileCount = () => {
    return Object.values(uploadedFiles).reduce((count, files) => count + files.length, 0);
  };

  const getCategoryUploadStatus = (category) => {
    const requiredDocs = category.documents.filter(doc => doc.required || doc.irsRequired);
    const uploadedRequiredDocs = requiredDocs.filter(doc => isDocumentUploaded(doc.id));
    return {
      required: requiredDocs.length,
      uploaded: uploadedRequiredDocs.length,
      complete: uploadedRequiredDocs.length === requiredDocs.length
    };
  };

  // Progress calculations
  const getRequiredProgress = () => {
    const required = getRequiredDocuments();
    const uploaded = required.filter(doc => isDocumentUploaded(doc.id));
    return required.length > 0 ? (uploaded.length / required.length) * 100 : 0;
  };

  const getRecommendedProgress = () => {
    // Only count recommended docs (high importance but not required)
    const recommended = Object.values(documentTypes)
      .filter(cat => cat.importance === 'high' && !cat.required)
      .flatMap(cat => cat.documents.filter(doc => !doc.required && !doc.irsRequired));
    const uploaded = recommended.filter(doc => isDocumentUploaded(doc.id));
    return recommended.length > 0 ? (uploaded.length / recommended.length) * 100 : 0;
  };

  const getOptionalProgress = () => {
    // Count all strengthening documents
    const optional = getStrengtheningDocuments();
    const uploaded = optional.filter(doc => isDocumentUploaded(doc.id));
    return optional.length > 0 ? (uploaded.length / optional.length) * 100 : 0;
  };

  const getOverallProgress = () => {
    // Weighted average: 40% required, 35% recommended, 25% optional
    const requiredWeight = 0.4;
    const recommendedWeight = 0.35;
    const optionalWeight = 0.25;
    
    return (
      getRequiredProgress() * requiredWeight +
      getRecommendedProgress() * recommendedWeight +
      getOptionalProgress() * optionalWeight
    );
  };

  const handleNext = () => {
    onUpdate({ uploadedFiles });
    onNext();
  };

  const handleSkip = () => {
    onUpdate({ uploadedFiles, skipped: true });
    onNext();
  };

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImportanceBadge = (importance) => {
    const badges = {
      critical: { text: 'IRS Required', className: 'critical' },
      high: { text: 'Highly Recommended', className: 'high' },
      medium: { text: 'Recommended', className: 'medium' }
    };
    return badges[importance] || { text: '', className: '' };
  };

  return (
    <div className="upload-documents-container">
      <h1 className="page-title">
        Upload R&D Related Documents
        <span className="info-icon" title="More information">ⓘ</span>
      </h1>
      <p className="page-subtitle">
        Upload documents to strengthen your R&D tax credit claim. Our <strong>SMART DOCS</strong> system 
        will automatically recognize and categorize your files.
      </p>

      {/* Combined Upload Section */}
      <div className="upload-section">
        {/* Mac-style Progress Bar */}
        <div className="progress-header">
          <h3 className="progress-title">Document Upload Progress</h3>
          <span className="progress-percentage">{Math.round(getOverallProgress())}% Complete</span>
        </div>
        
        <div className="mac-progress-bar">
          <div 
            className="progress-fill required"
            style={{ width: `${(getRequiredProgress() / 100) * 40}%` }}
          />
          <div 
            className="progress-fill recommended"
            style={{ width: `${(getRecommendedProgress() / 100) * 35}%` }}
          />
          <div 
            className="progress-fill optional"
            style={{ width: `${(getOptionalProgress() / 100) * 25}%` }}
          />
        </div>

        <div className="progress-legend">
          <div className="legend-item">
            <span className="legend-dot required"></span>
            <span>Required ({getRequiredDocuments().filter(doc => isDocumentUploaded(doc.id)).length}/{getRequiredDocuments().length})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot recommended"></span>
            <span>Recommended ({Object.values(documentTypes).filter(cat => cat.importance === 'high' && !cat.required).flatMap(cat => cat.documents.filter(doc => !doc.required && !doc.irsRequired)).filter(doc => isDocumentUploaded(doc.id)).length}/{Object.values(documentTypes).filter(cat => cat.importance === 'high' && !cat.required).flatMap(cat => cat.documents.filter(doc => !doc.required && !doc.irsRequired)).length})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot optional"></span>
            <span>Optional ({getStrengtheningDocuments().filter(doc => isDocumentUploaded(doc.id)).length}/{getStrengtheningDocuments().length})</span>
          </div>
        </div>

        {/* Integrated Drop Zone */}
        <div
          ref={dropZoneRef}
          className={`integrated-drop-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-content">
            <div className="upload-icon">📤</div>
            <p className="drop-zone-text">
              <span className="add-files-text">Add files</span> or drop files here
            </p>
            <p className="drop-zone-subtext">
              Upload multiple files at once • Maximum size per file: 40MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            multiple
          />
        </div>

        <div className="upload-summary-text">
          <strong>{getUploadedFileCount()}</strong> files uploaded • 
          {getRequiredProgress() < 100 && (
            <span className="warning-text"> {getRequiredDocuments().length - getRequiredDocuments().filter(doc => isDocumentUploaded(doc.id)).length} required documents remaining</span>
          )}
          {getRequiredProgress() === 100 && (
            <span className="success-text"> All required documents uploaded</span>
          )}
        </div>
      </div>

      {/* Document Categories */}
      <div className="document-categories">
        {Object.entries(documentTypes).map(([categoryKey, category]) => {
          const uploadStatus = getCategoryUploadStatus(category);
          const importanceBadge = getImportanceBadge(category.importance);
          
          return (
            <div key={categoryKey} className={`category-section ${category.importance}`}>
              <div 
                className="category-header"
                onClick={() => toggleCategory(categoryKey)}
              >
                <div className="category-title-section">
                  <span className="expand-icon">
                    {expandedCategories[categoryKey] ? '▼' : '▶'}
                  </span>
                  <h3 className="category-title">{category.category}</h3>
                  {importanceBadge.text && (
                    <span className={`importance-badge ${importanceBadge.className}`}>
                      {importanceBadge.text}
                    </span>
                  )}
                </div>
                <div className="category-status">
                  {uploadStatus.required > 0 && (
                    <span className={`status-text ${uploadStatus.complete ? 'complete' : ''}`}>
                      {uploadStatus.uploaded}/{uploadStatus.required} required
                    </span>
                  )}
                  {uploadStatus.complete && <span className="check-icon">✓</span>}
                </div>
              </div>
              
              {expandedCategories[categoryKey] && (
                <div className="category-documents">
                  {category.applicability && (
                    <p className="category-note">{category.applicability}</p>
                  )}
                  
                  {category.documents.map(doc => {
                    const isUploaded = isDocumentUploaded(doc.id);
                    const files = uploadedFiles[doc.id] || [];
                    
                    return (
                      <div key={doc.id} className={`document-item ${isUploaded ? 'uploaded' : ''}`}>
                        <div className="document-info">
                          <div className="document-header">
                            <span className="document-icon">{doc.icon}</span>
                            <div className="document-details">
                              <h4 className="document-name">
                                {doc.name}
                                {(doc.required || doc.irsRequired) && <span className="required-star">*</span>}
                                {doc.strengthensCase && <span className="strengthens-badge">Strengthens Case</span>}
                                {doc.new2025 && <span className="new-badge">New 2025</span>}
                              </h4>
                              <p className="document-description">{doc.description}</p>
                              <p className="document-formats">
                                Accepted: {doc.acceptedFormats.join(', ')} • 
                                Max size: {formatFileSize(doc.maxSize)}
                              </p>
                            </div>
                          </div>
                          
                          {!isUploaded && !doc.autoGenerated && (
                            <button
                              className="upload-btn"
                              onClick={() => handleDocumentUpload(doc, category)}
                              disabled={uploading[doc.id]}
                            >
                              {uploading[doc.id] ? 'Uploading...' : 'Upload Files'}
                            </button>
                          )}
                          
                          {doc.autoGenerated && (
                            <span className="auto-generated-note">Will be generated automatically</span>
                          )}
                        </div>
                        
                        {files.length > 0 && (
                          <div className="uploaded-files">
                            {files.map(file => (
                              <div key={file.id} className="uploaded-file">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{formatFileSize(file.size)}</span>
                                <button
                                  className="remove-btn"
                                  onClick={() => handleDeleteFile(file.id, doc.id)}
                                  title="Remove file"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Summary */}
      <div className="upload-summary">
        <p>
          Uploaded {getUploadedFileCount()} files
        </p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button onClick={handleSkip} className="skip-btn">
          Skip
        </button>
        <button 
          onClick={handleNext} 
          className="next-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UploadDocuments;