const mainContent = document.getElementById("mainContent");

const cacheFirst = [];
const cacheSecond = [];

const init = () => {
    loadingStart();
}

const loadingStart = () => {
    mainContent.innerHTML = `<p>Loading...</p>`;
    pushFirst();
}

const pushFirst = async () => {
    mainContent.innerHTML = `<p>Loading...</p>`;
    try{
        const response = await fetch("https://pokeapi.co/api/v2/pokemon");
        if (!response.ok) throw new Error (`HTTPS Error: ${response.status}`);
        const data = await response.json();
        cacheFirst.push(data);

        for(let i = 0; i < cacheFirst.length; i++){
            const key = cacheFirst[i];
            let total = key.count;
            pushSecond(total);
        }
    } catch (error) {
        console.error(`Error while loading data: ${error}`);
        mainContent.innerHTML = `An error occurend while loading the data: ${error.message}`;
    }
}

const pushSecond = async (total) => {
    mainContent.innerHTML = `<p>Loading...</p>`;
    try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${total}&offset=0`);
    if (!response.ok) throw new Error (`HTTPS Error: ${response.status}`);
    const data = await response.json();
    cacheSecond.push(data);
    renderCards();
    } catch (error) {
        console.error(`Error while loading data: ${error}`);
        mainContent.innerHTML = `An error occurend while loading the data: ${error.message}`;
    }
}

const renderCards = async () => {
    mainContent.innerHTML = "";
    
    for(let i = 0; i < cacheSecond.length; i++) {
        const key = cacheSecond[i];
        
        for(let j = 0; j < key.results.length; j++){
            const results = key.results[j];
            mainContent.innerHTML += `
                                        <p>${results.name}</p>
                                         `;
        }
    }
}









