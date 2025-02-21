(() => {
  'use strict'

  const getFilterControlPlayerCount = () => document.getElementById('players-filter-input');
  const getFilterControlPlayTime = () => document.getElementById('play-time-filter-input');
  const getFilterControlAge = () => document.getElementById('min-age-filter-input');
  const getFilterControlTitle = () => document.getElementById('title-filter-input');

  const getFilterCounter = () => document.getElementById('filterCount');

  const getFilters = () => {
    const playerCount = Number(getFilterControlPlayerCount().value);
    const playTime = getFilterControlPlayTime().value;
    const minAge = Number(getFilterControlAge().value);
    const title = getFilterControlTitle().value.toLowerCase();

    let count = 0;
    if (playerCount) count++;
    if (playTime) count++;
    if (minAge) count++;
    if (title) count++;

    return {
      'count': count,
      'values': {
        'playerCount': playerCount,
        'playTime': playTime,
        'minAge': minAge,
        'title': title
      }
    };
  }

  const applyFilter = () => {
    const filter = getFilters();
    console.log(`Applying filters: ${JSON.stringify(filter)}`);

    // Update filter badge
    setFilterCounter(filter.count);

    // Filter games list
    const allGames = Array.from(document.getElementsByClassName('game-list-item'));
    allGames.forEach(e => {
      const gamePlayersMin = Number(e.dataset.playersMin);
      const gamePlayersMax = Number(e.dataset.playersMax);
      const gamePlayTimeMin = Number(e.dataset.playtimeMin);
      const gamePlayTimeMax = Number(e.dataset.playtimeMax);
      const gameMinAge = Number(e.dataset.minage);
      const gameTitleLowerCase = e.dataset.title.toLowerCase();

      if (filter.values.playerCount && (filter.values.playerCount < gamePlayersMin || filter.values.playerCount > gamePlayersMax)) {
        console.log(`Game '${gameTitleLowerCase}' will be hidden due to player count (Min: ${gamePlayersMin}, Max: ${gamePlayersMax})`);
        e.style.display = 'none';
        return;
      }

      if (filter.values.playTime) {
        // Determine simplified playtime for game
        let gamePlayTime = 'medium';
        if (gamePlayTimeMax > 60) {
          gamePlayTime = 'long';
        } else if (gamePlayTimeMax <= 30) {
          gamePlayTime = 'quick';
        }

        if (filter.values.playTime !== gamePlayTime) {
          console.log(`Game '${gameTitleLowerCase}' will be hidden due to play time (Min: ${gamePlayTimeMin}, Max: ${gamePlayTimeMax}, Simplified: ${gamePlayTime})`);
          e.style.display = 'none';
          return;
        }
      }

      if (filter.values.minAge && (filter.values.minAge < gameMinAge)) {
        console.log(`Game '${gameTitleLowerCase}' will be hidden due to age (${gameMinAge}+)`);
        e.style.display = 'none';
        return;
      }

      if (filter.values.title && !gameTitleLowerCase.includes(filter.values.title)) {
        console.log(`Game '${gameTitleLowerCase}' will be hidden due to name (${gameTitleLowerCase})`);
        e.style.display = 'none';
        return;
      }

      e.style.display = 'block';
    });
  }

  const setFilterCounter = (count) => {
    const filterCounter = getFilterCounter();
    if (filterCounter) {
      filterCounter.innerText = (filterCounter.dataset.prefix || "") + count + (filterCounter.dataset.suffix || "");
      filterCounter.dataset.value = count;
    } else {
      console.log("Filter counter element is not present.");
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    // Register event listeners
    getFilterControlPlayerCount().addEventListener('change', applyFilter);
    getFilterControlPlayTime().addEventListener('change', applyFilter);
    getFilterControlAge().addEventListener('change', applyFilter);
    getFilterControlTitle().addEventListener('keyup', applyFilter);
    console.log('Game filter event listeners registered.');

    // Run apply method for any pre-selected values as a result of page refresh
    applyFilter();
  })
})()
