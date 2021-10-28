class Select {
    dropdownBoxComponent;
    containerComponent;
    inputBoxComponent;
    inputLabelComponent;
    inputArrowWrapper;
    inputArrowComponent;
    loaderComponent;
    loaderCircleComponent;
    selectedIndex;
    options;
    isOpen;
    label;
    parent;
    onSelect;


    constructor({selector, label, url, onSelect}) {
        if (!selector) console.error('Selector not provided');
        if (!label) console.error('Label not provided');
        if (!url) console.error('Url not provided');

        this.isOpen = false;

        this.label = label;
        this.selectedIndex = -1;
        this.onSelect = onSelect;

        this.#create(selector, label, url);

    }

    #createDiv = ({tagName, className, onclick, children}) => {
        const element = document.createElement(tagName);
        className ? element.className = className : null;
        onclick ? element.onclick = onclick : null;

        children?.forEach(child => element.appendChild(child));
        return element;
    }
    #create = (selector, label, url) => {
        if (selector.startsWith('#')) {
            this.parent = document.getElementById(selector.slice(1));
        }
        if (selector.startsWith('.')) {
            this.parent = document.getElementsByClassName(selector.slice(1))[0];
        }
        if (!this.parent) {
            console.error('Cannot find element with this selector');
            return;
        }

        //dropdown box
        this.dropdownBoxComponent = this.#createDiv({
            tagName: 'div', className: 'dropdown-box dropdown-box-hide'
        });

        //adding arrow to wrapper
        this.inputArrowComponent = this.#createDiv({
            tagName: 'div', className: 'input-arrow arrow-down'
        });

        const arrowWrapper = this.#createDiv({
            tagName: 'div', className: 'input-arrow-wrapper',
            children: [this.inputArrowComponent]
        });

        //adding label and arrow to box
        this.inputLabelComponent = this.#createDiv({
            tagName: 'div', className: 'input-label'
        });
        this.#updateLabel(label);

        const inputBox = this.#createDiv({
            tagName: 'div', className: 'input-box', onclick: this.click,
            children: [
                this.inputLabelComponent, arrowWrapper
            ]
        });

        //adding input box and dropdown box to container
        const container = this.#createDiv({
            tagName: 'div', className: 'container',
            children: [inputBox, this.dropdownBoxComponent]
        });


        //adding container to parent
        this.parent.appendChild(container);

        ///getting data from server
        this.#loader(true);
        this.#getData(url).then(data => this.#setData(data));

    }
    #loader = (enable) => {
        if (enable) {
            this.loaderCircleComponent = this.#createDiv({
                tagName: 'div',
                className: 'circle-loader'
            });

            this.loaderComponent = this.#createDiv({
                tagName: 'div',
                className: 'loader',
                children: [this.loaderCircleComponent]
            });

            this.dropdownBoxComponent.appendChild(this.loaderComponent);
            return;
        }

        this.dropdownBoxComponent.removeChild(this.loaderComponent);
    }
    #updateOptions = () => {
        const component = this.dropdownBoxComponent;
        if (!this.options.length) {
            const dropdownBox = this.dropdownBoxComponent;
            while (dropdownBox.lastElementChild) {
                dropdownBox.removeChild((dropdownBox.lastElementChild));
            }
            return;
        }
        this.options.forEach((label, index) => {
            const option = document.createElement('div');
            option.className = 'option';
            option.innerHTML = label;
            option.onclick = () => this.chooseIndex(index);
            component.appendChild(option);
        })
    }
    #updateLabel = (label) => {
        this.inputLabelComponent.innerHTML = label;
    }
    #setData = (data) => {
        if (!data || !data.labels) {
            console.error('No data');
            return;
        }

        this.options = data.labels;
        this.#updateOptions();

        this.#loader(false);
    }
    #getData = async (url) => {
        if (!url) {
            console.error('Url not provided');
            return;
        }
        const data = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        }).then(data => {
            return data.json();
        }).catch(err => {
            console.error(err);
        });

        if (!data?.labels?.length) {
            console.error('No labels in given URL');
            return;
        }

        return data;
    }
    click = (event) => {
        if (!event.isTrusted) return;

        if (!this.isOpen) this.open();
        else this.close();
    }
    open = () => {
        if (this.isOpen) return;

        //open
        this.inputArrowComponent.classList.remove('arrow-down');
        this.inputArrowComponent.classList.add('arrow-up');


        this.inputLabelComponent.classList.remove('input-label');
        this.inputLabelComponent.classList.add('input-label-shrink');

        this.dropdownBoxComponent.classList.remove('dropdown-box-hide');
        this.dropdownBoxComponent.classList.add('dropdown-box');

        this.isOpen = true;
    }
    close = () => {
        if (!this.isOpen) return;

        //close
        this.inputArrowComponent.className = 'input-arrow arrow-down';
        this.inputLabelComponent.className = 'input-label';
        this.dropdownBoxComponent.className = 'dropdown-box-hide';

        this.inputArrowComponent.classList.remove('arrow-up');
        this.inputArrowComponent.classList.add('arrow-down');


        this.inputLabelComponent.classList.remove('input-label-shrink');
        this.inputLabelComponent.classList.add('input-label');

        this.dropdownBoxComponent.classList.remove('dropdown-box');
        this.dropdownBoxComponent.classList.add('dropdown-box-hide');

        this.isOpen = false;
    }
    chooseIndex = (index) => {
        if (this.options[index]) {
            this.selectedIndex = index;
            this.#updateLabel(this.options[index]);
            this.close();
            if (this.onSelect)
                this.onSelect([this.selectedIndex, this.options[index]]);
            return [this.selectedIndex, this.options[index]]
        }
        return undefined;
    }
    getCurrent = () => {
        if (this.options[this.selectedIndex]) return [this.selectedIndex, this.options[this.selectedIndex]];
        return undefined;
    }
    clear = () => {
        this.options = [];
        this.selectedIndex = -1;
        this.#updateOptions();
        this.#updateLabel(this.label);
    }
    destroy = () => {
        this.parent.remove();
    }
}

export {Select};