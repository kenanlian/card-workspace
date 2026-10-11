// One demo vault, authored in both languages side by side so the Chinese and
// English clips tell the same story. `scripts/build-vault.mjs` turns it into
// data/vault.zh.json and data/vault.en.json.

/** Notes in root-view order (newest first); `hours` is how long before NOW each was last edited. */
export const NOW = Date.UTC(2026, 9, 10, 12, 0, 0);

export const ATTACHMENT_FOLDER = { zh: "附件", en: "Attachments" };

export const notes = [
  {
    hours: 1,
    zh: {
      path: "读书笔记/深度工作.md",
      content: `---
tags: [神经科学]
状态: 进行中
---

深度工作是在不被打断的专注中，把认知能力推到极限的工作。它很难，但产出的价值也最难被替代。

## 什么是深度工作

浅层工作可以边聊天边做，深度工作需要一整段完整的时间。每一次查看消息，都会把注意力切成碎片，参见 [[任务切换的代价]]。

## 进入状态

固定的时间、固定的位置、明确的结束点。进入状态的过程和 [[心流的条件#进入心流]] 很像：目标清晰，反馈及时，难度刚好。

## 每天的安排

- 上午两小时只做一件事
- 下午集中处理消息和会议
`,
    },
    en: {
      path: "Reading/Deep work.md",
      content: `---
tags: [neuroscience]
status: active
---

Deep work is focus without interruption that pushes your thinking to its limit. It is hard, and its value is the hardest to replace.

## What deep work is

Shallow work survives a chat window; deep work needs one unbroken block of time. Every glance at messages cuts attention into pieces — see [[The cost of task switching]].

## Getting into it

Fixed hours, a fixed place, a clear stopping point. Getting into it feels like [[Conditions for flow#Entering flow]]: a clear goal, quick feedback, just enough difficulty.

## The daily plan

- Two morning hours on a single task
- Messages and meetings batched in the afternoon
`,
    },
  },
  {
    hours: 3,
    image: "kyoto-temple.jpg",
    zh: {
      path: "旅行/京都红叶季.md",
      content: `---
tags: [旅行]
---

十一月中旬的京都，清水寺的舞台下面是一整片红叶。早上七点前到，人少、光线也柔和。

![[附件/kyoto-temple.jpg]]

## 路线

- 清水寺 → 二年坂 → 八坂神社
- 午后去南禅寺，傍晚到永观堂看夜枫
`,
    },
    en: {
      path: "Travel/Kyoto in autumn.md",
      content: `---
tags: [travel]
---

Mid-November in Kyoto: below the Kiyomizu-dera stage, the whole hillside turns red. Arrive before seven for soft light and empty paths.

![[Attachments/kyoto-temple.jpg]]

## Route

- Kiyomizu-dera → Ninenzaka → Yasaka Shrine
- Nanzen-ji after lunch, Eikan-dō for the evening maples
`,
    },
  },
  {
    hours: 5,
    zh: {
      path: "研究/访谈/访谈：程序员小林.md",
      content: `---
tags: [访谈]
状态: 进行中
---

小林说，一天里真正写代码的时间不到三小时。最怕的是刚理清思路就被打断，再回来要十几分钟才能接上。

他现在把上午留给 [[深度工作]]：关掉聊天软件，只开一个编辑器窗口。

## 被打断的来源

- 群消息和临时会议，占了打断的大半
- 自己顺手打开浏览器，其实也是一种打断

## 他的办法

把问题写在便签上，攒到中午统一回复。他说这是 [[深度工作]] 里最容易坚持的一条，也是 [[深度工作]] 能长期做下去的前提。
`,
    },
    en: {
      path: "Research/Interviews/Interview - Lin, developer.md",
      content: `---
tags: [interview]
status: active
---

Lin codes under three hours a day. The worst is an interruption just as the idea comes together; getting back takes ten minutes or more.

Mornings are now for [[Deep work]]: chat closed, one editor window open.

## Where interruptions come from

- Group chats and ad-hoc meetings cause most interruptions
- Opening a browser on a whim is an interruption too

## What works for him

Questions go on a sticky note. He calls it the easiest [[Deep work]] habit to keep, and the reason [[Deep work]] lasts for him.
`,
    },
  },
  {
    hours: 7,
    image: "tomato-beef.jpg",
    zh: {
      path: "厨房/番茄牛腩.md",
      content: `---
tags: [菜谱]
---

周末的砂锅炖菜：番茄分两次下，一半炖化做汤底，一半最后十分钟放，保留口感。

![[附件/tomato-beef.jpg]]

## 食材

- [x] 牛腩 600g，切块冷水焯
- [x] 番茄 4 个，十字刀去皮
- [ ] 洋葱半个、姜片、八角
`,
    },
    en: {
      path: "Kitchen/Tomato beef stew.md",
      content: `---
tags: [recipe]
---

A weekend clay-pot stew: add the tomatoes in two rounds — half melt into the broth, half go in for the last ten minutes.

![[Attachments/tomato-beef.jpg]]

## Ingredients

- [x] 600 g beef brisket, blanched
- [x] 4 tomatoes, peeled
- [ ] Half an onion, ginger, star anise
`,
    },
  },
  {
    hours: 9,
    zh: {
      path: "文章摘录/任务切换的代价.md",
      content: `---
tags: [神经科学]
状态: 已完成
---

从邮件切回文档，大脑要花时间重新进入状态。切换越频繁，损耗越大。

## 切换成本

每一次被打断，都要重新加载上下文：刚才读到哪里、下一步要做什么。

## 残留注意力

切走之后，一部分注意力还停留在上一件事上。研究者把它叫作“注意力残留”。这也是 [[深度工作]] 要求整块时间的原因。
`,
    },
    en: {
      path: "Clippings/The cost of task switching.md",
      content: `---
tags: [neuroscience]
status: done
---

Switching from email back to a document, the brain needs time to get back into it. The more often you switch, the more you lose.

## Switching cost

Every interruption means reloading context: where you were, what comes next.

## Attention residue

After a switch, part of your attention stays with the previous task.

That attention residue is why [[Deep work]] asks for whole blocks of time.
`,
    },
  },
  {
    hours: 11,
    zh: {
      path: "日志/手机放进抽屉一周.md",
      content: `---
tags: [日志]
---

第一天摸了十几次口袋。第三天开始，等电梯时会看看窗外。第七天，读完了半本书。

最明显的变化是上午：没有手机，[[深度工作]] 一次能坚持一个半小时。

## 下周

继续把手机放在抽屉里，再试一周下午的 [[深度工作]]。
`,
    },
    en: {
      path: "Journal/A week with my phone in a drawer.md",
      content: `---
tags: [journal]
---

Day one, I reached for my pocket a dozen times. By day three I looked out the window while waiting for the lift. By day seven I had read half a book.

Mornings changed most: without the phone, [[Deep work]] held for ninety minutes at a time.

## Next week

Keep the phone in the drawer and try afternoon [[Deep work]] too.
`,
    },
  },
  {
    hours: 13,
    zh: {
      path: "读书笔记/心流的条件.md",
      content: `---
tags: [神经科学]
状态: 已完成
---

心流是全神贯注、忘记时间的状态。契克森米哈赖总结了它出现的条件。

## 三个条件

- 清晰的目标
- 即时的反馈
- 刚好够得着的难度

## 进入心流

先用十五分钟做一件确定的小事，让注意力慢慢收拢。环境越安静，进入得越快。

## 被打断之后

被打断一次，往往要很久才能重新进入。所以保护开头的那段时间最重要。
`,
    },
    en: {
      path: "Reading/Conditions for flow.md",
      content: `---
tags: [neuroscience]
status: done
---

Flow is total absorption, where time disappears. Csikszentmihalyi summed up when it shows up.

## Three conditions

- A clear goal
- Immediate feedback
- Difficulty just within reach

## Entering flow

Spend fifteen minutes on one small, certain task and let attention gather. The quieter the room, the faster you get there.

## After an interruption

After a single interruption it can take a long time to get back in, so the opening stretch is the part to protect.
`,
    },
  },
  {
    hours: 15,
    image: "iceland-beach.jpg",
    zh: {
      path: "旅行/冰岛环岛.md",
      content: `---
tags: [旅行]
---

一号公路环岛十天，最难忘的是维克镇的黑沙滩：玄武岩柱从海里立起来，浪很大，不能靠太近。

![[附件/iceland-beach.jpg]]

## 提醒

- 天气一小时一变，冲锋衣一定要带
- 加油站之间距离很远，过半箱就加
`,
    },
    en: {
      path: "Travel/Iceland ring road.md",
      content: `---
tags: [travel]
---

Ten days on Route 1. The highlight was the black beach at Vík: basalt stacks rising from the sea, waves too big to get close.

![[Attachments/iceland-beach.jpg]]

## Reminders

- The weather changes hourly; pack a shell jacket
- Gas stations are far apart; refuel at half a tank
`,
    },
  },
  {
    hours: 17,
    zh: {
      path: "研究/访谈/访谈：设计师阿青.md",
      content: `---
tags: [访谈]
状态: 进行中
---

阿青做了五年产品设计。她说自己最清楚通知是怎么设计出来的，所以反而最难抵抗。

## 关于红点

她提到 [[红点与角标]]：数字一出现，就忍不住想清空。工作时她会把手机翻过来放。

## 她的节奏

每天只在固定的三个时间看消息，其余时间尽量不被打断。她说这让下午也能留出一段 [[深度工作]]。
`,
    },
    en: {
      path: "Research/Interviews/Interview - Qing, designer.md",
      content: `---
tags: [interview]
status: active
---

Qing has designed products for five years. She knows exactly how notifications are built, which makes them harder, not easier, to resist.

## On red dots

She mentions [[Red dots and badges]]: once a number appears, she wants it gone. At work her phone lies face down.

## Her rhythm

Messages get checked at three fixed times a day; the rest stays free of interruption. That leaves room for [[Deep work]] in the afternoon too.
`,
    },
  },
  {
    hours: 19,
    zh: {
      path: "文章摘录/通知的设计.md",
      content: `---
tags: [产品设计]
状态: 待读
---

好的通知只在用户需要的时候出现。坏的通知把每一次打断都包装成“可能错过的重要消息”。

## 原则

- 默认安静，让用户自己打开
- 合并同类通知，而不是逐条推送
- 角标数字要有上限，参见 [[红点与角标]]
`,
    },
    en: {
      path: "Clippings/Designing notifications.md",
      content: `---
tags: [product-design]
status: to-read
---

Good notifications appear only when the user needs them. Bad ones dress every interruption up as "something important you might miss".

## Principles

- Quiet by default; let users opt in
- Bundle similar notifications instead of pushing each one
- Cap badge counts — see [[Red dots and badges]]
`,
    },
  },
  {
    hours: 21,
    image: "pour-over.jpg",
    zh: {
      path: "厨房/手冲咖啡参数.md",
      content: `---
tags: [咖啡]
---

日常一杯：15g 豆子，水温 92°C，粉水比 1:15，总时长两分半左右。

![[附件/pour-over.jpg]]

## 步骤

1. 30g 水闷蒸 30 秒
2. 分三段注水到 225g
3. 浅烘豆可以把水温提高到 94°C
`,
    },
    en: {
      path: "Kitchen/Pour-over coffee.md",
      content: `---
tags: [coffee]
---

The daily cup: 15 g of beans, 92 °C water, a 1:15 ratio, about two and a half minutes in total.

![[Attachments/pour-over.jpg]]

## Steps

1. Bloom with 30 g of water for 30 seconds
2. Pour to 225 g in three stages
3. Raise the water to 94 °C for light roasts
`,
    },
  },
  {
    hours: 23,
    zh: {
      path: "日志/关闭通知之后.md",
      content: `---
tags: [日志]
---

只留下电话和日历提醒。头两天总怕错过消息，后来发现，真正要紧的事会有人直接打电话。

一天里被打断的次数少了一半，[[深度工作]] 的时间多了出来。
`,
    },
    en: {
      path: "Journal/After turning off notifications.md",
      content: `---
tags: [journal]
---

Only calls and calendar alerts stay on. For two days I worried about missing things; then I noticed that anything urgent comes as a phone call.

Interruptions dropped by half, and the time for [[Deep work]] grew.
`,
    },
  },
  {
    hours: 25,
    zh: {
      path: "研究/注意力研究综述.md",
      content: `---
tags: [方法]
状态: 进行中
---

这篇综述想回答一个问题：为什么专注越来越难？

## 背景

信息变多以后，稀缺的是注意力，参见 [[注意力经济]]。产品用不确定的奖励留住我们，参见 [[多巴胺与期待]]。

## 访谈发现

两位受访者都提到，被打断是最大的问题。

## 下一步

- 补充 [[深度工作]] 的实践建议
- 整理切换成本的研究
`,
    },
    en: {
      path: "Research/Attention research review.md",
      content: `---
tags: [method]
status: active
---

This review asks one question: why is focus getting harder?

## Background

As information multiplies, attention becomes the scarce resource — see [[The attention economy]]. Products keep us with uncertain rewards — see [[Dopamine and anticipation]].

## What the interviews found

Both interviewees named interruption as the biggest problem.

## Next steps

- Add practical advice on [[Deep work]]
- Gather the research on switching costs
`,
    },
  },
  {
    hours: 27,
    zh: {
      path: "读书笔记/多巴胺与期待.md",
      content: `---
tags: [神经科学]
状态: 已完成
---

多巴胺奖励的不是得到，而是期待。不确定的奖励最让人停不下来：下一次刷新，也许就有新东西。

## 为什么停不下来

可变奖励让每一次查看都像抽奖。信息流和红点都利用了这一点。
`,
    },
    en: {
      path: "Reading/Dopamine and anticipation.md",
      content: `---
tags: [neuroscience]
status: done
---

Dopamine rewards anticipation, not getting. Uncertain rewards are the hardest to stop: the next refresh might bring something new.

## Why we can't stop

Variable rewards turn every check into a lottery ticket. Feeds and red dots both rely on it.
`,
    },
  },
  {
    hours: 29,
    image: "balcony-garden.jpg",
    zh: {
      path: "生活/阳台花园.md",
      content: `---
tags: [植物]
---

朝东的小阳台，上午有四个小时直射光。今年种了罗勒、薄荷、迷迭香和一盆樱桃番茄。

![[附件/balcony-garden.jpg]]

## 养护

- 罗勒勤掐顶，才会长得密
- 番茄每周一次稀释液肥
`,
    },
    en: {
      path: "Life/Balcony garden.md",
      content: `---
tags: [plants]
---

A small east-facing balcony with four hours of morning sun. This year: basil, mint, rosemary, and a pot of cherry tomatoes.

![[Attachments/balcony-garden.jpg]]

## Care

- Pinch the basil often so it grows bushy
- Feed the tomatoes diluted fertilizer once a week
`,
    },
  },
  {
    hours: 31,
    zh: {
      path: "读书笔记/注意力经济.md",
      content: `---
tags: [经济学]
状态: 进行中
---

西蒙在 1971 年写道：信息的丰富造成注意力的贫乏。内容免费时，被出售的其实是我们的时间。

## 延伸

广告按停留时长计价，产品于是想尽办法让人多停留一会儿。
`,
    },
    en: {
      path: "Reading/The attention economy.md",
      content: `---
tags: [economics]
status: active
---

Herbert Simon wrote in 1971 that a wealth of information creates a poverty of attention. When content is free, what is sold is our time.

## Going further

Ads are priced by time on screen, so products work hard to keep us a little longer.
`,
    },
  },
  {
    hours: 33,
    zh: {
      path: "读书笔记/红点与角标.md",
      content: `---
tags: [产品设计]
状态: 待读
---

红色角标借用了我们对未完成事项的不安：数字越大，越想点开清空，哪怕里面没有要紧的事。
`,
    },
    en: {
      path: "Reading/Red dots and badges.md",
      content: `---
tags: [product-design]
status: to-read
---

Red badges borrow our unease about unfinished things: the bigger the number, the stronger the urge to clear it, even when nothing inside matters.
`,
    },
  },
  {
    hours: 35,
    image: "erhai-lake.jpg",
    zh: {
      path: "旅行/大理洱海.md",
      content: `---
tags: [旅行]
---

清晨的洱海很安静，苍山顶上还挂着云。住在双廊的海边客栈，推开窗就是湖面。

![[附件/erhai-lake.jpg]]

## 安排

- 第一天：古城、崇圣寺三塔
- 第二天：环海西路骑行
`,
    },
    en: {
      path: "Travel/Erhai Lake, Dali.md",
      content: `---
tags: [travel]
---

Erhai Lake is still at dawn, with clouds resting on the Cangshan peaks. From the guesthouse in Shuanglang, the window opens onto the water.

![[Attachments/erhai-lake.jpg]]

## Plan

- Day one: the old town and the Three Pagodas
- Day two: cycling the west shore road
`,
    },
  },
  {
    hours: 37,
    zh: {
      path: "文章摘录/无限滚动.md",
      content: `---
tags: [产品设计]
状态: 已完成
---

没有底部的信息流，取消了“看完了”这个自然的停止点。分页本是一次决定要不要继续的机会。
`,
    },
    en: {
      path: "Clippings/Infinite scroll.md",
      content: `---
tags: [product-design]
status: done
---

A feed with no bottom removes the natural stopping point of "I'm done". Pagination used to be a chance to decide whether to go on.
`,
    },
  },
  {
    hours: 39,
    zh: {
      path: "文章摘录/机会成本.md",
      content: `---
tags: [经济学]
状态: 已完成
---

选择一件事的真实代价，是为此放弃的选项里价值最高的那一个。花在刷手机上的一小时，也有它的机会成本。
`,
    },
    en: {
      path: "Clippings/Opportunity cost.md",
      content: `---
tags: [economics]
status: done
---

The real cost of a choice is the most valuable option you gave up for it. An hour of scrolling has an opportunity cost too.
`,
    },
  },
  {
    hours: 41,
    zh: {
      path: "研究/研究方法.md",
      content: `---
tags: [方法]
状态: 已完成
---

半结构化访谈，每次四十分钟。先问一天的工作节奏，再问最近一次被打断的经历。

## 记录方式

访谈笔记放在“访谈”文件夹，每篇只写一位受访者。
`,
    },
    en: {
      path: "Research/Research method.md",
      content: `---
tags: [method]
status: done
---

Semi-structured interviews, forty minutes each. First the rhythm of a working day, then the most recent interruption.

## Notes

Interview notes live in the Interviews folder, one interviewee per note.
`,
    },
  },
  {
    hours: 43,
    zh: {
      path: "日志/十月第一周复盘.md",
      content: `---
tags: [日志]
---

这周节奏偏慢，但把几件拖了很久的小事做完了。

## 完成

- [x] 整理相册，按旅行分好文件夹
- [x] 读完《心流》前三章
- [ ] 给京都的照片写游记
`,
    },
    en: {
      path: "Journal/October week one review.md",
      content: `---
tags: [journal]
---

A slow week, but a few long-postponed small things got done.

## Done

- [x] Sorted the photo library into trip folders
- [x] Finished the first three chapters of Flow
- [ ] Write up the Kyoto photos
`,
    },
  },
];
