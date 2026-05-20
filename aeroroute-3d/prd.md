**AeroRoute 3D**

**面向高密度城市无人机配送的航线可运营性评估沙盘**

Product Requirements Document v0.2 | Portfolio PoC

*核心更新：将“手动标注起降点”升级为可模拟生成、可批量评估的 Candidate Landing Node Database*

| 项目类型 | 内容 |
| :---- | :---- |
| B2B / Tech Product PoC | 低空物流开线前评估工具，不是实时飞控系统 |
| Route Launch & Operations Strategy Team | 无人机配送平台、低空运营、行业解决方案团队 |
| Route readiness assessment | 判断候选航线能否开通、是否需绕行、是否需现场验证 |
| 2km × 2km 香港高密度片区 | 真实建筑/禁飞/热异常 \+ 模拟候选节点数据库 |

# **1\. 产品概述**

## **1.1 产品定义**

AeroRoute 3D 是一个面向无人机即时配送平台、低空物流运营团队和无人机行业解决方案团队的 3D 航线可运营性评估沙盘。它通过融合 3D 建筑形态、禁飞区、候选起降点数据库、历史地表热异常与天气情景参数，帮助城市开线团队在新航线开通前判断：这条航线是否具备开通条件、在极端高温情景下是否仍适合运行、是否需要使用绕行路线、是否需要调整起降点或进入现场验证。

本产品不定位为实时飞控系统，也不模拟企业级无人机调度中台。MVP 阶段聚焦“开线前评估 / pre-operation route assessment”，强调可解释的路线比较和运营动作输出。

## **1.2 一句话定位**

AeroRoute 3D is a route-readiness sandbox for dense-city drone delivery, helping route launch teams evaluate candidate corridors under 3D urban constraints and extreme-heat scenarios.

# **2\. 背景与痛点分析**

## **2.1 城市无人机配送进入“多航线、多场景、系统运营”阶段**

无人机配送的竞争重点正在从“单架无人机能否飞”转向“能否在复杂城市中稳定开线、批量运营和形成可解释的安全策略”。美团公开介绍其城市低空物流解决方案由无人机、智能化调度系统和高效率运营体系组成，并可提供 3 公里半径内端到端零售物品配送 15 分钟达服务；其智能化调度系统连接远程机组、无人机、机场及空中交通规划控制模块，可自主完成订单航线调度并实时监控无人机队状态。

Wing 也强调其系统会自动选择安全高效路线、避开其他航空器和障碍物，飞手更多是从中心位置监控天气、空中交通和多个航班，而不是手动控制每架无人机。

## **2.2 痛点一：高密度城市让无人机航线从 2D 路径变成 3D 空域问题**

在香港、深圳、上海等高密度城市，航线不是二维最短路径问题。建筑高度、城市峡谷、起降点周边净空、禁飞/限制区、建筑贴近风险都会影响航线可运营性。香港 CAD 小型无人机制度采用风险导向监管方式，并提供 eSUA / Drone Map 等飞行前查询工具，说明合规和空间限制是低空运营的基础约束。

## **2.3 痛点二：设备理想参数无法直接代表真实城市运营能力**

以 DJI FlyCart 30 为例，官方规格给出了最大起飞重量、续航、最大飞行距离、工作温度、抗风能力等参数，但多项续航数据明确是在“zero altitude and windless environment”等受控条件下采集，仅供参考。真实城市环境中的建筑遮挡、风、热环境和飞行高度都会改变运营风险。

## **2.4 痛点三：极端天气不是“停飞/不停飞”，而是航线策略问题**

极端高温、强风、降雨等天气会影响无人机运行安全和履约稳定性。平台真正需要判断的是：哪些航线可以继续运行、哪些航线需要绕行、哪些区域需要暂停、哪些候选起降点需要替换，以及哪些航线需要转入现场验证。

# **3\. 目标用户与业务动作**

## **3.1 目标用户**

