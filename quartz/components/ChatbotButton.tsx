import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/chatbot.scss"

export default (() => {
  const ChatbotButton: QuartzComponent = () => {
    return (
      <>
        <div class="chatbot-container">
          <button
            class="chatbot-button"
            aria-label="챗봇 열기"
            title="챗봇과 대화하기"
            data-chatbot-toggle
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.99 3.05 16.28L2 22L7.72 20.95C9.01 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12S17.52 2 12 2ZM12 20C10.74 20 9.54 19.81 8.44 19.46L8 19.28L4.72 20.28L5.72 17L5.54 16.56C5.19 15.46 5 14.26 5 13C5 8.58 8.58 5 13 5S21 8.58 21 13 17.42 20 12 20Z"
                fill="currentColor"
              />
              <path
                d="M8 10H16V12H8V10ZM8 14H14V16H8V14Z"
                fill="currentColor"
              />
            </svg>
            <span>챗봇</span>
          </button>
        </div>
        
        {/* <div class="chatbot-overlay" data-chatbot-overlay></div> */} {/* 오버레이 제거 */}
        
        <div class="chatbot-popup" data-chatbot-popup>
          <div class="chatbot-popup-header">
            <h3>LX2 도움말 챗봇</h3>
            <div class="chatbot-header-buttons">
              <button 
                class="chatbot-reset"
                data-chatbot-reset
                aria-label="대화 초기화"
                title="대화 기록 초기화"
              >
                🔄
              </button>
              <button 
                class="chatbot-close"
                data-chatbot-close
                aria-label="챗봇 닫기"
              >
                ×
              </button>
            </div>
          </div>
          <div class="chatbot-popup-content">
            <div class="chatbot-messages">
              <div class="chatbot-message chatbot-bot-message">
                안녕하세요! LX2 매뉴얼 챗봇입니다. 무엇을 도와드릴까요?
              </div>
            </div>
            <div class="chatbot-input-area">
              <input
                type="text"
                placeholder="질문을 입력하세요..."
                class="chatbot-input"
                data-chatbot-input
              />
              <button class="chatbot-send" data-chatbot-send>전송</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  ChatbotButton.css = style

  ChatbotButton.afterDOMLoaded = `
    (function() {
      const toggleButton = document.querySelector('[data-chatbot-toggle]');
      const popup = document.querySelector('[data-chatbot-popup]');
      // const overlay = document.querySelector('[data-chatbot-overlay]'); // 오버레이 제거
      const closeButton = document.querySelector('[data-chatbot-close]');
      const resetButton = document.querySelector('[data-chatbot-reset]');
      const input = document.querySelector('[data-chatbot-input]');
      const sendButton = document.querySelector('[data-chatbot-send]');

      if (!toggleButton || !popup || !closeButton) return;

      const toggleChatbot = () => {
        const isActive = popup.classList.contains('active');
        if (isActive) {
          closeChatbot();
        } else {
          openChatbot();
        }
      };

      const openChatbot = () => {
        popup.classList.add('active');
        // overlay.classList.add('active'); // 오버레이 제거
        // document.body.style.overflow = 'hidden'; // 스크롤 방지 제거
      };

      const closeChatbot = () => {
        popup.classList.remove('active');
        // overlay.classList.remove('active'); // 오버레이 제거
        // document.body.style.overflow = ''; // 스크롤 복원 제거
      };

      const getSessionId = () => {
        let sessionId = localStorage.getItem('lx2-chatbot-session-id');
        if (!sessionId) {
          sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('lx2-chatbot-session-id', sessionId);
        }
        return sessionId;
      };

      const sendMessage = () => {
        const message = input.value.trim();
        if (!message) return;

        const messagesContainer = popup.querySelector('.chatbot-messages');
        if (messagesContainer) {
          const userMessage = document.createElement('div');
          userMessage.className = 'chatbot-message chatbot-user-message';
          userMessage.textContent = message;
          messagesContainer.appendChild(userMessage);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        input.value = '';

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'chatbot-message chatbot-bot-message chatbot-loading';
        loadingMessage.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        messagesContainer.appendChild(loadingMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        fetch('/openai/chatbot/ask2/json.do?q=' + encodeURIComponent(message), {
          method: 'GET',
          credentials: 'same-origin',
          headers: { 
            'Accept': 'text/plain; charset=UTF-8',
            'X-Chat-Session-Id': getSessionId()
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
          }
          return response.text();
        })
        .then(answer => {
          const loadingMsg = messagesContainer.querySelector('.chatbot-loading');
          if (loadingMsg) {
            loadingMsg.remove();
          }

          const botMessage = document.createElement('div');
          botMessage.className = 'chatbot-message chatbot-bot-message';
          
          // 마크다운을 HTML로 변환 (marked.js 사용)
          if (typeof marked !== 'undefined') {
            botMessage.innerHTML = marked.parse(answer);
          } else {
            // marked.js가 없으면 일반 텍스트로 표시
            botMessage.textContent = answer;
          }
          
          messagesContainer.appendChild(botMessage);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch(error => {
          console.error('챗봇 API 호출 오류:', error);
          
          const loadingMsg = messagesContainer.querySelector('.chatbot-loading');
          if (loadingMsg) {
            loadingMsg.remove();
          }

          const errorMessage = document.createElement('div');
          errorMessage.className = 'chatbot-message chatbot-bot-message';
          errorMessage.textContent = '죄송합니다. 현재 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
          messagesContainer.appendChild(errorMessage);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
      };

      const resetConversation = () => {
        if (confirm('대화 기록을 초기화하시겠습니까?')) {
          const messagesContainer = popup.querySelector('.chatbot-messages');
          if (messagesContainer) {
            messagesContainer.innerHTML = '<div class="chatbot-message chatbot-bot-message">안녕하세요! LX2 매뉴얼 챗봇입니다. 무엇을 도와드릴까요?</div>';
          }

          fetch('/memory/json.do', {
            method: 'POST',
            headers: {
              'X-Chat-Session-Id': getSessionId()
            }
          }).catch(error => {
            console.error('세션 초기화 오류:', error);
          });

          const newSessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('lx2-chatbot-session-id', newSessionId);
        }
      };

      toggleButton.addEventListener('click', toggleChatbot);
      closeButton.addEventListener('click', closeChatbot);
      resetButton.addEventListener('click', resetConversation);
      sendButton.addEventListener('click', sendMessage);
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });

      // overlay.addEventListener('click', closeChatbot); // 오버레이 클릭 제거
      
      // document.addEventListener('click', function(e) {
      //   if (!popup.contains(e.target) && !toggleButton.contains(e.target)) {
      //     closeChatbot();
      //   }
      // }); // 외부 클릭으로 닫기 제거
    })();
  `

  return ChatbotButton
}) satisfies QuartzComponentConstructor