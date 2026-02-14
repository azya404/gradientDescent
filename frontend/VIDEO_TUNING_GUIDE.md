# 🎨 Video Crop & Resize Tuning Guide

## 🎯 Problem Solved

Your videos are now **fully configurable** with individual crop, zoom, and position settings for each state!

---

## ⚙️ Configuration Settings

Each video state has 3 tuning parameters in `AIAvatar.tsx`:

### **1. `videoScale`** - Overall Size
Controls how much bigger the video is than the circle container.

```typescript
videoScale: 1.5  // 150% - video extends beyond circle
```

**Values:**
- `1.0` = 100% (video exactly fits circle - no pop-out)
- `1.2` = 120% (small pop-out)
- `1.5` = 150% (medium pop-out) ✅ **Current default**
- `1.8` = 180% (large pop-out)
- `2.0` = 200% (maximum pop-out)

**Effect:** Larger values = more dramatic pop-out effect

---

### **2. `videoZoom`** - Crop Zoom
Additional zoom/crop applied to the video content itself.

```typescript
videoZoom: 1.2  // 120% - zooms in 20% (crops edges)
```

**Values:**
- `1.0` = No zoom (show full video)
- `1.2` = 20% zoom in ✅ **Current default**
- `1.5` = 50% zoom in (tight crop on center)
- `2.0` = 100% zoom in (very tight crop)

**Effect:** Larger values = more cropped, focus on center

---

### **3. `videoPosition`** - Content Position
CSS `object-position` - controls which part of the video is centered.

```typescript
videoPosition: 'center center'  // Center both horizontally & vertically
```

**Common Values:**
- `'center center'` ✅ **Default** - Center the subject
- `'center top'` - Center horizontally, show top of video
- `'center bottom'` - Center horizontally, show bottom
- `'left center'` - Show left side
- `'right center'` - Show right side
- `'50% 30%'` - Custom percentages (50% x, 30% y from top-left)

**Effect:** Adjusts which part of video shows through the circle

---

## 🎬 Current Configuration

Located in `frontend/src/components/AIAvatar.tsx`:

```typescript
const AVATAR_CONFIG = {
  idle: {
    videoScale: 1.5,         // 150% size
    videoZoom: 1.2,          // 20% zoom
    videoPosition: 'center center'
  },
  judging: {
    videoScale: 1.5,
    videoZoom: 1.2,
    videoPosition: 'center center'
  },
  glitch_out: {
    videoScale: 1.5,
    videoZoom: 1.3,          // 30% zoom for intensity
    videoPosition: 'center center'
  },
  loading: {
    videoScale: 1.5,
    videoZoom: 1.2,
    videoPosition: 'center center'
  },
};
```

---

## 🔧 How to Tune Each Video

### **Example: Fix "idle" video if face is cut off**

**Problem:** Face is cropped at the top

**Solution 1:** Reduce zoom
```typescript
idle: {
  videoZoom: 1.0,  // Show more of the video (less crop)
}
```

**Solution 2:** Shift position up
```typescript
idle: {
  videoPosition: 'center 30%',  // Show more from top
}
```

**Solution 3:** Reduce overall scale
```typescript
idle: {
  videoScale: 1.3,  // Smaller pop-out
}
```

---

### **Example: Make "glitch_out" more intense**

**Goal:** Make the glitch video feel more aggressive

```typescript
glitch_out: {
  videoScale: 1.8,   // Bigger pop-out (more dramatic)
  videoZoom: 1.5,    // Tighter crop (more intense)
  videoPosition: 'center center'
}
```

---

### **Example: If video subject is off-center**

**Problem:** The character/face in the video is positioned to the left

```typescript
idle: {
  videoPosition: '60% center',  // Shift right (show more of left side)
}
```

**OR**

```typescript
idle: {
  videoPosition: 'left center',  // Focus on left side of video
}
```

---

## 📋 Quick Tuning Workflow

1. **Run the frontend** (npm run dev)
2. **Open browser** at http://localhost:5173
3. **Open AIAvatar.tsx** in your editor
4. **Edit the config** for the state you want to fix
5. **Save the file** (Vite hot-reloads automatically)
6. **Check the browser** (should update immediately)
7. **Repeat** until it looks good

