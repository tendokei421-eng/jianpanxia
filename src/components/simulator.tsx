import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Check, Pause, Play, RotateCcw, X } from "lucide-react";
import {
  LEVELS,
  optionKicker,
  optionLabel,
  type Level,
} from "@/game/content";

type Panel = "summary" | "comments" | "outcome" | "follow" | null;
type OpenPanel = Exclude<Panel, null>;

function stageHref(level: number, panel?: OpenPanel | null, choice?: string | null) {
  const params = new URLSearchParams();
  params.set("view", "play");
  params.set("level", String(level));
  if (panel) params.set("panel", panel);
  if (choice) params.set("choice", choice);
  return `?${params.toString()}`;
}

function formatTime(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Blank({ hint }: { hint: string }) {
  return (
    <div className="border-l-2 border-seal bg-paper px-4 py-5">
      <p className="font-display text-lg text-ink">留白</p>
      <p className="mt-1 text-sm leading-relaxed text-mute">{hint}</p>
    </div>
  );
}

function Sheet({
  title,
  level,
  choice,
  children,
}: {
  title: string;
  level: number;
  choice: string | null;
  children: ReactNode;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLAnchorElement>(null);
  const closeHref = stageHref(level, null, choice);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.location.assign(closeHref);
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [closeHref]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-4">
      <a href={closeHref} aria-label="关闭弹层" className="absolute inset-0 bg-ink/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col border border-rule bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <header className="flex items-center justify-between border-b border-rule px-4 py-3">
          <h2 id={titleId} className="font-display text-xl text-ink">
            {title}
          </h2>
          <a
            ref={closeRef}
            href={closeHref}
            aria-label="关闭"
            className="grid size-11 place-items-center text-ink"
          >
            <X className="size-5" />
          </a>
        </header>
        <div className="max-h-[70dvh] overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

function VideoPlayer({
  durationSec,
  captions,
  videoSrc,
  danmaku,
  mine,
}: {
  durationSec: number;
  captions: string[];
  videoSrc?: string;
  danmaku: string[];
  mine?: string;
}) {
  if (videoSrc) return <FilePlayer src={videoSrc} captions={captions} danmaku={danmaku} mine={mine} />;
  return <PlaceholderPlayer durationSec={durationSec} captions={captions} danmaku={danmaku} mine={mine} />;
}

function Danmaku({ lines, playing, mine }: { lines: string[]; playing: boolean; mine?: string }) {
  const posted = mine?.trim() ?? "";
  const items = lines.map((line) => line.trim()).filter((line) => line.length >= 2);
  if (items.length === 0 && !posted) return null;
  return (
    <div className={"danmaku-layer" + (playing ? " is-playing" : "")} aria-hidden="true">
      {items.map((text, index) => (
        <span
          key={`${index}-${text}`}
          className="danmaku-item absolute top-0 px-2 text-sm font-medium whitespace-nowrap text-surface"
          style={{
            marginTop: `${4 + (index % 6) * 14}%`,
            animationDelay: `${-index * 0.85}s`,
          }}
        >
          {text}
        </span>
      ))}
      {posted ? (
        <span
          className="danmaku-item absolute top-0 border-2 border-white bg-ink/75 px-2 py-0.5 text-sm font-medium whitespace-nowrap text-surface"
          style={{ marginTop: "18%", animationDelay: "0s" }}
        >
          {posted}
        </span>
      ) : null}
      {posted && !playing ? (
        <p className="absolute top-10 right-3 left-3 border-2 border-white bg-ink/80 px-2 py-1 text-sm leading-snug text-surface">
          {posted}
        </p>
      ) : null}
    </div>
  );
}

function FollowPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialSrc = src.replace(/^\//, "");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    markInline(v);
    const next = resolveMedia(src);
    const actual = new URL(v.currentSrc || v.src || next, window.location.href).pathname;
    const wanted = new URL(next, window.location.href).pathname;
    if (actual !== wanted) v.src = next;
    const start = () => {
      const job = v.play();
      if (job && typeof job.catch === "function") {
        job.catch(() => {
          v.muted = true;
          void v.play().catch(() => {});
        });
      }
    };
    if (v.readyState >= 2) start();
    else v.addEventListener("loadeddata", start, { once: true });
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={initialSrc}
      controls
      autoPlay
      playsInline
      preload="auto"
      className="mx-auto mb-4 aspect-[9/16] w-full max-w-xs bg-ink object-contain"
    />
  );
}

function markInline(video: HTMLVideoElement) {
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x5-playsinline", "");
  video.setAttribute("x5-video-player-type", "h5");
  video.setAttribute("x5-video-player-fullscreen", "false");
}

function resolveMedia(src: string): string {
  const file = src.replace(/^\//, "");
  if (typeof window === "undefined") return file;
  const prefix = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+/i.exec(window.location.pathname)?.[0];
  return prefix ? `${prefix}/${file}` : `/${file}`;
}

function FilePlayer({
  src,
  captions,
  danmaku,
  mine,
}: {
  src: string;
  captions: string[];
  danmaku: string[];
  mine?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);
  const lines = captions.map((line) => line.trim()).filter(Boolean);
  const toggleRef = useRef<() => void>(() => {});
  const initialSrc = src.replace(/^\//, "");

  toggleRef.current = () => {
    const v = videoRef.current;
    if (!v) return;
    const ended = v.ended || (Number.isFinite(v.duration) && v.duration > 0 && v.currentTime >= v.duration - 0.05 && v.paused);
    if (ended) v.currentTime = 0;
    if (ended || v.paused) {
      const job = v.play();
      if (job && typeof job.catch === "function") job.catch(() => setBroken(true));
      return;
    }
    v.pause();
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    markInline(v);
    const next = resolveMedia(src);
    const actual = new URL(v.currentSrc || v.src || next, window.location.href).pathname;
    const wanted = new URL(next, window.location.href).pathname;
    if (actual !== wanted) v.src = next;
  }, [src]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      if (document.querySelector("[role='dialog']")) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;
      event.preventDefault();
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function commit(next: number) {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.min(v.duration, Math.max(0, next));
  }

  function replay() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    const job = v.play();
    if (job && typeof job.catch === "function") job.catch(() => setBroken(true));
  }

  function seek(event: PointerEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width <= 0 ? 0 : (event.clientX - rect.left) / rect.width;
    commit(ratio * v.duration);
  }

  const ended = duration > 0 && !playing && time >= duration - 0.05;
  const atStart = time < 0.05 && !playing;
  const status = ended ? "已结束" : playing ? "播放中" : atStart ? "未播放" : "已暂停";
  const lineIndex =
    lines.length === 0 || duration <= 0
      ? -1
      : Math.min(lines.length - 1, Math.floor((time / duration) * lines.length));
  const line = lineIndex >= 0 ? lines[lineIndex] : "";
  const ratio = duration <= 0 ? 0 : time / duration;

  return (
    <div className="mx-auto w-fit max-w-full border border-rule bg-surface">
      <div className="player-frame relative bg-ink">
        <video
          ref={videoRef}
          src={initialSrc}
          controls
          playsInline
          preload="auto"
          className="bg-ink object-contain"
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration || 0);
            setBroken(false);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => setBroken(true)}
        />
        <Danmaku lines={danmaku} playing={playing} mine={mine} />
        {broken ? (
          <p className="absolute inset-x-3 bottom-3 text-center text-sm text-surface">视频没有加载上</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => toggleRef.current()}
        className="flex h-12 w-full items-center justify-center bg-seal text-base text-surface"
      >
        {playing ? "暂停" : ended ? "重播" : "播放"}
      </button>
      <div className="flex items-center gap-1 px-2 py-1">
        <button
          type="button"
          onClick={() => toggleRef.current()}
          aria-label={playing ? "暂停" : ended ? "重播" : "播放"}
          className="grid size-11 shrink-0 place-items-center text-ink"
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>
        <div
          role="slider"
          tabIndex={0}
          aria-label="播放进度"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
          className="relative flex h-11 min-w-0 flex-1 cursor-pointer touch-none items-center"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            seek(event);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            seek(event);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") commit(time + 5);
            if (event.key === "ArrowLeft") commit(time - 5);
          }}
        >
          <span className="relative h-1 w-full bg-rule">
            <span className="absolute inset-y-0 left-0 bg-seal" style={{ width: `${ratio * 100}%` }} />
          </span>
        </div>
        <p className="shrink-0 px-1 text-right text-xs text-mute tabular-nums">
          {formatTime(time)}/{formatTime(duration)}
        </p>
        <button
          type="button"
          onClick={replay}
          aria-label="重播"
          className="grid size-11 shrink-0 place-items-center text-ink"
        >
          <RotateCcw className="size-5" />
        </button>
      </div>
    </div>
  );
}

