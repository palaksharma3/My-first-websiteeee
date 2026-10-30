# Portfolio design system

## Identity

A user-directed charcoal-and-lavender research studio: a curious mind in motion. This replaces the previous blue/pink identity rather than tinting it. Oversized type introduces Palak, and a large mathematical profile connects the visual experience to her real interests and background.

The home page contains the introduction, About, Achievements, a maths notebook preview, a compact project index, CV, and Contact. Projects and Writing are separate, clearly named navigation destinations.

## Palette

- Charcoal `#141316`: the main page and header, deliberately greyish-black rather than blue.
- Soft charcoal `#1b191f` and plum `#211d28`: section and interaction surfaces.
- Warm white `#f4f0f8`: primary text.
- Lavender `#c5a5ff`: primary actions, focus, important links, and mathematical strokes.
- Deeper purple `#a87ee8`: supporting accent.
- Secondary text `#b7afc2`; rules `#39333f`.

Project illustrations, browser icons, the notebook artwork, sharing image, and canvas all belong to this palette. The canvas uses lavender, muted purple, and warm white, not cyan or cobalt.

## Typography and composition

Sora is the self-hosted display face; Archivo is the self-hosted reading face. The owner explicitly requested larger type: the main name reaches 8.5rem (136px), beyond the previous display cap. Headings use a consistent -0.04em tracking floor; reading text has generous line height and bounded measures.

A 1240px maximum container frames a continuous opening stage. The oversized name occupies the left while a full-scale mathematical object, factual orbital labels, and a changing profile story occupy the right. Small screens stack the profile scene beneath the introduction instead of shrinking it into a thumbnail.

Reading and achievement sections are mostly flat, with fine rules instead of repeated dashboard cards. The achievement list displays the owner's exact results and explanatory text. A subtly rotated, original notebook illustration introduces planned mathematical writing. A quiet project index sends visitors to the dedicated collection.

## Informational motion

The Canvas 2D scene draws actual four-coordinate geometry, rotating in the XW, YW, and ZW planes before perspective projection into 3D and then onto the screen. The scene is explicitly labelled as a projection, never literal vision in four spatial dimensions. Its states are selected with labelled buttons:

- The student: a tesseract (16 vertices, 32 edges, 24 square faces), paired with IIT Delhi and learning.
- The builder: a 16-cell (8 vertices, 24 edges), paired with embedded firmware, AXLR8R Racing, and practical systems.
- The explorer: a Clifford torus, correctly described as a two-dimensional surface embedded in 4D space, paired with higher-dimensional geometry, mathematical animation, game theory, and future writing.

The original portrait mypiccc.jpg is shown uncropped at its natural square aspect ratio in the About section. Its colours and contents are not retouched.

Each state changes both geometry and visible biographical information. A polite live region announces the selected story. Stable factual labels remain legible around the scene. The opening name uses one short masked arrival, and labels float gently; there is no scroll hijacking, typing loop, or forced scene transition.

Rendering is bounded to approximately 30fps with a device-pixel-ratio cap. Continuous motion pauses off-screen and in background tabs. A persistent header button pauses motion, and the system reduced-motion preference is respected by default. Manual controls remain usable without continuous animation.

## Navigation, writing, and contact

The mobile menu appears at 760px. Escape closes it and returns focus. Project filters have pressed states and an announced count. Projects are not presented as unavailable live demos: their real source repositories are linked.

The maths notebook starts honestly empty. The writings array in settings.js accepts real notes or papers, each with a title, type, summary, and file/link URL. Adding valid entries populates both the notebook page and home preview; an empty array shows the planned-writing state, not invented publications.

Contact uses the email address explicitly supplied by the owner. Email links open the user's mail application, while Copy email only copies the address and announces success or a manual-copy fallback. YouTube joins LinkedIn, GitHub, X, Instagram, and the public website in the social directory.

The CV remains unavailable until a file is supplied. No private Desktop PDF is included.

## Assets, fallback, and editing

Core biography, achievements, links, and navigation remain readable without JavaScript. The sculpture has a static original illustration. All artwork is original or retained from the owner's previous site; fonts are self-hosted with open-font licenses. There are no analytics, runtime external font requests, API keys, or build dependencies.

- index.html: personal home, achievements, writing preview, CV, and contact.
- projects.html: separate project collection.
- writing.html: maths notes and short papers.
- 404.html: not-found page.
- portfolio.css: current design tokens, typography, and layouts.
- geometry4d.js: four-dimensional models, orthonormal rotations, and projection math; unit-tested independently.
- script.js: profile rendering, content hydration, filters, and contact interactions.
- settings.js: owner-editable public content.
- START-HERE.txt: editing, adding papers and CV, previewing, and publishing.

## Reference observations

Rauno Freiberg (https://rauno.me) informed the attention to expressive interaction and typography; Brittany Chiang (https://brittanychiang.com) informed clear separation of biography, work, and writing; Emil Kowalski (https://emilkowal.ski) informed a simple, readable work-and-writing index. Their content and implementations were not copied. A working address for the requested System of Ashish reference could not be verified.

All changes are local. This redesign does not create a GitHub repository, push commits, alter domain settings, or deploy the site.
