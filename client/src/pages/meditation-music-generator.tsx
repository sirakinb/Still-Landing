import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Clipboard,
  Download,
  Music,
  Play,
  RefreshCw,
  Sparkles,
  Timer,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { usePageSEO } from "@/hooks/usePageSEO";

const APP_STORE_URL = "https://apps.apple.com/us/app/still-meditation/id6757083149";

const styles = [
  "Ambient",
  "Nature",
  "Piano",
  "Tibetan bowls",
  "Binaural",
  "Lo-fi",
  "Classical",
  "Custom blend",
];

const goals = [
  "Calm anxiety",
  "Deep focus",
  "Sleep wind-down",
  "Morning clarity",
  "Breathwork",
  "Body scan",
];

const textures = [
  "soft rain",
  "dawn forest",
  "warm tape hiss",
  "distant ocean",
  "low temple resonance",
  "open mountain air",
];

const tempoLabels = ["Very slow", "Slow", "Steady", "Gentle movement"];

function pick<T>(items: T[], index: number) {
  return items[((index % items.length) + items.length) % items.length];
}

function getBrainwave(goal: string) {
  if (goal.includes("Sleep")) return "delta-leaning low frequencies";
  if (goal.includes("Deep focus")) return "alpha and low beta focus tones";
  if (goal.includes("Breathwork")) return "steady theta pulse";
  return "relaxed alpha-theta ambience";
}

function formatPrompt({
  style,
  goal,
  texture,
  duration,
  mood,
  tempo,
  customDetail,
}: {
  style: string;
  goal: string;
  texture: string;
  duration: number;
  mood: string;
  tempo: string;
  customDetail: string;
}) {
  const detail = customDetail.trim()
    ? ` Include this personal detail: ${customDetail.trim()}.`
    : "";

  return `Create a ${duration}-minute ${style.toLowerCase()} meditation music track for ${goal.toLowerCase()}. The mood should feel ${mood.trim() || "grounded, spacious, and calm"}, with ${texture}, ${tempo.toLowerCase()} pacing, ${getBrainwave(goal)}, no harsh transients, no busy melody, and a seamless ending suitable for meditation.${detail}`;
}

function buildSessionPlan(duration: number, goal: string) {
  const intro = Math.max(1, Math.round(duration * 0.15));
  const body = Math.max(1, Math.round(duration * 0.7));
  const outro = Math.max(1, duration - intro - body);

  return [
    `${intro} min: settle into the breath and let the first tones arrive gradually.`,
    `${body} min: hold the main ${goal.toLowerCase()} atmosphere without sudden changes.`,
    `${outro} min: reduce layers slowly and leave a quiet final tail.`,
  ];
}

