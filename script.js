document.addEventListener("DOMContentLoaded", function() {
    const logoAnimation = document.getElementById("logo-animation");
    const mainContent = document.getElementById("main-content");
    const video = document.getElementById("background-video");

    // 動画の読み込みを最適化
    function initVideo() {
        if (!video) return;
        
        // 動画の読み込みを遅延させる
        setTimeout(() => {
            video.preload = "auto";
            video.load();
        }, 2500); // ロゴアニメーション終了後に読み込み開始
    }

    // ロゴアニメーションの設定
    const logoImage = document.getElementById('logo-image');
    if (logoImage) {
        setTimeout(() => {
            logoImage.classList.add('appear');
        }, 100);

        setTimeout(() => {
            logoAnimation.style.opacity = '0';
            mainContent.style.opacity = '1';
            initVideo(); // 動画の初期化を開始
        }, 2000);

        setTimeout(() => {
            logoAnimation.style.display = 'none';
            if (video) {
                playVideo();
            }
        }, 2500);
    }

    // 動画の再生を最適化
    function playVideo() {
        if (!video) return;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(function(error) {
                console.log("Video play failed:", error);
                setTimeout(playVideo, 1000);
            });
        }
    }

    // 動画の再生イベントリスナー
    video.addEventListener('canplaythrough', function() {
        if (video.paused) {
            playVideo();
        }
    }, { once: true }); // イベントリスナーを一度だけ実行

    // ページ読み込み時にテーマを設定
    // 常にダークモードを適用
    document.body.classList.add('dark-theme');

    // ページ読み込み時にロゴとハンバーガーメニューの色を設定
    updateLogoColor();

    // 作品リストの生成
    generateWorks();

    // 画像のダウンロード防止策を実行
    preventImageDownload();

    // 画像のロード状態を確認
    const images = document.querySelectorAll('.work-item img');
    images.forEach(img => {
        if (img.complete) {
            console.log('Image is loaded:', img.src);
        } else {
            console.log('Image is not loaded:', img.src);
            img.addEventListener('load', function() {
                console.log('Image loaded:', img.src);
            });
            img.addEventListener('error', function() {
                console.warn('WebP not supported or image not found, falling back to PNG:', this.src);
                this.src = this.src.replace('.webp', '.png');
            });
        }
    });
});

// 作品リストの生成
function generateWorks() {
    const worksGrid = document.getElementById('works-grid');
    const totalWorks = 24;

    for (let i = 1; i <= totalWorks; i++) {
        // クラス名を works-item に変更（work-item から）
        const workItem = document.createElement('div');
        workItem.className = 'works-item';
        workItem.onclick = function() { openFullscreen(this); };

        const img = document.createElement('img');
        img.src = `assets/works/${i.toString().padStart(2, '0')}.webp`;
        img.loading = 'lazy';
        img.alt = `Work ${i}`;

        workItem.appendChild(img);
        worksGrid.appendChild(workItem);
    }
}

// テーマ切り替え
function toggleTheme() {
    const body = document.body;
    const menuOverlay = document.getElementById("menu-overlay");
    const logoContainer = document.getElementById("logo-container");
    const isMenuOpen = menuOverlay.classList.contains("open");
    
    // テーマの切り替え
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');
    
    // メニューが開いている場合の処理
    if (isMenuOpen) {
        const isDarkTheme = body.classList.contains('dark-theme');
        
        // ダークモードの場合
        if (isDarkTheme) {
            logoContainer.querySelector('.dark-theme-logo').style.opacity = '1';
            logoContainer.querySelector('.light-theme-logo').style.opacity = '0';
        }
        // ライトモードの場合
        else {
            logoContainer.querySelector('.light-theme-logo').style.opacity = '1';
            logoContainer.querySelector('.dark-theme-logo').style.opacity = '0';
        }
    } else {
        // メニューが閉じている場合は通常の更新
        updateLogoColor();
    }
}

// スクロール位置を監視してロゴとハンバーガーメニューの色を変更する関数
function updateLogoColor() {
    const overlay = document.getElementById('overlay');
    const menuOverlay = document.getElementById('menu-overlay');
    
    // メニューが開いているときは処理をスキップ
    if (menuOverlay.classList.contains('open')) {
        return;
    }

    const darkSections = [];
    let isOverDarkSection = false;

    // 動画セクションを暗いセクションとして追加
    const videoSection = document.getElementById('video-section');
    if (videoSection) {
        darkSections.push(videoSection);
    }

    // Worksセクションの画像を暗いセクションとして追加
    const worksItems = document.querySelectorAll('.works-item');
    worksItems.forEach(item => {
        darkSections.push(item);
    });

    // オーバーレイの位置を取得
    const overlayRect = overlay.getBoundingClientRect();
    const overlayCenter = {
        x: overlayRect.left + (overlayRect.width / 2),
        y: overlayRect.top + (overlayRect.height / 2)
    };

    // 暗いセクション上にあるかチェック
    darkSections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();
        if (
            overlayCenter.y >= sectionRect.top &&
            overlayCenter.y <= sectionRect.bottom &&
            overlayCenter.x >= sectionRect.left &&
            overlayCenter.x <= sectionRect.right
        ) {
            isOverDarkSection = true;
        }
    });

    // 暗いセクション上にある場合は白、それ以外はテーマに従う
    if (isOverDarkSection) {
        overlay.classList.add('over-dark-section');
    } else {
        overlay.classList.remove('over-dark-section');
    }
}

