/**
 * 键盘侠模拟器 · 关卡文案
 *
 * 只改这个文件就能补内容。字符串留空 "" 时，界面显示「留白」。
 * 选项数量不限。abstain: true 的一项是不发表评论，不会进弹幕。
 * posted 是选中后投到弹幕里的句子。
 */

export type CommentOption = {
  id: string;
  /** 按钮文案。abstain 项若留空，界面仍显示「不发表评论」。 */
  text: string;
  /** 为 true 时，这一项是「不发表评论」。 */
  abstain?: boolean;
  /** 点选之后的反馈。留空则显示留白。 */
  outcome: string;
  /** 选中后投到弹幕区的句子。留空或 abstain 时不发弹幕。 */
  posted?: string;
};

export type NoteReply = {
  name: string;
  text: string;
};

export type Level = {
  id: string;
  /** 视频标题。留空则只显示关卡序号。 */
  title: string;
  /** 站内视频地址。有值时用自有播放器，不用外站播放器。 */
  videoSrc?: string;
  /** 占位播放器的时长（秒）。有 videoSrc 时以文件时长为准。 */
  durationSec: number;
  /** 按时间均分的字幕。空数组 = 画面留白。 */
  captions: string[];
  /** 「内容总结」正文。 */
  summary: string;
  /** 按下播放后飘过的弹幕。空数组表示不出现弹幕。 */
  danmaku: string[];
  comments: CommentOption[];
  /** 「查看后续」正文。 */
  followUp: string;
  /** 「查看后续」里用自有播放器自动播放的视频。不用外站播放器。 */
  followVideo?: string;
  /** 有笔记正文时，开场不放播放器，改成论坛帖。 */
  note?: string;
  /** 笔记的赞、收藏。 */
  likes?: number;
  saves?: number;
  /** 笔记或报道下可滑动的评论。 */
  replies?: NoteReply[];
  /** 有配图时，开场不放播放器，改成新闻图文。 */
  image?: string;
  /** 有推文正文时，开场不放播放器，改成公众号推文。 */
  post?: string;
  /** 后续视频是横屏时，播放器按 16:9。 */
  followWide?: boolean;
};