export default function MeditationMusicGenerator() {
  const [style, setStyle] = useState(styles[0]);
  const [goal, setGoal] = useState(goals[0]);
  const [texture, setTexture] = useState(textures[0]);
  const [duration, setDuration] = useState(10);
  const [tempo, setTempo] = useState(1);
  const [mood, setMood] = useState("safe, spacious, and gently uplifting");
  const [customDetail, setCustomDetail] = useState("");
  const [copied, setCopied] = useState(false);

  usePageSEO({
    title: "Meditation Music Generator | Create a Custom Meditation Prompt",
    description:
      "Use Still's free meditation music generator to create a personalized prompt for AI meditation music, soundscapes, binaural tones, sleep, focus, and mindfulness.",
  });

  const prompt = useMemo(
    () =>
      formatPrompt({
        style,
        goal,
        texture,
        duration,
        mood,
        tempo: tempoLabels[tempo],
        customDetail,
      }),
    [style, goal, texture, duration, mood, tempo, customDetail],
  );

  const sessionPlan = useMemo(() => buildSessionPlan(duration, goal), [duration, goal]);

  const randomize = () => {
    const seed = Date.now();
    setStyle(pick(styles, seed));
    setGoal(pick(goals, seed >> 2));
    setTexture(pick(textures, seed >> 4));
    setDuration(pick([3, 5, 10, 15, 20, 30], seed >> 6));
    setTempo(Math.abs(seed >> 8) % tempoLabels.length);
    setMood(pick([
      "clear, weightless, and steady",
      "warm, protected, and unhurried",
      "deep, spacious, and restorative",
      "bright, quiet, and focused",
    ], seed >> 10));
  };

  const copyPrompt = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadPrompt = () => {
    const blob = new Blob([`${prompt}\n\nSession plan:\n${sessionPlan.join("\n")}\n`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "still-meditation-music-prompt.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex min-h-16 items-center justify-between px-6">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Still
          </a>
          <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="rounded-full">
              <Play className="mr-2 h-4 w-4" />
              Open App
            </Button>
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-border/60 bg-primary text-primary-foreground">
          <div className="container mx-auto grid gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div className="max-w-3xl">
              <Badge className="mb-5 rounded-full bg-white/10 text-white hover:bg-white/10">
                Free SEO Tool
              </Badge>
              <h1 className="text-4xl font-medium leading-tight text-white md:text-6xl">
                Meditation Music Generator
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/75">
                Build a detailed meditation music prompt for sleep, focus, anxiety relief, breathwork, or mindfulness. Use it as a starting point, then create the full custom track in Still.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Primary keyword", "meditation music generator"],
                ["Best for", "AI meditation prompts"],
                ["Next step", "generate music in Still"],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/10 bg-white/10 p-5">
                  <div className="text-xs uppercase tracking-widest text-primary-foreground/55">{label}</div>
                  <div className="mt-2 font-serif text-2xl text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-border/70 shadow-sm">
              <CardContent className="space-y-7 p-6 lg:p-8">
                <div>
                  <h2 className="text-2xl font-semibold text-primary">Customize the soundscape</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Tune the details people usually leave vague: purpose, texture, pacing, duration, and emotional tone.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Style</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStyle(item)}
                        className={`min-h-11 border px-3 text-left text-sm transition-colors ${
                          style === item
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-secondary"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Goal</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {goals.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setGoal(item)}
                        className={`min-h-11 border px-3 text-left text-sm transition-colors ${
                          goal === item
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-secondary"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="texture">Texture</Label>
                    <select
                      id="texture"
                      value={texture}
                      onChange={(event) => setTexture(event.target.value)}
                      className="h-11 w-full border border-input bg-background px-3 text-sm"
                    >
                      {textures.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="duration">Duration: {duration} minutes</Label>
                    <Slider
                      id="duration"
                      min={3}
                      max={30}
                      step={1}
                      value={[duration]}
                      onValueChange={(value) => setDuration(value[0] || 10)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Pacing: {tempoLabels[tempo]}</Label>
                  <Slider
                    min={0}
                    max={tempoLabels.length - 1}
                    step={1}
                    value={[tempo]}
                    onValueChange={(value) => setTempo(value[0] || 0)}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mood">Mood words</Label>
                  <Input
                    id="mood"
                    value={mood}
                    onChange={(event) => setMood(event.target.value)}
                    placeholder="calm, safe, expansive"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="custom-detail">Personal detail</Label>
                  <Textarea
                    id="custom-detail"
                    value={customDetail}
                    onChange={(event) => setCustomDetail(event.target.value)}
                    placeholder="Example: make it feel like a quiet cabin after rainfall."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border-border/70 shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="outline" className="mb-3 rounded-full">
                        Generated prompt
                      </Badge>
                      <h2 className="text-2xl font-semibold text-primary">Your custom meditation music brief</h2>
                    </div>
                    <Button variant="outline" size="icon" onClick={randomize} aria-label="Randomize prompt">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="border border-border bg-secondary/40 p-5 text-base leading-8 text-foreground">
                    {prompt}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button onClick={copyPrompt}>
                      <Clipboard className="mr-2 h-4 w-4" />
                      {copied ? "Copied" : "Copy prompt"}
                    </Button>
                    <Button variant="outline" onClick={downloadPrompt}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  [Music, style],
                  [Timer, `${duration} minutes`],
                  [Waves, getBrainwave(goal)],
                ].map(([Icon, value]) => {
                  const DisplayIcon = Icon as typeof Music;
                  return (
                    <div key={String(value)} className="border border-border bg-card p-5">
                      <DisplayIcon className="mb-4 h-5 w-5 text-primary" />
                      <div className="text-sm leading-6 text-muted-foreground">{String(value)}</div>
                    </div>
                  );
                })}
              </div>

              <Card className="border-border/70 shadow-sm">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="text-2xl font-semibold text-primary">Suggested session structure</h2>
                  <ol className="mt-5 space-y-3">
                    {sessionPlan.map((item) => (
                      <li key={item} className="flex gap-3 text-muted-foreground">
                        <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-secondary/50 py-14">
          <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-primary">Turn this prompt into real meditation music</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Still creates original meditation tracks from your words, saves them to your library, and lets you use them in timed sessions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Download Still
                </Button>
              </a>
              <a href="/">
                <Button size="lg" variant="outline">
                  Visit landing page
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
