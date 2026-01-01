           // Плавная прокрутка для меню
        document.querySelectorAll('.fixed-menu a, .scroll-down, .logo, .btn[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Обработка формы
        document.getElementById('guest-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь должна быть отправка данных в Google Sheets
            // Для демонстрации просто показываем сообщение
            alert('Спасибо за подтверждение! Мы добавили вас в список гостей.');
            this.reset();
        });
        
        // Добавление полей для дополнительных гостей
        document.getElementById('guests-count').addEventListener('change', function() {
            const guestsCount = parseInt(this.value);
            const container = document.getElementById('additional-guests');
            
            container.innerHTML = '';
            
            if (guestsCount > 1) {
                container.style.display = 'block';
                
                for (let i = 2; i <= guestsCount; i++) {
                    const div = document.createElement('div');
                    div.className = 'form-group';
                    div.innerHTML = `
                        <label for="guest${i}">Имя и Фамилия гостя ${i}:</label>
                        <input type="text" id="guest${i}" name="guest${i}">
                    `;
                    container.appendChild(div);
                }
            } else {
                container.style.display = 'none';
            }
        });
        
        // Инициализация карты
        function initMap() {
            // Координаты поселка Ладыгино (приблизительные)
            const map = L.map('map').setView([54.8, 20.5], 12);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Добавляем маркер
            L.marker([54.8, 20.5])
                .addTo(map)
                .bindPopup('Гостевой дом "Сосны, ели и залив"<br>пос. Ладыгино, Калининградская обл.')
                .openPopup();
        }
        
        // Таймер обратного отсчета
        function updateCountdown() {
            const targetDate = new Date('June 13, 2026 16:00:00 GMT+0300').getTime();
            const now = new Date().getTime();
            const timeLeft = targetDate - now;
            
            if (timeLeft < 0) {
                document.getElementById('days').textContent = '000';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(3, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        // Игра Memory
        let gameStarted = false;
        let gameTimer = 0;
        let gameInterval;
        let moves = 0;
        let pairsFound = 0;
        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;
        
        const symbols = ['💍', '💐', '🥂', '🔥', '🏠', '👰', '🤵', '❤️', '🎉', '🎶', '🍖', '🥂', '🌲', '👞', '👗', '👔', '🍰', '🍷'];
        const gameSymbols = [...symbols, ...symbols];
        
        function initGame() {
            const grid = document.getElementById('memory-grid');
            grid.innerHTML = '';
            
            // Перемешиваем символы
            const shuffledSymbols = [...gameSymbols].sort(() => Math.random() - 0.5);
            
            // Создаем карточки
            shuffledSymbols.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.symbol = symbol;
                card.dataset.index = index;
                
                card.addEventListener('click', flipCard);
                grid.appendChild(card);
            });
            
            // Сбрасываем состояние игры
            resetGameState();
        }
        
        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;
            
            this.classList.add('flipped');
            this.textContent = this.dataset.symbol;
            
            if (!firstCard) {
                firstCard = this;
                return;
            }
            
            secondCard = this;
            moves++;
            document.getElementById('moves').textContent = moves;
            
            checkForMatch();
        }
        
        function checkForMatch() {
            const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
            
            if (isMatch) {
                disableCards();
                pairsFound++;
                document.getElementById('pairs').textContent = pairsFound;
                
                if (pairsFound === 18) {
                    clearInterval(gameInterval);
                    setTimeout(() => {
                        alert(`Поздравляем! Вы нашли все пары за ${moves} ходов и ${gameTimer} секунд!`);
                    }, 500);
                }
            } else {
                unflipCards();
            }
        }
        
        function disableCards() {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            
            resetBoard();
        }
        
        function unflipCards() {
            lockBoard = true;
            
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                firstCard.textContent = '';
                secondCard.classList.remove('flipped');
                secondCard.textContent = '';
                
                resetBoard();
            }, 1000);
        }
        
        function resetBoard() {
            [firstCard, secondCard, lockBoard] = [null, null, false];
        }
        
        function resetGameState() {
            clearInterval(gameInterval);
            gameTimer = 0;
            moves = 0;
            pairsFound = 0;
            firstCard = null;
            secondCard = null;
            lockBoard = false;
            
            document.getElementById('moves').textContent = '0';
            document.getElementById('game-timer').textContent = '0';
            document.getElementById('pairs').textContent = '0';
            
            if (gameStarted) {
                gameInterval = setInterval(() => {
                    gameTimer++;
                    document.getElementById('game-timer').textContent = gameTimer;
                }, 1000);
            }
        }
        
        // Инициализация игры при загрузке
        document.addEventListener('DOMContentLoaded', function() {
            // Инициализация карты
            initMap();
            
            // Запуск таймера
            updateCountdown();
            setInterval(updateCountdown, 1000);
            
            // Обработчики для игры Memory
            document.querySelector('.toggle-game').addEventListener('click', function() {
                const gameContainer = document.getElementById('game-container');
                const isHidden = gameContainer.style.display === 'none' || gameContainer.style.display === '';
                
                if (isHidden) {
                    gameContainer.style.display = 'block';
                    gameStarted = true;
                    initGame();
                    gameInterval = setInterval(() => {
                        gameTimer++;
                        document.getElementById('game-timer').textContent = gameTimer;
                    }, 1000);
                    
                    // Прокрутка к игре
                    gameContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    gameContainer.style.display = 'none';
                    gameStarted = false;
                    clearInterval(gameInterval);
                }
            });
            
            document.getElementById('restart-game').addEventListener('click', function() {
                initGame();
            });
            
            // Адаптация игры для мобильных устройств
            function adjustGameForMobile() {
                const grid = document.getElementById('memory-grid');
                if (!grid) return;
                
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // Для мобильных делаем поле 4x9 (итого 36 карточек)
                    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                    
                    // Убедимся, что у нас есть 36 карточек
                    const cards = grid.querySelectorAll('.memory-card');
                    if (cards.length === 36) return;
                    
                    // Если нужно, пересоздадим игру с правильным количеством карточек
                    if (gameStarted) {
                        initGame();
                    }
                } else {
                    // Для десктопа - стандартное 6x6
                    grid.style.gridTemplateColumns = 'repeat(6, 1fr)';
                }
            }
            
            // Вызываем при загрузке и изменении размера окна
            adjustGameForMobile();
            window.addEventListener('resize', adjustGameForMobile);
        });