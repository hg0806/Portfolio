# Portfolio 프로젝트

Next.js 15 + Supabase 기반의 Notion 스타일 포트폴리오 플랫폼

## 기술 스택

- **Frontend**: Next.js 15.5, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (권장)

## 주요 기능

### 1. 프로필 관리
- 이력서 스타일 프로필 (기본정보, 경력, 학력, 기술스택)
- 썸네일 비디오 지원
- 연락처 및 소셜 링크
- 드래그 앤 드롭 레이아웃 편집

### 2. 프로젝트 관리
- 카테고리별 분류 (작품/대외활동/기타)
- 프로젝트별 다중 페이지 지원
- Notion 스타일 계층 구조

### 3. 블록 에디터
- 10가지 블록 타입 (텍스트, 제목, 이미지, 비디오, 임베드, 링크, 마크다운, 도형, 구분선, Notion)
- 폰트 설정 (11가지 폰트, 10가지 크기)
- 텍스트 스타일 (굵게, 기울임, 밑줄)
- 정렬 (왼쪽, 가운데, 오른쪽)
- 색상 설정 (배경색, 텍스트 색상)
- 그리드 레이아웃 (1-4열)
- 도형 타입 (원, 사각형, 삼각형, 화살표)
- 마크다운 실시간 미리보기
- Notion 페이지 임베딩

## 🚀 설치 및 실행 가이드

### 사전 요구사항

시작하기 전에 다음 항목들이 설치되어 있는지 확인하세요:

