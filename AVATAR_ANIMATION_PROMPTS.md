# Avatar Animation Prompts for Nano Banana Pro

## 🎯 Design Direction

**Theme:** Toxic 10x tech-bro interviewer with cyberpunk/glitch aesthetics
**Style:** Dark, intimidating, corporate dystopian
**Color Palette:** Red, black, neon accents (orange, purple, cyan)
**Mood:** Aggressive, judgmental, chaotic

---

## 🎬 Animation States & Prompts

### **State 1: IDLE**
**Description:** Default resting state, subtle breathing/waiting animation
**Duration:** Loop indefinitely

```json
{
  "state": "idle",
  "prompt": "A menacing cyberpunk AI interviewer avatar, corporate tech-bro aesthetic, dark background, subtle floating animation, orange-red neon glow, intimidating eye, minimal movement, breathing effect, dystopian office vibe, 3D rendered, dark mode UI, professional yet aggressive",
  "negative_prompt": "friendly, welcoming, soft, cute, colorful, bright, happy, cartoonish",
  "style": "cyberpunk corporate, dark UI, minimal animation",
  "colors": ["#f88c49", "#1a1a1a", "#27272a"],
  "animation_type": "subtle_float_breathing",
  "loop": true,
  "fps": 30,
  "duration_seconds": 3
}
```

**Alternative Idle Prompt:**
```json
{
  "state": "idle_alt",
  "prompt": "Abstract geometric AI face, corporate tech aesthetic, single glowing orange eye in center, minimal geometric shapes, dark gray background, subtle pulsing glow, modern minimalist, threatening presence, floating particles, depth of field",
  "negative_prompt": "human face, realistic, detailed features, multiple eyes, organic",
  "style": "geometric abstract, minimal corporate",
  "colors": ["#f88c49", "#18181b", "#3f3f46"],
  "animation_type": "gentle_pulse_float",
  "loop": true
}
```

---

### **State 2: JUDGING**
**Description:** Analyzing code, scanning animation, critical stare
**Duration:** While user types code

```json
{
  "state": "judging",
  "prompt": "Cyberpunk AI avatar scanning and analyzing, yellow-orange warning glow, moving scan lines across face, data streams in background, critical judging expression, subtle head tilt back and forth, radar sweep effect, matrix-style code rain, calculating expression",
  "negative_prompt": "approving, friendly, neutral, static, peaceful",
  "style": "scanning HUD overlay, analytical, warning state",
  "colors": ["#eab308", "#fbbf24", "#1a1a1a"],
  "animation_type": "scan_tilt_analysis",
  "effects": ["scan_lines", "data_particles", "head_tilt_loop"],
  "loop": true,
  "fps": 30,
  "duration_seconds": 4
}
```

**Alternative Judging:**
```json
{
  "state": "judging_geometric",
  "prompt": "Geometric AI eye with rotating gimbal rings, yellow warning color, scanning beam sweeping across, technical HUD elements, code fragments floating by, gyroscopic rotation, targeting reticle, security camera aesthetic",
  "negative_prompt": "static, friendly, organic, soft edges",
  "style": "technical HUD, security camera, geometric",
  "colors": ["#eab308", "#fcd34d", "#27272a"],
  "animation_type": "gimbal_rotation_scan",
  "loop": true
}
```

---

### **State 3: LOADING**
**Description:** Processing request, waiting for backend response
**Duration:** 3-10 seconds during API call

```json
{
  "state": "loading",
  "prompt": "AI avatar in deep processing mode, intense purple-magenta glow, spiraling energy around head, loading circle animation, pulsing waves emanating outward, computational thinking, brain synapse firing effects, electricity sparks, power surge aesthetic",
  "negative_prompt": "calm, slow, static, dim, weak",
  "style": "high energy, processing, computational",
  "colors": ["#a855f7", "#c084fc", "#7c3aed"],
  "animation_type": "spiral_pulse_rotate",
  "effects": ["loading_spinner", "energy_waves", "electric_sparks"],
  "loop": true,
  "fps": 30,
  "duration_seconds": 2
}
```

