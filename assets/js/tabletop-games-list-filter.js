(() => {
  'use strict'

  const playerCountSelector = document.getElementById('players-filter-input');
  const playTimeSelector = document.getElementById('play-time-filter-input');
  const ageInput = document.getElementById('min-age-filter-input');
  const titleInput = document.getElementById('title-filter-input');

  const filterCounter = document.getElementById('filterCount');

  const getFilters = () => {
    const playerCount = Number(playerCountSelector.value);
    const playTime = playTimeSelector.value;
    const minAge = Number(ageInput.value);
    const title = titleInput.value.toLowerCase();

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
    filterCounter.innerText = (filterCounter.dataset.prefix || "") + filter.count + (filterCounter.dataset.suffix || "");
    filterCounter.dataset.value = filter.count;

    // Filter games list
    const allGames = Array.from(document.getElementsByClassName('game'));
    allGames.forEach(e => {
      const gamePlayersMin = Number(e.querySelector('.players').dataset.playersMin);
      const gamePlayersMax = Number(e.querySelector('.players').dataset.playersMax);
      const gamePlayTimeMin = Number(e.querySelector('.playtime').dataset.playtimeMin);
      const gamePlayTimeMax = Number(e.querySelector('.playtime').dataset.playtimeMax);
      const gameMinAge = Number(e.querySelector('.age').dataset.minage);
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

  window.addEventListener('DOMContentLoaded', () => {
    // Register event listeners
    playerCountSelector.addEventListener('change', applyFilter);
    playTimeSelector.addEventListener('change', applyFilter);
    ageInput.addEventListener('change', applyFilter);
    titleInput.addEventListener('keyup', applyFilter);
    console.log('Game filter event listeners registered.');

    // Run apply method for any pre-selected values as a result of page refresh
    applyFilter();
  })
})()
