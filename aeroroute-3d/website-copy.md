# AeroRoute 3D — Slide Context Markdown

> Purpose: This file is the full content source for the slide-like intro section of the AeroRoute 3D portfolio project.  
> It should be used as `aeroroute-3d/website-copy.md` or as the source for generating `slide-content.ts`.

---

## Content Direction

The visible intro should read like a concise product PRD / product discovery narrative, not a personal research-transfer story.

The goal is to help an interviewer quickly understand:

1. The demand is not a pseudo-demand.
2. Dense-city drone route launch has real operational complexity.
3. The product serves route launch and operations strategy teams.
4. The product supports pre-operation route-readiness decisions.
5. Candidate Landing Node Database is a reusable, filterable data layer for route-pair evaluation.
6. The MVP does not claim real-time flight control, real commercial vertiport access, or real-time thermal updraft detection.

Do **not** foreground the personal research-transfer narrative in the visible intro. Thermal susceptibility should appear as one product data layer, not as the origin story of the whole project.

---

## Recommended Visible Slide Structure

1. 00 Hero
2. 01 Industry Shift
3. 02 Three Route-launch Challenges
4. 03 Target Users & Decisions
5. 04 Current Workflow Pain
6. 05 Product Opportunity
7. 06 Candidate Landing Node Database
8. 07 Route-readiness Workflow
9. 08 Data Strategy & Boundaries
10. 09 MVP Scope
11. 10 Product Preview

---

# 00 Hero

## Display Title

AeroRoute 3D

## Display Subtitle

A 3D route-readiness sandbox for dense-city drone delivery.

## Visible Copy

Before a drone corridor goes live, AeroRoute 3D helps route launch teams evaluate whether it is operationally feasible under 3D urban constraints, candidate landing-node conditions, and extreme-weather scenarios.

## Tags

- Dense-city Drone Delivery
- Route Readiness
- 3D Airspace Sandbox
- Pre-operation Assessment

## Small Note

Pre-operation route assessment — not real-time flight control.

## Why This Slide Exists

This slide defines the product category and prevents misunderstanding. The viewer should immediately know this is not a drone-control interface or a general map demo. It is a pre-operation assessment tool for judging whether a candidate route is ready before pilot operation.

## Layout Intent

Use a large project title, short subtitle, one concise paragraph, and four tags. Keep this slide visually spacious. It should feel like a project opening, not a dashboard.

## PRD Mapping

Maps to:

- Product definition
- One-line positioning
- MVP boundary: pre-operation route assessment, not real-time flight control

## Do Not Say

- Live drone dispatch
- Real-time flight control
- Real-time thermal updraft detection
- Guaranteed safe route

---

# Bilingual Terminology / 中文术语表

This section defines the preferred Chinese terms for AeroRoute 3D.  
Use these terms when generating Chinese UI copy, bilingual labels, subtitles, or portfolio explanations.

