'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Type,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Trash2,
  GripVertical,
  Plus,
  Shapes,
  Code,
  FileText,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type BlockType =
  | 'text'
  | 'heading'
  | 'image'
  | 'video'
  | 'embed'
  | 'link'
  | 'markdown'
  | 'shape'
  | 'divider'
  | 'notion';

export type Block = {
  id: string;
  type: BlockType;
  content: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    padding?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    gridColumns?: number;
    borderRadius?: string;
    border?: string;
    shapeType?: 'circle' | 'square' | 'triangle' | 'arrow';
  };
  metadata?: {
    alt?: string;
    caption?: string;
    url?: string;
  };
};

const fontFamilies = [
  'Inter',
  'Georgia',
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Palatino',
  'Garamond',
  'Comic Sans MS',
];

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'];

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        textAlign: 'left',
        padding: '20px',
        fontSize: '16px',
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        gridColumns: 1,
        borderRadius: '8px',
        border: 'none',
      },
    };
    onChange([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    onChange(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)));
  };

  const updateBlockStyle = (id: string, styleUpdates: Partial<Block['style']>) => {
    onChange(
      blocks.map((block) =>
        block.id === id ? { ...block, style: { ...block.style, ...styleUpdates } } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const renderBlockToolbar = (block: Block) => (
    <div className="absolute -top-12 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-2 flex-wrap z-10">
      {/* Block Type */}
      <Select
        value={block.type}
        onValueChange={(value) => updateBlock(block.id, { type: value as BlockType })}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">텍스트</SelectItem>
          <SelectItem value="heading">제목</SelectItem>
          <SelectItem value="image">이미지</SelectItem>
          <SelectItem value="video">비디오</SelectItem>
          <SelectItem value="embed">임베드</SelectItem>
          <SelectItem value="link">링크</SelectItem>
          <SelectItem value="markdown">마크다운</SelectItem>
          <SelectItem value="shape">도형</SelectItem>
          <SelectItem value="divider">구분선</SelectItem>
          <SelectItem value="notion">Notion</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Family */}
      <Select
        value={block.style?.fontFamily}
        onValueChange={(value) => updateBlockStyle(block.id, { fontFamily: value })}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="폰트" />
        </SelectTrigger>
        <SelectContent>
          {fontFamilies.map((font) => (
            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select
        value={block.style?.fontSize}
        onValueChange={(value) => updateBlockStyle(block.id, { fontSize: value })}
      >
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue placeholder="크기" />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Text Formatting */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={block.style?.fontWeight === 'bold' ? 'default' : 'outline'}
          className="h-8 w-8 p-0"
          onClick={() =>
            updateBlockStyle(block.id, {
              fontWeight: block.style?.fontWeight === 'bold' ? 'normal' : 'bold',
            })
          }
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={block.style?.fontStyle === 'italic' ? 'default' : 'outline'}
          className="h-8 w-8 p-0"
          onClick={() =>
            updateBlockStyle(block.id, {
              fontStyle: block.style?.fontStyle === 'italic' ? 'normal' : 'italic',
            })
          }
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={block.style?.textDecoration === 'underline' ? 'default' : 'outline'}
          className="h-8 w-8 p-0"
          onClick={() =>
            updateBlockStyle(block.id, {
              textDecoration: block.style?.textDecoration === 'underline' ? 'none' : 'underline',
            })
          }
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Align */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={block.style?.textAlign === 'left' ? 'default' : 'outline'}
          className="h-8 w-8 p-0"
          onClick={() => updateBlockStyle(block.id, { textAlign: 'left' })}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={block.style?.textAlign === 'center' ? 'default' : 'outline'}
          className="h-8 w-8 p-0"
          onClick={() => updateBlockStyle(block.id, { textAlign: 'center' })}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={block.style?.textAlign === 'right' ? 'default' : 'outline'}
          className="h-8 w-8 p-0"
          onClick={() => updateBlockStyle(block.id, { textAlign: 'right' })}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Background Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: block.style?.backgroundColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <Label>배경색</Label>
          <Input
            type="color"
            value={block.style?.backgroundColor}
            onChange={(e) => updateBlockStyle(block.id, { backgroundColor: e.target.value })}
            className="w-full h-10 mt-2"
          />
        </PopoverContent>
      </Popover>

      {/* Text Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <Palette className="h-4 w-4" style={{ color: block.style?.textColor }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <Label>텍스트 색상</Label>
          <Input
            type="color"
            value={block.style?.textColor}
            onChange={(e) => updateBlockStyle(block.id, { textColor: e.target.value })}
            className="w-full h-10 mt-2"
          />
        </PopoverContent>
      </Popover>

      {/* Grid Columns (for images/videos) */}
      {(block.type === 'image' || block.type === 'video' || block.type === 'embed') && (
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">열: {block.style?.gridColumns || 1}</Label>
          <Slider
            value={[block.style?.gridColumns || 1]}
            onValueChange={([value]) => updateBlockStyle(block.id, { gridColumns: value })}
            min={1}
            max={4}
            step={1}
            className="w-20"
          />
        </div>
      )}

      {/* Shape Type */}
      {block.type === 'shape' && (
        <Select
          value={block.style?.shapeType}
          onValueChange={(value) =>
            updateBlockStyle(block.id, { shapeType: value as 'circle' | 'square' | 'triangle' | 'arrow' })
          }
        >
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue placeholder="도형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circle">원</SelectItem>
            <SelectItem value="square">사각형</SelectItem>
            <SelectItem value="triangle">삼각형</SelectItem>
            <SelectItem value="arrow">화살표</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Move & Delete */}
      <div className="flex gap-1 ml-auto">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => moveBlock(block.id, 'up')}
        >
          ↑
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => moveBlock(block.id, 'down')}
        >
          ↓
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-8 w-8 p-0"
          onClick={() => deleteBlock(block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderBlockContent = (block: Block) => {
    const blockStyle: React.CSSProperties = {
      backgroundColor: block.style?.backgroundColor,
      color: block.style?.textColor,
      textAlign: block.style?.textAlign,
      padding: block.style?.padding,
      fontSize: block.style?.fontSize,
      fontFamily: block.style?.fontFamily,
      fontWeight: block.style?.fontWeight,
      fontStyle: block.style?.fontStyle,
      textDecoration: block.style?.textDecoration,
      borderRadius: block.style?.borderRadius,
      border: block.style?.border,
    };

    switch (block.type) {
      case 'text':
      case 'heading':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder={block.type === 'heading' ? '제목 입력...' : '내용 입력...'}
            className="w-full min-h-[100px] bg-transparent border-none resize-none focus-visible:ring-0"
            style={blockStyle}
          />
        );

      case 'markdown':
        return (
          <div>
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="마크다운 입력..."
              className="w-full min-h-[100px] mb-4 font-mono text-sm"
            />
            {block.content && (
              <div
                className="prose prose-sm max-w-none p-4 rounded border"
                style={{
                  backgroundColor: block.style?.backgroundColor,
                  color: block.style?.textColor,
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${block.style?.gridColumns || 1}, 1fr)`,
              gap: '1rem',
            }}
          >
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      updateBlock(block.id, { content: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />
              {block.content && (
                <img
                  src={block.content}
                  alt={block.metadata?.alt || ''}
                  className="w-full rounded-lg"
                />
              )}
              <Input
                placeholder="대체 텍스트 (선택사항)"
                value={block.metadata?.alt || ''}
                onChange={(e) =>
                  updateBlock(block.id, {
                    metadata: { ...block.metadata, alt: e.target.value },
                  })
                }
                className="text-sm"
              />
            </div>
          </div>
        );

      case 'video':
      case 'embed':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${block.style?.gridColumns || 1}, 1fr)`,
              gap: '1rem',
            }}
          >
            <div className="space-y-2">
              <Input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder={
                  block.type === 'video'
                    ? 'YouTube/Vimeo URL 입력...'
                    : '임베드 URL 입력 (Instagram, etc)...'
                }
                className="w-full"
              />
              {block.content && (
                <div className="aspect-video">
                  <iframe
                    src={block.content}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'notion':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Notion 페이지 공유 링크 입력..."
              className="w-full"
            />
            {block.content && (
              <div className="aspect-video">
                <iframe src={block.content} className="w-full h-full rounded-lg border" />
              </div>
            )}
          </div>
        );

      case 'link':
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="링크 URL 입력..."
              className="w-full"
            />
            <Input
              placeholder="링크 제목 (선택사항)"
              value={block.metadata?.caption || ''}
              onChange={(e) =>
                updateBlock(block.id, {
                  metadata: { ...block.metadata, caption: e.target.value },
                })
              }
              className="text-sm"
            />
            {block.content && (
              <a
                href={block.content}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: block.style?.textColor }}
              >
                <LinkIcon className="h-4 w-4" />
                <span className="font-medium">
                  {block.metadata?.caption || block.content}
                </span>
              </a>
            )}
          </div>
        );

      case 'shape':
        return (
          <div className="flex items-center justify-center min-h-[200px]">
            {block.style?.shapeType === 'circle' && (
              <div
                className="w-32 h-32 rounded-full"
                style={{
                  backgroundColor: block.style?.backgroundColor,
                  border: `2px solid ${block.style?.textColor}`,
                }}
              />
            )}
            {block.style?.shapeType === 'square' && (
              <div
                className="w-32 h-32"
                style={{
                  backgroundColor: block.style?.backgroundColor,
                  border: `2px solid ${block.style?.textColor}`,
                  borderRadius: block.style?.borderRadius,
                }}
              />
            )}
            {block.style?.shapeType === 'triangle' && (
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '64px solid transparent',
                  borderRight: '64px solid transparent',
                  borderBottom: `110px solid ${block.style?.backgroundColor}`,
                }}
              />
            )}
            {block.style?.shapeType === 'arrow' && (
              <div className="text-6xl" style={{ color: block.style?.textColor }}>
                →
              </div>
            )}
          </div>
        );

      case 'divider':
        return (
          <div className="py-4">
            <div
              className="h-px"
              style={{
                backgroundColor: block.style?.textColor || '#e5e7eb',
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* Blocks */}
      {blocks.map((block) => (
        <Card
          key={block.id}
          className={`group relative p-6 transition-all ${
            selectedBlockId === block.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setSelectedBlockId(block.id)}
        >
          {/* Drag Handle */}
          <div className="absolute left-2 top-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>

          {/* Toolbar */}
          {renderBlockToolbar(block)}

          {/* Content */}
          <div className="pl-6">{renderBlockContent(block)}</div>
        </Card>
      ))}

      {/* Add Block Menu */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('text')}
          className="flex items-center gap-2"
        >
          <Type className="h-4 w-4" />
          텍스트
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('heading')}
          className="flex items-center gap-2"
        >
          <Type className="h-4 w-4" />
          제목
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('image')}
          className="flex items-center gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          이미지
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('video')}
          className="flex items-center gap-2"
        >
          <Video className="h-4 w-4" />
          비디오
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('embed')}
          className="flex items-center gap-2"
        >
          <Code className="h-4 w-4" />
          임베드
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('notion')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Notion
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('link')}
          className="flex items-center gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          링크
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('markdown')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          마크다운
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('shape')}
          className="flex items-center gap-2"
        >
          <Shapes className="h-4 w-4" />
          도형
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addBlock('divider')}
          className="flex items-center gap-2"
        >
          ━
          구분선
        </Button>
      </div>
    </div>
  );
}
