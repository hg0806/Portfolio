'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Play, LogOut, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Profile = {
  name?: string;
  title?: string;
  bio?: string;
  thumbnailVideo?: string;
  skills?: { name: string; level?: number }[];
  experience?: { title: string; company: string; period: string; description: string }[];
  education?: { degree: string; school: string; period: string }[];
  layout?: any;
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
  featured: boolean;
  createdAt: string;
};

type SectionType = 'bio' | 'skills' | 'experience' | 'education';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  editMode: boolean;
}

function SortableItem({ id, children, editMode }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={editMode ? 'cursor-move' : ''}>
      {editMode && (
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center py-2 text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-5 w-5" />
        </div>
      )}
      {children}
    </div>
  );
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<SectionType[]>([
    'bio',
    'skills',
    'experience',
    'education',
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as SectionType);
        const newIndex = items.indexOf(over.id as SectionType);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveLayout = async () => {
    if (!profile) return;

    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          layout: { sectionOrder },
        }),
      });
      setEditMode(false);
    } catch (error) {
      console.error('Failed to save layout:', error);
    }
  };

  useEffect(() => {
    // Fetch profile
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.data);
          if (data.data?.layout?.sectionOrder) {
            setSectionOrder(data.data.layout.sectionOrder);
          }
        }
      });

    // Fetch projects
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
      });

    // Check auth
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(!!data?.user));
  }, []);

  const workProjects = projects.filter((p) => p.category === 'work');
  const activityProjects = projects.filter((p) => p.category === 'activity');

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{profile?.name || 'Portfolio'}</h1>
          <div className="flex gap-2">
            {isLoggedIn ? (
              <>
                {editMode ? (
                  <Button size="sm" onClick={saveLayout}>
                    <Edit className="h-4 w-4 mr-2" />
                    저장
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    편집 모드
                  </Button>
                )}
                <Button size="sm" asChild>
                  <Link href="/new">
                    <Plus className="h-4 w-4 mr-2" />
                    새 프로젝트
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section - Thumbnail Video */}
        {profile?.thumbnailVideo && (
          <section className="min-h-screen flex items-center justify-center bg-black relative">
            <iframe
              src={profile.thumbnailVideo}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay"
            />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center z-10">
              <h2 className="text-5xl font-bold mb-4">{profile.name}</h2>
              <p className="text-2xl opacity-90">{profile.title}</p>
            </div>
          </section>
        )}

        {/* Profile Section */}
        <section className="max-w-5xl mx-auto px-8 py-20">
          {editMode && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-sm text-blue-800">
                드래그 앤 드롭으로 섹션 순서를 변경할 수 있습니다
              </p>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              <div className="space-y-12">
                {sectionOrder.map((sectionId) => {
                  if (sectionId === 'bio' && profile?.bio) {
                    return (
                      <SortableItem key="bio" id="bio" editMode={editMode}>
                        <div>
                          <h3 className="text-3xl font-bold mb-6">소개</h3>
                          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {profile.bio}
                          </p>
                        </div>
                      </SortableItem>
                    );
                  }

                  if (sectionId === 'skills' && profile?.skills && profile.skills.length > 0) {
                    return (
                      <SortableItem key="skills" id="skills" editMode={editMode}>
                        <div>
                          <h3 className="text-3xl font-bold mb-6">기술 스택</h3>
                          <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-base px-4 py-2">
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </SortableItem>
                    );
                  }

                  if (
                    sectionId === 'experience' &&
                    profile?.experience &&
                    profile.experience.length > 0
                  ) {
                    return (
                      <SortableItem key="experience" id="experience" editMode={editMode}>
                        <div>
                          <h3 className="text-3xl font-bold mb-6">경력</h3>
                          <div className="space-y-8">
                            {profile.experience.map((exp, idx) => (
                              <Card key={idx} className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="text-xl font-bold">{exp.title}</h4>
                                    <p className="text-gray-600">{exp.company}</p>
                                  </div>
                                  <Badge variant="outline">{exp.period}</Badge>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </SortableItem>
                    );
                  }

                  if (
                    sectionId === 'education' &&
                    profile?.education &&
                    profile.education.length > 0
                  ) {
                    return (
                      <SortableItem key="education" id="education" editMode={editMode}>
                        <div>
                          <h3 className="text-3xl font-bold mb-6">학력</h3>
                          <div className="space-y-4">
                            {profile.education.map((edu, idx) => (
                              <Card key={idx} className="p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-lg font-bold">{edu.degree}</h4>
                                    <p className="text-gray-600">{edu.school}</p>
                                  </div>
                                  <Badge variant="outline">{edu.period}</Badge>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </SortableItem>
                    );
                  }

                  return null;
                })}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        {/* Works Section */}
        {workProjects.length > 0 && (
          <section className="max-w-7xl mx-auto px-8 py-20 border-t">
            <h3 className="text-4xl font-bold mb-12">작품</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                    {project.coverImage || project.thumbnailPath ? (
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        {project.thumbnailPath ? (
                          <iframe
                            src={project.thumbnailPath}
                            className="absolute inset-0 w-full h-full"
                          />
                        ) : (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                        <span className="text-6xl">{project.icon || '📁'}</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h4>
                      {project.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {project.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Activities Section */}
        {activityProjects.length > 0 && (
          <section className="max-w-7xl mx-auto px-8 py-20 border-t">
            <h3 className="text-4xl font-bold mb-12">대외활동</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activityProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                    {project.coverImage || project.thumbnailPath ? (
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        {project.thumbnailPath ? (
                          <iframe
                            src={project.thumbnailPath}
                            className="absolute inset-0 w-full h-full"
                          />
                        ) : (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                        <span className="text-6xl">{project.icon || '🎯'}</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h4>
                      {project.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {project.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {projects.length === 0 && !profile && (
          <section className="max-w-5xl mx-auto px-8 py-40 text-center">
            <h2 className="text-4xl font-bold mb-4">포트폴리오를 시작하세요</h2>
            <p className="text-xl text-gray-600 mb-8">프로필과 프로젝트를 추가해보세요</p>
            {isLoggedIn && (
              <Button size="lg" asChild>
                <Link href="/new">
                  <Plus className="h-5 w-5 mr-2" />
                  첫 프로젝트 만들기
                </Link>
              </Button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
