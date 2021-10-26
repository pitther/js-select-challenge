import {Select} from '../select.js'

const root = document.createElement('div');
root.id = 'parent';
document.body.appendChild(root);

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({labels: ["Puzata hata", "Dominos pizza", "Chelentano", "Dobro Kava\u0026CockTail", "Babushka", "Stolovka", "Aroma kava"]}),
    })
);

let select;

beforeEach(() => {
    select = new Select({
        selector: '#parent',
        label: 'Выберите технологию',
        url: 'https://api.npoint.io/5c1750e2d62a51de3b86',
        onSelect(selectedItem) {
            return selectedItem;
        }
    });
});

test('open(), isOpen must be true', () => {
    select.open();
    expect(select.isOpen).toBe(true);
});

test('close(), isOpen must be false', () => {
    select.close();
    expect(select.isOpen).toBe(false);
});

test('chooseIndex(5), must return array', () => {
    expect(select.chooseIndex(5)).toContain(5);
});

test('chooseIndex(10), must return undefined', () => {
    expect(select.chooseIndex(10)).toBeUndefined();
});

test('chooseIndex() incorrect index, must return undefined', () => {
    expect(select.chooseIndex(null)).toBeUndefined();
    expect(select.chooseIndex(undefined)).toBeUndefined();
    expect(select.chooseIndex(-5)).toBeUndefined();
});

test('getCurrent() unset index, must return undefined', () => {
    expect(select.getCurrent()).toBeUndefined();
});

test('chooseIndex(5), must return array', () => {
    select.chooseIndex(5);
    expect(select.getCurrent()).toContain(5);
});

test('clear(), must clear options and set selectedIndex to -1', () => {
    select.clear();
    expect(select.selectedIndex).toBe(-1);

    expect(select.options.length).toBe(0);
});

test('destroy(), must delete select from dom', () => {
    select.destroy();
    //document.getElementById('parent').remove();
    expect(document.getElementsByClassName('container')[0]).toBeUndefined();
});
