/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Outdent, 
  Indent, 
  Link2, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Star, 
  Maximize2, 
  Minimize2,
  ChevronDown
} from 'lucide-react';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Write your rich content here...',
  error
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [format, setFormat] = useState('p');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    unorderedList: false,
    orderedList: false,
    blockquote: false
  });

  const updateToolbarStates = () => {
    if (typeof document !== 'undefined') {
      try {
        setActiveFormats({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          unorderedList: document.queryCommandState('insertUnorderedList'),
          orderedList: document.queryCommandState('insertOrderedList'),
          blockquote: String(document.queryCommandValue('formatBlock')) === 'blockquote'
        });

        const val = document.queryCommandValue('formatBlock');
        if (val) {
          const lowerVal = val.toString().toLowerCase();
          if (['h1', 'h2', 'h3', 'p'].includes(lowerVal)) {
            setFormat(lowerVal);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  };

  // Sync internal state with external value only when it differs (to avoid cursor resetting)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    updateToolbarStates();
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
    updateToolbarStates();
  };

  const handleFormatChange = (tag: string) => {
    setFormat(tag);
    execCommand('formatBlock', tag.toUpperCase());
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    const url = prompt('Enter the link URL (e.g. https://example.com):');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleAddImage = () => {
    const url = prompt('Enter the Image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleAddTable = () => {
    const rows = 2;
    const cols = 2;
    let tableHtml = '<table class="w-full border-collapse border border-gray-300 my-4">';
    for (let i = 0; i < rows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHtml += '<td class="border border-gray-300 p-2 text-xs">Cell</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table><p><br></p>';
    execCommand('insertHTML', tableHtml);
  };

  const handleAddStar = () => {
    // Inserts a star badge or star icon
    execCommand('insertHTML', ' <span class="inline-flex items-center text-amber-500 font-bold">⭐</span> ');
  };

  const getFormatLabel = () => {
    switch (format) {
      case 'h1': return 'Heading 1';
      case 'h2': return 'Heading 2';
      case 'h3': return 'Heading 3';
      default: return 'Paragraph';
    }
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 bg-white z-50 p-6 flex flex-col' : 'relative w-full'}`}>
      {label && !isFullscreen && (
        <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      <div className={`flex flex-col border rounded-xl overflow-hidden bg-white shadow-xs transition-all ${
        error ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200 focus-within:border-primary-red focus-within:ring-2 focus-within:ring-red-50'
      } ${isFullscreen ? 'flex-1 h-full' : ''}`}>
        
        {/* Rich Text Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-100 bg-gray-50/70 px-3 py-2 gap-y-2">
          <div className="flex flex-wrap items-center gap-1">
            
            {/* Format Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-text-gray bg-white border border-gray-200 rounded-lg hover:text-text-dark hover:border-gray-300 transition-colors"
              >
                <span>{getFormatLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-20">
                    <button
                      type="button"
                      onClick={() => handleFormatChange('p')}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-50 ${format === 'p' ? 'text-primary-red font-bold' : 'text-text-dark'}`}
                    >
                      Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatChange('h1')}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 ${format === 'h1' ? 'text-primary-red font-bold' : 'text-text-dark'}`}
                    >
                      Heading 1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatChange('h2')}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 ${format === 'h2' ? 'text-primary-red font-bold' : 'text-text-dark'}`}
                    >
                      Heading 2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatChange('h3')}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 ${format === 'h3' ? 'text-primary-red font-bold' : 'text-text-dark'}`}
                    >
                      Heading 3
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="w-[1px] h-5 bg-gray-200 mx-1" />

            {/* Formatting Actions */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
              className={`p-1.5 rounded-md transition-all border ${
                activeFormats.bold 
                  ? 'bg-red-50 text-primary-red border-red-200' 
                  : 'text-text-gray hover:bg-white hover:text-text-dark border-transparent hover:border-gray-200'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
              className={`p-1.5 rounded-md transition-all border ${
                activeFormats.italic 
                  ? 'bg-red-50 text-primary-red border-red-200' 
                  : 'text-text-gray hover:bg-white hover:text-text-dark border-transparent hover:border-gray-200'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-gray-200 mx-1" />

            {/* List Actions */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
              className={`p-1.5 rounded-md transition-all border ${
                activeFormats.unorderedList 
                  ? 'bg-red-50 text-primary-red border-red-200' 
                  : 'text-text-gray hover:bg-white hover:text-text-dark border-transparent hover:border-gray-200'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }}
              className={`p-1.5 rounded-md transition-all border ${
                activeFormats.orderedList 
                  ? 'bg-red-50 text-primary-red border-red-200' 
                  : 'text-text-gray hover:bg-white hover:text-text-dark border-transparent hover:border-gray-200'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-gray-200 mx-1" />

            {/* Quote Action */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand('formatBlock', 'blockquote'); }}
              className={`p-1.5 rounded-md transition-all border ${
                activeFormats.blockquote 
                  ? 'bg-red-50 text-primary-red border-red-200' 
                  : 'text-text-gray hover:bg-white hover:text-text-dark border-transparent hover:border-gray-200'
              }`}
              title="Quote Block"
            >
              <Quote className="w-4 h-4" />
            </button>

            {/* Indent Actions */}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand('outdent'); }}
              className="p-1.5 text-text-gray rounded-md hover:bg-white hover:text-text-dark border border-transparent hover:border-gray-200 transition-all"
              title="Outdent"
            >
              <Outdent className="w-4 h-4" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCommand('indent'); }}
              className="p-1.5 text-text-gray rounded-md hover:bg-white hover:text-text-dark border border-transparent hover:border-gray-200 transition-all"
              title="Indent"
            >
              <Indent className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-gray-200 mx-1" />

            {/* Insert Links & Media */}
            <button
              type="button"
              onClick={handleAddLink}
              className="p-1.5 text-text-gray rounded-md hover:bg-white hover:text-text-dark border border-transparent hover:border-gray-200 transition-all"
              title="Insert Link"
            >
              <Link2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAddImage}
              className="p-1.5 text-text-gray rounded-md hover:bg-white hover:text-text-dark border border-transparent hover:border-gray-200 transition-all"
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAddTable}
              className="p-1.5 text-text-gray rounded-md hover:bg-white hover:text-text-dark border border-transparent hover:border-gray-200 transition-all"
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAddStar}
              className="p-1.5 text-text-gray rounded-md hover:bg-white hover:text-amber-500 border border-transparent hover:border-gray-200 transition-all"
              title="Insert Highlight Star"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Full Screen */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-text-gray rounded-md hover:bg-white hover:text-text-dark border border-transparent hover:border-gray-200 transition-all"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Editable Canvas */}
        {/* `placeholder` is not valid on a div, so the hint is carried in
            data-placeholder and drawn by the rte-placeholder rule in index.css
            while the editor is empty. */}
        <div className={`rte-placeholder p-4 bg-white overflow-y-auto outline-none prose prose-sm max-w-none ${
          isFullscreen ? 'flex-1 h-full min-h-[400px]' : 'min-h-[220px]'
        }`}
          ref={editorRef}
          contentEditable={true}
          onInput={() => {
            handleInput();
            updateToolbarStates();
          }}
          onBlur={() => {
            handleInput();
            updateToolbarStates();
          }}
          onKeyUp={updateToolbarStates}
          onMouseUp={updateToolbarStates}
          onFocus={updateToolbarStates}
          data-placeholder={placeholder}
          style={{ minHeight: isFullscreen ? 'calc(100vh - 120px)' : '220px' }}
        />
      </div>

      {error && (
        <span className="text-[11px] text-red-500 font-bold mt-1.5 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
}
