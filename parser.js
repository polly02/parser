console.log('Я люблю халвичный раф');

const axios = require('axios');
const fs = require('fs');
const json2xls = require('json2xls');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const pagesNumber = 35;
let page = 1;
let parsingTimeout = 0;

let data = []

function parsing() {

    function getArticles() {

        let link = `https://www.tophouse.ru/products/kirpich/licevoy/page/${page}/`;
        console.log('Запрос цен на странице: ' + link);

        axios.get(link)
            .then(response => {
                let currentPage = response.data;

                const dom = new JSDOM(currentPage);

                let itemQty = dom.window.document.querySelectorAll('.offer-tile').length

                for (i = 0; i < (itemQty - 2); i++) {
                    let itemPrice = dom.window.document.querySelectorAll('.description-box')[i].textContent
                    let itemName = dom.window.document.querySelectorAll('.ht-100')[i].childNodes[3].childNodes[1].childNodes[0].textContent
                    console.log(itemName + itemPrice);
                    let obj = {
                        item: itemName,
                        price: itemPrice
                    }
                    data.push(obj)


                };

                if (page > (pagesNumber + 1)) {
                    let result = JSON.stringify(data)

                    fs.writeFileSync('item.json', result, 'utf8')
                    fs.writeFileSync('data.xlsx', result, 'utf8');
                };
            });

        page++;
    };
    for (let i = page; i <= pagesNumber; i++) {
        setTimeout(getArticles, parsingTimeout);
        parsingTimeout += 5000;
    };
    getArticles()
    return;
};
parsing()