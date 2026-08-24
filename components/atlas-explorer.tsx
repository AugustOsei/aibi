"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-110m.json";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";

import type { CountrySummaryView, IndustrySummaryView } from "../src/application/aibi-service";
import { VisualFlow } from "./visual-flow";

type AiLevelId = "standard" | "integrated" | "advanced";

type Selection = {
  country: CountrySummaryView | null;
  industry: IndustrySummaryView | null;
  level: AiLevelId | null;
};

const AI_LEVELS: Array<{ id: AiLevelId; name: string; summary: string }> = [
  { id: "standard", name: "Standard", summary: "Everyday tools" },
  { id: "integrated", name: "Integrated", summary: "Connected systems" },
  { id: "advanced", name: "Advanced", summary: "Human-led automation" },
];

const GEO: Record<string, { lat: number; lon: number; code: string }> = {
  "united-states": { lat: 39, lon: -98, code: "US" },
  "united-kingdom": { lat: 55, lon: -3, code: "UK" },
  canada: { lat: 57, lon: -106, code: "CA" },
  ghana: { lat: 8, lon: -2, code: "GH" },
};

const LAND_CHARS = ["·", "+", "×", "#", "%", "@"];
const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>;
const land = feature(topology, topology.objects.land) as FeatureCollection<Geometry>;