export const LEVELS: Level[] = [
  {
    id: "level-1",
    title: "学校辟谣学生升旗老师台下给校长打伞：俩人系父女，已报警",
    videoSrc: "/videos/level-1.mp4",
    durationSec: 13,
    captions: [],
    summary:
      "女教师在操场上为身旁背手站立的年长男子撑伞，被配以“讨好校领导”“职场谄媚”的解读，引发声讨。学校工作人员向媒体称两人是父女关系。",
    danmaku: [
      "作秀",
      "谄媚",
      "带节奏",
      "真是父女",
      "讨好领导",
      "给校长打伞",
      "背手像检阅",
      "就一把伞，刻意",
      "学校的解释我不信",
      "报警两个字在带节奏",
      "职场谄媚，看不下去",
      "如果是父女，标题就在带节奏",
      "升旗仪式上还打伞，画面太怪了",
      "女老师撑伞，男的背手，谁看了不多想",
      "评论区已经判完了，视频才放了几秒",
      "先别急着骂，等官方把关系说清楚",
    ],
    comments: [
      {
        id: "l1-a",
        text: "跟随大部分人的看法",
        posted: "就是讨好校领导，父女是借口",
        outcome: "",
      },
      {
        id: "l1-b",
        text: "故意和弹幕风向反着来",
        posted: "父女撑伞很正常，别跟着骂",
        outcome: "",
      },
      {
        id: "l1-c",
        text: "先独立思考再发表评论",
        posted: "画面容易让人误会，但学校说是父女，先别按标题定罪",
        outcome: "",
      },
      { id: "l1-skip", text: "不发表任何评论", abstain: true, outcome: "" },
    ],
    followUp:
      "两人并非父女，男子是一名退休返聘老教师。事件经历“网友质疑—校方称父女—教育局否认父女”的多次反转。反转本身也可能是一种新的片面；调查不是等一个“说法”就收手，而是直到完整事实经得起核实。",
    followVideo: "/videos/level-1-follow.mp4",
  },
  {
    id: "level-2",
    title: "",
    durationSec: 30,
    captions: [],
    summary: "",
    danmaku: [],
    note: "年轻女孩儿注意了⚠️在长沙五一附近跟朋友出去玩，刚下车遇到老太太要我们给她带路，说她眼睛不好看不见，我们拒绝了。结果在朋友店门口看见七人众万巡有一位小女孩带她进去小巷子里，感觉不对劲，为什么偏偏挑女性，路边也有男性，我马上出去把那个小女孩叫过来，叫她别去小心点，这个女孩儿过来了之后我们就在她后面看着，发现这个老太太居然能看手机？！我就联想到网络上发的那些诱骗年轻女生的视频，想想都毛骨悚然……",
    likes: 6821,
    saves: 3546,
    replies: [
      { name: "晚风不晚", text: "这就是拐卖，长沙的姐妹先别单独出门。" },
      { name: "路过五一", text: "能看手机就是装瞎，拐人已经实锤了。" },
      { name: "热心市民", text: "专挑女生，典型团伙，看见直接扭走。" },
      { name: "别装了", text: "还跟她客气什么，这种人就该当场收拾。" },
      { name: "先问清楚", text: "能看手机只能说明她不是全盲，还不能认定是诱拐。先把经过问清，再交给派出所核实。" },
    ],
    comments: [
      {
        id: "l2-a",
        text: "跟随大部分人的看法",
        posted: "能看手机就是装瞎，这就是拐卖。",
        outcome: "",
      },
      {
        id: "l2-b",
        text: "故意和评论风向反着来",
        posted: "看手机不等于拐人，别跟着认定。",
        outcome: "",
      },
      {
        id: "l2-c",
        text: "先独立思考再发表评论",
        posted: "现在只能说她不是全盲，还不能按拐卖下结论，先交给派出所核实。",
        outcome: "",
      },
      { id: "l2-skip", text: "不发表任何评论", abstain: true, outcome: "" },
    ],
    followUp:
      "经证实，刘奶奶73岁，确为视力一级残疾，使用的是装有读屏功能的手机，通过语音反馈操作，并非“看得见却装盲”。拍摄者随后道歉，承认对盲人的理解太片面。“盲人不可能用手机”本身就是未经调查的预设；调查研究要用一手事实打断“想当然”的链条。注意，“专挑女性”是拍摄者的单方面描述，不是经核实的事实。",
    followVideo: "/videos/level-2-follow.mp4",
  },
  {
    id: "level-3",
    title: "家园被毁！湖南石门县两位基层村支书忍不住哭了！",
    durationSec: 30,
    captions: [],
    summary: "",
    danmaku: [],
    image: "/images/level-3.png",
    likes: 7436,
    saves: 3182,
    replies: [
      { name: "看图说话", text: "这金耳环一看就是别人送的，基层干部哪买得起。" },
      { name: "路过石门", text: "来历不说清就是收的礼，哭也没用。" },
      { name: "围观群众", text: "这么粗的金圈，不是工资买得起的。" },
      { name: "不信泪", text: "先别哭，把耳环是谁送的交代清楚。" },
      { name: "先核对", text: "耳环的来历不能靠画面猜。材质、价格和购买记录都还没核实，不能据此否定她在灾区的工作。" },
    ],
    comments: [
      {
        id: "l3-a",
        text: "跟随大部分人的看法",
        posted: "金耳环来历不明，不像自己买的。",
        outcome: "",
      },
      {
        id: "l3-b",
        text: "故意和评论风向反着来",
        posted: "耳环来历不明不等于受贿，别跟着定罪。",
        outcome: "",
      },
      {
        id: "l3-c",
        text: "先独立思考再发表评论",
        posted: "现在只能看到她戴了耳环，来历还没核实，不能按贪腐下结论。",
        outcome: "",
      },
      { id: "l3-skip", text: "不发表任何评论", abstain: true, outcome: "" },
    ],
    followUp:
      "实际情况是，湖南石门县龙池河村支书向金元连续多日奋战在防汛一线，全村927人零伤亡；被质疑的耳环网购不到100元。2026年6月，公安部网安局披露依法查处网暴行为15起，对相关人员进行行政处罚。坐在屏幕前仅凭一副耳环否定基层干部在洪水中的全部付出，正是缺乏调查研究、以碎片表象审判基层的典型表现。",
    followVideo: "/videos/level-3-follow.mp4",
  },
  {
    id: "level-4",
    title: "姜萍：从走进决赛的那一刻起，她就已经赢了",
    durationSec: 55,
    captions: [],
    summary: "",
    danmaku: [],
    image: "/images/level-4.png",
    post: "2024年6月，17岁中专生姜萍以第12名入围阿里巴巴全球数学竞赛预赛。消息一经传出，全网集中报道。一个在职业学校学服装设计的女生，闯进汇集名校学子的数学赛场，名次甚至压过不少本科生。“寒门天才”的标签迅速传开：没有奥数班，没有名校光环，只有一盏灯和一本本自学的习题。短发、校服，站在写着“知识改变命运”的墙前，她自己倒还笑得很安静。\n\n人们愿意把最亮的词送给她。天才、奇迹、逆袭，评论区几乎只用一种声音。这个故事干净，也励志。它好像在说，起点可以很低，但只要够努力，就有人把你的名字认真地念出来。对很多同样普通的学生来说，姜萍走进决赛，就像替他们走了一步。\n\n于是有了这样的标题：从走进决赛的那一刻起，她就已经赢了。赢的不只是一个名次，还有一种被看见的可能。中专不是终点，衣服和公式也可以放在同一个人身上。她让“寒门”不再只是被同情的词，而变成被鼓掌的出发。那些天，全网把光打在她身上，夸奖本身也成了一种庆祝：原来努力会被这么多人同时看见。",
    likes: 8652,
    saves: 4371,
    replies: [
      { name: "灯下做题", text: "中专女生杀进决赛，这就是寒门天才。" },
      { name: "为她鼓掌", text: "从走进决赛起她就赢了，别的都不用问。" },
      { name: "看哭了", text: "17岁第12名，努力真的会被看见。" },
      { name: "深夜自习", text: "没有名校光环也能赢，姜萍值得全部的夸奖。" },
      { name: "先核对", text: "预赛名次值得高兴，但辅导有没有越过规则、成绩怎么来的，还要等组委会核对，先别把人造成神。" },
    ],
    comments: [
      {
        id: "l4-a",
        text: "跟随大部分人的看法",
        posted: "寒门天才实至名归，从进决赛起她就赢了。",
        outcome: "",
      },
      {
        id: "l4-b",
        text: "故意和评论风向反着来",
        posted: "名次高不等于天才，别急着加冕。",
        outcome: "",
      },
      {
        id: "l4-c",
        text: "先独立思考再发表评论",
        posted: "预赛第12名值得关注，但成名太快，规则和过程还没核对，先别把人造成神。",
        outcome: "",
      },
      { id: "l4-skip", text: "不发表任何评论", abstain: true, outcome: "" },
    ],
    followUp:
      "2024年11月3日，竞赛组委会公布调查结果：教师王某某在预选赛中对其指导的学生提供帮助，违反“禁止与他人讨论”的规则，二人决赛未获奖；王某某被诫勉谈话、取消本年度评先评优资格。事件从“全网造神”反转为“全网祛魅”。前面案例多是“先骂错”，这一案例是“先夸错”；骂错和夸错，背后是同一种“没有调查”。",
    followVideo: "/videos/level-4-follow.mp4",
    followWide: true,
  },
];

const ORDINAL = ["一", "二", "三", "四", "五", "六"];

export function optionLabel(option: CommentOption): { text: string; blank: boolean } {
  if (option.abstain) {
    return { text: option.text.trim() || "不发表评论", blank: false };
  }
  const text = option.text.trim();
  return { text: text || "待填写", blank: text.length === 0 };
}

export function optionKicker(index: number): string {
  return `选项${ORDINAL[index] ?? String(index + 1)}`;
}
