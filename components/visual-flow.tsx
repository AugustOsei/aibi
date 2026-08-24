function CountryIllustration() {
  return (
    <svg viewBox="0 0 180 110" aria-hidden="true" focusable="false">
      <circle className="flow-art__wash" cx="90" cy="53" r="40" />
      <circle className="flow-art__line" cx="90" cy="53" r="36" />
      <path className="flow-art__faint" d="M54 53h72M90 17c-13 11-20 23-20 36s7 25 20 36M90 17c13 11 20 23 20 36s-7 25-20 36M61 31c17 8 41 8 58 0M61 75c17-8 41-8 58 0" />
      <path className="flow-art__land" d="M64 31l8-7 13 2 5 7-5 5-10 1-4 7-9-4-3-7 5-4Zm35 8 8-4 11 5 4 9-6 6-7-2-4 6-9-3-2-10 5-7Zm-12 21 8 4 3 10-6 10-7-3-4-9 6-12Z" />
      <path className="flow-art__trace" d="M30 84C54 66 64 37 92 35c23-2 35 15 58 3" />
      <circle className="flow-art__pulse" cx="101" cy="43" r="5" />
      <circle className="flow-art__dot" cx="101" cy="43" r="2" />
    </svg>
  );
}

function IndustryIllustration() {
  return (
    <svg viewBox="0 0 180 110" aria-hidden="true" focusable="false">
      <path className="flow-art__faint" d="M13 91h154" />
      <g className="flow-art__building">
        <path className="flow-art__line" d="M18 88V48h36v40M15 48h42l-5-10H20l-5 10Z" />
        <path className="flow-art__accent" d="M21 50h30" />
        <path className="flow-art__line" d="M28 88V69h16v19" />
      </g>
      <g className="flow-art__building flow-art__building--two">
        <path className="flow-art__line" d="M67 88V31h41v57M72 31v-8h31v8" />
        <path className="flow-art__accent" d="M83 45h10M88 40v10" />
        <path className="flow-art__faint" d="M75 60h8v8h-8m17-8h8v8h-8M75 75h8v8h-8m17-8h8v8h-8" />
      </g>
      <g className="flow-art__building flow-art__building--three">
        <path className="flow-art__line" d="M121 88V55h41v33M118 55h47l-5-12h-37l-5 12Z" />
        <path className="flow-art__faint" d="M128 63h27M128 70h27M128 77h27" />
        <path className="flow-art__accent" d="M142 43V29m0 0 13 8m-13-8-10 7" />
      </g>
      <circle className="flow-art__pulse" cx="88" cy="23" r="4" />
    </svg>
  );
}

function LevelIllustration() {
  return (
    <svg viewBox="0 0 180 110" aria-hidden="true" focusable="false">
      <path className="flow-art__faint" d="M19 91h142" />
      <path className="flow-art__line" d="M25 84h40V68h39V51h39V34h18" />
      <rect className="flow-art__wash" x="28" y="70" width="34" height="11" />
      <rect className="flow-art__wash flow-art__level--two" x="68" y="54" width="33" height="11" />
      <rect className="flow-art__wash flow-art__level--three" x="107" y="37" width="33" height="11" />
      <path className="flow-art__trace" d="M31 75h27m14-16h25m14-17h25" />
      <circle className="flow-art__head" cx="151" cy="50" r="6" />
      <path className="flow-art__line" d="M151 57v18m-9 14 9-14 10 14m-19-22 9 5 10-5" />
      <circle className="flow-art__pulse" cx="137" cy="42" r="4" />
    </svg>
  );
}

function UsesIllustration() {
  return (
    <svg viewBox="0 0 180 110" aria-hidden="true" focusable="false">
      <rect className="flow-art__line" x="49" y="25" width="82" height="61" rx="2" />
      <path className="flow-art__faint" d="M49 40h82M67 40v46M101 40v46M56 33h22" />
      <path className="flow-art__accent" d="M75 68l7-9 7 4 7-13" />
      <path className="flow-art__line" d="M109 55h14M109 63h10M109 71h13" />
      <circle className="flow-art__packet flow-art__packet--one" cx="22" cy="34" r="4" />
      <circle className="flow-art__packet flow-art__packet--two" cx="158" cy="74" r="4" />
      <path className="flow-art__trace" d="M27 34h17c8 0 8 8 8 12M153 74h-17c-8 0-8-8-8-12" />
      <path className="flow-art__faint" d="M37 94h106" />
      <path className="flow-art__line" d="M73 86l-7 8m40-8 8 8" />
    </svg>
  );
}

function GapIllustration() {
  return (
    <svg viewBox="0 0 180 110" aria-hidden="true" focusable="false">
      <path className="flow-art__faint" d="M24 30h132M24 78h132" />
      <rect className="flow-art__track" x="25" y="23" width="130" height="14" rx="7" />
      <rect className="flow-art__bar flow-art__bar--possible" x="25" y="23" width="104" height="14" rx="7" />
      <rect className="flow-art__track" x="25" y="71" width="130" height="14" rx="7" />
      <rect className="flow-art__bar flow-art__bar--actual" x="25" y="71" width="61" height="14" rx="7" />
      <path className="flow-art__gap" d="M88 52h39m-39 0 7-5m-7 5 7 5m32-5-7-5m7 5-7 5" />
      <path className="flow-art__faint" d="M88 40v25m39-25v25" />
      <circle className="flow-art__pulse" cx="127" cy="52" r="4" />
    </svg>
  );
}

const FLOW_STEPS = [
  { number: "01", title: "Choose a country", detail: "Set the regional context.", Illustration: CountryIllustration },
  { number: "02", title: "Choose an industry", detail: "Focus on the work that matters.", Illustration: IndustryIllustration },
  { number: "03", title: "Explore utilization depth", detail: "Standard through advanced uses.", Illustration: LevelIllustration },
  { number: "04", title: "Review observed use", detail: "See credible adoption evidence.", Illustration: UsesIllustration },
  { number: "05", title: "Surface the gap", detail: "Compare only when evidence allows.", Illustration: GapIllustration },
] as const;

export function VisualFlow() {
  return (
    <section className="visual-flow" aria-labelledby="visual-flow-heading">
      <header className="visual-flow__header">
        <p id="visual-flow-heading">How the index works</p>
        <span>Possible AI utilization → observed utilization → gap.</span>
      </header>
      <ol>
        {FLOW_STEPS.map(({ number, title, detail, Illustration }) => (
          <li key={number}>
            <div className="visual-flow__art"><Illustration /></div>
            <div className="visual-flow__copy">
              <span>{number}</span>
              <div><h2>{title}</h2><p>{detail}</p></div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
