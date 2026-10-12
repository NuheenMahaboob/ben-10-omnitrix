# Ben 10 Omnitrix

A personal, work-in-progress Omnitrix simulator for a Tizen wearable watch, built with HTML, CSS, and JavaScript.

## Features

- Tap the Omnitrix to open alien selection.
- Rotate the watch bezel to cycle through 10 alien images.
- Tap an alien to play a transformation video and sound.
- Tap the post-transformation screen to start the blinking power-down sequence.
- Tap again when the screen turns red to return home.
- The watch's hardware back button resets the app.

## Project files

- `OmnitrixApp/`: the runnable Tizen app, including all referenced images, sounds, video, icon, configuration, and Tizen project descriptors.
- `preview/index.html`: a desktop preview with controls that simulate the bezel and back button.
- `reference/earlier-drafts/`: original loose HTML, CSS, and JavaScript snapshots. These are development references, not the active app. Despite their original “latest” filenames, their content differs from the packaged project.

## Run the desktop preview

From the repository root, with Python 3 installed:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/preview/`. Tap the watch to open it, use the Previous/Next buttons or arrow keys to select an alien, then tap to transform. Escape or Back / Reset returns to the home screen.

The initial opening sound may be blocked by browser autoplay rules until you interact. The preview uses the original app source; it is not a watch emulator.

## Continue development for Tizen

Import `OmnitrixApp` as an existing project in Tizen Studio with wearable web development support. The existing `.tproject` targets `wearable-6.0`; `config.xml` declares a minimum Tizen version of 5.5 and the wearable profile. Check compatibility with your target watch.

Configure your own local signing profile before building and installing a new widget package. Generated `.wgt` files, signatures, certificates, SDK installations, emulator images, IDE caches, and unrelated installers are intentionally excluded.

## Current validation and follow-up work

The desktop flow was checked through opening, changing aliens, transformation video playback, power-down, and returning home. Installation and hardware behavior on an actual watch have not been verified in this review.

Future work includes handling rejected media playback gracefully, checking reset behavior during video playback, reviewing the broad privileges in `config.xml`, and testing on the intended wearable device.

The media assets are preserved from the original project. No license or ownership claim for third-party characters or media is added by this upload.
