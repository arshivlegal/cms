
import React, { useState, useEffect } from 'react';
import { FileText, Video, Upload, Edit2, Trash2, Eye, Plus, Menu, X, Home, Settings, LogOut, Search, Filter, AlertTriangle } from 'lucide-react';

// ==================== REUSABLE COMPONENTS ====================

// Button Component
const Button = ({ variant = "primary", children, onClick, disabled, className = "", type = "button", ...props }) => {
  const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#083455] text-white hover:bg-[#0D436C] shadow-md hover:shadow-lg",
    secondary: "text-[#804012] bg-[#FFD19C] hover:bg-[#FFE0BC]",
    cta: "text-white bg-[#804012] hover:bg-[#FFD19C] hover:text-[#804012]",
    outliner: "text-[#083455] hover:bg-[#083455] hover:text-white border-[#083455] border-2",
    destructive: "text-white bg-[#731818] hover:bg-[#6C2E2E]",
    ghost: "text-gray-700 hover:bg-gray-100"
  };

  const allClasses = `${baseClass} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button 
      type={type}
      className={allClasses} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  className = "",
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083455] transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Textarea Component
const Textarea = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  rows = 4,
  className = "",
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083455] transition-all resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Select Component
const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [],
  error,
  required = false,
  className = "",
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#083455] transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// File Upload Component
const FileUpload = ({ 
  label, 
  name, 
  onChange, 
  previewUrl, 
  accept = "image/*",
  error,
  required = false
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-[#083455] transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}>
        <input
          name={name}
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
          id={name}
        />
        <label htmlFor={name} className="cursor-pointer">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="mx-auto w-full max-w-md h-48 object-cover rounded-lg" />
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto text-gray-400" size={48} />
              <p className="text-gray-600">Click to upload</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
            </div>
          )}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-[scale-in_0.2s_ease-out]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{title || 'Confirm Delete'}</h3>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>
        
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ progress }) => {
  if (progress === 0 || progress === 100) return null;
  
  return (
    <div className="mt-3">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Uploading...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[#083455] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ==================== MOCK DATA & UTILITIES ====================

const mockAPI = {
  blogs: [
    { _id: '1', title: 'Understanding Property Rights', content: 'Detailed analysis of property law...', category: 'Rights', tags: ['property', 'rights'], thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400', createdAt: new Date().toISOString(), isPublished: true },
    { _id: '2', title: 'Court Procedures 101', content: 'Essential guide to court processes...', category: 'Court', tags: ['court', 'procedure'], thumbnail: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400', createdAt: new Date().toISOString(), isPublished: false }
  ],
  videos: [
    { _id: '1', title: 'Legal Rights Explained', platform: 'youtube', redirectUrl: 'https://youtube.com/watch?v=example', description: 'Quick overview of basic legal rights', thumbnail: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400', createdAt: new Date().toISOString(), isActive: true }
  ]
};

const validateBlog = (data) => {
  const errors = {};
  if (!data.title || data.title.length < 3) errors.title = 'Title must be at least 3 characters';
  if (!data.content || data.content.length < 10) errors.content = 'Content must be at least 10 characters';
  return { isValid: Object.keys(errors).length === 0, errors };
};

const validateVideo = (data) => {
  const errors = {};
  if (!data.title || data.title.length < 3) errors.title = 'Title must be at least 3 characters';
  if (!data.redirectUrl || !data.redirectUrl.startsWith('http')) errors.redirectUrl = 'Valid URL required';
  if (!data.platform) errors.platform = 'Platform is required';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export {
    Button,
    Input,
    Textarea,
    Select,
    FileUpload,
    DeleteModal,
    ProgressBar,
    mockAPI,
    validateBlog,
    validateVideo
    
}