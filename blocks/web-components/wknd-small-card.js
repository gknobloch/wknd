/** A small card component */
class WkndSmallCard extends HTMLElement {
  #article;
  #activity;
  #template;

  constructor() {
    self = super();
    this.#activity = this.getAttribute('data-activity');
    this.#template = document.createElement('template');
    this.#template.innerHTML = `<style type='text/css'>
        article {
          width: 300px;
          xheight: 300px;
          background: #f8f8f8;
          margin: 10px;
          padding: 10px;
        }
        .title { 
          color: var(--titleColor,black);
          font-size: var(--smallCardTitleFontSize,26px);
          font-family: var(--fontFamilySansSerif,sans-serif);
          font-weight: var(--fontWeightBold,600);
          text-transform: uppercase; 
        }

        .deselected {
          display:none;
        }

        .image {
          height: var(--smallCardImageHeight, 222px);
          margin: 0;
          -o-object-fit: cover;
          object-fit: cover;
          -o-object-position: center;
          object-position: center;
          overflow: hidden;
          width: 100%;
        }

        .text {
          color: var(--textColorDim,dimgray);
          display: block;
          font-size: var(--fontSizeSmall,14px);
          margin-top: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
          width: var(--small-card-width, 267px);
        }
      </style>
      <article>
      <div class='image'><slot name="image"></slot></div>
      <div class='title'><slot name="title"></slot></div>
      <p class='text'><slot></slot></p>
    </article>`;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode:"open"});
    shadowRoot.appendChild(this.#template.content.cloneNode(true));
    this.#article = shadowRoot.querySelector('article');
    window.addEventListener('activity-selected', e => this.#activitySelected(e));
  }

  #activitySelected(e) {
    const activity = e.detail?.activity;
    const selected = activity == null ? true : this.#activity == activity;
    this.#article.className = selected ? 'selected' : 'deselected';
  }
}

customElements.define('wknd-small-card', WkndSmallCard);