export function AsciiEarth({ activeSlug, onSelect }: { activeSlug?: string | undefined; onSelect?: ((slug: string) => void) | undefined }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<Array<{ slug: string; x: number; y: number }>>([]);
  const rotationRef = useRef({ longitude: -18, latitude: -10 });
  const velocityRef = useRef({ longitude: 0, latitude: 0 });
  const dragRef = useRef({ active: false, x: 0, y: 0, moved: false });
  const manuallyRotatedRef = useRef(false);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const mask = document.createElement("canvas");
    const maskContext = mask.getContext("2d");
    if (!context || !maskContext) return;
    let frame = 0;
    let lastDraw = 0;
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    manuallyRotatedRef.current = false;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      mask.width = Math.max(1, Math.round(width));
      mask.height = Math.max(1, Math.round(height));
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - lastDraw < 70) return;
      lastDraw = now;
      const activeGeo = activeSlug ? GEO[activeSlug] : undefined;
      if (activeGeo && !manuallyRotatedRef.current && !dragRef.current.active) {
        const target = -activeGeo.lon;
        const difference = ((target - rotationRef.current.longitude + 540) % 360) - 180;
        rotationRef.current.longitude += difference * (reduced ? 1 : .075);
      } else if (!dragRef.current.active && !reduced) {
        rotationRef.current.longitude += velocityRef.current.longitude;
        rotationRef.current.latitude = Math.max(-72, Math.min(72, rotationRef.current.latitude + velocityRef.current.latitude));
        velocityRef.current.longitude *= .94;
        velocityRef.current.latitude *= .94;
        if (!activeGeo && Math.abs(velocityRef.current.longitude) < .02) rotationRef.current.longitude += .16;
      }

      const radius = Math.min(width * .43, height * .43);
      const projection = geoOrthographic().translate([width / 2, height / 2]).scale(radius).clipAngle(90).precision(.5).rotate([rotationRef.current.longitude, rotationRef.current.latitude]);
      const path = geoPath(projection, context);
      const maskPath = geoPath(projection, maskContext);
      context.clearRect(0, 0, width, height);
      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#fff";
      maskContext.beginPath();
      maskPath(land);

      context.beginPath();
      path({ type: "Sphere" });
      context.fillStyle = "rgba(255,255,255,.46)";
      context.fill();
      context.strokeStyle = "rgba(18, 79, 56, .24)";
      context.stroke();
      context.beginPath();
      path(geoGraticule10());
      context.strokeStyle = "rgba(35, 73, 55, .10)";
      context.lineWidth = .7;
      context.stroke();

      const fontSize = Math.max(7, Math.min(9.5, width / 54));
      const stepX = fontSize * .82;
      const stepY = fontSize * 1.06;
      context.font = `600 ${fontSize}px var(--font-mono)`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (let y = height / 2 - radius; y <= height / 2 + radius; y += stepY) {
        for (let x = width / 2 - radius; x <= width / 2 + radius; x += stepX) {
          if (x < 0 || y < 0 || x >= mask.width || y >= mask.height) continue;
          if (!maskContext.isPointInPath(x, y)) continue;
          const inverted = projection.invert?.([x, y]);
          const character = LAND_CHARS[Math.abs(Math.floor(((inverted?.[0] ?? 0) + y) / 23)) % LAND_CHARS.length] ?? "#";
          context.fillStyle = "rgba(17, 74, 50, .8)";
          context.fillText(character, x, y);
        }
      }

      context.beginPath();
      path(land);
      context.strokeStyle = "rgba(16, 78, 53, .4)";
      context.lineWidth = .75;
      context.stroke();

      const visibleCenter: [number, number] = [-rotationRef.current.longitude, -rotationRef.current.latitude];
      const markers: Array<{ slug: string; x: number; y: number }> = [];
      Object.entries(GEO).forEach(([slug, geo]) => {
        if (geoDistance([geo.lon, geo.lat], visibleCenter) >= Math.PI / 2) return;
        const point = projection([geo.lon, geo.lat]);
        if (!point) return;
        const [x, y] = point;
        markers.push({ slug, x, y });
        const selected = slug === activeSlug;
        context.strokeStyle = selected ? "#0b6b49" : "#e65734";
        context.fillStyle = selected ? "#0b6b49" : "#e65734";
        context.lineWidth = selected ? 2 : 1.2;
        context.beginPath();
        context.arc(x, y, selected ? 9 : 6, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.arc(x, y, selected ? 3.5 : 2.2, 0, Math.PI * 2);
        context.fill();
        context.font = "700 10px var(--font-mono)";
        context.textAlign = "left";
        context.fillText(geo.code, x + 12, y);
        context.textAlign = "center";
      });
      markersRef.current = markers;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [activeSlug]);

  const selectAtPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    const closest = markersRef.current.find((marker) => Math.hypot(marker.x - x, marker.y - y) < 24);
    if (closest) onSelect?.(closest.slug);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { active: true, x: event.clientX, y: event.clientY, moved: false };
    velocityRef.current = { longitude: 0, latitude: 0 };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 2) dragRef.current.moved = true;
    rotationRef.current.longitude += deltaX * .32;
    rotationRef.current.latitude = Math.max(-72, Math.min(72, rotationRef.current.latitude - deltaY * .26));
    velocityRef.current = { longitude: deltaX * .14, latitude: -deltaY * .11 };
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (moved) {
      manuallyRotatedRef.current = true;
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    }
  };

  return (
    <div className="ascii-earth-wrap">
      <canvas
        ref={canvasRef}
        className="ascii-earth"
        aria-label={onSelect ? "Interactive ASCII globe. Drag to rotate or select a highlighted country." : "Interactive ASCII globe. Drag to rotate the view."}
        onClick={(event) => { if (onSelect && !suppressClickRef.current) selectAtPoint(event.clientX, event.clientY); }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      <div className="earth-caption"><span><i /> {onSelect ? "Drag to rotate · click a country" : "Drag to rotate"}</span><b>{activeSlug ? GEO[activeSlug]?.code : "World"}</b></div>
    </div>
  );
}

