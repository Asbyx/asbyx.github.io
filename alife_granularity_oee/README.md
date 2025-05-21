# Alife Granularity & OEE Presentation Website

This static website is designed to support a presentation on Artificial Life, focusing on component granularity and its relation to Open-Ended Evolution (OEE).

The website is structured to be hosted on GitHub Pages, for example, at `your-username.github.io/alife_granularity_oee/` (if the repository is named `alife_granularity_oee`).

## Structure

- `index.html`: The main landing page. It introduces the topic and provides navigation to the three main sections of the presentation.
- `css/`: Contains the stylesheets.
  - `main.css`: Global styles for the entire website, including the design for the home page and the group-specific pages.
- `js/`: Contains JavaScript files.
  - `main.js`: Scripts for the `index.html` page (e.g., interactive animations).
  - `group-navigation.js`: Handles the full-page scroll navigation (mouse wheel, arrow keys, touch swipe) for the individual group pages.
  - `simulations/`: Contains placeholder JavaScript files for the interactive simulations mentioned in the presentation.
    - `flappy_ai.js`
    - `acrobats.js`
    - `gol.js`
    - `lenia.js`
- `pages/`: Contains the HTML files for each of the three main presentation sections.
  - `explicit_fitness.html`: Covers "Very Complex Components, Explicit Fitness Function".
  - `guessable_fitness.html`: Covers "Moderately Complex Components, Guessable Fitness Function".
  - `invisible_fitness.html`: Covers "Simplest Components, Invisible Fitness Function".
- `README.md`: This file.

## Features

-   **Homepage**: Introduces the presentation and links to three main categories.
-   **Category Pages**: Each category has its own page with a consistent structure:
    1.  **Quick Introduction**: Key concepts and keywords.
    2.  **Simulations/Examples**: Embedded YouTube videos and placeholders for JavaScript canvas simulations.
    3.  **Link with Open-Ended Evolution**: Discussion on how the category relates to OEE.
-   **Navigation**: 
    -   Homepage cards link to category pages.
    -   Category pages have a "Home" link in the header.
    -   Within category pages, content is divided into full-viewport sections. Users can navigate between these sections by:
        -   Scrolling the mouse wheel (up/down).
        -   Pressing the Up/Down arrow keys.
        -   Swiping up/down on touch devices.
-   **Design**: Aims for a modern, "organic," and visually appealing dark theme with subtle animations and transitions. Uses Google Fonts (`Orbitron` for titles, `Roboto` for body text).
-   **Modularity**: HTML, CSS, and JavaScript are separated for easier maintenance and future development.

## Placeholder Content

-   The JavaScript simulations (`[js]` tags in the original Markdown) are currently represented by `<canvas>` elements with placeholder text and basic drawing in their respective JS files in `js/simulations/`. These are intended to be replaced with actual simulation code.
-   One YouTube link in the "Simplest Components" section for "Life itself" is marked as `[lien youtube à trouver]` in the original Markdown and is a placeholder in the HTML.

## Deployment to GitHub Pages

Assuming your GitHub username is `your-username` and you want to host this in a repository named `alife_granularity_oee` (so the URL becomes `your-username.github.io/alife_granularity_oee/`):

1.  **Create a new repository** on GitHub named `alife_granularity_oee` (or your preferred name).
2.  **Push the entire `alife_granularity_oee` folder contents** (this `README.md`, `index.html`, `css/`, `js/`, `pages/` folders) to the `main` (or `master`) branch of your new repository.
    *Make sure these files are at the root of the repository branch, not inside another `alife_granularity_oee` subfolder within the repository.*
3.  **Go to your repository settings** on GitHub.
4.  Navigate to the **"Pages"** section in the left sidebar.
5.  Under "Build and deployment", for **"Source"**, select **"Deploy from a branch"**.
6.  For **"Branch"**, select your `main` (or `master`) branch and the `/ (root)` folder. Click **"Save"**.
7.  GitHub Pages will build and deploy your site. It might take a few minutes. The URL will be displayed in the Pages settings once it's live (e.g., `https://your-username.github.io/alife_granularity_oee/`).

**Important Note on Paths:**
All internal links (`href` and `src` attributes) in the HTML and CSS files are relative (e.g., `css/main.css`, `../index.html`, `../js/group-navigation.js`). This structure is set up to work correctly when served from a subdirectory on GitHub Pages (like `/alife_granularity_oee/`).

If you decide to host it at the root of a custom domain or at `your-username.github.io` (i.e., from a repository named `your-username.github.io`), these paths will still work correctly. 