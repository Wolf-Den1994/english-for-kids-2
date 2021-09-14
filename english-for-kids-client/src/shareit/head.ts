export const head = (className: string): string => `
    <header class="categ-header">
      <nav class="categ-menu">
        <a href="#" class="categ-link categ-link-categ">Categories</a>
        <a href="#" class="categ-link categ-link-words">Words</a>
      </nav>
      <a href="#" class="categ-link categ-link-out">Log out</a>
    </header>
    <main class="${className}-main"></main>
  `;