---

## 🎨 Common Fixes

### **Face is cut off at top:**
```typescript
videoPosition: 'center 20%'  // Show more from top
```

### **Face is cut off at bottom:**
```typescript
videoPosition: 'center 80%'  // Show more from bottom
```

### **Too much dead space around character:**
```typescript
videoZoom: 1.5  // Zoom in more
```

### **Character is too cropped/tight:**
```typescript
videoZoom: 1.0  // Zoom out (show more)
```

### **Pop-out effect too subtle:**
```typescript
videoScale: 2.0  // Increase pop-out
```

### **Pop-out effect too aggressive:**
```typescript
videoScale: 1.2  // Reduce pop-out
```

### **Video looks stretched/squished:**
```typescript
// In the video style section, change:
objectFit: 'cover'  // ✅ Crops to fit (recommended)
// OR
objectFit: 'contain'  // Shows entire video (may have black bars)
```

---

## 🎯 Per-State Recommendations

### **IDLE (Orange - Calm)**
- Moderate scale (1.5)
- Gentle zoom (1.1-1.2)
- Centered position

```typescript
idle: {
  videoScale: 1.5,
  videoZoom: 1.2,
  videoPosition: 'center center'
}
```

### **JUDGING (Yellow - Analyzing)**
- Same as idle (consistent look)
- Could shift slightly for "looking" effect

```typescript
judging: {
  videoScale: 1.5,
  videoZoom: 1.2,
  videoPosition: 'center center'  // Or '55% center' for slight shift
}
```

### **LOADING (Purple - Processing)**
- Could be slightly larger (more active)
- Moderate zoom

```typescript
loading: {
  videoScale: 1.6,
  videoZoom: 1.2,
  videoPosition: 'center center'
}
```

### **GLITCH_OUT (Red - Roasting)**
- MAXIMUM impact (largest scale)
- Tightest crop (most intense)
- Could shake with position changes

```typescript
glitch_out: {
  videoScale: 1.8,   // Very large pop-out
  videoZoom: 1.4,    // Very tight crop
  videoPosition: 'center center'
}
```

---

## 🐛 Troubleshooting

### **Video looks weird/distorted:**
- Check aspect ratio of source video (should be vertical/portrait)
- Try changing `objectFit` from 'cover' to 'contain'

### **Video doesn't fill circle:**
- Increase `videoScale` (try 1.8 or 2.0)
- Increase `videoZoom` (try 1.5)

### **Can't see the avatar's face:**
- Reduce `videoZoom` to 1.0
- Adjust `videoPosition` (try 'center 30%' or 'center 40%')

### **Too much background visible:**
- Increase `videoZoom` to crop tighter
- Check if video has too much padding/empty space

### **Changes not appearing:**
- Make sure you saved the file
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R)

---

## 💡 Pro Tips

1. **Start with one state** (idle) and get it perfect
2. **Copy those settings** to other states as a baseline
3. **Fine-tune each state** individually
4. **Use different zoom levels** to create visual variety between states
5. **Test state transitions** to ensure they flow smoothly
6. **Keep notes** of what settings work for your specific videos

---

## 🎬 Example: If Your Videos Are Landscape (16:9)

If your videos are landscape instead of portrait, use these settings:

```typescript
idle: {
  videoScale: 2.0,    // Much larger to crop into square
  videoZoom: 1.5,     // Heavy crop to focus on center
  videoPosition: 'center center'
}
```

This will "crop" a square section from the center of your landscape video.

---

## ✅ Final Checklist

- [ ] Idle video looks good and centered
- [ ] Judging video looks good (similar to idle)
- [ ] Loading video looks good
- [ ] Glitch_out video looks intense and dramatic
- [ ] Pop-out effect is visible but not too aggressive
- [ ] Faces/characters are not cut off
- [ ] No weird stretching or distortion
- [ ] Transitions between states look smooth
- [ ] All videos loop seamlessly

---

**Your videos should now look polished and professional! Adjust the config values until each state looks perfect.** 🚀