主用户定义为“城市航线开通与低空运营策略团队 / Route Launch & Operations Strategy Team”，而不是单一的传统航线规划员。该团队可能存在于美团无人机、DJI Delivery / FlyCart 解决方案团队、Wing / Zipline 等无人机配送运营团队，或城市低空经济试点项目团队。

## **3.2 核心业务动作**

1\. 选择候选起降点：从 Candidate Landing Node Database 中选择 origin / destination，或在 3D 沙盘中新增候选点。

2\. 生成基础航线：系统在建筑硬约束和禁飞区约束下生成最短可行路线。

3\. 选择情景约束：用户选择 Normal Day / Extreme Heat Scenario / Strict Compliance Mode 等情景。

4\. 生成风险感知航线：系统叠加热易感性、建筑贴近风险和安全权重，生成 Safety Route 与 Balanced Route。

5\. 输出运营建议：Approve / Reroute / Suspend under heat scenario / Adjust node / Request field validation / Export report。

# **4\. 产品范围与边界**

| 范围类型 | 内容 |
| :---- | :---- |
| MVP 做 | 2km × 2km 高密度片区真实建筑沙盘；禁飞区图层；热易感性图层；候选起降点模拟数据库；三类路线比较；路线可运营性评分。 |
| MVP 不做 | 实时飞控、实时热气流检测、CFD 风场仿真、多机冲突调度、真实 API 下发、企业真实订单调度。 |
| Roadmap | 接入实时气象 API、企业起降点网络、无人机 telemetry、电池健康数据、合规报告自动生成。 |

# **5\. 核心更新：Candidate Landing Node Database**

## **5.1 为什么要从“手动标注”升级为“模拟节点数据库”**

如果 MVP 只在地图上手动放置 2-3 个点，项目会显得像一次演示，而不是可扩展产品。新版方案将起降点层设计为 Candidate Landing Node Database：系统可批量生成多组候选节点，并为每个节点赋予位置、类型、可用面积、净空半径、合规状态、热易感性、地面可达性和综合适配评分。

这并不意味着 MVP 声称拥有香港真实商业无人机起降点。相反，数据库字段中的 data\_status 明确标记为 synthetic\_for\_PoC。它的价值是验证一种产品逻辑：当企业未来接入真实 POI、物流站点、合作商户 rooftop、自动配送柜或园区节点时，系统可以直接复用同一套节点评估结构。

## **5.2 数据库用途**

* 为路线生成提供 origin / destination 候选池，而不是每次临时手动画点。  
* 支持批量生成 O-D pairs，评估一个区域内哪些节点组合最适合开线。  
* 将“起降点是否适合”转化为可解释指标，而不是只看空间位置。  
* 支持后续扩展到真实 POI / 企业节点 / rooftop / delivery cabinet 数据。

## **5.3 节点数据库字段设计**

| 字段 | 说明 |
| :---- | :---- |
| node\_id | 候选节点唯一编号，如 HK-LN-001 |
| district | 所在片区，如 Sham Shui Po / Kwun Tong |
| node\_type | 候选点类型：mall\_rooftop, logistics\_micro\_hub, community\_pickup\_node 等 |
| lat / lon | 节点坐标。MVP 为模拟生成；未来可由真实 POI 或企业节点替换 |
| recommended\_altitude\_m | 建议航线接入高度，用于 3D route generation |
| available\_area\_m2 | 可用起降/缓冲面积的估计值 |
| clearance\_radius\_m | 周边净空半径，用于起降安全评估 |
| no\_fly\_conflict\_status | none / nearby\_buffer / review\_required |
| building\_clearance\_score | 建筑净空安全评分，0-100 |
| thermal\_susceptibility\_score | 热易感性评分，0-100；越高代表高温情景下风险越高 |
| ground\_access\_score | 地面可达性/运营可接入性评分 |
| landing\_suitability\_score | 综合起降适配评分 |
| readiness\_level | A / B / C，表示优先级 |
| data\_status | synthetic\_for\_PoC / verified\_POI / enterprise\_node |

