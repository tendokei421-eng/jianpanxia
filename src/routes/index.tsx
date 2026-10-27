import { createFileRoute } from "@tanstack/react-router";
import { ClosingScreen, HomeScreen, PlayScreen } from "@/components/simulator";

const PANELS = ["summary", "comments", "outcome", "follow"] as const;

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    const result: {
      view?: "play" | "close";
      level?: number;
      panel?: (typeof PANELS)[number];
      choice?: string;
    } = {};
    if (search.view === "play" || search.view === "close") result.view = search.view;
    const levelRaw = Number(search.level);
    if (Number.isInteger(levelRaw) && levelRaw >= 0) result.level = levelRaw;
    const panel = PANELS.find((item) => item === search.panel);
    if (panel) result.panel = panel;
    if (typeof search.choice === "string" && search.choice.length > 0) result.choice = search.choice;
    return result;
  },
  component: function Home() {
    const search = Route.useSearch();
    if (search.view === "close") return <ClosingScreen />;
    if (search.view !== "play") return <HomeScreen />;
    return (
      <PlayScreen
        levelIndex={search.level ?? 0}
        panel={search.panel ?? null}
        choiceId={search.choice ?? null}
      />
    );
  },
});