// スクロールイベントリスナーを追加
document.addEventListener('scroll', updateLogoColor);
window.addEventListener('resize', updateLogoColor);

// テーマ切り替え後に updateLogoColor を実行
document.getElementById('logo-container').addEventListener('click', function() {
    toggleTheme();
});

// ハンバーガーメニューの開閉
document.getElementById("hamburger-menu").addEventListener("click", function() {
    toggleMenu();
});

// メニューを開く関数
function toggleMenu() {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const menuOverlay = document.getElementById("menu-overlay");
    const overlay = document.getElementById("overlay");
    const logoContainer = document.getElementById("logo-container");
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    hamburgerMenu.classList.toggle('active');
    menuOverlay.classList.toggle("open");
    
    // メニューが開かれたとき
    if (menuOverlay.classList.contains("open")) {
        // ライトモードの場合
        if (!isDarkTheme) {
            logoContainer.querySelector('.light-theme-logo').style.opacity = '1';
            logoContainer.querySelector('.dark-theme-logo').style.opacity = '0';
        }
        // ダークモードの場合
        else {
            logoContainer.querySelector('.dark-theme-logo').style.opacity = '1';
            logoContainer.querySelector('.light-theme-logo').style.opacity = '0';
        }
    } else {
        // メニューが閉じられたとき、インラインスタイルを削除
        logoContainer.querySelector('.light-theme-logo').style.opacity = '';
        logoContainer.querySelector('.dark-theme-logo').style.opacity = '';
        // 通常の色変更処理を実行
        updateLogoColor();
    }
}

// メニューを閉じる関数
function closeMenu() {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const menuOverlay = document.getElementById("menu-overlay");
    const logoContainer = document.getElementById("logo-container");
    
    // メニューを閉じる
    hamburgerMenu.classList.remove('active');
    menuOverlay.classList.remove("open");
    
    // インラインスタイルを削除（もし存在すれば）
    const lightThemeLogo = logoContainer.querySelector('.light-theme-logo');
    const darkThemeLogo = logoContainer.querySelector('.dark-theme-logo');
    if (lightThemeLogo) lightThemeLogo.style.opacity = '';
    if (darkThemeLogo) darkThemeLogo.style.opacity = '';
    
    // 現在のスクロール位置に基づいてロゴの色を更新
    updateLogoColor();
}

// メニューオーバーレイの外側をクリックして閉じる
document.getElementById('menu-overlay').addEventListener('click', function(event) {
    // ハンバーガーメニューボタン以外をクリックした場合は閉じる
    if (!event.target.closest('#hamburger-menu')) {
        closeMenu();
    }
});

// オーバーレイ（ヘッダー）領域のクリックも処理
document.getElementById('overlay').addEventListener('click', function(event) {
    // ロゴとハンバーガーメニュー以外のクリックでメニューを閉じる
    if (!event.target.closest('#logo-container') && !event.target.closest('#hamburger-menu')) {
        closeMenu();
    }
});

// メニュー内のリンクをクリックしたときにメニューを閉じる
document.querySelectorAll('.menu-content a').forEach(link => {
    link.addEventListener('click', function() {
        closeMenu();
    });
});

// 画像の全画面表示
function openFullscreen(element) {
    const overlay = document.getElementById('fullscreen-overlay');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const image = element.querySelector('img');

    fullscreenImage.src = image.src;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 全画面表示を閉じる
function closeFullscreen(event) {
    if (event) {
        event.stopPropagation();
    }
    const overlay = document.getElementById('fullscreen-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
}

// ESCキーでも全画面表示を閉じられるように
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.getElementById('fullscreen-overlay').style.display === 'flex') {
            closeFullscreen();
        }
    }
});

// フルスクリーン画像クリック時の処理
document.getElementById('fullscreen-overlay').addEventListener('click', function(event) {
    if (event.target === this) {
        closeFullscreen();
    }
});

// 右クリック無効化
document.addEventListener("contextmenu", function(event) {
    if(event.target.nodeName === 'IMG') {
        event.preventDefault();
    }
}, false);

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 60;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

function preventImageDownload() {
    // 右クリック防止
    document.addEventListener('contextmenu', function(e) {
        if(e.target.nodeName === 'IMG') {
            e.preventDefault();
        }
    }, false);

    // ドラッグ防止
    const workImages = document.querySelectorAll('.work-item img');
    workImages.forEach(img => {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    });
}
