import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  const isHomePage = fileData.slug === "index"

  if (title) {
    return (
      <div class="article-title-wrapper">
        <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
        {!isHomePage && (
          <button class="back-button" onclick="history.back()">
            <span class="arrow">←</span> 뒤로가기
          </button>
        )}
      </div>
    )
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0 0 0;
  position: relative;
}

.article-title {
  text-align: center;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

/* 뒤로가기 버튼 스타일 */
.back-button {
  position: absolute;
  left: 0;
  bottom: -1.8rem; /* 버튼을 약간 아래로 이동 */
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--neo-bg, #f9f9fb);
  border: 1px solid var(--gray, #ccc);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.9rem;
  color: var(--x-text, #333);
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.back-button:hover {
  background: var(--x-accent, #f0f2f5);
  border-color: var(--x-accent, #bbb);
  color: var(--x-main, #007bff);
  transform: translateX(-2px);
}

.back-button:active {
  transform: translateX(0);
  box-shadow: none;
}

.back-button .arrow {
  font-size: 1.1rem;
  line-height: 1;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
