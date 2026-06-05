# UTSEUS UI Comments Modification Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 根据 `docs/specs/2026-06-05-ui-optimization-recommendations.md` 中以 `#####` 标注的批注，制定桌面端优先的 UI 修改路线，先提供可选择的字体/配色/布局方案，再落地到页面组件。

**Architecture:** 本轮不优先生成最终图片和图标资产，而是先调整页面结构、字体、颜色方案、卡片布局和筛选按钮状态。需要选择的内容通过临时设计展示区实现，用户确认后再删除展示区并把选定方案固化到 `src/styles/global.css` 与对应组件中。

**Tech Stack:** Astro 5, MDX content collections, vanilla CSS/Tailwind utility classes, static assets under `public/images`.

---

## 1. 批注结论

本次批注给出的方向可以归纳为：

- **字体:** 用户不熟悉字体名称，需要在首页展示不同字体效果，选择后删除演示。
- **颜色:** 不应把红黄蓝固定得太死，需要提供更美观的配色方案、色卡、字体和页面颜色预览。
- **Hero:** 可以尝试直接从 UTSEUS logo 中提取文字效果，用白色版本放入 Hero；Hero 背景要体现中法合作、上海大学与 UTC/UTSEUS 融合。
- **按钮:** 暂时不完整设计全站按钮系统；先确定按钮位置、功能链接和筛选按钮样式。Hero 保留一个按钮可以接受，但形式需要更有设计感。
- **卡片:** 优先重新设计关键数字、Mobilité、ComplexCity、Témoignages、Contact 等卡片结构。项目卡片图片背景暂时保留，先做分类菜单和结构。
- **图片/图标:** 暂不作为主要任务；卡片中预留图片/图标位置，后续再统一生成。
- **UTC 工具栏:** 必须保留，并尽量符合 UTC 旧网站统一格式。
- **侧边目录:** 基本可保留，只做轻量改进，可考虑向左隐藏或缩放，让主内容更居中。
- **优先级:** 先改字体、颜色、排版布局和卡片结构。

## 2. 文件影响范围

### 2.1 新增文件

- `docs/plans/2026-06-05-ui-comments-modification-plan.md`  
  本计划文档。

- `src/components/DesignChoicePanel.astro`  
  临时设计展示组件，用于展示 Hero 字体、章节标题字体、段落字距/行距、配色方案和色卡。用户选择完成后删除。

- `src/data/ui-palettes.json`  
  存放 3-4 套配色候选，包含背景、标题、强调色、辅助色、卡片背景和按钮颜色。

### 2.2 修改文件

- `src/pages/fr/index.astro`, `src/pages/en/index.astro`, `src/pages/zh/index.astro`  
  临时插入 `DesignChoicePanel`；最终选择后移除。

- `src/components/Hero.astro`  
  调整 Hero 标题、单一 CTA 位置与形式；预留替换 Hero 背景的结构。

- `src/components/Header.astro`  
  保留 UTC 工具栏，确认 UTSEUS logo 区域尺寸和对齐。

- `src/components/KeyFiguresGrid.astro`  
  从普通数字列表改为更有设计感的数据展示卡片。

- `src/components/ProgramFilter.astro`  
  重新设计标签筛选按钮与选中态。

- `src/components/ProgramCard.astro`  
  重做 Mobilité 卡片格式，减少空白，增加方向感和可预留图片/图标区域。

- `src/components/ProjectModal.astro`, `src/components/ProjectCard.astro`  
  项目图片背景暂时保留；增加或规划项目分类菜单入口与统一卡片信息层级。

- `src/components/TestimonialCarousel.astro`  
  重做学生反馈卡片形式，先不确定小标签细节，只提升卡片设计感。

- `src/components/ContactCard.astro`, `src/content/sections/{fr,en,zh}/05-contact.mdx`  
  联系信息改为联系人卡片结构，补充姓名、角色、邮箱展示位。

- `src/components/SidebarTOC.astro`, `src/styles/global.css`  
  轻量调整侧边目录与主内容居中关系。

