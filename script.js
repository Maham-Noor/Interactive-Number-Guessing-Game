const minNum = 1;
        const maxNum = 100;
        const maxAttempts = 10;
        
        let targetNumber;
        let attemptsLeft;

        const gameCard = document.getElementById('game-card');
        const guessInput = document.getElementById('guess-input');
        const submitBtn = document.getElementById('submit-btn');
        const feedbackMsg = document.getElementById('feedback-msg');
        const attemptsSpan = document.getElementById('attempts-left');
        const restartBtn = document.getElementById('restart-btn');

        function initGame() {
            targetNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            attemptsLeft = maxAttempts;
            
            attemptsSpan.textContent = attemptsLeft;
            feedbackMsg.textContent = "Good luck!";
            feedbackMsg.className = '';
            guessInput.value = '';
            guessInput.disabled = false;
            submitBtn.disabled = false;
            restartBtn.style.display = 'none';
            gameCard.className = 'game-container'; // Reset animations
            
            guessInput.focus();
        }

        // --- NEW: Confetti Effect ---
        function fireConfetti() {
            const count = 200;
            const defaults = { origin: { y: 0.7 }, zIndex: 0 };

            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio)
                });
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }

        function triggerShake() {
            gameCard.classList.remove('shake');
            void gameCard.offsetWidth; // Trigger reflow to restart animation
            gameCard.classList.add('shake');
        }

        function processGuess() {
            const userGuess = parseInt(guessInput.value);

            if (isNaN(userGuess) || userGuess < minNum || userGuess > maxNum) {
                feedbackMsg.textContent = `Enter a number between ${minNum}-${maxNum}!`;
                feedbackMsg.className = 'wrong';
                triggerShake();
                return;
            }

            attemptsLeft--;
            attemptsSpan.textContent = attemptsLeft;

            if (userGuess === targetNumber) {
                endGame(true, `🏆 WOAH! ${targetNumber} is correct!`);
                fireConfetti();
                gameCard.classList.add('win-glow');
            } else if (attemptsLeft === 0) {
                endGame(false, `GAME OVER! It was ${targetNumber}.`);
                triggerShake();
            } else {
                const difference = Math.abs(targetNumber - userGuess);
                const direction = userGuess > targetNumber ? "High" : "Low";
                
                let hintMessage = "";
                let colorClass = "";

                if (difference <= 3) {
                    hintMessage = `🔥 BOILING! A bit too ${direction}!`;
                    colorClass = "boiling";
                } else if (difference <= 10) {
                    hintMessage = `Hot! A bit too ${direction}.`;
                    colorClass = "hot";
                } else if (difference <= 20) {
                    hintMessage = `Warm... too ${direction}.`;
                    colorClass = "warm";
                } else if (difference <= 40) {
                    hintMessage = `Cold. Too ${direction}.`;
                    colorClass = "cold";
                } else {
                    hintMessage = `❄️ FREEZING! Way too ${direction}!`;
                    colorClass = "freezing";
                }

                feedbackMsg.textContent = hintMessage;
                feedbackMsg.className = colorClass;
            }

            guessInput.value = '';
            if (attemptsLeft > 0) guessInput.focus();
        }

        function endGame(isWin, message) {
            feedbackMsg.textContent = message;
            feedbackMsg.className = isWin ? 'correct' : 'wrong';
            guessInput.disabled = true;
            submitBtn.disabled = true;
            restartBtn.style.display = 'block';
        }

        submitBtn.addEventListener('click', processGuess);
        guessInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processGuess(); });
        restartBtn.addEventListener('click', initGame);

        initGame();