| English Term | Preferred Chinese Term | Notes |
|---|---|---|
| AeroRoute 3D | AeroRoute 3D | 产品名不翻译 |
| dense-city drone delivery | 高密度城市无人机配送 | 不写“稠密城市” |
| route readiness | 航线可运营性 | 比“路线准备度”自然 |
| route-readiness sandbox | 航线可运营性评估沙盘 | 产品核心定位 |
| pre-operation route assessment | 开线前航线评估 | 比“运营前评估”更贴近业务 |
| route launch | 航线开通 / 开线 | 面向业务动作 |
| route launch team | 航线开通团队 / 城市开线团队 | 根据语境选择 |
| route launch and operations strategy team | 城市开线与运营策略团队 | 目标用户 |
| candidate corridor | 候选航线 | 不建议直译为“候选走廊” |
| drone corridor | 无人机航线 / 低空航线 | 视语境选择 |
| 3D urban constraints | 三维城市空间约束 | 用于问题描述 |
| 3D airspace sandbox | 三维低空沙盘 | 界面模块 |
| restricted zone | 禁飞 / 限制飞行区 | 不只写“限制区” |
| route screening | 航线筛查 | 业务流程 |
| route-level decision | 航线级决策 | 产品价值 |
| candidate landing node | 候选起降点 | 核心数据对象 |
| Candidate Landing Node Database | 候选起降点数据库 | 不翻译成“着陆节点” |
| node readiness level | 节点可用等级 / 节点 readiness 等级 | UI 中可保留 readiness |
| landing suitability score | 起降适配评分 | 比“着陆适宜性”自然 |
| building clearance | 建筑净空 / 建筑安全间距 | 根据上下文选择 |
| thermal susceptibility proxy | 热易感性代理指标 | 必须保留“代理”含义 |
| extreme heat scenario | 极端高温情景 | 不写“极热场景” |
| scenario-based evaluation | 情景化评估 | 产品表达 |
| baseline route | 基础航线 / baseline 航线 | UI 中可中英混用 |
| safety-first route | 安全优先航线 | 路线策略 |
| balanced route | 平衡航线 | 路线策略 |
| route comparison | 航线对比 | 功能模块 |
| decision output | 运营建议输出 | 比“决策输出”更业务化 |
| approve | 建议开通 / 可进入测试 | 根据语境选择 |
| reroute | 建议绕行 | 运营动作 |
| suspend | 暂停运行 / 暂不建议运行 | 不写“悬停” |
| adjust node | 调整起降点 | 运营动作 |
| request field validation | 建议现场验证 | 业务动作 |
| live dispatch | 实时调度 | 明确不是 MVP 范围 |
| real-time flight control | 实时飞控 | 明确不是 MVP 范围 |
| real-time thermal updraft detection | 实时热气流检测 | 明确不要声称 |
| real commercial vertiport data | 真实商业起降点数据 | 明确不要声称 |
| synthetic for PoC | PoC 模拟数据 | 不写成真实数据 |

---

# 01 Industry Shift

## Display Title

Drone delivery is moving from flight capability to route operations.

## Visible Copy

The challenge is no longer only whether a drone can fly, but whether routes can be launched, monitored, adjusted, and repeated in complex urban environments.

## Cards

### System operation

Drone delivery depends on aircraft, stations, dispatch systems, and monitoring.

### Route launch

Each new corridor needs local feasibility checks before pilot operation.

### Operational reliability

The key question becomes: can this route run repeatedly and explainably?

## Why This Slide Exists

This slide proves the project is responding to a real industry shift. Drone delivery is not only about single-flight feasibility. Once services move into urban contexts, the business problem becomes route launch, operations, monitoring, exception handling, and repeatability.

## Layout Intent

Use one strong claim and three compact evidence-style cards. Do not use large market-size numbers unless they are clearly sourced and directly relevant.

## PRD Mapping

Maps to:

- Section 2.1: Urban drone delivery is entering multi-route, multi-scenario, system-operation stage
- References to Meituan / Wing-style automated operation logic

## Source / Evidence Notes

Potential evidence directions:

- Meituan urban low-altitude logistics solution
- Wing drone delivery operation model
- DJI delivery drone / FlyCart ecosystem as an example of device capability entering logistics use cases

## Do Not Say

- All cities are ready for drone delivery
- Drone delivery is already fully mainstream everywhere
- The product replaces existing dispatch systems

---

# 02 Three Route-launch Challenges

## Display Title

A launchable route is not just the shortest path.

## Visible Copy

In dense cities, candidate corridors must pass spatial, regulatory, device, weather, and operational checks before they can go live.

## Cards

### 3D urban space

Buildings, height, clearance, and restricted zones shape flyable corridors.

### Spec ≠ readiness

Controlled-condition drone specs cannot directly represent real-city operation.

### Weather strategy

Extreme weather creates route-level actions: continue, reroute, pause, or validate.

## Why This Slide Exists

This is the core pain-point framing. It compresses the PRD’s three pain points into one slide: high-density urban geometry, device parameter limitations, and weather as a route strategy problem rather than a simple stop/go decision.

## Layout Intent

Use three cards only. This slide should be crisp and business-oriented. It should not become a technical explanation of algorithms.

## PRD Mapping

Maps to:

