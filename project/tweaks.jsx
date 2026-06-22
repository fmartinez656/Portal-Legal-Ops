// ===========================================================================
// TWEAKS — Panel de ajustes del Portal Legal Ternova
// Controla tema, color de acento, tipografía de titulares, densidad y radios,
// aplicándolos a las variables CSS del documento.
// ===========================================================================
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#FF8000",
  "headFont": "Hanken Grotesk",
  "density": "default",
  "radius": 12,
  "heroTitle": "Bienvenido al portal legal."
}/*EDITMODE-END*/;

const ACCENTS = ['#FF8000', '#E8730A', '#5B2A86', '#1B5E96', '#1F7A4D'];
const HEAD_FONTS = ['Hanken Grotesk', 'Public Sans', 'Fraunces', 'Libre Franklin', 'Space Grotesk'];

// Inyecta @import de los fonts de titular alternativos bajo demanda
function ensureFont(family) {
  if (family === 'Hanken Grotesk' || family === 'Public Sans') return;
  const id = 'twkfont-' + family.replace(/\s+/g, '');
  if (document.getElementById(id)) return;
  const l = document.createElement('link');
  l.id = id; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=' + family.replace(/\s+/g, '+') + ':wght@400;500;600;700&display=swap';
  document.head.appendChild(l);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const root = document.documentElement;

  useEffect(() => { root.setAttribute('data-theme', t.theme); }, [t.theme]);
  useEffect(() => {
    root.style.setProperty('--accent', t.accent);
    // derivar tono de texto del acento (un poco más oscuro)
    root.style.setProperty('--accent-2', t.accent);
  }, [t.accent]);
  useEffect(() => {
    ensureFont(t.headFont);
    root.style.setProperty('--serif', `'${t.headFont}', 'Public Sans', system-ui, sans-serif`);
  }, [t.headFont]);
  useEffect(() => { root.setAttribute('data-density', t.density); }, [t.density]);
  useEffect(() => {
    const r = t.radius;
    root.style.setProperty('--r-sm', Math.max(2, r - 4) + 'px');
    root.style.setProperty('--r-md', r + 'px');
    root.style.setProperty('--r-lg', (r + 4) + 'px');
    root.style.setProperty('--r-xl', (r + 10) + 'px');
  }, [t.radius]);
  useEffect(() => {
    const el = document.querySelector('#v-home .ptitle');
    if (el) {
      const txt = t.heroTitle || '';
      const words = txt.split(' ');
      if (words.length > 1) {
        const last = words.pop().replace(/\.$/, '');
        el.innerHTML = words.join(' ') + ' <em>' + last + '</em>.';
      } else { el.textContent = txt; }
    }
  }, [t.heroTitle]);

  return (
    <TweaksPanel title="Ajustes">
      <TweakSection label="Apariencia" />
      <TweakRadio label="Tema" value={t.theme} options={['light', 'dark']}
        onChange={(v) => setTweak('theme', v)} />
      <TweakColor label="Color de acento" value={t.accent} options={ACCENTS}
        onChange={(v) => setTweak('accent', v)} />
      <TweakSelect label="Tipografía de titulares" value={t.headFont} options={HEAD_FONTS}
        onChange={(v) => setTweak('headFont', v)} />

      <TweakSection label="Espaciado" />
      <TweakRadio label="Densidad" value={t.density} options={['compact', 'default', 'comfy']}
        onChange={(v) => setTweak('density', v)} />
      <TweakSlider label="Radio de bordes" value={t.radius} min={4} max={22} step={2} unit="px"
        onChange={(v) => setTweak('radius', v)} />

      <TweakSection label="Contenido" />
      <TweakText label="Título de inicio" value={t.heroTitle}
        onChange={(v) => setTweak('heroTitle', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