## **5.4 模拟生成规则**

MVP 可使用 rule-based synthetic generation。生成过程如下：

1\. 设定研究区 AOI，例如香港某 2km × 2km 高密度片区。

2\. 根据候选节点类型生成若干类别：commercial rooftop、logistics micro-hub、community pickup node、park-edge pad、transport interchange node、industrial rooftop 等。

3\. 为每个节点赋予模拟经纬度、推荐接入高度、可用面积、净空半径、热易感性、地面可达性和合规状态。

4\. 通过规则计算 landing\_suitability\_score，并将节点分为 A/B/C 三档。

5\. 从数据库中批量组合 origin-destination pairs，进入 route generation engine。

注意：模拟节点数据库不是为了伪装成真实商业点位，而是为了展示产品可以从“点位选择”进入“批量开线评估”的能力。

## **5.5 示例数据表（节选）**

| Node ID | District | Type | Alt m | Area m2 | Clear m | TSI | Suitability | Level |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| HK-LN-001 | Sham Shui Po | mall\_rooftop | 60 | 681 | 26 | 84 | 41 | C |
| HK-LN-002 | Mong Kok | logistics\_micro\_hub | 45 | 656 | 44 | 86 | 50 | C |
| HK-LN-003 | Kwun Tong | community\_pickup\_node | 45 | 1099 | 49 | 35 | 76 | A |
| HK-LN-004 | Kowloon Bay | park\_edge\_pad | 120 | 869 | 18 | 27 | 56 | C |
| HK-LN-005 | Central | transport\_interchange\_node | 105 | 1120 | 46 | 25 | 79 | A |
| HK-LN-006 | Tsim Sha Tsui | campus\_service\_node | 120 | 920 | 48 | 20 | 74 | A |
| HK-LN-007 | Sha Tin | pier\_or\_waterfront\_node | 120 | 656 | 18 | 73 | 47 | C |
| HK-LN-008 | Tseung Kwan O | industrial\_rooftop | 105 | 726 | 55 | 36 | 73 | B |
| HK-LN-009 | Sham Shui Po | mall\_rooftop | 60 | 1490 | 47 | 22 | 80 | C |
| HK-LN-010 | Mong Kok | logistics\_micro\_hub | 35 | 612 | 48 | 42 | 67 | C |
| HK-LN-011 | Kwun Tong | community\_pickup\_node | 75 | 472 | 28 | 86 | 44 | C |
| HK-LN-012 | Kowloon Bay | park\_edge\_pad | 90 | 997 | 35 | 80 | 59 | B |
| HK-LN-013 | Central | transport\_interchange\_node | 45 | 1465 | 22 | 23 | 71 | C |
| HK-LN-014 | Tsim Sha Tsui | campus\_service\_node | 60 | 1313 | 12 | 83 | 56 | C |
| HK-LN-015 | Sha Tin | pier\_or\_waterfront\_node | 60 | 1070 | 22 | 48 | 57 | C |
| HK-LN-016 | Tseung Kwan O | industrial\_rooftop | 105 | 791 | 52 | 34 | 69 | B |
| HK-LN-017 | Sham Shui Po | mall\_rooftop | 90 | 181 | 50 | 29 | 53 | C |
| HK-LN-018 | Mong Kok | logistics\_micro\_hub | 90 | 341 | 17 | 23 | 51 | C |

完整样例数据库已另存为 CSV，可用于后续 demo 或代码测试。

# **6\. 系统架构**

系统由六层组成：Scenario Setup、Candidate Node Database、Constraint Layer、Thermal Susceptibility Layer、Route Generation Engine、Decision Output。

