import { QuartzComponent, QuartzComponentConstructor } from "./types"

interface Options {
  title: string
}

const defaultOptions: Options = {
  title: "메뉴",
}

export default ((opts?: Partial<Options>) => {
  const options = { ...defaultOptions, ...opts }
  
  const HamburgerMenu: QuartzComponent = () => {
    return (
      <>
        <div class="hamburger-menu-container">
          <button 
            class="hamburger-menu-toggle" 
            id="hamburger-toggle"
            aria-label="메뉴 열기/닫기"
            aria-expanded="false"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
          
          <div class="hamburger-menu-overlay" id="hamburger-overlay">
            <nav class="hamburger-menu-nav" id="hamburger-nav">
              <div class="hamburger-menu-header">
                <h2>{options.title}</h2>
                <button 
                  class="hamburger-menu-close" 
                  id="hamburger-close"
                  aria-label="메뉴 닫기"
                >
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                </button>
              </div>
              
              <div class="hamburger-menu-content">
                <ul class="hamburger-menu-list">
                  <li><a href="/" class="hamburger-menu-item">홈</a></li>
                  <li><a href="/1.-회원.html" class="hamburger-menu-item">회원</a></li>
                  <li><a href="/2.-과정.html" class="hamburger-menu-item">과정</a></li>
                  <li><a href="/3.-콘텐츠.html" class="hamburger-menu-item">콘텐츠</a></li>
                  <li><a href="/4.-사이트.html" class="hamburger-menu-item">사이트</a></li>
                  <li><a href="/5.-서비스.html" class="hamburger-menu-item">서비스</a></li>
                  <li><a href="/6.-시설.html" class="hamburger-menu-item">시설</a></li>
                  <li><a href="/7.-주문결제.html" class="hamburger-menu-item">주문결제</a></li>
                  <li><a href="/8.-통계.html" class="hamburger-menu-item">통계</a></li>
                  <li><a href="/9.-설정.html" class="hamburger-menu-item">설정</a></li>
                  <li><a href="/10.시스템.html" class="hamburger-menu-item">시스템</a></li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Inline script for hamburger menu functionality */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              'use strict';
              
              function initHamburgerMenu() {
                const toggle = document.getElementById('hamburger-toggle');
                const overlay = document.getElementById('hamburger-overlay');
                const nav = document.getElementById('hamburger-nav');
                const close = document.getElementById('hamburger-close');
                const menuItems = document.querySelectorAll('.hamburger-menu-item');
                
                if (!toggle || !overlay || !nav) {
                  setTimeout(initHamburgerMenu, 100);
                  return;
                }
                
                const currentPath = window.location.pathname;
                
                // 현재 페이지 메뉴 아이템 활성화
                menuItems.forEach(item => {
                  const href = item.getAttribute('href');
                  if (!href) return;
                  
                  // 홈페이지 체크
                  if (href === '/' && (currentPath === '/' || currentPath === '/index.html')) {
                    item.classList.add('active');
                  }
                  // 다른 페이지들 체크
                  else if (href === currentPath || href === currentPath.replace('.html', '') || href + '.html' === currentPath) {
                    item.classList.add('active');
                  }
                });
                
                function openMenu() {
                  toggle.classList.add('active');
                  overlay.classList.add('active');
                  toggle.setAttribute('aria-expanded', 'true');
                  document.body.style.overflow = 'hidden';
                  
                  const focusableElements = nav.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
                  if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                  }
                }
                
                function closeMenu() {
                  toggle.classList.remove('active');
                  overlay.classList.remove('active');
                  toggle.setAttribute('aria-expanded', 'false');
                  document.body.style.overflow = '';
                  toggle.focus();
                }
                
                toggle.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (toggle.classList.contains('active')) {
                    closeMenu();
                  } else {
                    openMenu();
                  }
                });
                
                if (close) {
                  close.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMenu();
                  });
                }
                
                overlay.addEventListener('click', function(e) {
                  if (e.target === overlay) {
                    closeMenu();
                  }
                });
                
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    closeMenu();
                  }
                });
                
                menuItems.forEach(item => {
                  item.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (!href) return;
                    
                    // 같은 페이지가 아닌 경우에만 이동
                    if (href !== currentPath && href !== currentPath.replace('.html', '') && href + '.html' !== currentPath) {
                      // 메뉴 닫기
                      closeMenu();
                      
                      // 페이지 이동 (SPA 네비게이션이 있으면 그것을 사용, 없으면 일반 링크 동작)
                      setTimeout(() => {
                        window.location.href = href;
                      }, 200);
                    } else {
                      // 같은 페이지인 경우 메뉴만 닫기
                      closeMenu();
                    }
                  });
                });
                
                window.addEventListener('resize', function() {
                  if (window.innerWidth > 768 && overlay.classList.contains('active')) {
                    closeMenu();
                  }
                });
                
                let startX = 0;
                let startY = 0;
                
                nav.addEventListener('touchstart', function(e) {
                  startX = e.touches[0].clientX;
                  startY = e.touches[0].clientY;
                });
                
                nav.addEventListener('touchmove', function(e) {
                  if (!overlay.classList.contains('active')) return;
                  
                  const currentX = e.touches[0].clientX;
                  const currentY = e.touches[0].clientY;
                  const diffX = startX - currentX;
                  const diffY = startY - currentY;
                  
                  if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                    closeMenu();
                  }
                });
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initHamburgerMenu);
              } else {
                initHamburgerMenu();
              }
            })();
          `
        }} />
      </>
    )
  }

  return HamburgerMenu
}) satisfies QuartzComponentConstructor

