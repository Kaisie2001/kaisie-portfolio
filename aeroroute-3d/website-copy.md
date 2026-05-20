# AeroRoute 3D Website Copy

## Content Purpose

This file is the full editorial source for the AeroRoute 3D portfolio case study intro.

The final website should not become a long article page. It should become a slide-like storytelling section, where each screen works like a concise pitch-deck slide.

This Markdown keeps the full thinking behind each slide: visible copy, design intent, layout notes, Chinese explanation, source notes, and wording boundaries.

---

# 00 Hero Section

## Display Title

AeroRoute 3D

## Display Subtitle

A 3D route-readiness sandbox for dense-city drone delivery.

## Visible Copy

Before a drone corridor goes live, AeroRoute 3D helps route launch teams evaluate whether it is operationally feasible under dense urban geometry, regulatory constraints, and extreme heat scenarios.

## Tags

- Dense-city Drone Delivery
- Route Readiness
- 3D Airspace Sandbox
- Extreme Heat Scenario

## Design Intent

This opening screen should let viewers understand the project within five seconds. It should not explain the entire system. It should establish the product category, target context, and decision value.

The key message is:

AeroRoute 3D is not a drone-control interface. It is a pre-operation route assessment product.

## Layout Notes

Use a large project title, one concise subtitle, one short paragraph, and four compact tags.

The main visual should eventually show a 3D sandbox or a placeholder for it: buildings, candidate landing nodes, restricted zones, and multiple route alternatives.

## Chinese Explanation

这一屏的目的不是解释所有技术细节，而是让面试官立刻知道：这个项目不是普通无人机路径规划 demo，而是一个面向无人机配送开线前评估的 3D 决策沙盘。

它的核心价值是帮助团队判断：一条候选无人机航线在真实城市环境中是否具备可运营性。

## What Not to Overclaim

Do not say:
- real-time drone control
- live dispatch
- real-time thermal updraft detection
- guaranteed safe route

Use:
- route-readiness
- pre-operation assessment
- candidate corridor
- scenario-based evaluation

---

# 01 Context | Why this matters now

## Display Title

Drone delivery is moving from flight demos to urban operations.

## Visible Copy

Delivery drones are no longer only experimental flying machines. They are becoming part of urban logistics systems, connecting commercial districts, communities, scenic areas, and local service nodes.

## Evidence Cards

### Urban deployment

Drone delivery is already being tested and deployed across commercial, community, and tourism scenarios.

### Automated operation

Modern drone delivery systems rely on automated route selection, fleet monitoring, and exception handling, rather than manual control of every flight.

### Controlled-condition limits

Drone specifications are usually measured under controlled conditions. Real-city deployment still requires route-level assessment.

## Design Intent

This section establishes industry relevance without turning into a market-size report.

The message should be:

The problem is no longer whether drones can fly. The problem is whether drone routes can operate safely and repeatedly in complex cities.

## Layout Notes

Use three small evidence cards.

Avoid adding too many numbers. This project should feel grounded, not like a consulting market report.

## Chinese Explanation

这一节的重点是说明：无人机配送已经从“技术展示”进入“城市运营”阶段。

所以真正的问题不是“无人机会不会飞”，而是“某一条航线能不能在城市里稳定运营”。这就自然引出 AeroRoute 3D 的产品价值。

## Source / Evidence Notes

Use these source directions later if needed:
- Meituan drone delivery / urban low-altitude logistics
- Wing automated drone delivery operation
- DJI FlyCart 30 specifications and controlled-condition notes

## What Not to Overclaim

Do not write unsupported market-size claims unless the source is clearly cited.

Do not say every city is ready for drone delivery.

---

# 02 Problem | The route is not just a line

## Display Title

A drone route is not just a line between two points.

## Visible Copy

In dense cities, route feasibility is shaped by buildings, restricted zones, candidate landing nodes, weather sensitivity, and operational trade-offs. A short route on a 2D map may become risky once placed inside a 3D urban environment.

## Key Constraint Cards

### Building obstruction

High-rise geometry turns a 2D path into a 3D clearance problem.

### Regulatory constraint

Restricted flying zones must be checked before route launch.

