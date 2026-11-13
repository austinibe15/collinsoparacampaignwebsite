
/* =========================================================
   CAMPAIGN NEWSROOM — SEARCH AND CATEGORY FILTERS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("updates-search");
  const filterButtons = document.querySelectorAll(".update-filter");
  const updateCards = document.querySelectorAll(".update-card");
  const noResults = document.getElementById("updates-no-results");

  if (!searchInput || !filterButtons.length || !updateCards.length) {
    return;
  }

  let activeCategory = "all";

  function filterUpdates() {

    const searchTerm = searchInput.value.trim().toLowerCase();

    let visibleCount = 0;

    updateCards.forEach((card) => {

      const category = card.dataset.category || "all";
      const cardText = card.textContent.toLowerCase();

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch = cardText.includes(searchTerm);

      const shouldShow = matchesCategory && matchesSearch;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }

    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }

  }


  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      activeCategory = button.dataset.filter || "all";

      filterUpdates();

    });

  });


  searchInput.addEventListener("input", filterUpdates);

});
