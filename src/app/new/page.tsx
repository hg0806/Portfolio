'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BlockEditor, { Block } from '@/components/BlockEditor';
import { ArrowLeft, Save, User, FolderPlus, FileText } from 'lucide-react';

export default function NewPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'profile' | 'project'>('profile');

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    thumbnailVideo: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    skills: [] as { name: string }[],
    experience: [] as { title: string; company: string; period: string; description: string }[],
    education: [] as { degree: string; school: string; period: string }[],
  });

  // Project state
  const [project, setProject] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'work' as 'work' | 'activity' | 'other',
    thumbnailPath: '',
    coverImage: '',
    icon: '',
    tags: [] as string[],
    featured: false,
  });

  // Pages for project
  const [pages, setPages] = useState<{ title: string; blocks: Block[] }[]>([
    { title: '메인 페이지', blocks: [] },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('저장 실패');

      alert('프로필이 저장되었습니다');
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다');
    }
  };

  const handleSaveProject = async () => {
    if (!project.title.trim()) {
      alert('프로젝트 제목을 입력해주세요');
      return;
    }

    try {
      // Create project
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!projectResponse.ok) throw new Error('프로젝트 저장 실패');

      const projectData = await projectResponse.json();
      const projectId = projectData.data.id;

      // Create pages for the project
      for (const page of pages) {
        await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            title: page.title,
            blocks: page.blocks,
          }),
        });
      }

      alert('프로젝트가 저장되었습니다');
      router.push(`/projects/${project.slug || projectData.data.slug}`);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-600 hover:text-black flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            뒤로
          </Link>

          {/* Mode Selector */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'profile' ? 'default' : 'outline'}
              onClick={() => setMode('profile')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              프로필 편집
            </Button>
            <Button
              variant={mode === 'project' ? 'default' : 'outline'}
              onClick={() => setMode('project')}
              className="flex items-center gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              새 프로젝트
            </Button>
          </div>

          <Button
            onClick={mode === 'profile' ? handleSaveProfile : handleSaveProject}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            저장
          </Button>
        </div>
      </header>

      {/* Full-Screen Editor */}
      <main className="flex-1 overflow-y-auto">
        {mode === 'profile' ? (
          /* Profile Editor */
          <div className="max-w-5xl mx-auto px-8 py-12 space-y-8">
            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">기본 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">이름</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">직책/역할</label>
                  <Input
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="프론트엔드 개발자"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">소개</label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="자기소개를 입력하세요"
                    className="min-h-[150px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">썸네일 비디오 URL</label>
                  <Input
                    value={profile.thumbnailVideo}
                    onChange={(e) => setProfile({ ...profile, thumbnailVideo: e.target.value })}
                    placeholder="YouTube, Vimeo URL"
                  />
                </div>
              </div>
            </Card>

            <Separator />

            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">연락처</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">이메일</label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">전화번호</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">웹사이트</label>
                  <Input
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn</label>
                  <Input
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub</label>
                  <Input
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </Card>

            <Separator />

            {/* Skills */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">기술 스택</h3>
              <div className="space-y-4">
                <Input
                  placeholder="기술명 입력 후 Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) {
                        setProfile({
                          ...profile,
                          skills: [...profile.skills, { name: value.trim() }],
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          skills: profile.skills.filter((_, i) => i !== index),
                        })
                      }
                    >
                      {skill.name} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <Separator />

            {/* Experience */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">경력</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      experience: [
                        ...profile.experience,
                        { title: '', company: '', period: '', description: '' },
                      ],
                    })
                  }
                >
                  + 추가
                </Button>
              </div>
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <Input
                        placeholder="직책"
                        value={exp.title}
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[index].title = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                      />
                      <Input
                        placeholder="회사/단체"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[index].company = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                      />
                      <Input
                        placeholder="기간"
                        value={exp.period}
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[index].period = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                      />
                    </div>
                    <Textarea
                      placeholder="업무 내용"
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[index].description = e.target.value;
                        setProfile({ ...profile, experience: newExp });
                      }}
                      className="mb-2"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          experience: profile.experience.filter((_, i) => i !== index),
                        })
                      }
                    >
                      삭제
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            <Separator />

            {/* Education */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">학력</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      education: [...profile.education, { degree: '', school: '', period: '' }],
                    })
                  }
                >
                  + 추가
                </Button>
              </div>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                      <Input
                        placeholder="학위"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].degree = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                      />
                      <Input
                        placeholder="학교명"
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].school = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                      />
                      <Input
                        placeholder="기간"
                        value={edu.period}
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].period = e.target.value;
                          setProfile({ ...profile, education: newEdu });
                        }}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          education: profile.education.filter((_, i) => i !== index),
                        })
                      }
                    >
                      삭제
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          /* Project Editor */
          <div className="w-full">
            {/* Project Metadata */}
            <div className="bg-white border-b sticky top-0 z-40">
              <div className="max-w-5xl mx-auto px-8 py-6 space-y-4">
                <Input
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  placeholder="프로젝트 제목"
                  className="text-3xl font-bold border-none px-0"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    value={project.category}
                    onValueChange={(value: any) => setProject({ ...project, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">작품</SelectItem>
                      <SelectItem value="activity">대외활동</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={project.icon}
                    onChange={(e) => setProject({ ...project, icon: e.target.value })}
                    placeholder="아이콘 (이모지)"
                  />
                  <Input
                    value={project.thumbnailPath}
                    onChange={(e) => setProject({ ...project, thumbnailPath: e.target.value })}
                    placeholder="썸네일 비디오 URL"
                  />
                </div>
                <Textarea
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  placeholder="프로젝트 설명"
                  className="resize-none"
                  rows={2}
                />
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="태그 입력 후 Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value;
                        if (value.trim()) {
                          setProject({
                            ...project,
                            tags: [...project.tags, value.trim()],
                          });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="flex-1"
                  />
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() =>
                          setProject({
                            ...project,
                            tags: project.tags.filter((_, i) => i !== index),
                          })
                        }
                      >
                        {tag} ✕
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pages Editor */}
            <div className="max-w-5xl mx-auto px-8 py-12">
              <Tabs
                value={currentPageIndex.toString()}
                onValueChange={(value) => setCurrentPageIndex(parseInt(value))}
              >
                <div className="flex items-center justify-between mb-6">
                  <TabsList>
                    {pages.map((page, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        <FileText className="h-4 w-4 mr-2" />
                        {page.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPages([...pages, { title: `페이지 ${pages.length + 1}`, blocks: [] }])
                    }
                  >
                    + 페이지 추가
                  </Button>
                </div>

                {pages.map((page, index) => (
                  <TabsContent key={index} value={index.toString()}>
                    <div className="mb-6">
                      <Input
                        value={page.title}
                        onChange={(e) => {
                          const newPages = [...pages];
                          newPages[index].title = e.target.value;
                          setPages(newPages);
                        }}
                        placeholder="페이지 제목"
                        className="text-2xl font-bold border-none px-0 mb-4"
                      />
                    </div>
                    <BlockEditor
                      blocks={page.blocks}
                      onChange={(blocks) => {
                        const newPages = [...pages];
                        newPages[index].blocks = blocks;
                        setPages(newPages);
                      }}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
