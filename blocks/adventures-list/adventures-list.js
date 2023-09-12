/**
 * Loads the list of adventures.
 * @param {string} url The URL to an AEM persisted query providing the adventures
 * @returns {Document} The document
 */
async function fetchAdventures(url) {
  const resp = await fetch(url);
  if (resp.ok) {
    return await resp.json();
  }
  return {};
}

function getError(content, data) {
  const $div = document.createElement('div');
  $div.className = 'block-error';
  const $data = data? JSON.stringify(data) : '';
  $div.innerHTML = `${content}<pre>${$data}</pre>`;
  return $div;
}

/**
 * @param {HTMLElement} $block The adventures list block element
 */
export default async function decorate($block) {
  var $err = null;

  // Get URL
  const link = $block.querySelector('a');
  if(!link) {
    $err = getError("no 'a' element found in block", $block);
  }
  const path = link ? link.getAttribute('href') : $block.textContent.trim();
  const hostname = link ? link.hostname : null;

  // Fetch adventures and render as wknd-small-card elements
  const json = await fetchAdventures(path);
  if (!$err && json && json.data && json.data.adventureList && json.data.adventureList.items) {
    const $root = document.createElement('span');
    const $ul = document.createElement('ul');
    var adventures = json.data.adventureList.items;
    const activities = {};
    adventures.forEach((adventure, index) => {
      if(adventure.activity) {
        activities[adventure.activity] = true;
      }
      const $li = document.createElement('li');

      const $ac = document.createElement('wknd-small-card');
      $ac.setAttribute('data-activity', adventure.activity);

      const $title = document.createElement('h4');
      $title.setAttribute('slot', 'title');
      $title.textContent = adventure.title;
      $ac.appendChild($title);

      // hack for image width
      let imageSrc = 'https://' + hostname + adventure.primaryImage['_dynamicUrl'];
      imageSrc = imageSrc.replace("width=200", "width=400");

      const $img = document.createElement('img');
      $img.setAttribute('src', imageSrc);
      $img.setAttribute('alt', adventure.title);
      $img.setAttribute('slot', 'image');
      $ac.appendChild($img);

      const $description = document.createElement('div');
      $description.textContent = adventure.activity;
      $ac.appendChild($description);

      $li.appendChild($ac);
      $ul.appendChild($li);
    });

    // And create the activity selector
    const $selector = document.createElement('activities-selector');
    $selector.setAttribute('title', 'Select an activity');
    const $menu = document.createElement('menu');
    $selector.appendChild($menu);
    for(var a of Object.keys(activities)) {
      const $li = document.createElement('li');
      $li.textContent = a;
      $menu.appendChild($li);
    }

    $root.appendChild($selector);
    $root.appendChild($ul);
    $block.replaceChildren($root);
  } else if($err) {
    $block.replaceChildren($err);
  } else {
    $block.innerHTML = '';
  }
}
