const DATA = [
    {
        title: "전지적 독자 시점",
        type: "webtoon",
        genre: "fantasy",
        mood: "intense",
        desc: "멸망한 세상에서 유일하게 결말을 아는 독자가 되어 살아남는 법.",
        link: "https://comic.naver.com/webtoon/list?titleId=747269"
    },
    {
        title: "나 혼자만 레벨업",
        type: "webtoon",
        genre: "action",
        mood: "intense",
        desc: "최약체에서 최강의 헌터로! 압도적인 작화와 통쾌한 액션.",
        link: "https://page.kakao.com/content/50866481"
    },
    {
        title: "유미의 세포들",
        type: "webtoon",
        genre: "romance",
        mood: "heart-warming",
        desc: "내 머릿속 세포들이 들려주는 유미의 평범하면서도 특별한 이야기.",
        link: "https://comic.naver.com/webtoon/list?titleId=651673"
    },
    {
        title: "데뷔 못 하면 죽는 병 걸림",
        type: "novel",
        genre: "fantasy",
        mood: "chill",
        desc: "아이돌 서바이벌과 시스템이 결합된 화제의 웹소설.",
        link: "https://page.kakao.com/content/56325530"
    },
    {
        title: "화산귀환",
        type: "novel",
        genre: "action",
        mood: "intense",
        desc: "매화 검존 청명이 백 년 만에 환생하여 무너진 화산파를 다시 일으킨다.",
        link: "https://series.naver.com/novel/detail.series?productNo=4130558"
    },
    {
        title: "상수리나무 아래",
        type: "novel",
        genre: "romance",
        mood: "emotional",
        desc: "말더듬이 영애 리프탄과 대륙 최고의 기사 리프탄의 애절한 판타지 로맨스.",
        link: "https://ridibooks.com/books/1922000007"
    }
];

const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const quizHeader = document.getElementById('quiz-header');

let currentStep = 0;
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
            { label: "로맨스", value: "romance" }
        ]
    },
    {
        question: "지금 기분은 어떠신가요?",
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
    quizContainer.appendChild(stepDiv);
}

function handleChoice(key, value) {
    answers[key] = value;
    currentStep++;

    if (currentStep < steps.length) {
        renderStep();
    } else {
        showResult();
    }
}

function showResult() {
    quizContainer.classList.add('hidden');
    quizHeader.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // 간단한 필터링 로직: 타입 일치 -> 장르/무드 중 하나라도 일치하면 점수 부여
    const scores = DATA.map(item => {
        let score = 0;
        if (item.type === answers.type) score += 5;
        if (item.genre === answers.genre) score += 3;
        if (item.mood === answers.mood) score += 2;
        return { ...item, score };
    });

    const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

    resultContainer.innerHTML = `
        <div class="result-card">
            <span class="result-tag">${bestMatch.type === 'webtoon' ? '웹툰' : '소설'} | ${bestMatch.genre}</span>
            <h2 class="result-title">${bestMatch.title}</h2>
            <p class="result-desc">${bestMatch.desc}</p>
            <div class="btn-group">
                <a href="${bestMatch.link}" target="_blank" class="primary-btn">작품 바로가기</a>
                <button onclick="resetQuiz()" class="secondary-btn">다시 하기</button>
            </div>
        </div>
    `;
}

function resetQuiz() {
    currentStep = 0;
    answers = { type: '', genre: '', mood: '' };
    quizContainer.classList.remove('hidden');
    quizHeader.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    renderStep();
}

// 시작
renderStep();
