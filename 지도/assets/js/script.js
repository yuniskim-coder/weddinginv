// 캘린더 생성
function generateCalendar() {
    const date = new Date(2025, 8, 25); // 2025년 9월 (월은 0부터 시작하므로 8)
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    document.getElementById('calendar-month-year').textContent = `${year}년 ${monthNames[month]}`;

    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';

    // 빈칸 채우기
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day-cell');
        daysContainer.appendChild(emptyCell);
    }

    // 날짜 채우기
    for (let i = 1; i <= lastDayOfMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell', 'rounded-full');
        dayCell.textContent = i;
        if (i === day) {
            dayCell.classList.add('wedding-day', 'shadow-md');
        }
        daysContainer.appendChild(dayCell);
    }
}

// 지도 생성
function initMap() {
    var mapContainer = document.getElementById('kakaoMap');
    var mapOption = {
        center: new kakao.maps.LatLng(37.595599, 126.668371),
        level: 4
    };
    var map = new kakao.maps.Map(mapContainer, mapOption);
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
    var imageSize = new kakao.maps.Size(64, 69);
    var imageOption = {offset: new kakao.maps.Point(27, 69)};
    
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
    var markerPosition = new kakao.maps.LatLng(37.595599, 126.668371);
    
    var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage
    });
    
    marker.setMap(map);
}

// 페이지 로드 후 캘린더 생성 및 갤러리 초기화
window.onload = function() {
    generateCalendar();
    setupGallery();
    setupShareFeatures();
    setupMapButtons();
    setupScrollAnimation();
    
    // 꽃잎 애니메이션 시작
    petalAnimation = new PetalAnimation();
    petalAnimation.start();
};

// 갤러리 이미지 모달 기능
function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.image-modal-close-btn');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImage.src = this.src;
            modalImage.alt = this.alt;
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// 공유 기능
function setupShareFeatures() {
    const copyUrlBtn = document.getElementById('copy-url');
    const togglePetalsBtn = document.getElementById('toggle-petals');
    const toggleMusicBtn = document.getElementById('toggle-music');
    const backgroundMusic = document.getElementById('background-music');
    
    copyUrlBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(window.location.href).then(function() {
            alert('링크가 클립보드에 복사되었습니다!');
        }).catch(function() {
            // 폴백: 텍스트 선택 방식
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('링크가 클립보드에 복사되었습니다!');
        });
    });

    // 꽃잎 애니메이션 토글
    togglePetalsBtn.addEventListener('click', function() {
        if (petalAnimation.isActive) {
            petalAnimation.stop();
            togglePetalsBtn.textContent = '🌸 꽃잎 ON';
            togglePetalsBtn.classList.remove('bg-pink-500', 'hover:bg-pink-600');
            togglePetalsBtn.classList.add('bg-gray-500', 'hover:bg-gray-600');
        } else {
            petalAnimation.start();
            togglePetalsBtn.textContent = '🌸 꽃잎 OFF';
            togglePetalsBtn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
            togglePetalsBtn.classList.add('bg-pink-500', 'hover:bg-pink-600');
        }
    });

    // 배경음악 토글
    if (toggleMusicBtn && backgroundMusic) {
        toggleMusicBtn.addEventListener('click', function() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    toggleMusicBtn.textContent = '🎵 음악 OFF';
                    toggleMusicBtn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
                    toggleMusicBtn.classList.add('bg-purple-500', 'hover:bg-purple-600');
                }).catch(error => {
                    console.log('음악 재생 실패:', error);
                    alert('음악 재생에 실패했습니다. 사용자 인터랙션 후 다시 시도해주세요.');
                });
            } else {
                backgroundMusic.pause();
                toggleMusicBtn.textContent = '🎵 음악 ON';
                toggleMusicBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
                toggleMusicBtn.classList.add('bg-gray-500', 'hover:bg-gray-600');
            }
        });

        // 초기 상태 설정 (음악은 기본적으로 정지 상태)
        toggleMusicBtn.classList.add('bg-gray-500', 'hover:bg-gray-600');
        
        // 음량 설정 (50%)
        backgroundMusic.volume = 0.5;
    }
}

// 지도 버튼 기능
function setupMapButtons() {
    const kakaoMapBtn = document.querySelector('.bg-yellow-400');
    const naverMapBtn = document.querySelector('.bg-green-500');
    
    if (kakaoMapBtn) {
        kakaoMapBtn.addEventListener('click', function() {
            window.open('https://map.kakao.com/link/map/웨딩홀,37.595599,126.668371', '_blank');
        });
    }
    
    if (naverMapBtn) {
        naverMapBtn.addEventListener('click', function() {
            window.open('https://map.naver.com/v5/search/37.595599,126.668371', '_blank');
        });
    }
}

// 스크롤 애니메이션
function setupScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);

    // 섹션들에 observer 적용
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// 떨어지는 꽃잎 애니메이션
class PetalAnimation {
    constructor() {
        this.container = document.getElementById('petals-container');
        this.petals = [];
        this.petalTypes = ['heart', 'flower', 'rose', 'sparkle'];
        this.animationTypes = ['fall', 'fallWithSway', 'fallLeft', 'fallRight'];
        this.isActive = false;
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // 랜덤 꽃잎 타입 선택
        const petalType = this.petalTypes[Math.floor(Math.random() * this.petalTypes.length)];
        petal.classList.add(petalType);
        
        // 랜덤 위치 설정
        petal.style.left = Math.random() * 100 + '%';
        petal.style.fontSize = (Math.random() * 10 + 15) + 'px';
        
        // 랜덤 색상 (분홍색 계열)
        const colors = ['#fca5a5', '#f472b6', '#ec4899', '#db2777', '#be185d'];
        petal.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        // 랜덤 애니메이션 선택
        const animationType = this.animationTypes[Math.floor(Math.random() * this.animationTypes.length)];
        const duration = Math.random() * 3 + 2; // 2-5초
        const delay = Math.random() * 2; // 0-2초 지연
        
        petal.style.animation = `${animationType} ${duration}s linear ${delay}s infinite`;
        
        this.container.appendChild(petal);
        this.petals.push(petal);
        
        // 애니메이션 완료 후 요소 제거
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
            const index = this.petals.indexOf(petal);
            if (index > -1) {
                this.petals.splice(index, 1);
            }
        }, (duration + delay) * 1000);
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        
        // 모바일에서는 꽃잎 개수 줄이기
        const isMobile = window.innerWidth < 768;
        const initialPetals = isMobile ? 3 : 5;
        const spawnRate = isMobile ? 0.5 : 0.7; // 모바일: 50%, 데스크톱: 70%
        const spawnInterval = isMobile ? 1200 : 800; // 모바일: 1.2초, 데스크톱: 0.8초
        
        // 초기 꽃잎들 생성
        for (let i = 0; i < initialPetals; i++) {
            setTimeout(() => this.createPetal(), i * 300);
        }
        
        // 주기적으로 새 꽃잎 생성
        this.interval = setInterval(() => {
            if (Math.random() < spawnRate) {
                this.createPetal();
            }
        }, spawnInterval);
    }

    stop() {
        if (!this.isActive) return;
        this.isActive = false;
        
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        // 기존 꽃잎들 제거
        this.petals.forEach(petal => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        });
        this.petals = [];
    }
}

// 전역 꽃잎 애니메이션 인스턴스
let petalAnimation;

// 카카오맵 API 로드 후 지도 초기화 함수 실행
kakao.maps.load(function() {
    initMap();
});
