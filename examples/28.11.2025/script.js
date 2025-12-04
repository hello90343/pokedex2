const content = document.getElementById("content");

function init() {
    renderCards();
}

async function renderCards() {
    try {
        const response = await fetch("https://thronesapi.com/api/v2/Characters");

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const data = await response.json();

        for (let i = 0; i < data.length; i++) {
            let dataKey = data[i];
            let html = `
                <section class="contentStyle">
                    <div>
                        <h2>${dataKey.fullName}</h2>
                        <p>${dataKey.title}</p>
                        <p>${dataKey.family}</p>
                    </div>
                    <img src="${dataKey.imageUrl}">
                </section>
            `;
            content.innerHTML += html;
        }
    } catch (error) {
        console.error("Fehler beim Laden der Karten:", error);
        content.innerHTML = "<p>Es gab ein Problem beim Laden der Daten.</p>";
    }
}