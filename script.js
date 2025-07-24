// アイコン画像ファイル名のリスト
const iconFiles = [
    ...Array.from({length: 27}, (_, i) => `${i+1}.png`)
];

// 〇グリッド自動生成
const circleGrid = document.getElementById('circle-grid');
let circles = [];
if (circleGrid) {
    for (let i = 0; i < 30; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circleGrid.appendChild(circle);
    }
    circles = Array.from(circleGrid.getElementsByClassName('circle'));
}

// 〇の中にアイコンが5個そろったらビンゴ画像を表示
function checkBingo() {
    const filledCount = circles.filter(c => c.childElementCount > 0).length;
    const overlay = document.getElementById('bingo-overlay');
    if (filledCount > 0 && filledCount % 5 === 0) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// ポップアップ用の要素を取得
const iconPopup = document.getElementById('icon-popup');
let currentCircle = null; // どの〇がクリックされたかを保持

// ポップアップ外クリックで閉じる処理
function handlePopupClose(e) {
    if (iconPopup.style.display === 'flex' && !iconPopup.contains(e.target)) {
        iconPopup.style.display = 'none';
        currentCircle = null;
        document.removeEventListener('mousedown', handlePopupClose);
    }
}

// 使用済みアイコンの管理
let usedIcons = new Set();

// 〇クリック時にアイコン選択ポップアップを表示
circles.forEach(circle => {
    circle.addEventListener('click', (event) => {
        event.stopPropagation();
        const iconImg = circle.querySelector('img');
        if (iconImg) {
            // アイコンが入っていれば削除
            const file = iconImg.alt;
            circle.removeChild(iconImg);
            usedIcons.delete(file);
            checkBingo();
            return;
        }
        // 空ならポップアップ表示
        currentCircle = circle;
        iconPopup.innerHTML = '';
        iconFiles.forEach(file => {
            if (usedIcons.has(file)) return;
            const img = document.createElement('img');
            img.src = `icons/${file}`;
            img.alt = file;
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentCircle && currentCircle.childElementCount === 0) {
                    const iconImg = document.createElement('img');
                    iconImg.src = `icons/${file}`;
                    iconImg.alt = file;
                    currentCircle.appendChild(iconImg);
                    iconPopup.style.display = 'none';
                    usedIcons.add(file);
                    currentCircle = null;
                    checkBingo();
                    document.removeEventListener('mousedown', handlePopupClose);
                }
            });
            iconPopup.appendChild(img);
        });
        iconPopup.style.display = 'flex';
        setTimeout(() => {
            document.addEventListener('mousedown', handlePopupClose);
        }, 0);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 閉じるボタン
    const closeBingoBtn = document.getElementById('close-bingo');
    if (closeBingoBtn) {
        closeBingoBtn.addEventListener('click', function(event) {
            document.getElementById('bingo-overlay').classList.remove('show');
            event.stopPropagation();
        });
    }
    // ビンゴ画像自体のクリックでも閉じる
    const bingoImg = document.getElementById('bingo-img');
    if (bingoImg) {
        bingoImg.addEventListener('click', function(event) {
            document.getElementById('bingo-overlay').classList.remove('show');
            event.stopPropagation();
        });
    }
});