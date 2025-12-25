# Mobile Workout Logger

Simple mobile-friendly workout logger that stores data locally in your browser (localStorage). Works well on mobile browsers and desktop.

Usage

1. Open `index.html` on your phone's browser or host the folder with a simple static server.

Quick local server (from the project folder):

```bash
# Python 3
python -m http.server 8000

# then open http://localhost:8000 on your device or in an emulator
```

How it works

- Pick a date with the date picker (defaults to today).
- Add workout entries (exercise, sets, reps, weight, notes).
- Entries are saved locally and visible any time you pick that date later — e.g., log on the 9th and view it on the 13th by selecting the 9th.
- Use the ◀/▶ buttons to navigate by day.

Notes

- Data is stored in browser localStorage under key `workoutLogs_v1`.
- To back up, copy the JSON from `localStorage.getItem('workoutLogs_v1')` in browser devtools.