### Weather sensitivity

Extreme heat scenarios may activate additional route risk.

### Operational trade-off

A safer route may require detour; a shorter route may carry higher risk.

## Design Intent

This section should reframe drone routing from a shortest-path problem into an operational-readiness problem.

The key sentence is:

A short route is not always an operable route.

## Layout Notes

Use four constraint cards. Each card should be short and visually balanced.

This slide can later pair with a simple visual: a flat 2D line becoming a constrained 3D corridor.

## Chinese Explanation

这一节要把问题说清楚：在香港、深圳这类高密度城市，无人机航线不是二维地图上两点之间的一条线。

它受到建筑高度、禁飞区、候选起降点、天气风险和运营效率共同影响。

所以你的产品不是在解决“怎么画最短线”，而是在解决“这条线是否真的能开通”。

## What Not to Overclaim

Do not say current drone companies ignore 3D constraints.

Say:
Existing systems may focus on execution and monitoring, while this project focuses on pre-operation route-readiness assessment.

---

# 03 Research Insight | Where my angle comes from

## Display Title

From urban heat exposure research to drone route risk screening.

## Visible Copy

My previous research focused on route-level thermal exposure in Hong Kong, using long-term Landsat LST anomaly, spatial networks, and built-environment indicators. This project transfers that spatial-risk thinking into a new mobility context: drone corridor assessment.

## Method Transfer Cards

### From exposure surface

Long-term thermal anomaly can be transformed into a spatial risk layer.

### From route analysis

Route-level indicators can reveal risk differences between alternative corridors.

### From urban diagnosis

Built environment data can explain why some corridors are more exposed or constrained.

## Important Boundary

This project does not claim real-time thermal updraft detection.

Historical LST anomaly is used as a thermal susceptibility proxy for scenario-based route assessment.

## Design Intent

This section links the project to my existing research background without overstating the causal relationship between surface heat and drone flight instability.

The message should be:

I am transferring a spatial-risk modeling method, not claiming my dissertation directly proves drone crash risk.

## Layout Notes

Use one main paragraph, three method-transfer cards, and one highlighted boundary note.

The boundary note should be visually distinct, because it increases credibility.

## Chinese Explanation

这一节非常重要，因为它说明你的独特性来自哪里。

你不是说“我的论文证明了无人机会被热气流影响”，而是说：我的论文让我建立了一套把城市热环境转化为空间风险图层的方法。这个项目把这种方法迁移到无人机航线评估中。

这会让你的技术迁移能力非常清楚。

## What Not to Overclaim

Do not say:
- LST directly measures thermal updrafts.
- My thesis proves drone instability.
- The system detects real-time hot air columns.

Use:
- thermal susceptibility proxy
- scenario-based heat risk activation
- spatial risk screening

---

# 04 Target User | Who this is for

## Display Title

Designed for route launch and operations strategy teams.

## Visible Copy

The users are not individual drone pilots. They are the teams responsible for deciding whether a candidate route should be launched, adjusted, suspended, or sent for field validation.

## User Cards

### Route Launch Manager

Goal: Decide whether a new delivery corridor is ready for pilot operation.

Needs: Route feasibility, clearance risks, restricted-zone conflicts, launch recommendation.

### Operations Strategy PM

Goal: Compare route strategies under different operating scenarios.

Needs: Baseline route, safety route, balanced route, and risk explanation.

### Solution Consultant

Goal: Explain route feasibility to city partners, business teams, or internal stakeholders.

Needs: 3D sandbox, route-readiness report, and visual evidence.

## Design Intent

This section makes the product feel like a real internal tool for a technology company, not a generic B2B dashboard.

The target user should not be too narrow, such as only “route planner”. It should match companies like Meituan Drone, DJI Delivery, Wing, Zipline, or similar low-altitude logistics teams.

## Layout Notes

Use three persona cards. Keep them concise.

Avoid making the personas too fictional or too emotional. These are operational/product roles, not consumer personas.

## Chinese Explanation

你之前担心“航线规划员”听起来太传统、太窄。这里改成 route launch and operations strategy teams，会更贴近美团无人机、大疆行业解决方案、Wing 这类公司。