function PlaceholderPlayer({
  durationSec,
  captions,
  danmaku,
  mine,
}: {
  durationSec: number;
  captions: string[];
  danmaku: string[];
  mine?: string;
}) {
  const duration = Math.max(1, durationSec);
  const lines = captions.map((line) => line.trim()).filter(Boolean);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeRef = useRef(0);
  const playingRef = useRef(false);
  const durationRef = useRef(duration);
  durationRef.current = duration;

  const toggleRef = useRef<() => void>(() => {});
  toggleRef.current = () => {
    if (timeRef.current >= durationRef.current - 0.05) {
      timeRef.current = 0;
      setTime(0);
      playingRef.current = true;
      setPlaying(true);
      return;
    }
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  };

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (playingRef.current) {
        const next = timeRef.current + dt;
        if (next >= durationRef.current) {
          timeRef.current = durationRef.current;
          playingRef.current = false;
          setTime(durationRef.current);
          setPlaying(false);
        } else {
          timeRef.current = next;
          setTime(next);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      if (document.querySelector("[role='dialog']")) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, select")) return;
      event.preventDefault();
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function commit(next: number) {
    const clamped = Math.min(duration, Math.max(0, next));
    timeRef.current = clamped;
    setTime(clamped);
    if (clamped >= duration - 0.05) {
      playingRef.current = false;
      setPlaying(false);
    }
  }

  function replay() {
    timeRef.current = 0;
    setTime(0);
    playingRef.current = true;
    setPlaying(true);
  }

  function seek(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width <= 0 ? 0 : (event.clientX - rect.left) / rect.width;
    commit(ratio * duration);
  }

  const ended = !playing && time >= duration - 0.05;
  const atStart = time < 0.05 && !playing;
  const status = ended ? "已结束" : playing ? "播放中" : atStart ? "未播放" : "已暂停";
  const lineIndex =
    lines.length === 0 ? -1 : Math.min(lines.length - 1, Math.floor((time / duration) * lines.length));
  const line = lineIndex >= 0 ? lines[lineIndex] : "";
  const ratio = duration === 0 ? 0 : time / duration;

  return (
    <div className="border border-rule bg-surface">
      <div className="relative aspect-video bg-ink">
        <p className="pointer-events-none absolute top-3 left-3 text-xs text-surface/80">{status}</p>
        {line ? (
          <p className="pointer-events-none absolute right-4 bottom-4 left-4 text-sm leading-relaxed text-surface">
            {line}
          </p>
        ) : (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="mx-auto grid size-16 place-items-center border-2 border-seal font-display text-2xl text-seal">
                留
              </div>
              <p className="mt-3 text-sm text-surface/80">画面留白</p>
            </div>
          </div>
        )}
        {!playing ? (
          <button
            type="button"
            onClick={ended ? replay : () => toggleRef.current()}
            aria-label={ended ? "重播" : "播放"}
            className="absolute inset-0 grid place-items-center"
          >
            <span className="grid size-16 place-items-center bg-seal text-surface">
              {ended ? <RotateCcw className="size-6" /> : <Play className="size-6" />}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toggleRef.current()}
            aria-label="暂停"
            className="absolute inset-0"
          />
        )}
        <Danmaku lines={danmaku} playing={playing} mine={mine} />
      </div>
      <div className="flex items-center gap-1 px-2 py-1">
        <button
          type="button"
          onClick={() => toggleRef.current()}
          aria-label={playing ? "暂停" : ended ? "重播" : "播放"}
          className="grid size-11 shrink-0 place-items-center text-ink"
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>
        <div
          role="slider"
          tabIndex={0}
          aria-label="播放进度"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
          className="relative flex h-11 min-w-0 flex-1 cursor-pointer touch-none items-center"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            seek(event);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            seek(event);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") commit(timeRef.current + 5);
            if (event.key === "ArrowLeft") commit(timeRef.current - 5);
          }}
        >
          <span className="relative h-1 w-full bg-rule">
            <span className="absolute inset-y-0 left-0 bg-seal" style={{ width: `${ratio * 100}%` }} />
          </span>
        </div>
        <p className="shrink-0 px-1 text-right text-xs text-mute tabular-nums">
          {formatTime(time)}/{formatTime(duration)}
        </p>
        <button
          type="button"
          onClick={replay}
          aria-label="重播"
          className="grid size-11 shrink-0 place-items-center text-ink"
        >
          <RotateCcw className="size-5" />
        </button>
      </div>
    </div>
  );
}