- Pain Point 1: high-density cities turn route planning from 2D path into 3D airspace problem
- Pain Point 2: ideal device parameters do not equal real-city operational readiness
- Pain Point 3: extreme weather is a route strategy problem, not only stop/fly

## What This Should Make Clear

AeroRoute 3D is not solving a generic shortest-path problem. It helps assess whether a route is launchable under real urban constraints.

## Do Not Say

- Drone companies do not consider safety
- Current platforms ignore regulations
- Weather automatically makes a route impossible

---

# 03 Target Users & Decisions

## Display Title

Built for route launch and operations strategy teams.

## Visible Copy

The users are not individual pilots. They are the teams deciding whether a corridor should launch, reroute, pause, adjust nodes, or enter field validation.

## Cards

### Route Launch Manager

Decides whether a corridor is ready for pilot operation.

### Operations Strategy PM

Compares baseline, safer, and balanced route options.

### Solution Consultant

Explains route feasibility to partners and internal stakeholders.

## Why This Slide Exists

This slide answers the product question: who is this for? The target user should not be described as only a traditional route planner. The product is better framed for route launch, low-altitude operations, product strategy, and solution teams inside companies such as drone delivery platforms, UAV companies, or low-altitude logistics operators.

## Layout Intent

Use three persona cards. Keep them operational and role-based, not emotional consumer personas.

## PRD Mapping

Maps to:

- Target user: Route Launch & Operations Strategy Team
- Potential company contexts: Meituan Drone, DJI Delivery / FlyCart solution team, Wing / Zipline-style operations teams, city low-altitude economy pilot teams

## Key Business Decisions

The product helps teams decide whether to:

- Launch a candidate corridor
- Use a safer or balanced route
- Pause under extreme scenarios
- Replace or adjust candidate landing nodes
- Send a route for field validation
- Export a route-readiness report

## Do Not Say

- This replaces pilots
- This replaces flight-control engineers
- This directly operates live aircraft

---

# 04 Current Workflow Pain

## Display Title

The pain is decision fragmentation.

## Visible Copy

Teams may have maps, regulations, weather signals, and site knowledge, but they still need one workflow that turns scattered constraints into a route-level decision.

## Cards

### Fragmented checks

Buildings, zones, nodes, and weather are reviewed separately.

### Weak comparison

Alternative corridors are hard to compare with one consistent logic.

### Unclear next step

Teams need approve, reroute, pause, adjust, or validate recommendations.

## Why This Slide Exists

This slide translates the technical problem into a workflow problem. The issue is not necessarily that teams have no tools. The issue is that early route screening may be fragmented across multiple layers, teams, and formats, making it difficult to produce one explainable route-level decision.

## Layout Intent

Use three pain cards. The slide should feel like product discovery, not academic literature review.

## PRD Mapping

Maps to:

- Business action chain: choose nodes → generate baseline route → choose scenario → generate risk-aware routes → output operational recommendation
- Product need: one explainable route-readiness workflow

## Do Not Say

- Companies have no tools
- This product replaces all route planning systems
- The product guarantees regulatory approval

---

# 05 Product Opportunity

## Display Title

Route readiness before route launch.

## Visible Copy

AeroRoute 3D creates a pre-operation assessment layer before routes enter live execution, fleet monitoring, or enterprise dispatch.

## Cards

### Before execution

Check feasibility before live operation.

### Before field validation

Prioritize which corridors deserve site visits.

### Before risk escalation

Prepare fallback routes for extreme scenarios.

## Why This Slide Exists

This slide defines the product opportunity. The product is not the flight-execution system itself. It is a planning and decision-support layer before live operation.

## Layout Intent

Use the repeated “Before...” rhythm to create a clean product-opportunity slide. Keep it focused and concise.

## PRD Mapping

Maps to:

- MVP positioning: pre-operation route assessment
- Operation decision output: Approve / Reroute / Suspend / Adjust node / Request field validation / Export report

## What This Should Make Clear

AeroRoute 3D sits before enterprise dispatch and live flight control. It supports route-readiness decisions and early-stage route screening.

## Do Not Say