这个对象不是飞手，而是负责判断一条航线是否能开、怎么开、什么时候要绕行或暂停的团队。

## What Not to Overclaim

Do not imply this product replaces flight control engineers or pilots.

It supports pre-operation decision-making.

---

# 05 User Pain Points | What they struggle with

## Display Title

Early route screening is fragmented.

## Visible Copy

Teams need to check buildings, restricted zones, landing nodes, and weather-related risks across different tools. This makes early-stage route screening slow, fragmented, and difficult to explain.

## Pain Point Cards

### Fragmented screening

Buildings, restricted zones, landing nodes, and weather risks are often checked separately.

### 2D blind spots

A short route may fail once building clearance and altitude constraints are considered.

### Coarse weather decisions

A city-level heat warning does not explain which candidate route should be adjusted or avoided.

## Design Intent

This section should translate the technical problem into a real workflow pain.

The core idea is:

The pain is not only data availability. The pain is decision fragmentation.

## Layout Notes

Use three pain cards with minimal copy.

These cards should feel like a product discovery summary, not a literature review.

## Chinese Explanation

这一节是把问题落到业务动作上。

真实团队不是不知道天气、建筑、禁飞区这些东西，而是这些信息往往分散在不同工具里，很难形成一个清晰的“这条航线能不能开”的判断。

所以你的产品价值是把分散信息转化为 route-level decision。

## What Not to Overclaim

Do not say companies have no tools.

Say the early route-screening workflow can be fragmented, especially before a route reaches full operational deployment.

---

# 06 Product Opportunity | The gap

## Display Title

Route readiness before route launch.

## Visible Copy

Existing drone systems focus heavily on flight execution, automation, and fleet monitoring. Before a route reaches that stage, teams still need a structured way to compare candidate corridors, explain risks, and decide whether a route is ready for pilot operation.

## Opportunity Cards

### Before execution

Evaluate route feasibility before live operation.

### Before field validation

Prioritize which candidate routes deserve on-site checking.

### Before operational risk

Prepare alternate corridors for extreme heat scenarios.

### Before stakeholder review

Turn spatial constraints into explainable route decisions.

## Design Intent

This is the product opportunity slide.

It should clearly position AeroRoute 3D as a pre-operation assessment layer, not a flight execution system.

## Layout Notes

Use four “Before...” cards to create a clean rhythm.

The slide should feel like a transition from problem to product.

## Chinese Explanation

这一节是你的产品机会点。

现有无人机系统很多都强调飞行执行、自动化调度、机队监控。但在正式上线之前，团队仍然需要一个工具去比较候选航线、解释风险、判断是否值得进入测试运营。

这就是你的切口。

## What Not to Overclaim

Do not say existing drone systems lack safety or route planning.

Say this project focuses on the earlier stage: route readiness before route launch.

---

# 07 Design Question

## Display Title

How might we help drone delivery teams evaluate route readiness before launch?

## Visible Copy

AeroRoute 3D turns 3D urban constraints and thermal susceptibility into explainable route decisions, helping teams compare baseline, safety-first, and balanced corridors before field testing or pilot operation.

## Core Design Question

How might we help drone delivery teams evaluate route readiness before launch, by turning 3D urban constraints and thermal susceptibility into explainable route decisions?

## Design Intent

This slide should act as a conceptual hinge. Everything before it explains why the project matters. Everything after it explains how the product responds.

## Layout Notes

Use large typography for the design question.

Keep the page visually clean. This slide can be more spacious than others.

## Chinese Explanation

这一屏是整个前期研究部分的收束。

它把前面的行业背景、痛点、目标用户和产品机会压缩成一个设计问题。后面就可以进入产品方案、数据策略和技术实现。

## What Not to Overclaim

Do not include too many details on this slide.

It should feel like a clear design challenge, not a feature list.

---

# 08 Scope | What I chose to focus on

## Display Title

Pre-operation assessment, not real-time flight control.

## Visible Copy

The MVP focuses on evaluating candidate routes within a selected Hong Kong district using 3D buildings, restricted-zone data, a synthetic candidate landing-node database, and historical thermal susceptibility layers.