- **Node.js** 18.x 이상 ([다운로드](https://nodejs.org/))
- **npm** 또는 **yarn** (Node.js 설치 시 자동으로 포함)
- **Git** ([다운로드](https://git-scm.com/))

### 1단계: 프로젝트 다운로드

```bash
# Git으로 클론하기
git clone https://github.com/hg0806/Portfolio.git
cd Portfolio

# 또는 ZIP 파일 다운로드 후 압축 해제
```

### 2단계: 의존성 설치

프로젝트 폴더에서 다음 명령어를 실행하세요:

```bash
npm install
```

⏱️ 첫 설치는 2-3분 정도 걸릴 수 있습니다.

### 3단계: Supabase 프로젝트 생성

#### 3-1. Supabase 계정 만들기

1. [Supabase](https://app.supabase.com) 접속
2. "Start your project" 클릭하여 회원가입/로그인
3. "New Project" 버튼 클릭

#### 3-2. 프로젝트 설정

1. **Name**: 원하는 프로젝트 이름 입력 (예: `my-portfolio`)
2. **Database Password**: 안전한 비밀번호 입력 및 저장 (나중에 필요할 수 있음)
3. **Region**: `Northeast Asia (Seoul)` 선택 (한국 기준)
4. **Pricing Plan**: `Free` 선택
5. "Create new project" 클릭

⏱️ 프로젝트 생성은 약 2분 정도 걸립니다.

### 4단계: 데이터베이스 설정

#### 4-1. SQL 스키마 실행

1. 왼쪽 메뉴에서 **🔧 SQL Editor** 클릭
2. "+ New query" 버튼 클릭
3. 프로젝트의 `supabase-schema.sql` 파일 내용을 복사
4. SQL Editor에 붙여넣기
5. 오른쪽 하단 **"Run"** 버튼 클릭 (또는 Ctrl/Cmd + Enter)

✅ 성공 메시지가 나타나면 완료입니다!

#### 4-2. 환경 변수 가져오기

1. 왼쪽 메뉴 하단 **⚙️ Project Settings** 클릭
2. **API** 탭 선택
3. 다음 3가지 값을 복사해두세요:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (긴 문자열)
   - **service_role** 키 (긴 문자열) - ⚠️ 비밀로 유지!

### 5단계: 환경 변수 설정

프로젝트 루트 폴더에 `.env.local` 파일을 생성하세요:

```bash
# 맥/리눅스
touch .env.local

# 윈도우 (PowerShell)
New-Item .env.local

# 또는 텍스트 에디터로 직접 생성
```

`.env.local` 파일을 열어 다음 내용을 입력하세요 (4-2단계에서 복사한 값 사용):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **중요**: 실제 값으로 교체하고, 따옴표는 넣지 마세요!

### 6단계: 관리자 계정 생성

#### 6-1. Supabase에서 사용자 추가

1. Supabase 대시보드에서 **👤 Authentication** 메뉴 클릭
2. **Users** 탭 선택
3. **"Add user"** → **"Create new user"** 클릭
4. 이메일과 비밀번호 입력
5. **"Create user"** 클릭

✅ 이 계정으로 포트폴리오에 로그인할 수 있습니다!

### 7단계: 개발 서버 실행

```bash
npm run dev
```

🎉 브라우저에서 http://localhost:3000 을 열어보세요!

### 8단계: 첫 로그인

1. 메인 페이지 오른쪽 상단 **"로그인"** 버튼 클릭
2. 6-1단계에서 만든 이메일/비밀번호 입력
3. 로그인 성공 시 **"편집 모드"**, **"새 프로젝트"** 버튼이 보입니다

## 📝 사용 방법

### 프로필 편집하기

1. 로그인 후 **"새 프로젝트"** 버튼 클릭
2. 상단 탭에서 **"프로필"** 선택
3. 기본 정보, 경력, 학력, 기술스택 입력
4. **"저장"** 클릭

### 레이아웃 편집하기

1. 로그인 후 메인 페이지에서 **"편집 모드"** 클릭
2. 각 섹션 위의 드래그 핸들(⋮⋮)을 잡고 원하는 위치로 이동
3. **"저장"** 클릭

### 프로젝트 추가하기

1. **"새 프로젝트"** 버튼 클릭
2. **"프로젝트"** 탭에서 정보 입력:
   - 제목, 설명
   - 카테고리 (작품/대외활동/기타)
   - 썸네일, 아이콘
   - 태그
3. 페이지 추가하여 상세 내용 작성 (블록 에디터 사용)
4. **"저장"** 클릭

## 📊 데이터 모델

### Profile (profiles 테이블)
사용자 프로필 및 이력서 정보
- 기본 정보: name, title, bio, email, phone, location
- 소셜: website, github, linkedin, twitter
- 썸네일: thumbnail_video
- JSONB: skills, experience, education, layout

### Project (projects 테이블)
프로젝트 (작품/대외활동)
- 카테고리: work, activity, other
- slug (URL용 고유 식별자)
- 썸네일: thumbnail_path, cover_image, icon
- 태그: tags (배열)
- 메인 표시: featured

### Page (pages 테이블)
프로젝트 내부 페이지
- 계층 구조: parent_id (Notion 스타일)
- 블록 기반 콘텐츠: blocks (JSONB)
- 순서: order

## 🗺️ 주요 라우트

- `/` - 메인 포트폴리오 (공개)
- `/login` - 로그인 페이지
- `/new` - 프로필/프로젝트 편집 (로그인 필요)
- `/projects/[slug]` - 프로젝트 상세 페이지 (공개)
- `/api/profile` - 프로필 CRUD API
- `/api/projects` - 프로젝트 CRUD API
- `/api/pages/[id]` - 페이지 CRUD API
- `/api/auth/session` - 세션 확인 API
- `/api/auth/logout` - 로그아웃 API

## 🔧 문제 해결

### 포트 충돌 에러

```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법**: 다른 프로그램이 3000 포트를 사용 중입니다.

```bash
# 맥/리눅스: 3000 포트 사용 프로세스 종료
lsof -ti:3000 | xargs kill -9

# 윈도우: 3000 포트 사용 프로세스 종료
netstat -ano | findstr :3000
taskkill /PID <PID번호> /F
```

### Supabase 연결 실패

**증상**: 로그인이 안 되거나 데이터가 로드되지 않음

**체크리스트**:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 값에 따옴표가 없는지 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인
4. `supabase-schema.sql`을 실행했는지 확인

### 빌드 에러

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 삭제 후 재빌드
rm -rf .next
npm run build
```

## 🚀 배포하기

### Vercel로 배포 (권장)

1. [Vercel](https://vercel.com) 회원가입/로그인
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 연결 및 선택
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. "Deploy" 클릭

⏱️ 첫 배포는 2-3분 정도 걸립니다.

### 배포 후 확인사항

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**에 배포된 주소 입력 (예: `https://your-site.vercel.app`)
3. **Redirect URLs**에도 동일 주소 추가

## 📚 추가 정보

### 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행 (빌드 후)
npm start

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

### 프로젝트 구조

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── login/             # 로그인 페이지
│   │   ├── new/               # 프로필/프로젝트 편집
│   │   ├── projects/[slug]/   # 프로젝트 상세
│   │   └── api/               # API Routes
│   ├── components/            # React 컴포넌트
│   │   ├── BlockEditor.tsx   # 블록 에디터
│   │   └── ui/               # shadcn/ui 컴포넌트
│   └── lib/                  # 유틸리티
│       └── supabase/         # Supabase 클라이언트
├── supabase-schema.sql       # 데이터베이스 스키마
└── package.json              # 의존성 관리
```

### 주요 의존성

- `next` 15.5.9 - React 프레임워크
- `react` 19.0.0 - UI 라이브러리
- `@supabase/supabase-js` - Supabase 클라이언트
- `@dnd-kit/*` - 드래그 앤 드롭
- `tailwindcss` - CSS 프레임워크
- `typescript` - 타입 안전성

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하면 [Issues](../../issues)에 등록해주세요.

## 라이센스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.
