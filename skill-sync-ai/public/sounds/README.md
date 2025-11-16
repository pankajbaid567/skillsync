# Sound Files Placeholder

To get actual sound files, you can:

1. **Free Sources**:
   - https://freesound.org/
   - https://mixkit.co/free-sound-effects/
   - https://pixabay.com/sound-effects/

2. **Recommended Sounds**:
   - `celebrate.mp3` - Light chime or bell sound (celebration)
   - `level-up.mp3` - Achievement/power-up sound
   - `achievement.mp3` - Trophy/success sound
   - `match.mp3` - Pop or notification sound

3. **Search Terms**:
   - "notification chime"
   - "level up sound"
   - "achievement unlock"
   - "success ding"

For now, the celebration system will work without sounds (graceful fallback).
Sounds will play automatically when files are added to this directory.

## Quick Setup:
```bash
# Download free sounds from Mixkit
curl -o public/sounds/celebrate.mp3 "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
curl -o public/sounds/level-up.mp3 "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3"
curl -o public/sounds/achievement.mp3 "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3"
curl -o public/sounds/match.mp3 "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
```