| 层级 | 输入/功能 |
| :---- | :---- |
| 1\. Scenario Setup | 选择起点、终点、无人机类型、飞行高度范围、天气情景 |
| 2\. Candidate Node Database | 提供多组候选起降点及节点评分，支持批量 O-D 组合 |
| 3\. Constraint Layer | 3D 建筑障碍、禁飞区、最小安全距离、飞行高度约束 |
| 4\. Thermal Susceptibility Layer | LST anomaly、P90 heat anomaly、hot anomaly share、built-up / NDVI proxy |
| 5\. Route Generation Engine | 生成 baseline、safety、balanced 三类航线 |
| 6\. Decision Output | 输出 route readiness score、路线解释和运营建议 |

# **7\. 技术实现方案**

## **7.1 技术路线**

1\. 数据预处理：清洗建筑、禁飞区、热异常和候选节点数据。

2\. 3D grid / voxel 构建：将目标区域切分为三维可通行网格。

3\. 硬约束生成：建筑体块和禁飞区设置为不可通行。

4\. 热易感性生成：将 LST anomaly 等指标转为 Thermal Susceptibility Index。

5\. 路线搜索：使用 A\* / Dijkstra 基于 cost function 生成路线。

6\. 路线评估：计算距离、绕行率、热易感暴露、建筑贴近风险和合规冲突。

7\. 产品展示：用 deck.gl / Kepler.gl / Mapbox / Figma 封装 3D 沙盘和决策面板。

## **7.2 热易感性建模**

MVP 不声称实时检测热气流，而是构建静态热易感性图层。示例公式：

TSI \= normalize(0.5 × P90\_LST\_anomaly \+ 0.3 × Hot\_anomaly\_share \+ 0.2 × Built\_up\_intensity \- 0.2 × NDVI)

TSI 是产品化 proxy，用于情景评估，不等同于真实 CFD 或实时垂直热流观测。

## **7.3 天气情景触发**

Weather Trigger \= max(0, Temperature \- Threshold)。例如阈值为 30°C，28°C 时热风险权重不激活；35°C 时，热易感性图层被放大，用于生成高温情景下的风险感知路线。

## **7.4 Voxel Cost Function**

如果 voxel 与建筑体或禁飞区相交，则 Cost(v) \= infinity。否则：

Cost(v) \= w\_distance × DistanceCost(v) \+ w\_thermal × TSI(v) × WeatherTrigger \+ w\_clearance × BuildingClearanceRisk(v) \+ w\_altitude × AltitudePenalty(v)

通过调整权重，系统可以生成 efficiency-first、safety-first 和 balanced 三类路线。

# **8\. 核心功能需求**

| 模块 | 功能 |
| :---- | :---- |
| 3D Route Sandbox | 展示 3D 建筑、禁飞区、候选节点、热易感性区域和三类航线 |
| Candidate Node Explorer | 查看候选起降点数据库，按 readiness level / node type / suitability score 筛选节点 |
| Scenario Setup Panel | 选择情景、无人机类型、飞行高度范围、安全/效率权重 |
| Risk Layer Manager | 开关建筑、禁飞区、热易感性、建筑缓冲区、候选节点等图层 |
| Route Comparison Panel | 对比 baseline / safety / balanced route 的距离、绕行、风险和推荐结果 |
| Risk Explanation Panel | 解释为什么推荐某条路线，并标出主要风险航段 |
| Operation Decision Output | Approve / Reroute / Suspend / Adjust node / Request field validation / Export report |

# **9\. 路线评估指标**

| 指标 | 说明 |
| :---- | :---- |
| Route Distance | 航线长度，可直接计算 |
| Detour Ratio | 相对 baseline route 的绕行比例 |
| Thermal Susceptibility Exposure | 航线穿越高 TSI 区域的累计风险 |
| Building Clearance Risk | 与高层建筑距离过近的风险 |
| Restricted Zone Conflict | 是否穿越禁飞/限制区 |
| Node Suitability Score | 起降点数据库中的节点适配评分 |
| Route Readiness Score | 综合可运营性评分 |

# **10\. 用户流程**

## **10.1 高温情景下评估一条新商圈配送航线**

1\. 用户进入 AeroRoute 3D，选择目标 AOI。

2\. 系统加载 Candidate Landing Node Database，显示 A/B/C 三档候选起降点。