export function AtlasExplorer({
  countries,
  industries,
}: {
  countries: CountrySummaryView[];
  industries: IndustrySummaryView[];
}) {
  const [selection, setSelection] = useState<Selection>({ country: null, industry: null, level: null });
  const [marketChosen, setMarketChosen] = useState(false);
  const selectCountry = useCallback((slug: string) => {
    const country = countries.find((item) => item.slug === slug);
    if (country) {
      setSelection((current) => ({ ...current, country, industry: null, level: null }));
      setMarketChosen(true);
    }
  }, [countries]);

  const resultHref = selection.industry && selection.level
    ? `/industries/${selection.industry.slug}?${new URLSearchParams({
      ...(selection.country ? { country: selection.country.slug } : {}),
      level: selection.level,
    }).toString()}#ai-uses`
    : null;

  return (
    <div className="journey-page">
      <section className="journey shell" aria-labelledby="journey-heading">
        <header className="journey__intro">
          <div>
            <p className="journey__eyebrow">Artificial Intelligence Business Index</p>
            <h1 id="journey-heading">How can industries use AI today?</h1>
          </div>
          <p>Follow the five steps below. Practical AI uses come first; reported adoption and the gap follow when comparable data exists.</p>
        </header>

        <VisualFlow />

        <div className="journey__workspace">
          <div className="journey__globe">
            <AsciiEarth activeSlug={selection.country?.slug} onSelect={selectCountry} />
            <div className="journey__globe-note" aria-live="polite">
              <span>Country</span>
              <strong>{marketChosen ? selection.country?.name ?? "Global outlook" : "Choose on the globe or in step 1"}</strong>
            </div>
          </div>

          <form className="journey__controls" onSubmit={(event) => event.preventDefault()}>
            <div className="journey__progress" aria-label="Your selection progress">
              <span className={marketChosen ? "is-complete" : "is-current"}>1</span>
              <i className={selection.industry ? "is-complete" : ""} />
              <span className={!marketChosen ? "" : selection.industry ? "is-complete" : "is-current"}>2</span>
              <i className={selection.level ? "is-complete" : ""} />
              <span className={selection.level ? "is-complete" : selection.industry ? "is-current" : ""}>3</span>
            </div>

            <label className="journey-field">
              <span><b>01</b> Country</span>
              <select
                value={marketChosen ? selection.country?.slug ?? "global" : ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setMarketChosen(Boolean(value));
                  setSelection({
                    country: value === "global" ? null : countries.find((country) => country.slug === value) ?? null,
                    industry: null,
                    level: null,
                  });
                }}
              >
                <option value="" disabled>Choose a country</option>
                <option value="global">Global outlook</option>
                {countries.map((country) => <option value={country.slug} key={country.slug}>{country.name}</option>)}
              </select>
            </label>

            <label className={`journey-field${marketChosen ? "" : " is-locked"}`}>
              <span><b>02</b> Industry</span>
              <select
                disabled={!marketChosen}
                value={selection.industry?.slug ?? ""}
                onChange={(event) => {
                  const industry = industries.find((item) => item.slug === event.target.value) ?? null;
                  setSelection((current) => ({ ...current, industry, level: null }));
                }}
              >
                <option value="" disabled>{marketChosen ? "Choose an industry" : "Choose a country first"}</option>
                {industries.map((industry) => <option value={industry.slug} key={industry.slug}>{industry.name}</option>)}
              </select>
            </label>

            <fieldset className={`journey-levels${selection.industry ? "" : " is-locked"}`} disabled={!selection.industry}>
              <legend><b>03</b> AI integration level</legend>
              <div>
                {AI_LEVELS.map((level) => (
                  <button
                    type="button"
                    key={level.id}
                    className={selection.level === level.id ? "is-selected" : ""}
                    aria-pressed={selection.level === level.id}
                    onClick={() => setSelection((current) => ({ ...current, level: level.id }))}
                  >
                    <strong>{level.name}</strong>
                    <small>{level.summary}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className={`journey__result${resultHref ? " is-ready" : ""}`} aria-live="polite">
              {resultHref ? (
                <>
                  <p>
                    <span>{selection.country?.name ?? "Global"}</span>
                    <span>{selection.industry?.name}</span>
                    <span>{AI_LEVELS.find((level) => level.id === selection.level)?.name} AI</span>
                  </p>
                  <Link href={resultHref}>Show what AI can do <b aria-hidden="true">↗</b></Link>
                </>
              ) : (
                <p className="journey__prompt">Complete the three choices to see the AI uses.</p>
              )}
            </div>
          </form>
        </div>

        <p className="journey__footnote">Reported use and the gap appear after the practical AI uses, only when comparable evidence is available.</p>
      </section>
    </div>
  );
}
