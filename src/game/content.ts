/**
 * 键盘侠模拟器 · 关卡文案
 *
 * 只改这个文件就能补内容。字符串留空 "" 时，界面显示「留白」。
 * 每关 comments 请保持 3 项，其中恰好一项 abstain: true（不发表评论）。
 */

export type CommentOption = {
  id: string;
  /** 按钮文案。abstain 项若留空，界面仍显示「不发表评论」。 */
  text: string;
  /** 为 true 时，这一项是「不发表评论」。 */
  abstain?: boolean;
  /** 点选之后的反馈。留空则显示留白。 */
  outcome: string;
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
      { id: "l1-a", text: "", outcome: "" },
      { id: "l1-b", text: "", outcome: "" },
      { id: "l1-skip", text: "不发表评论", abstain: true, outcome: "" },
    ],
    followUp: "",
  },
  {
    id: "level-2",
    title: "",
    durationSec: 30,
    captions: [],
    summary: "",
    danmaku: [],
    comments: [
      { id: "l2-a", text: "", outcome: "" },
      { id: "l2-b", text: "", outcome: "" },
      { id: "l2-skip", text: "不发表评论", abstain: true, outcome: "" },
    ],
    followUp: "",
  },
  {
    id: "level-3",
    title: "",
    durationSec: 30,
    captions: [],
    summary: "",
    danmaku: [],
    comments: [
      { id: "l3-a", text: "", outcome: "" },
      { id: "l3-b", text: "", outcome: "" },
      { id: "l3-skip", text: "不发表评论", abstain: true, outcome: "" },
    ],
    followUp: "",
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