function TitleScreen() {
  return (
    <main className="flex min-h-dvh flex-col bg-paper text-ink">
      <div className="h-1 bg-seal" />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-between px-5 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <p className="text-sm text-mute">闯关演示</p>
        <div>
          <div className="mb-6 grid size-14 place-items-center border-2 border-seal font-display text-2xl text-seal">
            键
          </div>
          <h1 className="font-display text-[2rem] leading-tight text-ink sm:text-5xl">键盘侠模拟器</h1>
          <p className="mt-4 text-base leading-relaxed text-mute">
            一部视频，两个按钮，一次选择。
          </p>
          <a
            href={stageHref(0)}
            className="mt-8 flex h-14 w-full items-center justify-center bg-seal text-base text-surface"
          >
            开始
          </a>
        </div>
        <p className="mt-10 text-sm leading-relaxed text-mute">
          没写明的标题、画面、总结、评论和后续都先留白，之后可以直接补上。
        </p>
      </div>
    </main>
  );
}

function NoteCard({ text }: { text: string }) {
  return (
    <article className="border border-rule bg-surface">
      <header className="flex items-center gap-3 px-4 py-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-seal text-base text-surface">某</div>
        <div className="min-w-0 flex-1">
          <p className="text-base text-ink">某用户</p>
          <p className="text-xs text-mute">笔记</p>
        </div>
        <span className="inline-flex h-8 items-center border border-seal px-3 text-sm text-seal">关注</span>
      </header>
      <p className="px-4 pb-4 text-base leading-relaxed whitespace-pre-wrap text-ink">{text}</p>
      <div className="flex gap-5 border-t border-rule px-4 py-3 text-sm text-mute">
        <span>赞</span>
        <span>收藏</span>
        <span>评论</span>
      </div>
    </article>
  );
}

