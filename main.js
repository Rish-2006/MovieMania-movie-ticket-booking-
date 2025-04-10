let isLoggedIn = false;

window.addEventListener('DOMContentLoaded', () => {
    // Check if user was previously logged in
    if (localStorage.getItem('isLoggedIn')) {
        isLoggedIn = true;
        const username = localStorage.getItem('username');
        const signInButton = document.querySelector('.sign-in');
        if (signInButton) {
            signInButton.textContent = username;
            signInButton.classList.add('logged-in');
        }
    }
    
    initSlider();
    setupPopup();
    setupEmailValidation();
    setupSearch();
    setupMovieLinks();
    setupLogout();
});

function initSlider() {
    const slides = document.querySelector(".slides");
    const dots = document.querySelectorAll(".dot");

    if (!slides || dots.length === 0) return;

    let slideIndex = 0;
    const totalSlides = slides.children.length;

    function showSlides() {
        slideIndex = (slideIndex + 1) % totalSlides;
        updateSlide();
    }

    function currentSlide(n) {
        slideIndex = n;
        updateSlide();
    }

    function updateSlide() {
        slides.style.transform = `translateX(-${slideIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === slideIndex);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => currentSlide(index));
    });

    let slideInterval = setInterval(showSlides, 3000);

    slides.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slides.addEventListener('mouseleave', () => {
        slideInterval = setInterval(showSlides, 3000);
    });
}

function setupPopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    const signInButton = document.querySelector('.sign-in');

    if (!popupOverlay || !signInButton) return;

    const closePopup = document.querySelector('.close-popup');
    const signinForm = document.querySelector('.signin-form');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    function showPopup() {
        popupOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    signInButton.addEventListener('click', function(e) {
        if (!isLoggedIn) {
            showPopup();
        }
    });

    closePopup.addEventListener('click', hidePopup);

    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) hidePopup();
    });

    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = this.querySelector('input[type="text"]');
            const passwordInput = this.querySelector('input[type="password"]');
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Reset errors
            usernameInput.style.borderColor = '';
            passwordInput.style.borderColor = '';
            usernameError.style.display = 'none';
            passwordError.style.display = 'none';

            let isValid = true;

            if (!username) {
                usernameInput.style.borderColor = 'red';
                usernameError.style.display = 'block';
                isValid = false;
            }

            if (!password) {
                passwordInput.style.borderColor = 'red';
                passwordError.style.display = 'block';
                isValid = false;
            } else if (password.length < 6) {
                passwordInput.style.borderColor = 'red';
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordError.style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                alert(`Welcome to Movie Mania, ${username}! You can now book tickets.`);
                signInButton.textContent = username;
                signInButton.classList.add('logged-in');
                hidePopup();
            }
        });
    }
}

function setupEmailValidation() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const subscribeButton = document.querySelector('.button1 input[type="button"]');

    if (!emailInput || !emailError || !subscribeButton) return;

    function verifyEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailError.style.display = 'block';
            emailInput.style.borderColor = 'red';
            return false;
        } else {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '';
            alert('Thank you for subscribing!');
            emailInput.value = '';
            return true;
        }
    }

    subscribeButton.addEventListener('click', verifyEmail);
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') verifyEmail();
    });
}

function setupMovieLinks() {
    const movies = document.querySelectorAll('.movie');
    const noResults = document.getElementById('noResults');
    
    movies.forEach(movie => {
        movie.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                const movieTitle = this.querySelector('.movie-info').textContent;
                alert(`Please sign in to book tickets for "${movieTitle}".`);
                document.querySelector('.sign-in').click();
            }
        });
    });
}

function setupLogout() {
    const signInButton = document.querySelector('.sign-in');
    
    signInButton.addEventListener('click', function(e) {
        if (isLoggedIn) {
            e.preventDefault();
            if (confirm('Do you want to log out?')) {
                isLoggedIn = false;
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                this.textContent = 'Sign in';
                this.classList.remove('logged-in');
            }
        }
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search');
    const allMovies = document.querySelectorAll('.movie');
    const noResults = document.getElementById('noResults');

    if (!searchInput) return;

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim().toLowerCase();
            let hasResults = false;

            if (searchTerm === '') {
                allMovies.forEach(movie => {
                    movie.style.display = 'block';
                });
                noResults.style.display = 'none';
                return;
            }

            allMovies.forEach(movie => {
                const movieTitle = movie.getAttribute('data-title').toLowerCase();
                if (movieTitle.includes(searchTerm)) {
                    movie.style.display = 'block';
                    hasResults = true;
                } else {
                    movie.style.display = 'none';
                }
            });

            noResults.style.display = hasResults ? 'none' : 'block';
        }
    });
}

function setupSeatBooking() {
    if (!isLoggedIn) {
        alert('Please sign in to book seats.');
        document.querySelector('.sign-in').click();
        return;
    }
    
    document.addEventListener("DOMContentLoaded", () => {
      const seatContainer = document.querySelector(".seat-container");
      const seatCount = document.getElementById("seatCount");
      const totalPriceEl = document.getElementById("totalPrice");
      const checkoutBtn = document.getElementById("checkoutBtn");
      const modal = document.getElementById("paymentModal");
      const modalQuantity = document.getElementById("modalQuantity");
      const modalSeats = document.getElementById("modalSeats");
      const modalTotal = document.getElementById("modalTotal");

      const rows = 10;
      const cols = 10;
      let selectedSeats = 0;
      let totalPrice = 0;
      const seatPrices = { vip: 200, economy: 100, regular: 150 };

      function updateDisplay() {
        seatCount.textContent = selectedSeats;
        totalPriceEl.textContent = totalPrice;
        checkoutBtn.disabled = selectedSeats === 0;
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const seat = document.createElement("div");
          seat.classList.add("seat");

          let seatType = "regular";
          if (i === 0) {
            seat.classList.add("vip");
            seatType = "vip";
          } else if (i === 1) {
            seat.classList.add("economy");
            seatType = "economy";
          } else {
            seat.classList.add("regular");
          }

          const seatId = `${String.fromCharCode(65 + i)}${j + 1}`;
          seat.dataset.seatId = seatId;
          seat.title = `Seat ${seatId} - ${seatType.toUpperCase()}`;

          if (Math.random() < 0.2) {
            seat.classList.add("occupied");
          } else {
            seat.addEventListener("click", () => {
              if (!seat.classList.contains("occupied")) {
                const type = seat.classList.contains("vip") ? "vip" :
                             seat.classList.contains("economy") ? "economy" : "regular";

                if (seat.classList.contains("selected")) {
                  seat.classList.remove("selected");
                  selectedSeats--;
                  totalPrice -= seatPrices[type];
                } else {
                  seat.classList.add("selected");
                  selectedSeats++;
                  totalPrice += seatPrices[type];
                }
                updateDisplay();
              }
            });
          }

          seatContainer.appendChild(seat);
        }
      }

      updateDisplay();
      checkoutBtn.addEventListener("click", () => {
        const selectedSeatsElements = document.querySelectorAll(".seat.selected");
        const selectedSeatIds = Array.from(selectedSeatsElements).map(seat => seat.dataset.seatId);
      
        // Double-check the number of seats here — this should be accurate
        const quantity = selectedSeatIds.length;
      
        modalQuantity.textContent = `Quantity: ${selectedSeatsElements.length}`;        
        modalSeats.textContent = `Seats: ${selectedSeatIds.join(', ')}`;
        modalTotal.textContent = `Total: Rs ${totalPrice}`;
        modal.style.display = "flex";
      });
      
      });
      
      };

      window.closeModal = function () {
        modal.style.display = "none";
      };
      window.confirmPayment = function () {
        const selectedSeatsElements = document.querySelectorAll(".seat.selected");
        const selectedSeatIds = Array.from(selectedSeatsElements).map(seat => seat.dataset.seatId);
      
        const quantity = selectedSeatIds.length;
        const seatList = selectedSeatIds.join(','); // comma-separated!
        const total = totalPrice;
      
        window.location.href = `payments.html?total=${total}&seats=${seatList}&quantity=${quantity}`;
      };
      
    

    function setupPayment() {
        document.addEventListener("DOMContentLoaded", () => {
            const params = new URLSearchParams(window.location.search);
            const seatsParam = params.get("seats") || "";
            const seatArray = seatsParam.split(",").filter(s => s.trim() !== "");
    
            document.getElementById("seatCount").textContent = seatArray.length;
            document.getElementById("totalPrice").textContent = params.get("total") || 0;
    
            // Optional: Display actual seat list
            const seatListEl = document.getElementById("seatList");
            if (seatListEl) {
                seatListEl.textContent = seatArray.join(", ");
            }
    
            const paymentMethod = document.getElementById("paymentMethod");
            const cardDetails = document.getElementById("cardDetails");
            const razorpayDetails = document.getElementById("razorpayDetails");
            const payBtn = document.getElementById("payBtn");
    
            paymentMethod.addEventListener("change", () => {
                if (paymentMethod.value === "razorpay") {
                    cardDetails.style.display = "none";
                    razorpayDetails.style.display = "block";
                } else {
                    cardDetails.style.display = "block";
                    razorpayDetails.style.display = "none";
                }
            });
    
            payBtn.addEventListener("click", () => {
                if (paymentMethod.value === "card") {
                    const cardNumber = document.getElementById("cardNumber").value.replace(/\D/g, "");
                    const expDate = document.getElementById("expDate").value;
                    const cvv = document.getElementById("cvv").value.replace(/\D/g, "");
                    const currentDate = new Date();
                    const selectedDate = new Date(expDate + "-01");
    
                    if (cardNumber.length !== 16) {
                        alert("Invalid card number! It must be 16 digits.");
                        return;
                    }
                    if (!expDate || selectedDate <= currentDate) {
                        alert("Invalid expiration date! The card must be valid.");
                        return;
                    }
                    if (cvv.length !== 3) {
                        alert("Invalid CVV! It must be 3 digits.");
                        return;
                    }
                } else if (paymentMethod.value === "razorpay") {
                    const phoneNumber = document.getElementById("phoneNumber").value.replace(/\D/g, "");
                    const phoneregex = /^[6-9]\d{9}$/;
    
                    if (!phoneregex.test(phoneNumber)) {
                        alert("Invalid phone number! It must be 10 digits and begin with 6–9.");
                        return;
                    }
                }
    
                alert("🎉 Payment Successful! Booking Confirmed.");
                window.location.href = "index.html";
            });
        });
    }