- This replaces dispatch systems
- This controls drones
- This guarantees operational safety

---

# 06 Candidate Landing Node Database

## Display Title

From landing points to a reusable node database.

## Visible Copy

The MVP structures candidate landing points as a filterable database, so route evaluation can scale from one corridor to multiple origin–destination pairs.

## Cards

### Structured nodes

Each node stores type, altitude, area, clearance, access, and readiness fields.

### Batch evaluation

Node pairs can be combined to screen multiple candidate corridors.

### PoC boundary

Synthetic nodes are used to test the product logic, not to claim real vertiport access.

## Small Note

Synthetic candidate nodes support PoC route-pair evaluation.

## Why This Slide Exists

This slide explains a core product layer: Candidate Landing Node Database turns landing points into structured, filterable, and scalable inputs for screening, scoring, and route-pair evaluation—beyond a single demo corridor.

## Layout Intent

This slide should feel more concrete than earlier problem slides. It can include a small visual preview of fields or an abstract table/card showing node attributes.

## PRD Mapping

Maps to:

- Core update: Candidate Landing Node Database as reusable node layer for O-D evaluation
- Database usage: O-D pair generation, node suitability scoring, batch route evaluation
- Data boundary: `synthetic_for_PoC`, not real commercial landing points

## Field Concepts to Preserve

Do not show all fields on the slide, but the product logic should preserve:

- node_id
- district
- node_type
- recommended_altitude_m
- available_area_m2
- clearance_radius_m
- no_fly_conflict_status
- building_clearance_score
- thermal_susceptibility_score
- ground_access_score
- landing_suitability_score
- readiness_level
- data_status

## Do Not Say

- Real vertiport network
- Verified commercial landing points
- Operational deployment database

---

# 07 Route-readiness Workflow

## Display Title

From candidate nodes to operational recommendation.

## Visible Copy

The product turns route setup, scenario testing, and route comparison into one decision workflow.

## Cards

### 1. Select nodes

Choose origin and destination from the candidate-node database.

### 2. Generate routes

Compare baseline, safety-first, and balanced corridors.

### 3. Decide action

Approve, reroute, pause, adjust node, or request field validation.

## Why This Slide Exists

This slide explains the business action clearly. It prevents the project from being perceived as only a 3D visual demo. The viewer should understand what a user actually does inside the product.

## Layout Intent

Use a simple three-step workflow. If the UI supports it, show this as a horizontal process or stepped diagram rather than three equal text blocks.

## PRD Mapping

Maps to:

- Core business action: select candidate nodes → generate baseline route → choose scenario → generate risk-aware route → output recommendation
- User flow: selected AOI → load node database → select O/D → generate baseline → activate scenario layer → compare route options → output suggestion

## Optional Expanded Workflow for Later Sections

For a technical/product preview section, the workflow can expand to:

1. Select AOI
2. Load Candidate Landing Node Database
3. Choose origin / destination
4. Generate baseline route
5. Activate scenario layer
6. Generate safety and balanced routes
7. Compare risk and detour
8. Output recommendation

## Do Not Say

- The workflow directly dispatches drones
- The recommendation is legally binding
- The system replaces field validation

---

# 08 Data Strategy & Boundaries

## Display Title

Real constraints, synthetic operating inputs.

## Visible Copy

AeroRoute 3D separates evidence-based spatial constraints from simulated PoC inputs, so the concept stays useful without pretending to have enterprise data.

## Cards

### Real constraints

3D buildings, restricted zones, and base maps define hard spatial limits.

### Thermal proxy

Historical LST supports heat-scenario screening, not real-time updraft detection.

### Synthetic nodes

Generated landing candidates support PoC evaluation, not live operation.

## Small Note

No real commercial vertiports, live telemetry, or real-time thermal updraft sensing.

## Why This Slide Exists

This slide protects project credibility. It shows that the product uses real or evidence-based spatial constraints where possible, but does not pretend to have enterprise data, real commercial vertiports, live drone telemetry, or real-time thermal sensing.

## Layout Intent

Use three cards plus a small boundary note. This slide should feel honest and professional, not defensive.

## PRD Mapping