**Alternative Loading:**
```json
{
  "state": "loading_brain",
  "prompt": "Digital brain visualization, purple neural network firing, synaptic connections lighting up in sequence, thought process visualization, loading progress bar integrated into design, data packets flowing through neural pathways",
  "negative_prompt": "organic brain, realistic anatomy, medical",
  "style": "neural network, digital brain, sci-fi",
  "colors": ["#a855f7", "#d8b4fe", "#581c87"],
  "animation_type": "neural_firing_sequence",
  "loop": true
}
```

---

### **State 4: GLITCH_OUT (Roasting)**
**Description:** Aggressive roasting mode, chaotic glitch effects
**Duration:** While audio plays (~5-15 seconds)

```json
{
  "state": "glitch_out",
  "prompt": "Corrupted AI avatar glitching violently, intense red danger glow, digital distortion effects, screen tear artifacts, chromatic aberration, face shaking aggressively, error messages flashing, hostile angry expression, system malfunction aesthetic, RGB split, pixel corruption",
  "negative_prompt": "stable, clean, organized, calm, friendly",
  "style": "glitch art, system error, hostile takeover",
  "colors": ["#ef4444", "#dc2626", "#991b1b"],
  "animation_type": "aggressive_glitch_shake",
  "effects": ["screen_tear", "chromatic_aberration", "rgb_split", "pixel_corruption", "shake_violent"],
  "loop": true,
  "fps": 30,
  "duration_seconds": 1.5,
  "intensity": "high"
}
```

**Alternative Glitch:**
```json
{
  "state": "glitch_matrix",
  "prompt": "AI face fragmenting into digital shards, red alert state, face breaking apart and reassembling, matrix code cascading, system breach effect, hostile takeover, reality distortion, digital breakdown, warning symbols flashing",
  "negative_prompt": "smooth, gentle, organized, peaceful",
  "style": "digital fragmentation, matrix breach",
  "colors": ["#ef4444", "#fca5a5", "#450a0a"],
  "animation_type": "fragment_reassemble_loop",
  "effects": ["face_shatter", "code_rain", "warning_flash"],
  "loop": true
}
```

---

## 🎨 Specific Avatar Concepts

### **Concept A: Geometric Eye**
```json
{
  "concept": "geometric_eye_avatar",
  "base_prompt": "Single large geometric eye in center, minimal abstract face, sharp angular shapes, tech company logo aesthetic, premium dark UI, floating in void, depth particles, corporate intimidation",
  "reference_style": "Apple/Meta corporate design meets Black Mirror",
  "base_colors": {
    "idle": "#f88c49",
    "judging": "#eab308",
    "loading": "#a855f7",
    "glitch_out": "#ef4444"
  },
  "shape_elements": ["circle", "triangle", "hexagon", "ring"],
  "animation_focus": "eye movement, pupil dilation, iris rotation"
}
```

### **Concept B: Glitch Face**
```json
{
  "concept": "glitch_face_avatar",
  "base_prompt": "Stylized humanoid face made of glitch particles, VHS corruption aesthetic, CRT screen static, facial features constantly shifting, digital ghost, tech-bro attitude visualized, sharp jawline, judging expression",
  "reference_style": "Glitch art meets corporate headshot",
  "visual_effects": ["VHS_tracking_errors", "CRT_scanlines", "digital_noise"],
  "animation_focus": "face reconstruction, glitch transitions, expression morphing"
}
```

### **Concept C: Abstract Orb**
```json
{
  "concept": "abstract_orb_avatar",
  "base_prompt": "Sentient glowing orb with consciousness, floating geometric core, energy field surrounding, particle system, intelligent presence, mood indicated by color and intensity, minimal but powerful",
  "reference_style": "Portal 2 cores meets HAL 9000",
  "visual_effects": ["particle_field", "energy_waves", "inner_core_rotation"],
  "animation_focus": "pulsing intensity, color transitions, orbital rings"
}
```