function StageScreen({
  level,
  index,
  total,
  choiceId,
  panel,
}: {
  level: Level;
  index: number;
  total: number;
  choiceId: string | null;
  panel: Panel;
}) {
  const selected = level.comments.find((option) => option.id === choiceId) ?? null;
  const posted = selected && !selected.abstain ? selected.posted?.trim() ?? "" : "";

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="h-1 bg-seal" />
      <header className="mx-auto flex w-full max-w-lg items-start justify-between gap-3 px-4 pt-3 pb-2">
        <div className="min-w-0">
          <p className="font-display text-lg text-ink">键盘侠模拟器</p>
          <p className="mt-1 text-sm text-mute">
            第 {index + 1} 关 / 共 {total} 关
          </p>
        </div>
        <a href="?" className="inline-flex h-11 shrink-0 items-center px-2 text-sm text-mute">
          回到开场
        </a>
      </header>

      <div className="mx-auto w-full max-w-lg px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {level.note?.trim() ? (
          <NoteCard text={level.note} />
        ) : (
          <VideoPlayer
            key={level.id}
            durationSec={level.durationSec}
            captions={level.captions}
            videoSrc={level.videoSrc}
            danmaku={level.danmaku}
            mine={posted}
          />
        )}

        {level.note?.trim() ? null : (
          <>
            <h1 className="mt-4 font-display text-xl leading-snug text-ink sm:text-2xl">
              {level.title.trim() || `第 ${index + 1} 关`}
            </h1>
            {!level.title.trim() ? <p className="mt-1 text-sm text-mute">视频标题留白</p> : null}
          </>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={stageHref(index, "summary", choiceId)}
            className="inline-flex h-12 w-full items-center justify-center border border-ink bg-surface text-base text-ink"
          >
            内容总结
          </a>
          <a
            href={stageHref(index, "comments", choiceId)}
            className="inline-flex h-12 w-full items-center justify-center bg-seal text-base text-surface"
          >
            发表评论
          </a>
        </div>

        {selected ? (
          <p className="mt-4 text-sm leading-relaxed text-mute">
            本关选择
            <span className="mt-1 block text-base text-ink">{optionLabel(selected).text}</span>
          </p>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={stageHref(index, "follow", choiceId)}
          className="flex h-12 w-full items-center justify-center border border-seal bg-surface text-base text-seal"
        >
          查看后续
        </a>
      </div>

      {panel === "summary" ? (
        <Sheet title="内容总结" level={index} choice={choiceId}>
          {level.summary.trim() ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap text-ink">{level.summary}</p>
          ) : (
            <Blank hint={level.note?.trim() ? "这篇笔记的内容总结留白。" : "此视频的内容总结留白。"} />
          )}
        </Sheet>
      ) : null}

      {panel === "comments" ? (
        <Sheet title="发表评论" level={index} choice={choiceId}>
          <ul className="flex flex-col gap-3">
            {level.comments.map((option, optionIndex) => {
              const label = optionLabel(option);
              const active = option.id === choiceId;
              return (
                <li key={option.id}>
                  <a
                    href={stageHref(index, null, option.id)}
                    className={
                      "flex min-h-14 w-full items-center justify-between gap-3 border px-4 py-3 text-left " +
                      (active ? "border-seal" : "border-rule")
                    }
                  >
                    <span>
                      <span className="block text-xs text-seal">{optionKicker(optionIndex)}</span>
                      <span className={"mt-1 block text-base " + (label.blank ? "text-mute" : "text-ink")}>
                        {label.text}
                      </span>
                    </span>
                    {active ? <Check className="size-4 shrink-0 text-seal" /> : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </Sheet>
      ) : null}

      {panel === "outcome" && selected ? (
        <Sheet title="你的选择" level={index} choice={choiceId}>
          <p className="text-base text-ink">{optionLabel(selected).text}</p>
          <div className="mt-4">
            {selected.outcome.trim() ? (
              <p className="text-base leading-relaxed whitespace-pre-wrap text-ink">{selected.outcome}</p>
            ) : (
              <Blank hint="选择之后的反馈留白。" />
            )}
          </div>
        </Sheet>
      ) : null}

      {panel === "follow" ? (
        <Sheet title="后续" level={index} choice={choiceId}>
          {level.followVideo ? <FollowPlayer src={level.followVideo} /> : null}
          {level.followUp.trim() ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap text-ink">{level.followUp}</p>
          ) : (
            <Blank hint={`第 ${index + 1} 关的后续留白。`} />
          )}
          <div className={index === 0 ? "mt-6" : "mt-6 grid grid-cols-2 gap-3"}>
            {index === 0 ? null : (
              <a
                href={stageHref(index - 1)}
                className="inline-flex h-12 items-center justify-center border border-rule text-ink"
              >
                上一关
              </a>
            )}
            {index < total - 1 ? (
              <a
                href={stageHref(index + 1)}
                className="inline-flex h-12 w-full items-center justify-center bg-seal text-surface"
              >
                下一关
              </a>
            ) : (
              <a href="?" className="inline-flex h-12 w-full items-center justify-center bg-seal text-surface">
                回到开场
              </a>
            )}
          </div>
        </Sheet>
      ) : null}
    </main>
  );
}

export function PlayScreen({
  levelIndex,
  panel,
  choiceId,
}: {
  levelIndex: number;
  panel: Panel;
  choiceId: string | null;
}) {
  const index = Math.min(Math.max(levelIndex, 0), Math.max(LEVELS.length - 1, 0));
  const level = LEVELS[index];
  if (!level) {
    return (
      <main className="grid min-h-dvh place-items-center bg-paper px-6 text-ink">
        <p>还没有关卡。</p>
      </main>
    );
  }

  return (
    <StageScreen
      level={level}
      index={index}
      total={LEVELS.length}
      choiceId={choiceId}
      panel={panel}
    />
  );
}

export function HomeScreen() {
  return <TitleScreen />;
}