Maps to:

- Data boundary: real buildings / restricted zones / thermal susceptibility vs synthetic candidate nodes
- Defensive statement: LST anomaly is not real-time thermal flow observation
- MVP limitation: no enterprise telemetry, no live API dispatch

## Do Not Say

- Real-time thermal updraft detection
- Real enterprise vertiports
- Live operational telemetry
- Accurate battery-loss prediction

---

# 09 MVP Scope

## Display Title

Pre-operation assessment only.

## Visible Copy

The MVP focuses on evaluating candidate routes in a selected Hong Kong district. It does not replace flight control, dispatch, or regulatory approval systems.

## Cards

### Included

3D sandbox · node database · zone screening · scenario testing · route comparison.

### Excluded

Live flight control · real-time updraft detection · CFD · enterprise dispatch · real vertiports.

## Why This Slide Exists

This slide keeps the project scoped. The portfolio project should look ambitious but not unrealistic. Clear MVP boundaries are part of the product maturity.

## Layout Intent

Use a two-column Included / Excluded layout. This slide can be visually clean and structured.

## PRD Mapping

Maps to:

- MVP scope: 2km × 2km high-density district, real buildings, restricted zones, thermal susceptibility, simulated node database, route comparison, readiness score
- MVP non-goals: real-time flight control, real-time updraft detection, CFD, multi-drone conflict, enterprise API dispatch, real order dispatch
- Roadmap: real weather API, enterprise nodes, telemetry, battery health data, compliance reporting

## Do Not Say

- Full enterprise platform
- Operationally deployable system
- Complete regulatory approval solution

---

# 10 Product Preview

## Display Title

Compare corridors before pilot operation.

## Visible Copy

The product helps teams explore candidate nodes, screen constraints, compare route options, and output a route-readiness recommendation.

## Cards

### 3D sandbox

View dense urban geometry and route alternatives.

### Node explorer

Filter candidate landing nodes by readiness and suitability.

### Route comparison

Compare baseline, safer, and balanced corridors.

### Decision output

Approve, reroute, pause, adjust node, or request validation.

## Small Note

Product preview — not live drone dispatch.

## Why This Slide Exists

This slide transitions from problem framing into the actual product system. It should prepare the viewer for the next website section: architecture, data pipeline, route scoring, or UI prototype.

## Layout Intent

Use four product-module cards. If the visual is crowded, reduce visible card copy and rely on icons or labels.

## PRD Mapping

Maps to:

- Core feature modules: 3D Route Sandbox, Candidate Node Explorer, Scenario Setup Panel, Risk Layer Manager, Route Comparison Panel, Risk Explanation Panel, Operation Decision Output
- Route evaluation outputs: distance, detour, thermal susceptibility exposure, building clearance risk, restricted-zone conflict, node suitability, route-readiness score

## Do Not Say

- Real-time command center
- Live dispatch console
- Enterprise-grade flight system

---

# Notes for Generating `slide-content.ts`

The final rendered deck should be shorter than this Markdown. This file is the complete editorial source. When converting to `slide-content.ts`:

- Use only Display Title, Visible Copy, Cards, Tags, and Small Note.
- Do not render “Why This Slide Exists” or “PRD Mapping” in the UI.
- Preserve credibility notes as `sourceNote` only when needed.
- Keep each slide visually light.
- Do not include personal research-transfer narrative in visible slides.

---

# Notes for Page Layout

The final page should feel like a project case-study deck inside the existing portfolio, not a standalone landing page.

Preferred rhythm:

- Hero: large title + concise subtitle + tags
- Industry Shift: one claim + three compact cards
- Challenges: one claim + three challenge cards
- Target Users: three persona cards + decision framing
- Workflow Pain: one workflow problem + three pain cards
- Opportunity: pre-operation layer + before-cards
- Candidate Nodes: concrete database layer + small field preview
- Workflow: three-step decision flow
- Data Strategy: real vs synthetic vs boundary
- Scope: included / excluded
- Product Preview: product module cards

Avoid rendering every explanatory note. Keep the UI concise, but keep this Markdown complete for future editing.
