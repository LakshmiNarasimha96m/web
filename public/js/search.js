function displaySearchResults(result) {
  const resultsContainer = document.getElementById('searchResults');
  const messageBox = document.getElementById('messageBox');
  if (!resultsContainer || !messageBox) return;

  resultsContainer.innerHTML = '';
  messageBox.textContent = '';

  if (result.error) {
    messageBox.textContent = result.error;
    return;
  }

  const heading = document.createElement('h2');
  heading.textContent = `Search Results for: ${result.searchTerm}`;
  resultsContainer.appendChild(heading);

  result.results.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'story';
    row.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
    resultsContainer.appendChild(row);
  });
}

async function performSearch(query) {
  const messageBox = document.getElementById('messageBox');
  const resultsContainer = document.getElementById('searchResults');
  if (!messageBox || !resultsContainer) return;

  messageBox.textContent = 'Searching...';
  resultsContainer.innerHTML = '';

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchFor: query })
    });

    const data = await response.json();
    if (!response.ok) {
      messageBox.textContent = data.error || 'Search failed.';
      return;
    }

    displaySearchResults(data);
  } catch (error) {
    messageBox.textContent = 'Unable to complete search. Please try again later.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchFor');
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (query && searchInput) {
    searchInput.value = query;
    performSearch(query);
  }

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = searchInput?.value.trim();
    if (value) {
      performSearch(value);
    }
  });
});
