// File Upload Service - Handles document uploads for R&D tax credit claims
// Currently using mock uploads, but structured for easy integration with cloud storage

class FileUploadService {
  constructor() {
    this.mockMode = true; // Toggle this when ready for real uploads
    this.uploadedFiles = new Map(); // Store uploaded files in memory for demo
  }

  // Upload file - ready for real implementation
  async uploadFile(file, documentType) {
    if (this.mockMode) {
      return this.mockUploadFile(file, documentType);
    }

    // Real upload implementation (ready for S3, Azure Blob, etc.)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('timestamp', new Date().toISOString());

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return {
        success: true,
        fileId: data.fileId,
        url: data.url,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Mock file upload for development
  async mockUploadFile(file, documentType) {
    return new Promise((resolve, reject) => {
      // Simulate upload delay
      const uploadTime = Math.random() * 2000 + 1000; // 1-3 seconds
      
      setTimeout(() => {
        // Validate file
        const validation = this.validateFile(file, documentType);
        if (!validation.valid) {
          reject(new Error(validation.error));
          return;
        }

        // Generate mock file ID and URL
        const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockUrl = URL.createObjectURL(file);

        // Store file metadata
        const fileData = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          documentType: documentType,
          url: mockUrl,
          uploadedAt: new Date().toISOString(),
          status: 'uploaded'
        };

        this.uploadedFiles.set(fileId, fileData);

        resolve({
          success: true,
          fileId: fileId,
          url: mockUrl,
          metadata: fileData
        });
      }, uploadTime);
    });
  }

  // Validate file before upload
  validateFile(file, documentType) {
    const maxSize = documentType.maxSize || 10485760; // Default 10MB
    const acceptedFormats = documentType.acceptedFormats || ['.pdf'];

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum of ${this.formatFileSize(maxSize)}`
      };
    }

    // Check file format
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return {
        valid: false,
        error: `File format not accepted. Please use: ${acceptedFormats.join(', ')}`
      };
    }

    // Additional validation for specific document types
    if (documentType.id.includes('tax_return') && file.type !== 'application/pdf') {
      return {
        valid: false,
        error: 'Tax returns must be in PDF format'
      };
    }

    return { valid: true };
  }

  // Delete uploaded file
  async deleteFile(fileId) {
    if (this.mockMode) {
      return this.mockDeleteFile(fileId);
    }

    try {
      const response = await fetch(`/api/upload/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  // Mock delete file
  async mockDeleteFile(fileId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const file = this.uploadedFiles.get(fileId);
        if (file && file.url) {
          URL.revokeObjectURL(file.url);
        }
        this.uploadedFiles.delete(fileId);
        resolve({ success: true });
      }, 500);
    });
  }

  // Get all uploaded files
  getUploadedFiles() {
    return Array.from(this.uploadedFiles.values());
  }

  // Get uploaded files by document type
  getFilesByDocumentType(documentTypeId) {
    return this.getUploadedFiles().filter(file => 
      file.documentType.id === documentTypeId
    );
  }

  // Check if a document type has been uploaded
  isDocumentUploaded(documentTypeId) {
    return this.getFilesByDocumentType(documentTypeId).length > 0;
  }

  // Get upload progress (for real implementation)
  onUploadProgress(callback) {
    // In real implementation, this would hook into XMLHttpRequest or fetch progress events
    this.progressCallback = callback;
  }

  // Helper methods
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getAuthToken() {
    // In production, get from auth service
    return sessionStorage.getItem('auth_token') || 'mock_token';
  }

  // Batch upload multiple files
  async uploadMultipleFiles(files, documentType) {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, documentType)
    );

    try {
      const results = await Promise.all(uploadPromises);
      return {
        success: true,
        uploaded: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
      };
    } catch (error) {
      console.error('Batch upload error:', error);
      throw error;
    }
  }

  // Generate presigned URL (for S3-style uploads)
  async getPresignedUrl(documentType) {
    if (this.mockMode) {
      return {
        url: 'https://mock-upload-url.com/upload',
        fields: {
          key: `uploads/${Date.now()}_${documentType.id}`,
          policy: 'mock_policy',
          signature: 'mock_signature'
        }
      };
    }

    // Real implementation would call backend API
    const response = await fetch('/api/upload/presigned-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentType: documentType.id })
    });

    return response.json();
  }
}

export default new FileUploadService();