### **Concept D: Code Entity**
```json
{
  "concept": "code_entity_avatar",
  "base_prompt": "Living code structure forming a face, matrix-style green code but recolored, ASCII art that moves and forms expressions, terminal window aesthetic, command-line demon, algorithmic consciousness",
  "reference_style": "Matrix code meets ASCII art portrait",
  "visual_effects": ["code_typing_animation", "terminal_cursor", "syntax_highlighting"],
  "animation_focus": "code rearranging into expressions, typing effects"
}
```

---

## 🎬 Transition Animations

### **Idle → Judging**
```json
{
  "transition": "idle_to_judging",
  "prompt": "Avatar transitioning from calm orange to warning yellow, scan lines appearing, eye focusing and narrowing, analyzing mode activation",
  "duration_seconds": 0.5,
  "easing": "ease-out"
}
```

### **Judging → Loading**
```json
{
  "transition": "judging_to_loading",
  "prompt": "Avatar receiving input, yellow to purple color shift, energy building up, processing power ramping up, intensity increasing",
  "duration_seconds": 0.3,
  "easing": "ease-in-out"
}
```

### **Loading → Glitch_Out**
```json
{
  "transition": "loading_to_glitch",
  "prompt": "Avatar computation complete, explosive energy release, purple to red flash, system overload, glitch effects erupting, hostile takeover",
  "duration_seconds": 0.2,
  "easing": "ease-in",
  "impact": "high"
}
```

### **Glitch_Out → Idle**
```json
{
  "transition": "glitch_to_idle",
  "prompt": "Avatar calming down from rage, red fading to orange, glitches subsiding, system stabilizing, returning to standby",
  "duration_seconds": 1.0,
  "easing": "ease-out"
}
```

---

## 🎨 Technical Specifications

### **General Settings:**
```json
{
  "resolution": "1024x1024",
  "format": "MP4 or WebM with alpha channel",
  "fps": 30,
  "background": "transparent or #0a0a0a",
  "export_settings": {
    "loop": true,
    "compression": "H.264",
    "quality": "high"
  }
}
```

### **Color Palette Reference:**
```json
{
  "colors": {
    "idle": {
      "primary": "#f88c49",
      "secondary": "#fbbf24",
      "glow": "rgba(248,140,73,0.25)"
    },
    "judging": {
      "primary": "#eab308",
      "secondary": "#fcd34d",
      "glow": "rgba(234,179,8,0.35)"
    },
    "loading": {
      "primary": "#a855f7",
      "secondary": "#c084fc",
      "glow": "rgba(168,85,247,0.35)"
    },
    "glitch_out": {
      "primary": "#ef4444",
      "secondary": "#fca5a5",
      "glow": "rgba(239,68,68,0.5)"
    },
    "background": "#0a0a0a",
    "accent": "#18181b"
  }
}
```

---

## 💡 Pro Tips for Nano Banana Pro

1. **Keep it Simple:** Abstract geometric shapes animate better than complex characters
2. **High Contrast:** Dark background + bright neon colors = cyberpunk vibe
3. **Loop Seamlessly:** Make sure start and end frames match
4. **Exaggerate Movement:** Subtle animations get lost - be bold
5. **Color = Emotion:** Use color transitions to signal state changes
6. **Add Particles:** Floating particles add depth and polish
7. **Glitch Effects:** Use displacement, chromatic aberration, RGB split
8. **Test Alpha Channel:** Transparent background for overlay on UI

---

## 🎯 Recommended Workflow

1. Generate **4 separate videos** (one per state)
2. Each should **loop seamlessly**
3. Save as: `ai_idle.mp4`, `ai_judging.mp4`, `ai_loading.mp4`, `ai_glitch_out.mp4`
4. Place in `frontend/public/videos/`
5. Frontend will auto-swap based on state

---

## 📦 File Naming Convention

```
frontend/public/videos/
├── ai_idle.mp4          (Orange, gentle float)
├── ai_judging.mp4       (Yellow, scanning)
├── ai_loading.mp4       (Purple, spinning)
└── ai_glitch_out.mp4    (Red, chaotic glitch)
```

---

**Good luck with the animations! The geometric eye or abstract orb concepts would work best for quick iteration.** 🚀
