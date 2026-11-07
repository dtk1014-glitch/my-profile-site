// ===== 1. 주요 업무 데이터 =====
// 이 배열만 수정하면 카드가 자동으로 바뀝니다.
const projects = [
  {
    title: '매장 운영 관리',
    description: '일일 오픈·마감 점검과 매장 환경 관리를 담당합니다.',
    tags: ['매장 운영', '일일 점검'],
    thumb: 'bg-thumb',
  },
  {
    title: '매출·재고 관리',
    description: '매출 흐름을 분석하고 발주와 재고 점검을 체계적으로 진행합니다.',
    tags: ['매출 분석', '재고 관리'],
    thumb: 'bg-thumb',
  },
  {
    title: '팀 관리·교육',
    description: '직원 근무 일정을 조율하고 신규 직원 교육을 진행합니다.',
    tags: ['직원 교육', '근무 스케줄'],
    thumb: 'bg-thumb',
  },
];

// ===== 2. 공통 헬퍼 =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text; // textContent 사용으로 안전하게 출력
  return el;
}

// ===== 3. 업무 카드 렌더링 =====
const projectsGrid = $('#projects-grid');

function renderProjects() {
  if (!projectsGrid) return;
  projectsGrid.replaceChildren();

  projects.forEach((project, index) => {
    // 타임라인 항목: 점 + 카드
    const item = createEl('li', 'fade-in relative pl-10');
    const dot = createEl(
      'span',
      'absolute left-0 top-6 h-3.5 w-3.5 rounded-full bg-ink ring-4 ring-paper'
    );

    const card = createEl(
      'article',
      'flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card transition duration-300 hover:-translate-y-1 md:flex-row'
    );

    // 썸네일 (모노톤 블록 + 이니셜)
    const thumb = createEl(
      'div',
      `relative flex h-44 shrink-0 items-center justify-center ${project.thumb} text-6xl font-black text-white md:h-auto md:w-52`,
      project.title.charAt(0)
    );

    // 본문
    const body = createEl('div', 'flex flex-1 flex-col p-6 sm:p-8');
    const number = createEl(
      'p',
      'text-xs font-bold uppercase tracking-[0.25em] text-muted',
      `Project ${String(index + 1).padStart(2, '0')}`
    );
    const title = createEl('h3', 'mt-2 text-2xl font-black tracking-tight text-ink', project.title);
    const description = createEl(
      'p',
      'mt-3 flex-1 leading-relaxed text-muted',
      project.description
    );

    // 태그
    const tagList = createEl('ul', 'mt-5 flex flex-wrap gap-2');
    project.tags.forEach((tag) => {
      tagList.append(
        createEl(
          'li',
          'rounded-full bg-surface-alt px-3 py-1 text-xs font-bold text-ink',
          tag
        )
      );
    });

    body.append(number, title, description, tagList);
    card.append(thumb, body);
    item.append(dot, card);
    projectsGrid.append(item);
  });
}

// ===== 4. 스크롤 시 페이드인 =====
const fadeObserver =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              fadeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      )
    : null;

function observeFadeIns() {
  $$('.fade-in:not(.is-visible)').forEach((el) => {
    if (fadeObserver) fadeObserver.observe(el);
    else el.classList.add('is-visible');
  });
}

// ===== 5. 다크모드 토글 =====
const root = document.documentElement;
const themeToggle = $('#theme-toggle');

themeToggle.addEventListener('click', () => {
  const isDark = root.classList.toggle('dark');
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch (e) {
    // 저장이 막혀 있어도 토글 자체는 동작합니다
  }
});

// ===== 6. 모바일 메뉴 =====
const menuToggle = $('#menu-toggle');
const mobileMenu = $('#mobile-menu');

function setMobileMenu(open) {
  mobileMenu.classList.toggle('hidden', !open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
}

menuToggle.addEventListener('click', () => {
  setMobileMenu(mobileMenu.classList.contains('hidden'));
});

// 메뉴 항목을 누르면 자동으로 닫힘
$$('#mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenu(false));
});

// ===== 7. 현재 섹션 내비게이션 강조 =====
function highlightActiveNav() {
  if (!('IntersectionObserver' in window)) return;

  const navLinks = $$('a.nav-link');
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  $$('section[id]').forEach((section) => navObserver.observe(section));
}

// ===== 8. 초기화 =====
renderProjects();
observeFadeIns();
highlightActiveNav();
