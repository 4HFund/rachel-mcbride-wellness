# Rachel McBride Wellness Site Structure

The site is being split into more manageable pieces.

## Current organized files

```text
rachel-mcbride-wellness/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── IMG_4099.jpeg
├── IMG_4100.jpeg
└── reset.html
```

## Goal

Keep `index.html` focused on page content only.

Move all design rules into:

```html
<link rel="stylesheet" href="css/styles.css">
```

Move all interaction code into:

```html
<script src="js/app.js"></script>
```

## Editing guide

- Change page words and section order in `index.html`.
- Change colors, spacing, image sizing, mobile layout, and button styles in `css/styles.css`.
- Change mobile menu, scroll animations, FAQ accordion, and nav shadow behavior in `js/app.js`.

## Next cleanup step

Replace the big inline `<style>...</style>` block in `index.html` with:

```html
<link rel="stylesheet" href="css/styles.css">
```

Replace the big inline `<script>...</script>` block before `</body>` with:

```html
<script src="js/app.js"></script>
```
