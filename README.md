# DBCM Lab

홍익대학교 Data-based Construction Management Lab의 웹사이트입니다. 블로그, 논문, 멤버 프로필과 연구실 소개를 공개합니다. 승인된 멤버는 **Member portal**에서 콘텐츠를 편집할 수 있습니다.

## Vercel과 Supabase 연결

1. 기존 Supabase 프로젝트의 **SQL Editor → New query**에서 [DBCM 마이그레이션](supabase/migrations/20261123000000_dbcm_portal.sql) 전체를 한 번 실행합니다. 사이트는 섹션을 처음 게시하기 전까지 저장소에 포함된 초기 콘텐츠를 표시합니다.
   블로그 사진 첨부를 쓰려면 [사진 저장소 마이그레이션](supabase/migrations/20261123000100_dbcm_blog_images.sql)도 한 번 실행합니다.
   사진 자동 정리를 활성화하려면 이어서 [사진 정리 마이그레이션](supabase/migrations/20261123000200_dbcm_blog_image_cleanup.sql)을 한 번 실행한 뒤 앱을 배포합니다.
2. Vercel의 **dbcm → Settings → Environment Variables**에 두 값을 `Config`로 등록합니다. Supabase 프로젝트의 **Connect** 화면에서 복사할 수 있습니다.

   | 변수 | 값 |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable Key |

3. Vercel Production에서 사용하는 주소가 다르거나 Vercel 시스템 환경 변수를 사용하지 않는다면 `DBCM_ORIGIN`에 실제 사이트 주소를 지정합니다. 현재 운영 주소는 `https://dbcm-lab.vercel.app`입니다.
4. Supabase에 테스트 계정을 만들고 편집 권한을 등록한 뒤, Vercel Preview에서 로그인·게시·로그아웃을 확인합니다. Preview 환경 변수에는 검증용 Supabase 프로젝트나 브랜치의 값을 넣습니다.
5. 검증된 코드를 `main`에 반영합니다. 이후 코드 변경은 Vercel이 배포하고, 콘텐츠 변경은 편집기에서 게시하면 공개 페이지에 반영됩니다.

## 멤버 계정과 권한

운영자는 Supabase **Authentication → Users → Add user**에서 계정을 만들거나 기존 계정을 선택합니다. 사용자 UUID를 복사해 **SQL Editor**에서 편집 권한을 부여합니다.

```sql
insert into public.dbcm_editors (user_id)
values ('여기에-사용자-UUID')
on conflict do nothing;
```

편집 권한을 회수하려면 해당 UUID를 지정해 다음 명령을 실행합니다.

```sql
delete from public.dbcm_editors
where user_id = '여기에-사용자-UUID';
```

공개 멤버 프로필과 편집 계정은 별도로 관리됩니다. DBCM 전용 Supabase 프로젝트라면 Auth 설정에서 공개 가입을 끄세요. 여러 앱이 프로젝트를 공유한다면 기존 가입 설정을 유지하더라도 `dbcm_editors`에 등록된 계정만 DBCM을 수정할 수 있습니다.

### 이메일 초대와 비밀번호 재설정

DBCM 전용 프로젝트에서 초대 메일을 사용하려면 Supabase Auth의 **Site URL**을 운영 주소로 지정하고, **Email Templates**의 링크를 아래와 같이 설정합니다. 기존 Auth를 다른 앱과 공유하는 경우 해당 앱의 메일 설정을 확인한 뒤 변경하세요.

```html
<!-- Invite user -->
<a href="{{ .SiteURL }}/account/confirm/?token_hash={{ .TokenHash }}&amp;type=invite">Accept DBCM invitation</a>

<!-- Reset password -->
<a href="{{ .SiteURL }}/account/confirm/?token_hash={{ .TokenHash }}&amp;type=recovery">Reset DBCM password</a>
```

운영용 초대·재설정 메일에는 [커스텀 SMTP](https://supabase.com/docs/guides/auth/auth-smtp)를 설정합니다. 초대 계정에도 SQL로 위 편집 권한을 등록합니다.

## 로컬 실행

Node.js 22.19 이상이 필요합니다. 로컬에서 연동을 검증하려면 위 환경 변수 두 개를 `.env.local`에 넣습니다. 테스트 DB에도 DBCM 마이그레이션을 적용하고 테스트 계정의 편집 권한을 등록합니다.

```sh
npm install
npm start
```

환경 변수 없이 실행하면 공개 페이지에서 초기 콘텐츠를 확인할 수 있습니다. 편집기 로그인에는 Supabase 연결이 필요합니다.

## 편집

- **Blog**에서 글과 논문을 편집하거나 글을 추가·삭제합니다. 카테고리, 대표 이미지, 작성일, 작성자와 홈페이지 추천 여부를 설정할 수 있습니다.
- **Members**에서 교수, 연구원, 졸업생 프로필을 추가·수정·삭제합니다.
- **About Us**에서 제목, 부제, 소개 본문을 편집합니다.
- **Upload cover image**에서 대표 이미지를 올립니다. 본문의 원하는 위치에 커서를 두고 **Insert photos at cursor**에서 사진을 선택하면 그 위치에 삽입됩니다. **Attach photos**에서 고른 사진은 글 아래에 표시됩니다. 글 아래에 12장까지 첨부할 수 있으며 파일당 최대 6 MB입니다.
- 본문은 Markdown을 지원합니다. **Publish changes**를 누르면 해당 섹션이 공개됩니다. 게시된 글이나 사진을 제거하고 다시 게시하면, 다른 공개 콘텐츠에서도 사용되지 않는 사진 파일을 Supabase Storage에서 삭제합니다. 파일 삭제에 실패하면 다음에 변경 사항을 게시할 때 다시 시도합니다.

기존 사이트 템플릿은 Web Expe의 [Next.js Simple Blog Template](https://github.com/webexpe13/blog-template-using-nextjs-typescript-tailwindcss)을 기반으로 합니다. [MIT 라이선스](LICENSE)를 따릅니다.
