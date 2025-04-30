const emojiMap = {
    "dog": "🐶",
    "cat": "🐱",
    "happy": "😊",
    "sad": "😢",
    "food": "🍎",
    "car": "🚗",
    "house": "🏠",
    "school": "🏫",
    "book": "📘",
    "sun": "☀️"
};

async function searchImages() {
    const word = document.getElementById('wordInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!word) {
        alert('Please type a word');
        return;
    }

    // 1. Emoji
    if (emojiMap[word]) {
        const emoji = emojiMap[word];
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';
        wrapper.style.margin = '10px';
        wrapper.style.textAlign = 'center';

        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = emoji;
        emojiSpan.style.fontSize = '100px';
        emojiSpan.style.cursor = 'pointer';
        emojiSpan.onclick = () => addToSentenceText(emoji, word);

        const label = document.createElement('div');
        label.textContent = word;

        wrapper.appendChild(emojiSpan);
        wrapper.appendChild(label);
        resultsDiv.appendChild(wrapper);
    }

    // 2. ARASAAC
    try {
        const arasaacRes = await fetch(`https://api.arasaac.org/api/pictograms/en/search/${encodeURIComponent(word)}`);
        const arasaacData = await arasaacRes.json();
        arasaacData.slice(0, 4).forEach(symbol => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'inline-block';
            wrapper.style.margin = '10px';
            wrapper.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = `https://static.arasaac.org/pictograms/${symbol._id}/${symbol._id}_300.png`;
            img.alt = word;
            img.className = 'result-img';
            img.onclick = () => addToSentence(img.src, word);

            const label = document.createElement('div');
            label.textContent = word;

            wrapper.appendChild(img);
            wrapper.appendChild(label);
            resultsDiv.appendChild(wrapper);
        });
    } catch (err) {
        console.error('ARASAAC error:', err);
    }

    // 3. Pixabay
    const pixabayKey = '49978957-7f3f3c500656460c1f5b4026f';
    try {
        const pixabayRes = await fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(word)}&image_type=photo&per_page=5`);
        const pixabayData = await pixabayRes.json();
        pixabayData.hits.forEach(photo => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'inline-block';
            wrapper.style.margin = '10px';
            wrapper.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = photo.previewURL;
            img.alt = word;
            img.className = 'result-img';
            img.onclick = () => addToSentence(img.src, word);

            const label = document.createElement('div');
            label.textContent = word;

            wrapper.appendChild(img);
            wrapper.appendChild(label);
            resultsDiv.appendChild(wrapper);
        });
    } catch (err) {
        console.error('Pixabay error:', err);
    }
}

function addToSentence(imgSrc, word) {
    const sentenceDiv = document.getElementById('sentence');
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.margin = '10px';
    wrapper.style.textAlign = 'center';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = word;
    img.className = 'sentence-img';

    const label = document.createElement('div');
    label.textContent = word;

    wrapper.appendChild(img);
    wrapper.appendChild(label);
    sentenceDiv.appendChild(wrapper);
}

function addToSentenceText(text, word) {
    const sentenceDiv = document.getElementById('sentence');
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.margin = '10px';
    wrapper.style.textAlign = 'center';

    const span = document.createElement('span');
    span.textContent = text;
    span.style.fontSize = '80px';
    span.style.display = 'block';

    const label = document.createElement('div');
    label.textContent = word;

    wrapper.appendChild(span);
    wrapper.appendChild(label);
    sentenceDiv.appendChild(wrapper);
}

function clearSentence() {
    document.getElementById('sentence').innerHTML = '';
}

// Trigger search on spacebar
document.getElementById('wordInput').addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        searchImages();
        this.value = '';
    }
});
