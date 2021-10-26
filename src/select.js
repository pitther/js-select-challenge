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


        //container component
        this.containerComponent = document.createElement('div');
        this.containerComponent.className = 'container';

        //box component
        this.inputBoxComponent = document.createElement('div');
        this.inputBoxComponent.className = 'input-box';
        this.inputBoxComponent.onclick = (event) => this.click(event);

        //label
        this.inputLabelComponent = document.createElement('div');
        this.inputLabelComponent.className = 'input-label';
        //this.inputLabelComponent.innerHTML = label;
        this.#updateLabel(label);

        //arrow
        this.inputArrowWrapper = document.createElement('div');
        this.inputArrowWrapper.className = 'input-arrow-wrapper';

        this.inputArrowComponent = document.createElement('div');
        this.inputArrowComponent.className = 'input-arrow arrow-down';

        //dropdown box
        this.dropdownBoxComponent = document.createElement('div');
        this.dropdownBoxComponent.className = 'dropdown-box dropdown-box-hide';

        //adding arrow to wrapper
        this.inputArrowWrapper.appendChild(this.inputArrowComponent);

        //adding label and arrow to box
        this.inputBoxComponent.appendChild(this.inputLabelComponent);
        this.inputBoxComponent.appendChild(this.inputArrowWrapper);

        //adding input box and dropdown box to container
        this.containerComponent.appendChild(this.inputBoxComponent);
        this.containerComponent.appendChild(this.dropdownBoxComponent);

        //adding container to parent
        this.parent.appendChild(this.containerComponent);

        ///getting data from server
        this.#loader(true);
        this.#getData(url).then(data => this.#setData(data));

    }
    #loader = (enable) => {
        if (enable) {
            this.loaderComponent = document.createElement('div');
            this.loaderCircleComponent = document.createElement('div');
            this.loaderComponent.className = 'loader';
            this.loaderCircleComponent.className = 'circle-loader';
            this.loaderComponent.appendChild(this.loaderCircleComponent);
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

        if (!data || !data['labels'] || !data['labels'].length) {
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
        this.inputArrowComponent.className = 'input-arrow arrow-up';
        this.inputLabelComponent.className = 'input-label input-label-shrink';
        this.dropdownBoxComponent.className = 'dropdown-box';

        this.isOpen = true;
    }
    close = () => {
        if (!this.isOpen) return;

        //close
        this.inputArrowComponent.className = 'input-arrow arrow-down';
        this.inputLabelComponent.className = 'input-label';
        this.dropdownBoxComponent.className = 'dropdown-box-hide';

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