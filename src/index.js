import {Select} from './select.js'

const select = new Select({
    selector: '#parent',
    label: 'Выберите технологию',
    url: 'https://api.npoint.io/5c1750e2d62a51de3b86',
    onSelect(selectedItem) {
        console.log('Selected: ', selectedItem);
    }
});

const buttons = document.getElementsByTagName('button');

for (const button of buttons) {
    switch (button.getAttribute('data-type')) {
        case 'open': {
            button.onclick = select.open;
            break;
        }
        case 'close': {
            button.onclick = select.close;
            break;
        }
        case 'set': {
            button.onclick = () => {select.chooseIndex(5)};
            break;
        }
        case 'get': {
            button.onclick = () => {
                button.innerHTML = 'Получить выбранный '+select.getCurrent();
            };
            break;
        }
        case 'clear': {
            button.onclick = select.clear;
            break;
        }
        case 'destroy': {
            button.onclick = select.destroy;
            break;
        }
    }
}
