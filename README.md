# Deadline Board

A vibrant, simple **notice-board style deadline/reminder dashboard** built with vanilla HTML, CSS and JavaScript.

## What it demonstrates

This project is designed as a UI/UX portfolio piece. It combines a physical notice-board metaphor with a practical digital dashboard.

### Features

- Visual dashboard overview
- Interactive monthly calendar
- Click a calendar date to reveal its deadlines
- Add, edit and delete reminders
- Deadline time and date
- Categories: Study, Work, Personal, Finance, Events
- Color-coded urgency:
  - 🔴 Urgent
  - 🟡 Coming up
  - 🟢 Plenty of time
- Notice-board / list view
- Category and urgency filters
- Quick filters in the sidebar
- Deadline statistics
- Responsive mobile layout
- Lightweight visual graphics
- Browser `localStorage` persistence
- No framework or build step required

## Run it

Open `index.html` in a browser.

Or serve it locally:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## GitHub Pages

Upload the contents to a GitHub repository and enable GitHub Pages from:

**Settings → Pages → Deploy from branch → main / root**

Because the project is plain HTML/CSS/JS, it can be hosted as a static site.

## Design system

The interface uses blue and light-blue as its primary visual language, with a white card system and dark navy typography.

Urgency is intentionally communicated through color:

- Red = immediate attention
- Amber = approaching
- Green = comfortable time remaining

The calendar uses colored dots so users can scan upcoming deadlines without reading every item.

## Data

This is a front-end demonstration. Reminders are saved to the browser using `localStorage`; there is no real account system or server database.

## Project structure

```text
deadline-board/
├── index.html
├── styles.css
├── script.js
├── README.md
├── LICENSE
└── project.json
```

## License

MIT
