class ActivitiesSelector extends HTMLElement {
  #template;
  #selectors = [];

  constructor() {
    self = super();
    this.#template = document.createElement('template');
    this.#template.innerHTML = `<style type='text/css'>
      div {
        color:red;
      }
      p {
        display: inline;
        margin-right: 0.5em;
        color: var(--textColorDim, dimGray);
        font-size: var(--fontSizeSmall, 2px);
      }
      li {
        display: inline;
        background-color: blue;
        color:green;
        opacity: 30%;
        color: #ffffff;
        cursor: pointer;
        padding: 5px;
        margin-right: 5px;
        border-radius: 5px;
      }
      .selected {
        color: yellow;
        background-color: blue;
        opacity: 100%;
      }
    </style>`;

    this.#selectors = this.querySelectorAll('li');
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode:"open"});
    shadowRoot.appendChild(this.#template.content.cloneNode(true));
    const $title = document.createElement('p');
    $title.textContent = this.getAttribute('title') + ":";
    shadowRoot.appendChild($title);
    this.querySelectorAll('li').forEach(li => {
      shadowRoot.appendChild(li);
      li.addEventListener('click', e => this.#selectorClicked(e));
    });
  }

  #selectorClicked(e) {
    const selectOne = e.target.className != 'selected';
    this.#selectors.forEach(li => li.className = '');
    if(selectOne) {
      e.target.className = 'selected';
    }
    const detail = selectOne ? { detail: { activity: e.target.textContent }} : null;
    window.dispatchEvent(new CustomEvent('activity-selected', detail));
  }
}

customElements.define('activities-selector', ActivitiesSelector);