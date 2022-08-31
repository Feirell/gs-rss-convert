# gs-stream-reader

Builds a VLC (.pls) playlist from the RSS feed for the GameStar (https://gamestar.de) Podcast.

Install node.js then run 
```bash
node lib/index.js YOUR_RSS_URL FILE_NAME
```

For example like this
```bash
node lib/index.js https://www.gamestar.de/plus/podcast?auth=XXXXXX_username_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX playlist.pls
```

Which results in a playlist file like the following.
You can then open the file with whatever player you would like and use it on mobile or desktop.
The entries title contains its id and the date they were uploaded to make it easier to find the episode you are looking for.

```ini
[playlist]
NumberOfEntries=454

Title1=#001 18.02.17 Warum Entwickler lügen
File1=https://ads.julephosting.de/podcasts/126-gamestar-podcast/9625-warum-entwickler-luegen.mp3

Title2=#002 25.02.17 Der perfekte Spiele-Anfang
File2=https://ads.julephosting.de/podcasts/126-gamestar-podcast/9624-der-perfekte-spiele-anfang.mp3

Title3=#003 04.03.17 (Plus) Mikrotransaktionen sind nicht böse, nur gefährlich
File3=https://cdn.julephosting.de/podcasts/126-gamestar-podcast/9623-plus-mikrotransaktionen-sind-nicht-boese-nur-gefaehrlich.mp3

Title4=#004 11.03.17 Kritiker vs. Fans - Wer hat recht?
File4=https://ads.julephosting.de/podcasts/126-gamestar-podcast/9622-kritiker-vs-fans-wer-hat-recht.mp3

Title5=#005 18.03.17 (Plus) Open World - Fluch oder Segen?
File5=https://cdn.julephosting.de/podcasts/126-gamestar-podcast/9621-plus-open-world-fluch-oder-segen.mp3

[...]
```

## development

Just install node.js (version 16) clone this repo, navigate into it and execute `yarn`.
This should install the dependencies, then you can open the index.ts in the src directory and manipulate it to your liking.

Compile it afterwards via `yarn run build`.
