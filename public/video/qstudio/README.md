# QStudio video

Drop `.mp4` files here. Reference them as
`${import.meta.env.BASE_URL}video/qstudio/<name>.mp4` — never a bare `/video/...`
path, because the site is served from a sub-path (`/Motion-Website/`) and a
root-relative URL 404s in the build.

Posters go in `public/images/qstudio/` as `<same-name>-poster.jpg`.

## Before you drop a file in

**Check the codec.** HEVC/H.265 in an MP4 will not play in Chrome or Firefox —
it shows a black frame everywhere except Safari, with no error. One of the
Solution device films arrived this way and nearly shipped. Verify, then convert
if needed:

```sh
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height -of csv=p=0 in.mp4
# want: h264,<w>,<h>
```

## Encode profile

Silent looping background film — this is what every other film on the site uses:

```sh
ffmpeg -i in.mp4 -an -c:v libx264 -crf 26 -preset slow -g 60 \
  -pix_fmt yuv420p -movflags +faststart out.mp4
```

- `-an` strips audio: nothing here is ever unmuted, and the track is dead weight.
- `-crf 28` instead of 26 when several clips load in one viewport.
- `-movflags +faststart` puts the index first so playback can begin while the
  rest is still downloading.
- **Crop to the target aspect at encode time**, not with `object-cover` — the
  browser otherwise decodes pixels it immediately throws away. Offset the crop
  ~18% from the top when a person leads the shot, ~10% when a screen does
  (a screen needs its top edge kept).

## Poster

```sh
ffmpeg -ss 2 -i out.mp4 -frames:v 1 -q:v 4 ../../images/qstudio/<name>-poster.jpg
```

Pick a frame that reads at a glance — the poster is what shows until the file
starts, and on a slow connection that is most of the visit.
