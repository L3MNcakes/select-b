import SELECT_B_SINGLE_TEMPLATE from './select-b-single.html';

const template = document.createElement('template');
template.innerHTML = SELECT_B_SINGLE_TEMPLATE;

export interface ISelectBOption {
    value : string;
    label : string;
}

export interface ISelectBSingleState {
    allOptions : ISelectBOption[];
}

/**
 * select-b-single
 */
export class SelectBSingle extends HTMLElement {
    private rootEl : ShadowRoot;

    private state : ISelectBSingleState = {
        allOptions: []
    };

    constructor() {
        super();

        this.rootEl = this.attachShadow({ mode: 'open' });
        this.rootEl.appendChild(template.content.cloneNode(true));

        this.rootEl.querySelector('slot')
            .addEventListener('slotchange', this.onSlotChange.bind(this));

        this.rootEl.querySelector('.select-b-single-dropdown-icon')
            .addEventListener('click', this.onDropdownClick.bind(this));
    }

    private onSlotChange(evt : Event) : void {
        this.updateAllOptions();
    }

    private updateAllOptions() : void {
        const allOptions : ISelectBOption[] = Array.from(this.querySelectorAll('option'))
            .map( option => ({ value: option.value, label: option.text }));

        this.state = {
            ...this.state,
            allOptions
        };

        this.renderOptions();
    }

    private renderOptions() : void {
        const optionsEl = this.rootEl.querySelector('.select-b-single-options');
        optionsEl.textContent = '';

        this.state.allOptions.forEach( option => {
            const optionEl = document.createElement('span');
            optionEl.setAttribute('data-value', option.value);
            optionEl.setAttribute('data-label', option.label);
            optionEl.textContent = option.label;
            optionEl.addEventListener('click', this.onOptionClick.bind(this));

            optionsEl.appendChild(optionEl);
        });
    }

    private onOptionClick(evt : Event) : void {
        this.rootEl.querySelector('.select-b-single-options').setAttribute('hidden', '');
        this.rootEl.querySelector('.select-b-single-input').textContent = (evt.target as Element).getAttribute('data-label');
    }

    private onDropdownClick(evt : Event) : void {
        this.rootEl.querySelector('.select-b-single-options').removeAttribute('hidden');
    }
}