## Included

- 3D route-readiness sandbox
- Candidate landing-node database
- Restricted-zone screening
- Thermal susceptibility scenario
- Baseline / safety / balanced route comparison
- Route readiness recommendation

## Excluded

- Real-time flight control
- Real-time thermal updraft detection
- Multi-drone traffic control
- Enterprise API dispatch
- Full CFD wind simulation
- Real commercial vertiport network

## Design Intent

This slide protects the credibility of the project.

It shows that the product is ambitious but scoped. It also prevents viewers from expecting enterprise-grade live drone dispatch.

## Layout Notes

Use a two-column Included / Excluded layout.

This slide should feel honest and professional.

## Chinese Explanation

这一节一定要放，因为它会让你的项目更可信。

你不是假装自己做出了企业级实时无人机调度系统，而是明确说明 MVP 聚焦开线前评估。你清楚地区分了真实数据、模拟数据和未来能力。

## What Not to Overclaim

Do not hide the limitations.

The clear boundary is part of the product maturity.

---

# 09 Data Strategy

## Display Title

Real constraints. Synthetic nodes. Clear boundaries.

## Visible Copy

The project separates real spatial constraints from simulated operating inputs. Buildings, restricted zones, and thermal susceptibility are used as spatial evidence. Candidate landing nodes are generated as a synthetic database to support route-pair evaluation where public commercial vertiport data is not yet available.

## Data Cards

### Real spatial constraints

3D buildings, restricted zones, and base map layers define where routes cannot or should not pass.

### Thermal susceptibility proxy

Historical LST anomaly is used to identify areas that may become more sensitive under extreme heat scenarios.

### Synthetic landing-node database

A simulated database of candidate landing nodes supports route-pair generation, filtering, and readiness scoring.

### Transparent data boundary

The MVP does not claim access to real commercial vertiports, real-time telemetry, or real-time thermal updrafts.

## Design Intent

This slide explains data credibility.

It should answer the likely interview challenge:

If Hong Kong does not have public commercial drone landing-node data, how do you create meaningful route pairs?

The answer is:

Use synthetic candidate landing nodes for PoC evaluation, while using real spatial constraints where available.

## Layout Notes

Use four data cards.

This slide can later show a small preview of the candidate landing-node database.

## Chinese Explanation

这一节是回应“你的起降点是不是虚构”的关键。

你的起降点确实是 synthetic，但它不是随便画几个点，而是作为 PoC 的候选节点数据库，用来支持路线组合评估。真实的是建筑、禁飞区、热易感性这些空间约束。模拟的是运营输入。

## What Not to Overclaim

Do not call synthetic nodes real vertiports.

Use:
- synthetic candidate landing-node database
- generated for PoC route-pair evaluation
- not real commercial vertiport network

---

# 10 Evidence Cards

## Display Title

Evidence behind the product framing.

## Visible Copy

The product framing is based on drone delivery operations, automated fleet logic, controlled-condition device specifications, and Hong Kong’s regulatory context.

## Evidence Cards

### Industry deployment

Drone delivery has moved into multi-scenario urban operation, including commercial districts, communities, and scenic areas.

Source direction: Meituan urban low-altitude logistics solution.

### Automation model

Drone operators increasingly monitor systems rather than manually control each flight.

Source direction: Wing technology and fleet operation model.

### Device capability boundary

Drone specifications are measured under controlled conditions; real-city deployment requires local route assessment.

Source direction: DJI FlyCart 30 specifications.

### Regulatory layer

Hong Kong provides an official SUA regulatory framework and eSUA Drone Map, making regulatory screening part of route preparation.

Source direction: Hong Kong CAD SUA / eSUA.

## Design Intent

This slide should not become a bibliography page. It should show that the project is grounded in evidence.

## Layout Notes

Use four evidence cards.

Each card should have one claim and one source note.

## Chinese Explanation

这一节不是为了堆资料，而是证明你的项目不是凭空想象。

你只需要展示四类证据：行业部署、自动化运营模式、设备参数边界、香港监管环境。

## What Not to Overclaim

Do not overquote reports.

Keep evidence as concise source-backed signals.

