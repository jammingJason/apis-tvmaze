/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const res = await axios.get('http://api.tvmaze.com/search/shows?q=' + query);
  let arrShows = [];
  for (let i = 0; i < res.data.length; i++) {
    let newShow = res.data[i].show;
    let newImage = newShow.image;
    if (newImage === null) {
      newImage = 'https://tinyurl.com/tv-missing';
    } else {
      newImage = newShow.image.medium;
    }
    arrShows.push({
      id: newShow.id,
      name: newShow.name,
      summary: newShow.summary,
      image: newImage,
    });
  }
  console.log(arrShows);
  return arrShows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $('#shows-list');
  $showsList.empty();
  const modalTitle = document.querySelector('#modalLabel');
  for (let show of shows) {
    const intID = Math.floor(Math.random() * 1111);
    modalTitle.innerText = show.name;
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id="${intID}" class="btn btn-primary" data-toggle="modal"
             data-target="#exampleModal">Get Episodes</button>
             </div>
         </div>
       </div>
      `
    );
    // alert(show.image);
    $showsList.append($item);
    const episodeBtn = document.getElementById(intID);
    episodeBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      $('#episodes-area').show();
      getEpisodes(show.id);
    });
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
  evt.preventDefault();
  let query = $('#search-query').val();
  if (!query) return;
  $('#episodes-area').hide();
  let shows = await searchShows(query);
  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const getUL = document.querySelector('#episodes-list');
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  for (let i = 0; i < res.data.length; i++) {
    const newLI = document.createElement('li');
    newLI.innerText = res.data[i].name + ' - Season: ' + res.data[i].season;
    getUL.append(newLI);
  }
  // TODO: return array-of-episode-info, as described in docstring above
}