3\. 用户筛选出一个 mall\_rooftop 作为 origin，一个 community\_pickup\_node 作为 destination。

4\. 系统生成 baseline route，避开建筑与禁飞区，优先选择最短可行航线。

5\. 用户切换到 Extreme Heat Scenario，系统激活 Thermal Susceptibility Layer。

6\. 系统生成 safety route 与 balanced route，并对比三类航线。

7\. 右侧面板显示：baseline route 虽短，但穿越高热易感区；balanced route 绕行可控且风险下降。

8\. 系统输出建议：Use Balanced Route under heat scenario; request field validation before pilot operation。

# **11\. MVP 交付物**

| 交付物 | 说明 |
| :---- | :---- |
| PRD 文档 | 定义产品目标、业务动作、数据边界和技术实现 |
| Candidate Node Database CSV | 64 条模拟候选节点，可用于 demo 或算法测试 |
| 3D 沙盘图 / 视频 | 展示建筑、候选节点、热易感性和路线对比 |
| 路线对比结果 | 输出 baseline / safety / balanced route 的指标表 |
| Figma / Web Dashboard | 展示产品界面和交互流程 |

# **12\. 风险、限制与防御性说明**

* Landsat LST anomaly 不是实时热气流观测，只作为热易感性 proxy。  
* Candidate Landing Node Database 在 MVP 中为 synthetic\_for\_PoC，不代表真实商业起降点。  
* 能耗惩罚不做精确动力学建模，只用于路线策略对比。  
* MVP 不做实时飞控、多机冲突和企业 API 下发。  
* 真实落地需要接入企业节点、实时气象、无人机 telemetry、电池健康数据和监管接口。

产品防御性说明：本项目不是要替代企业级无人机调度系统，而是验证一种产品逻辑：在高密度城市无人机配送开线前，将 3D 建筑、禁飞区、候选起降点和热易感性转化为可解释的航线评估结果，帮助运营团队判断是否开线、如何绕行、是否需要现场验证。

# **13\. Roadmap**

| 阶段 | 内容 |
| :---- | :---- |
| Phase 1 \- Portfolio MVP | 2km × 2km AOI；真实建筑/禁飞/热异常；模拟节点数据库；三类路线对比；PRD \+ dashboard |
| Phase 2 \- Enhanced Simulation | 加入风速/降雨情景；候选节点批量评分；应急备降点；多 O-D 批量评估 |
| Phase 3 \- Enterprise Integration | 接入实时气象 API、企业真实起降点、无人机 telemetry、电池健康数据和合规报告模块 |

# **14\. 参考来源**

\[1\] Meituan. “美团无人机发布第四代新机型 携全新城市低空物流解决方案参展 2023 WAIC.” https://www.meituan.com/news/NN230706019014042

\[2\] DJI. “DJI FlyCart 30 Specs.” https://www.dji.com/flycart-30/specs

\[3\] Hong Kong Civil Aviation Department. “Small Unmanned Aircraft Order (Cap.448G).” https://www.cad.gov.hk/english/sua.html

\[4\] Wing. “How Wing’s Drone Delivery Technology Works.” https://wing.com/technology/

\[5\] Project research notes: background research Google Doc and uploaded low-altitude economy / UAM / eSUA / FlyCart materials, May 2026\.

# **Appendix A. Candidate Node Database: 设计说明**

数据库推荐以 CSV / GeoJSON 双格式维护。CSV 便于产品文档和指标查看，GeoJSON 便于前端 3D 地图渲染。字段中的 data\_status 必须保留，用于区分 synthetic\_for\_PoC、verified\_POI 和 enterprise\_node，避免误把模拟点位表达为真实商业点位。

在代码实现上，可先生成 60-100 条 synthetic candidate nodes，用于展示批量路线评估能力；未来接入真实数据后，只需替换 lat/lon、node\_type、area、clearance、compliance\_status 等字段，航线评估逻辑不变。