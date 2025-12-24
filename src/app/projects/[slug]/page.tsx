'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Block = {
  id: string;
  type: 'text' | 'heading' | 'image' | 'video' | 'embed' | 'link' | 'markdown' | 'shape' | 'divider' | 'notion';
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

type Page = {
  id: string;
  title: string;
  icon?: string;
  blocks: Block[];
  order: number;
  children?: Page[];
};

type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  thumbnailPath?: string;
  coverImage?: string;
  icon?: string;
  tags: string[];
  pages: Page[];
};

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch project
    fetch(`/api/projects?slug=${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const proj = data.data[0];
          setProject(proj);
          if (proj.pages.length > 0) {
            setCurrentPageId(proj.pages[0].id);
          }
        }
      });

    // Check auth
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(!!data?.user));
  }, [params.slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const currentPage = project.pages.find((p) => p.id === currentPageId);

  const renderBlock = (block: Block) => {
    const blockStyle: React.CSSProperties = {
      backgroundColor: block.style?.backgroundColor,
      color: block.style?.textColor,
      textAlign: block.style?.textAlign as any,
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
          <div style={blockStyle} className="whitespace-pre-wrap">
            {block.content}
          </div>
        );

      case 'markdown':
        return (
          <div
            className="prose prose-lg max-w-none"
            style={{
              backgroundColor: block.style?.backgroundColor,
              color: block.style?.textColor,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
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
            {block.content && (
              <img
                src={block.content}
                alt={block.metadata?.alt || ''}
                className="w-full rounded-lg"
              />
            )}
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
        );

      case 'notion':
        return (
          <div className="aspect-video">
            {block.content && (
              <iframe src={block.content} className="w-full h-full rounded-lg border" />
            )}
          </div>
        );

      case 'link':
        return (
          <a
            href={block.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: block.style?.textColor }}
          >
            <span className="font-medium">
              {block.metadata?.caption || block.content}
            </span>
          </a>
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-black flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            홈으로
          </Link>
          {isLoggedIn && (
            <Button size="sm" variant="outline" asChild>
              <Link href="/new">
                <Edit className="h-4 w-4 mr-2" />
                편집
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="pt-20">
        {/* Project Header */}
        <section className="max-w-5xl mx-auto px-8 py-12">
          <div className="mb-8">
            {project.icon && <span className="text-6xl mb-4 block">{project.icon}</span>}
            <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
            {project.description && (
              <p className="text-xl text-gray-600 mb-6">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cover Image or Thumbnail Video */}
          {(project.coverImage || project.thumbnailPath) && (
            <div className="mb-12">
              {project.thumbnailPath ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={project.thumbnailPath}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay"
                  />
                </div>
              ) : project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full rounded-lg"
                />
              ) : null}
            </div>
          )}

          {/* Page Navigation */}
          {project.pages.length > 1 && (
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {project.pages.map((page) => (
                <Button
                  key={page.id}
                  variant={currentPageId === page.id ? 'default' : 'outline'}
                  onClick={() => setCurrentPageId(page.id)}
                  className="flex items-center gap-2"
                >
                  {page.icon && <span>{page.icon}</span>}
                  <FileText className="h-4 w-4" />
                  {page.title}
                </Button>
              ))}
            </div>
          )}

          {/* Page Content */}
          {currentPage && currentPage.blocks && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-8">{currentPage.title}</h2>
              {Array.isArray(currentPage.blocks) &&
                currentPage.blocks.map((block) => (
                  <Card key={block.id} className="p-6">
                    {renderBlock(block)}
                  </Card>
                ))}
            </div>
          )}

          {/* Empty State */}
          {(!currentPage || !currentPage.blocks || currentPage.blocks.length === 0) && (
            <div className="text-center py-20 text-gray-500">
              <p>아직 작성된 내용이 없습니다.</p>
              {isLoggedIn && (
                <Button className="mt-4" asChild>
                  <Link href="/new">
                    <Edit className="h-4 w-4 mr-2" />
                    내용 추가하기
                  </Link>
                </Button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
