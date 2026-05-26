const generateBtn = document.getElementById('generate-btn');
const lottoContainer = document.getElementById('lotto-container');

function generateLottoNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers.sort((a, b) => a - b);
}

function getBallClass(num) {
    if (num <= 10) return 'ball-1';
    if (num <= 20) return 'ball-11';
    if (num <= 30) return 'ball-21';
    if (num <= 40) return 'ball-31';
    return 'ball-41';
}

function displayLotto() {
    lottoContainer.innerHTML = ''; // 기존 번호 삭제
    
    for (let i = 0; i < 5; i++) {
        const lottoSet = generateLottoNumbers();
        const setDiv = document.createElement('div');
        setDiv.className = 'lotto-set';
        
        lottoSet.forEach(num => {
            const ball = document.createElement('div');
            ball.className = `ball ${getBallClass(num)}`;
            ball.textContent = num;
            setDiv.appendChild(ball);
        });
        
        lottoContainer.appendChild(setDiv);
    }
}

generateBtn.addEventListener('click', displayLotto);

// 페이지 로드 시 처음 한 번 실행
displayLotto();