- `src/styles/global.css`  
  管理字体 token、配色 token、卡片样式、筛选按钮样式、Hero wordmark、设计演示区样式。

## 3. 实施阶段

### Task 1: 整理批注并冻结本轮范围

**Files:**
- Read: `docs/specs/2026-06-05-ui-optimization-recommendations.md`
- Modify: `docs/plans/2026-06-05-ui-comments-modification-plan.md`

- [ ] 确认本轮范围只覆盖桌面端优先 UI。
- [ ] 明确图片和图标资产暂不最终生成，只预留位置。
- [ ] 明确 UTC 工具栏保留，不再按旧建议移除 Ukraine flag 或 UTC utility row。
- [ ] 明确 Hero 只保留一个主按钮，但按钮样式和位置需要重做。

### Task 2: 创建首页临时字体演示区

**Files:**
- Create: `src/components/DesignChoicePanel.astro`
- Modify: `src/pages/fr/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/zh/index.astro`
- Modify: `src/styles/global.css`

- [ ] 在 `DesignChoicePanel.astro` 中添加 Hero 字体比较区，展示同一句 `UTSEUS`。
- [ ] 候选包括：
  - logo-inspired rounded tech style
  - `Eurostile, Bank Gothic, Arial Rounded MT Bold`
  - `Inter Tight`
  - `IBM Plex Sans`
  - 当前标题风格作为对照
- [ ] 添加章节标题字体比较区，展示同一句 section title，例如 `Un partenariat universitaire pionnier`。
- [ ] 添加正文对比区，只展示一段，不改全站正文。
- [ ] 在三语首页的 Hero 后或 À propos 前临时插入演示区。
- [ ] 在演示区顶部明确标注“临时字体选择区，确认后删除”。
- [ ] 验证 `/fr/`, `/en/`, `/zh/` 均能显示演示区。

### Task 3: 创建配色与页面色卡演示区

**Files:**
- Create: `src/data/ui-palettes.json`
- Modify: `src/components/DesignChoicePanel.astro`
- Modify: `src/styles/global.css`

- [ ] 定义至少 4 套配色方案：
  - `institutional-tricolor`: 保留红黄蓝，但降低饱和度。
  - `sino-french-gradient`: 红蓝渐变为主，黄色只作点缀。
  - `campus-light`: 白色/浅灰背景，红色和蓝色做重点，整体更清爽。
  - `research-dark-blue`: 深蓝学术感背景，红色用于行动点。
- [ ] 每套方案展示：
  - 页面背景色
  - 标题色
  - 正文字色
  - 主按钮色
  - 卡片背景
  - 辅助强调色
- [ ] 为每套方案做小型页面预览卡：标题、段落、按钮、关键数字卡片。
- [ ] 用简单文字重新解释“对比与可读性”：背景和文字要能清楚区分，按钮要在不同背景上都能看清。

### Task 4: Hero 品牌标题与单按钮方案

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/styles/global.css`
- Use asset: `public/images/brand/utseus-logo.png`

- [ ] 保留当前 UTSEUS logo-inspired wordmark 作为候选之一。
- [ ] 尝试制作“从 logo 文字风格出发的白色 Hero wordmark”：不直接依赖复杂抠图，先用 CSS 模拟白色/浅灰描边效果。
- [ ] 保留 `h1` 的可访问名称为 `UTSEUS`。
- [ ] Hero 只保留一个按钮。
- [ ] 重设按钮样式：可以采用红色主按钮 + 细黄色侧边或角标，避免普通红色矩形过单调。
- [ ] 按钮功能暂定继续跳转 `#about`，待用户确认是否改为 brochure、mobility 或 contact。

