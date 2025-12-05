const mainContent = document.getElementById("mainContent");

const cacheTotal = [];
const cacheAllCards = [];
const cacheAllCardsResults = [];
const imgs = [];
const colors = [];
const colorsSecond = [];

let morePages = 20;
let lessPages = 0;
let morePagesContent = 2;
let lessPagesContent = 1;
let total;

const init = () => {
    loadingStart();
}

const loadingStart = () => {
    mainContent.innerHTML = `<p>Loading...</p>`;
    getTotal();
}

const getTotal = async () => {
    mainContent.innerHTML = `<p>Loading...</p>`;
    try{
        const response = await fetch("https://pokeapi.co/api/v2/pokemon");
        if (!response.ok) throw new Error (`HTTPS Error: ${response.status}`);
        const data = await response.json();
        cacheTotal.push(data);

        for(let i = 0; i < cacheTotal.length; i++){
            const key = cacheTotal[i];
            total = key.count;
            getAllCardsBase(total);
        }
    } catch (error) {
        console.error(`Error while loading data: ${error}`);
        mainContent.innerHTML = `An error occurend while loading the data: ${error.message}`;
    }
}

const getAllCardsBase = async (total) => {
    mainContent.innerHTML = `<p>Loading...</p>`;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${total}&offset=0`);
        if (!response.ok) throw new Error (`HTTPS Error: ${response.status}`);
        const data = await response.json();
        cacheAllCards.push(data);
        getAllCardsBaseResults();
    } catch (error) {
        console.error(`Error while loading data: ${error}`);
        mainContent.innerHTML = `An error occurend while loading the data: ${error.message}`;
    }
}

const getAllCardsBaseResults = async () => {
    mainContent.innerHTML = `
                             <p>By entering your favorite Pokémon, you will gain faster access to the website.</p>
                             <input id="externBtn" placeholder="Your favourite pokemon">
                             <p>Loading...</p>
                             `;
    try{
        for(let i = 0; i < cacheAllCards.length; i++) {
            const key = cacheAllCards[i];
            for(let j = 0; j < key.results.length; j++) {
                const results = key.results[j];
                const url = await fetch(results.url);
                const pokemon = await url.json();
                cacheAllCardsResults.push(pokemon);
            }
        }

        getImgs();
        getColors();
        getIconSecond();
        setTimeout(getRenderCards, 2000);
    } catch (error) {
        console.error(`Error while loading data: ${error}`);
        mainContent.innerHTML = `An error occurend while loading the data: ${error.message}`;
    }
}

const getImgs = () => {
    for (let i = 0; i < cacheAllCardsResults.length; i++) {
        const key = cacheAllCardsResults[i];
        let img = key.sprites.other["official-artwork"].front_default;
        if (!img) img = "none";
        imgs.push(img);
    }
};

const getColors = () => {
    for (let i = 0; i < cacheAllCardsResults.length; i++) {
        const key = cacheAllCardsResults[i];
        let color = key.types[0].type.name;
        if (!color) color = "none";
        colors.push(color);
    }
}

const getIconSecond = () => {
    for(let i = 0; i < cacheAllCardsResults.length; i++) {
        const key = cacheAllCardsResults[i];
        let colorSecond = "none";
        if (key.types[1]) {
            colorSecond = key.types[1].type.name;
        }
        colorsSecond.push(colorSecond);
    }
}

const returnIconSecond = (index) => {
    for (let i = 0; i < colorsSecond.length; i++) {
        if (i === index) {
            const key = colorsSecond[i];
            let returnValue = "";
            returnValue = key === "none"
            ? ""
            : `<img class="mainContentSectionArticleIcons_${key}" src="./assets/icons/${key}.svg"></img>`;
            return returnValue;   
        }
    }
}

const getRenderCards = async () => {
    mainContent.innerHTML = "";
    let html = `<section id="mainContentSection">`;
    for (let i = lessPages; i < morePages; i++) {
        const key = cacheAllCardsResults[i];
        const img = imgs[i]; 
        const color = colors[i];
        html += `
            <article class="mainContentSectionArticle">
            <header class="mainContentSectionArticleHeader">
            <p>#${key.id}</p>
            <h3>${upper(key.name)}</h3>
            </header>
             `;
        html += img === "none"
        ? `<div class="mainContentSectionArticleDiv type_${color}"><img class="mainContentSectionArticleDivImg" src="./assets/imgs/noImg.png" alt="No Picture"></div>` 
        : `<div class="mainContentSectionArticleDiv type_${color}"><img class="mainContentSectionArticleDivImg" src="${img}"></div>`;
        html += `
            <footer class="mainContentSectionArticleFooter">
                <img class="mainContentSectionArticleIcons_${color}" src="./assets/icons/${color}.svg">
                ${returnIconSecond(i)}
            </footer>
        `;
        html += `</article>`;
    }
    html += `</section>`;
    
    html += `  <div id="mainPagesInfos">
               <div id="mainPagesBtnDiv">
               <button onclick="lessPagesUpgrade()" class="mainPagesBtnLess" id="mainPagesLess">${lessPagesContent}</button>
               <button onclick="morePagesUpgrade()" class="mainPagesBtnMore" id="mainPagesMore">${morePagesContent}</button>
               </div>
               <p>${siteNumber()} side numbers</p>
               </div>
               `;             
    mainContent.innerHTML += html;
};

const morePagesUpgrade = () => {
    window.scrollTo({ top: 0});
    morePages += 20;
    lessPages += 20;
    morePagesContent++;
    if(morePagesContent > siteNumber()){
    morePages = 20;
    lessPages = 0;
    morePagesContent = 2;
    }
    if(lessPagesContent === 66) lessPagesContent = 1;
    getRenderCards();
}

const lessPagesUpgrade = () => {
    window.scrollTo({ top: 0});
    morePages -= 20;
    lessPages -= 20;
    if(lessPagesContent < 2) morePagesContent--;
    if(morePagesContent > lessPagesContent) lessPagesContent--;
    if(0 === lessPagesContent){
        lessPagesContent = 1;
    }
    if(morePagesContent == lessPagesContent) {
    lessPagesContent = siteNumber() - 1;    
    morePagesContent = siteNumber(); 
    morePages = total;
    lessPages = total - 20;  
    }
    getRenderCards();
}

const upper = (name) => {
    const transfromOne = name.charAt(0).toUpperCase();
    const transformTwo = name.slice(1).toLowerCase();
    return transfromOne + transformTwo;
}

const siteNumber = () => {
    return Math.ceil(total/20);
}