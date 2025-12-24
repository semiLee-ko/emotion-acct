**📝 기획서: [감정 영수증 (Mood Receipt)]
1. 프로젝트 개요**
• **컨셉:** "무엇을 샀는가(What)"보다 **"왜 샀는가(Why/Emotion)"**를 기록하는 신개념 가계부.
• **핵심 가치:** 2026 트렌드 '필코노미(Feel-conomy)' 반영. 소비를 통해 얻은 감정을 시각화하여 심리적 만족감(또는 경각심) 부여.
• **플랫폼:** **App in Toss** (WebView 기반 웹 애플리케이션)
• **타겟:** 토스를 사용하는 2030 세대 (간편함과 직관적인 UI 선호)
**2. 시스템 아키텍처 (Tech Stack)**

| **구분** | **기술 스택** | **비고** |
| --- | --- | --- |
| **Front-end** | React.js (또는 Vue) | 웹뷰 내 SPA(Single Page App)로 구동. 컴포넌트 관리 용이. |
| **Auth** | **Toss Login** | 앱인토스 SDK (`TossApp.login()`) 활용. 반환된 `userId`를 식별자로 사용. |
| **Database** | **Firebase Firestore** | NoSQL. 토스 `userId`를 Document ID로 매핑하여 유저 데이터 관리. |
| **Image Gen** | `html2canvas` | 클라이언트 사이드 렌더링. 별도 서버 없이 공유 이미지 생성. |
| **Hosting** | Firebase Hosting | (또는 Vercel) SSL 적용 및 배포 용이. |

**3. 데이터베이스 구조 (Firestore Schema)**
가장 효율적인 비용과 속도를 위해 **Sub-collection** 구조를 추천합니다.
**📂 Collection: `users`**
• **Document ID:** `{toss_userId}` (토스에서 받은 고유 ID)
• **Fields:**
    ◦ `joinedAt`: timestamp (가입일)
    ◦ `nickname`: string (필요 시)
**📂 Sub-Collection: `receipts` (유저 문서 하위 컬렉션)**
• **Document ID:** Auto-generated ID
• **Fields:**
    ◦ `amount`: number (금액, 예: 5000)
    ◦ `emotion`: string (감정 코드, 예: 'STRESS', 'JOY', 'FLEX')
    ◦ `note`: string (한줄 메모, 예: "떡볶이 수혈")
    ◦ `date`: timestamp (소비 날짜)
    ◦ `createdAt`: timestamp (기록 생성일)
**4. 핵심 기능 명세 (Feature Spec)
① 로그인 (Intro)**
• **로직:**
    1. 앱 실행 시 `TossApp.getParams()` 또는 SDK로 유저 정보 확인.
    2. Firebase `users` 컬렉션에 해당 `userId`가 있는지 조회.
    3. 없으면 `setDoc`으로 유저 문서 생성(회원가입 처리), 있으면 패스.
• **UI:** 별도 로그인 화면 없음(토스 앱 내 자동 로그인 처리). 로딩 스피너만 노출.
**② 메인 화면 (Receipt Feed)**
• **UI 컨셉:** 마트 영수증이 길게 늘어진 형태.
• **기능:**
    ◦ Firestore에서 `receipts` 데이터를 `date` 내림차순으로 쿼리 (`limit(20)`).
    ◦ **Infinite Scroll:** 스크롤이 바닥에 닿으면 추가 로딩.
    ◦ **삭제 인터랙션:** 리스트 항목을 스와이프하거나 꾹 누르면 **"영수증 찢어지는 소리/모션"**과 함께 데이터 삭제 (`deleteDoc`).
**③ 입력 화면 (Modal / Bottom Sheet)**
• **UI:** 화면 하단 `+` 버튼을 누르면 올라오는 바텀시트.
• **입력 항목:**
    1. **금액:** 숫자 키패드.
    2. **감정 선택 (Radio Button):** 5가지 이모지 중 택 1.
        ▪ 🤯 시발비용 (Stress)
        ▪ 🥰 심쿵비용 (Love)
        ▪ 🚑 응급비용 (Emergency)
        ▪ 🧘 위로비용 (Comfort)
        ▪ ✨ 갓생비용 (Growth)
    3. **메모:** 최대 20자 제한 (영수증 품목명처럼 짧게).
• **저장:** 버튼 클릭 시 Firestore `addDoc` 실행 → 성공 시 메인 피드 리프레시.
**④ 통계 화면 (Analysis)**
• **UI:** 이번 달 총 지출액 + 도넛 차트.
• **기능:**
    ◦ 이번 달 1일~현재까지 데이터 쿼리.
    ◦ 감정별 금액 합산하여 비율 표시.
    ◦ **Copy:** "이번 달은 스트레스가 가장 비쌌네요." (가장 비중 높은 감정에 따른 멘트 출력)
**⑤ 공유하기 (Share)**
• **UI:** 특정 영수증 상세 클릭 시 '공유하기' 버튼 노출.
• **로직 (Client-side):**
    1. `id="share-area"`로 지정된 div(예쁜 영수증 디자인)에 데이터 바인딩.
    2. `html2canvas(document.querySelector("#share-area"))` 실행.
    3. Canvas를 Blob 데이터로 변환.
    4. `navigator.share({ files: [file] })` 호출하여 인스타/카톡 공유 창 띄움.
**5. UI/UX 디자인 가이드 (Solo Dev Tip)**
디자이너 없이 그럴듯하게 보이려면 **'폰트'**와 **'배경'**만 잘 쓰면 됩니다.
• **배경색:** `#F5F5F5` (약간 회색빛 도는 종이 질감 느낌)
• **영수증 영역:** `#FFFFFF` (순백색), `box-shadow` 살짝 줘서 떠있는 느낌.
• **폰트:** **영수증 전용 폰트** 사용 필수. (구글 폰트의 `Courier Prime`이나 `Space Mono` 추천, 한글은 고딕 계열 중 얇은 것 or 'D2Coding' 같은 코딩 폰트가 영수증 느낌 잘 남).
• **상단 끝처리:** 영수증 상단과 하단을 지그재그(톱니바퀴) 모양으로 CSS 처리 (`mask-image` 또는 `background-image` 패턴 활용).
**6. 개발 로드맵 (우선순위)**
1. **Day 1:** 리액트 프로젝트 생성 + Firebase 연동 + 토스 SDK 테스트.
2. **Day 2:** Firestore CRUD (입력, 리스트 불러오기, 삭제) 구현.
3. **Day 3:** UI 스타일링 (영수증 CSS 구현) + 통계 로직 작성.
4. **Day 4:** `html2canvas` 공유 기능 구현 + 최종 테스트 및 배포.