### Task 5: Hero 背景方案设计准备

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/styles/global.css`
- Optional later: `public/images/generated/hero-*.png`

- [ ] 暂不最终生成图片。
- [ ] 在计划和设计区中列出 3 个 Hero 背景方向供选择：
  - 上海大学建筑 + UTC 建筑的融合背景。
  - 上海地标 + 法国/Compiègne 地标的中法城市融合。
  - UTSEUS logo + UTC/SHU 标志元素 + 校园建筑的半抽象工程背景。
- [ ] 在 Hero 组件中保持背景图路径集中，方便后续一次性替换。
- [ ] 设计背景时避免只表现上海夜景，必须体现中法合作和两校融合。

### Task 6: 关键数字卡片重设计

**Files:**
- Modify: `src/components/KeyFiguresGrid.astro`
- Modify: `src/data/key-figures.json` only if label text needs minor refinement
- Modify: `src/styles/global.css`

- [ ] 将当前四个并列灰色数字块改为四张更有表现力的数据卡。
- [ ] `2005` 卡片使用时间箭头/时间轴式布局，表达历史延续。
- [ ] `1200+` 学生卡片先不使用真实比例饼图，除非后续能从官方来源确认中法学生比例；本轮可用双向流动图或中法双圆关系图替代。
- [ ] `4` 专业卡片展示四个专业名称的分支结构。
- [ ] `14` 项目卡片使用科研风格网格/节点样式。
- [ ] 卡片预留统一 icon slot，但本轮可以用 CSS 图形或文字标识代替最终图标。

### Task 7: Mobilité 区域卡片与普通文本区重排

**Files:**
- Modify: `src/content/sections/{fr,en,zh}/02-mobility.mdx`
- Modify: `src/components/ProgramFilter.astro`
- Modify: `src/components/ProgramCard.astro`
- Modify: `src/styles/global.css`

- [ ] 减少 Mobilité section 中大段普通文本的视觉重量。
- [ ] 将中法流动关系表现为两条方向路径：
  - Chinese students -> France/UT network
  - French/European students -> Shanghai/SHU
- [ ] ProgramCard 增加方向、周期、对象、收获四个信息槽。
- [ ] 卡片中预留背景图片或图标位置，但本轮不最终生成资产。
- [ ] 空白过多的卡片区域用背景纹理、浅色分区或小型路径线条补足。

### Task 8: 筛选标签按钮重设计

**Files:**
- Modify: `src/components/ProgramFilter.astro`
- Modify: `src/styles/global.css`

- [ ] 将当前普通边框按钮改为 segmented control 或胶囊式筛选条。
- [ ] `aria-selected="true"` 时视觉突出：
  - 背景变为选中配色
  - 字重提升
  - 增加小圆点、下划线或左侧色条
- [ ] 未选中项保持轻量。
- [ ] hover 和 focus-visible 状态清楚可见。
- [ ] 同样的筛选按钮样式后续可复用到 Projets 分类菜单。

### Task 9: ComplexCity 研究方向展示重设计

**Files:**
- Modify: `src/content/sections/{fr,en,zh}/03-complexcity.mdx`
- Create or Modify: `src/components/ComplexCityDiagram.astro`
- Modify: `src/pages/{fr,en,zh}/index.astro`
- Modify: `src/styles/global.css`

- [ ] 新增 `ComplexCityDiagram.astro`。
- [ ] 用重叠圆圈或 Venn-like circles 展示不同研究方向/学术风格，而不是完全依赖段落。
- [ ] 每个圆圈包含短标题和 1 行说明。
- [ ] 颜色使用蓝色体系为主，可加入红色或黄色小面积强调。
- [ ] 原有段落保留为补充说明，但视觉优先级降低。

### Task 10: Projets 分类菜单与卡片结构规划

**Files:**
- Modify: `src/components/ProjectModal.astro`
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/styles/global.css`
- Read: `src/data/projects.json`

- [ ] 暂时保留项目卡片的图片背景。
- [ ] 根据 `axis` 字段建立项目分类菜单。
- [ ] 分类菜单样式复用 Task 8 的筛选标签按钮。
- [ ] 选中某类时突出当前标签，并筛选对应项目。
- [ ] 卡片信息层级固定为：领域 tag、项目标题、2-3 行摘要、点击提示。
- [ ] 后续图标设计根据项目内容和领域统一风格，本轮只预留 icon slot。

### Task 11: Témoignages 卡片重设计

**Files:**
- Modify: `src/components/TestimonialCarousel.astro`
- Modify: `src/styles/global.css`
- Read: `src/data/testimonials.json`

