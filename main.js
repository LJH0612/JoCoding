const GENRE_MAP = {
    fantasy: 'FANTASY',
    action: 'ACTION',
    romance: 'PURE',
    martialarts: 'HISTORICAL',
    comedy: 'COMIC',
    drama: 'DRAMA'
};

const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const quizHeader = document.getElementById('quiz-header');

let currentStep = 0;
let history = [];
let answers = {
    type: '',
    genre: '',
    mood: ''
};

const steps = [
    {
        question: "어떤 종류의 작품을 찾으시나요?",
        key: "type",
        options: [
            { label: "웹툰 (Webtoon)", value: "webtoon" },
            { label: "소설 (Novel)", value: "novel" }
        ]
    },
    {
        question: "선호하는 장르는 무엇인가요?",
        key: "genre",
        options: [
            { label: "판타지", value: "fantasy" },
            { label: "액션", value: "action" },
            { label: "로맨스", value: "romance" },
            { label: "무협", value: "martialarts" },
            { label: "코믹", value: "comedy" },
            { label: "드라마", value: "drama" }
        ]
    },
    {
        question: "어떤 분위기의 이야기를 원하시나요?",
        key: "mood",
        options: [
            { label: "강렬하고 몰입감 있는", value: "intense" },
            { label: "가슴 따뜻하고 힐링되는", value: "heart-warming" },
            { label: "감성적이고 애절한", value: "emotional" },
            { label: "가볍고 즐거운", value: "chill" }
        ]
    }
];

function renderStep() {
    quizContainer.innerHTML = '';
    const step = steps[currentStep];

    const stepDiv = document.createElement('div');
    stepDiv.className = 'quiz-step';

    const questionText = document.createElement('h2');
    questionText.style.marginBottom = '2rem';
    questionText.textContent = step.question;
    stepDiv.appendChild(questionText);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'options-grid';

    step.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.label;
        btn.onclick = () => handleChoice(step.key, opt.value);
        optionsGrid.appendChild(btn);
    });

    stepDiv.appendChild(optionsGrid);

    if (currentStep > 0) {
        const backBtn = document.createElement('button');
        backBtn.className = 'secondary-btn';
        backBtn.style.marginTop = '2rem';
        backBtn.style.width = '100%';
        backBtn.textContent = '이전 단계로';
        backBtn.onclick = handleBack;
        stepDiv.appendChild(backBtn);
    }

    quizContainer.appendChild(stepDiv);
}

function handleChoice(key, value) {
    history.push({ ...answers });
    answers[key] = value;
    currentStep++;

    if (currentStep < steps.length) {
        renderStep();
    } else {
        showLoading();
        fetchRecommendation();
    }
}

function handleBack() {
    if (currentStep > 0) {
        currentStep--;
        answers = history.pop();
        renderStep();
    }
}

function showLoading() {
    quizContainer.innerHTML = '<div class="quiz-step"><h2>당신을 위한 작품을 찾는 중...</h2><p class="subtitle">실시간 데이터를 가져오고 있습니다.</p></div>';
}

async function fetchRecommendation() {
    try {
        const naverGenre = GENRE_MAP[answers.genre] || 'DRAMA';
        // AllOrigins CORS Proxy 사용
        const apiUrl = `https://comic.naver.com/api/webtoon/titlelist/genre?genre=${naverGenre}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);
        
        const list = parsedData.titleList || [];
        
        if (list.length === 0) {
            throw new Error('No data found');
        }

        // 결과 중 랜덤하게 하나 선택
        const randomIndex = Math.floor(Math.random() * list.length);
        const item = list[randomIndex];

        displayResult({
            title: item.titleName,
            type: answers.type === 'webtoon' ? '웹툰' : '웹툰 (기반 소설 추천)',
            genre: answers.genre,
            desc: `${item.author} 작가의 작품입니다. 현재 별점 ${item.starScore}점을 기록하고 있어요!`,
            link: `https://comic.naver.com/webtoon/list?titleId=${item.titleId}`,
            img: item.thumbnailUrl
        });
    } catch (error) {
        console.error('Fetch error:', error);
        // 에러 시 기존 하드코딩 데이터 중 하나 보여주기 (Fallback)
        displayResult({
            title: "전지적 독자 시점",
            type: "웹툰",
            genre: "판타지",
            desc: "데이터를 가져오는 중 오류가 발생했습니다. 하지만 이 작품은 정말 추천해요!",
            link: "https://comic.naver.com/webtoon/list?titleId=747269",
            img: "https://shared-comic.pstatic.net/thumb/webtoon/747269/thumbnail/thumbnail_IMAG21_3902319088661706680.jpg"
        });
    }
}

function displayResult(result) {
    quizContainer.classList.add('hidden');
    quizHeader.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="thumbnail-wrapper">
                <img src="${result.img}" alt="${result.title}" class="result-img" referrerpolicy="no-referrer">
            </div>
            <span class="result-tag">${result.type} | ${result.genre}</span>
            <h2 class="result-title">${result.title}</h2>
            <p class="result-desc">${result.desc}</p>
            <div class="btn-group">
                <a href="${result.link}" target="_blank" class="primary-btn">작품 바로가기</a>
                <button onclick="resetQuiz()" class="secondary-btn">다시 하기</button>
            </div>
        </div>
    `;
}

function resetQuiz() {
    currentStep = 0;
    history = [];
    answers = { type: '', genre: '', mood: '' };
    quizContainer.classList.remove('hidden');
    quizHeader.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    renderStep();
}

renderStep();
