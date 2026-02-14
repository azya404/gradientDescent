# 🎬 Video Avatar Setup Guide

## 🎯 The Pop-Out Effect Explained

Your rectangular video will appear to **emerge from behind** the circular frame, creating a 3D depth effect:

- **Video is 120% size** of the circle (larger than container)
- **Circular border** acts as a "window" the avatar pops through
- **Avatar appears in front** of the top edge, **behind** the bottom edge
- Creates an **illusion of depth** and dimensionality

---

## 📁 File Structure

Place your generated videos here:

```
frontend/
└── public/
    └── videos/
        ├── ai_idle.mp4           (Orange state - calm)
        ├── ai_judging.mp4        (Yellow state - analyzing)
        ├── ai_loading.mp4        (Purple state - processing)
        └── ai_glitch_out.mp4     (Red state - roasting)
```

**Optional:** Also provide WebM versions for better browser compatibility:
```
frontend/
└── public/
    └── videos/
        ├── ai_idle.webm
        ├── ai_judging.webm
        ├── ai_loading.webm
        └── ai_glitch_out.webm
```

---

## 📐 Video Specifications

### **Recommended Settings:**

```json
{
  "resolution": "1080x1920 (vertical/portrait)",
  "aspect_ratio": "9:16 or 4:5 (vertical rectangle)",
  "fps": 30,
  "duration": "2-4 seconds (seamless loop)",
  "format": "MP4 (H.264) or WebM",
  "background": "transparent (if possible) or black #0a0a0a",
  "file_size": "< 5MB per video (for performance)"
}
```

### **Why Vertical/Portrait?**

Since the video is **120% size** and needs to **pop out vertically**, a vertical/portrait format works best:

- ✅ **9:16** (1080x1920) - TikTok/Instagram Reels format
- ✅ **4:5** (1080x1350) - Instagram portrait format
- ✅ **1:1** (1080x1080) - Square also works

**Avoid:** Horizontal/landscape formats (16:9) won't create the pop-out effect.

---

## 🎨 How the Pop-Out Effect Works

```
         Top of circle
              ▲
              │ Avatar appears IN FRONT (z-index: 10)
   ┌──────────┼──────────┐
   │          │          │
   │    ┌─────┴─────┐    │
   │    │  Avatar   │    │ ◄── Video is 120% size
   │    │  (larger) │    │
   │    └─────┬─────┘    │
   │          │          │
   └──────────┼──────────┘
              │ Avatar appears BEHIND (hidden by circle)
              ▼
         Bottom of circle
```

### **CSS Breakdown:**

1. **Circle container**: `w-80 h-80 rounded-full` (320px diameter)
2. **Video size**: `width: 120%, height: 120%` (384px - larger than circle)
3. **Overflow**: `overflow-visible` on video container
4. **Positioning**: Centered with flexbox
5. **Layering**:
   - Background circle: `z-0` (behind)
   - Video: `z-10` (middle - pops through)
   - Circular mask: `z-20` (front border crisp)

---

## 🎬 Step-by-Step Setup

### **Step 1: Create Videos Folder**

```powershell
cd C:\gradientDescent\frontend\public
mkdir videos
```

### **Step 2: Place Your Generated Videos**

Copy your 4 videos from Nano Banana Pro output:

```powershell
# Copy to the videos folder
cp path/to/your/idle_video.mp4 C:\gradientDescent\frontend\public\videos\ai_idle.mp4
cp path/to/your/judging_video.mp4 C:\gradientDescent\frontend\public\videos\ai_judging.mp4
cp path/to/your/loading_video.mp4 C:\gradientDescent\frontend\public\videos\ai_loading.mp4
cp path/to/your/glitch_video.mp4 C:\gradientDescent\frontend\public\videos\ai_glitch_out.mp4
```

### **Step 3: Test in Browser**

1. Make sure frontend is running (`npm run dev`)
2. Visit http://localhost:5173
3. The videos should auto-play and loop
4. Try submitting code to see state transitions

---

## 🎨 Adjusting the Pop-Out Effect

If you want to adjust how much the avatar pops out, edit the video size in `AIAvatar.tsx`:

```typescript
style={{
  width: '120%',  // Increase for MORE pop-out (try 130%, 140%)
  height: '120%', // Decrease for LESS pop-out (try 110%, 100%)
  objectFit: 'contain',
}}
```

### **Size Guide:**

- `100%` - Video exactly fits circle (no pop-out)
- `110%` - Subtle pop-out
- `120%` - Medium pop-out ✅ (current)
- `130%` - Strong pop-out
- `140%` - Very strong pop-out

---

## 🐛 Troubleshooting

### **Videos not showing:**

1. Check file paths: `frontend/public/videos/ai_idle.mp4`
2. Check file names match exactly (case-sensitive)
3. Check browser console (F12) for 404 errors
4. Try hard refresh (Ctrl+Shift+R)

### **Videos not looping:**

- Videos should have `loop` attribute (already added)
- Make sure video files loop seamlessly (start = end frame)

### **Pop-out looks weird:**

- Check video aspect ratio (should be vertical/portrait)
- Adjust `width/height` percentages
- Make sure video is centered on subject

### **Performance issues:**

- Compress videos to < 5MB each
- Use WebM format (better compression)
- Lower FPS to 24 if needed

---

## 🎯 Example Video Cropping

If your Nano Banana Pro output is **1920x1080 (landscape)**, you need to crop it to **vertical**:

### **Using FFmpeg:**

```bash
# Crop center 1080x1920 vertical from landscape video
ffmpeg -i input.mp4 -vf "crop=1080:1920:420:0" -c:v libx264 -crf 23 ai_idle.mp4
```

### **Using Online Tools:**

- **Kapwing.com** - Free online video editor
- **Canva** - Resize video to 1080x1920
- **ClipChamp** - Windows built-in video editor

---

## 📦 Final Checklist

Before launching:

- [ ] 4 videos created (idle, judging, loading, glitch_out)
- [ ] All videos are vertical/portrait format
- [ ] All videos loop seamlessly
- [ ] All videos < 5MB each
- [ ] Files placed in `frontend/public/videos/`
- [ ] Files named correctly (ai_idle.mp4, etc.)
- [ ] Tested in browser at http://localhost:5173
- [ ] Pop-out effect looks good
- [ ] State transitions work smoothly

---

## 🎨 Quick Tips for Nano Banana Pro

1. **Request vertical output**: Specify "1080x1920 portrait orientation"
2. **Loop seamlessly**: Add "seamless loop" to prompt
3. **Centered subject**: Add "character centered, portrait framing"
4. **Keep it simple**: Complex animations may not loop well
5. **Test one first**: Generate idle state first, verify it works, then do the rest

---

**You're all set! The pop-out effect will make your avatar look super dynamic!** 🚀