- [ ] 重做 testimonial card，使其更像学生故事卡而不是普通引用框。
- [ ] 卡片包含：头像/首字母、姓名、项目/年份、quote、学生身份区域。
- [ ] 小标签是否区分中法学生等待用户反馈，本轮只预留位置。
- [ ] 横向滚动保留，但卡片视觉要更明确，避免空白和单调。

### Task 12: Contact 联系人卡片与资源分组

**Files:**
- Modify: `src/content/sections/{fr,en,zh}/05-contact.mdx`
- Modify: `src/components/ContactCard.astro`
- Optional Create: `src/data/contacts.json`
- Modify: `src/styles/global.css`

- [ ] 将联系区域拆为联系人、官方链接、文档资源三个区块。
- [ ] 联系人卡片展示姓名、角色、邮箱。
- [ ] 若联系人数据需要三语复用，创建 `src/data/contacts.json`；否则先直接在 MDX 中调用 ContactCard。
- [ ] 邮箱使用 `mailto:` 链接。
- [ ] 联系人信息缺失时不编造，使用已确认的姓名/邮箱。

### Task 13: UTC 工具栏保留与品牌层级微调

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/styles/global.css`

- [ ] 保留 UTC utility row。
- [ ] 对照 UTC 旧网站工具栏内容和排列，保持其统一格式。
- [ ] 不把 UTC 工具栏作为主要视觉焦点。
- [ ] UTSEUS logo 和主导航保持主品牌层级。
- [ ] 不在本轮移除 Ukraine flag，除非后续确认 UTC 官方当前模板已不包含它。

### Task 14: 侧边目录轻量改进

**Files:**
- Modify: `src/components/SidebarTOC.astro`
- Modify: `src/styles/global.css`

- [ ] 保留现有 TOC 结构和 scrollspy 效果。
- [ ] 尝试缩窄 TOC 宽度或降低卡片重量。
- [ ] 评估桌面端是否可向左隐藏一部分，让主内容视觉更居中。
- [ ] 不做大改，避免破坏当前已基本实现的导航体验。

### Task 15: 验证与用户选择

**Files:**
- Verify: `/fr/`, `/en/`, `/zh/`
- Run commands:
  - `rtk npm run build`
  - `rtk npm test`

- [ ] 构建通过。
- [ ] 首页临时设计展示区可见。
- [ ] 用户能比较 Hero 字体、章节字体、正文间距和配色方案。
- [ ] 用户确认字体和配色后，删除 `DesignChoicePanel.astro` 及页面插入点。
- [ ] 将被选中的字体和配色固化到 `src/styles/global.css`。
- [ ] 最终页面不保留临时选择区。

## 4. 执行顺序建议

1. **先做 Task 2-3:** 字体与配色展示。因为用户明确表示需要看效果后选择。
2. **再做 Task 4, 6, 8:** Hero 标题/按钮、关键数字卡片、筛选按钮。这些是当前最明显的视觉问题。
3. **然后做 Task 7, 9, 11, 12:** Mobilité、ComplexCity、Témoignages、Contact 的结构重设计。
4. **最后做 Task 10, 13, 14:** 项目分类菜单、UTC 工具栏确认、侧边目录轻量优化。
5. **图片和图标:** 不进入本轮主要交付，只保留插槽和统一风格要求。

## 5. 本轮不做的内容

- 不最终生成 Hero 背景图片。
- 不最终生成项目图标和卡片图片。
- 不处理移动端专项问题。
- 不删除 UTC 工具栏。
- 不使用未经确认的中法学生比例数据。

## 6. 验收标准

- 用户可以在首页看到字体和配色的实际视觉对比。
- Hero 的 UTSEUS 标题更接近官方标志风格。
- 页面颜色不再机械局限于红黄蓝三色，而是提供更完整的视觉方案。
- 关键数字、Mobilité、Témoignages、Contact 的卡片结构更有设计感。
- 筛选按钮有清晰选中态。
- 页面仍符合报告目标：UTSEUS 身份更强、文字密度降低、视觉叙事增强、机构可信度保留。