---

# 11 Recommended Page Flow

## Display Title

Recommended page flow.

## Visible Copy

The intro should work like a short product story before entering system architecture and technical implementation.

## Page Flow

1. Hero
2. Context
3. Problem
4. Research Transfer
5. Target User
6. User Pain Points
7. Product Opportunity
8. Design Question
9. Scope
10. Data Strategy
11. Evidence Cards
12. Product Preview
13. Technical Implementation
14. Reflection / Limitations

## Design Intent

This section is for internal planning. It does not need to be shown as a slide on the website unless useful.

## Chinese Explanation

你的网站前半部分应该像一个 pitch deck，而不是长论文。

先让人理解为什么这个问题存在，再告诉他你为谁做，最后再进入技术实现。

---

# 12 Final Website Copy

## Hero

AeroRoute 3D

A 3D route-readiness sandbox for dense-city drone delivery.

Before a drone corridor goes live, AeroRoute 3D helps route launch teams evaluate whether it is operationally feasible under dense urban geometry, regulatory constraints, and extreme heat scenarios.

## Context

Drone delivery is no longer only a flight demo. It is becoming an urban operations problem.

Delivery drones now operate across commercial districts, communities, and scenic areas. As routes scale, the key question shifts from “Can the drone fly?” to “Can this route operate safely, repeatedly, and explainably in a real city?”

## Problem

A drone route is not just a line between two points.

In dense cities, route feasibility is shaped by buildings, restricted zones, candidate landing nodes, weather sensitivity, and operational trade-offs. A short route on a 2D map may become risky once placed inside a 3D urban environment.

## User

Designed for route launch and operations strategy teams.

The users are not individual drone pilots. They are the teams deciding whether a route should be launched, adjusted, suspended, or sent for field validation.

## Pain Points

Route screening is fragmented.

Buildings, restricted zones, landing nodes, and weather risks are often checked separately.

2D maps hide 3D risk.

A short route may fail once building clearance and altitude constraints are considered.

Weather decisions are too coarse.

A general heat warning does not explain which candidate route should be adjusted or avoided.

## Opportunity

Route readiness before route launch.

AeroRoute 3D turns spatial constraints into route-level decisions. It compares baseline, safety-first, and balanced routes, then explains the operational trade-off behind each recommendation.

## Design Question

How might we help drone delivery teams evaluate route readiness before launch, by turning 3D urban constraints and thermal susceptibility into explainable route decisions?

## Scope

This is not a real-time flight-control system.

The MVP focuses on pre-operation route assessment. It does not claim real-time thermal updraft detection, multi-drone traffic control, or enterprise API dispatch.

## Data Strategy

Real constraints. Synthetic nodes. Clear boundaries.

The MVP uses real spatial constraints where available: 3D buildings, restricted zones, and historical thermal susceptibility layers. Because public commercial landing-node data is not yet available in Hong Kong, candidate landing nodes are generated as a synthetic database for route-pair evaluation.

---

# 13 Layout Principles

## Display Title

Minimal, but not empty.

## Principles

- Use full-screen slide sections instead of a long scrolling article.
- Each slide should contain one core idea.
- Use short paragraphs and compact cards.
- Keep source notes small but visible.
- Use generous spacing.
- Use one accent color.
- Avoid decorative clutter.
- Make the structure feel like a product case study, not a research paper.

## Chinese Explanation

你的风格是简约，但不能信息缺失。

所以每一屏应该只有一个核心观点，但这个观点要有业务含义、数据边界或产品判断。

---

# 14 Content to Avoid

## Avoid

- Large market-size paragraphs without clear relevance.
- Unsupported battery-saving percentages.
- Claims about crash-rate reduction.
- Real-time thermal updraft detection.
- Real-time drone control.
- Full CFD simulation claims.
- Real commercial vertiport network claims.
- Overly technical algorithm explanation in the intro section.
- Too many academic citations on the first screens.

## Use Instead

- Route readiness
- Pre-operation assessment
- Candidate corridor
- Thermal susceptibility proxy
- Scenario-based evaluation
- Explainable route decision
- Synthetic candidate landing-node database

---

End of Markdown.
