function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return; // на этой странице формы нет — тихо выходим

  const nameInput = document.getElementById('res-name'),
        phoneInput = document.getElementById('res-phone'),
        guestsInput = document.getElementById('res-guests'),
        timeInput = document.getElementById('res-time'),
        dateInput = document.getElementById('res-date'),
        sendBtn = document.getElementById('sendBtn'),
        formStatus = document.getElementById('formStatus');
  
  const setError = (inputEl, message) => {
    const box = inputEl.closest('.input-box');
    const errorMsg = box.querySelector('.error-message');
    box.classList.add('error');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
  };
  
  const clearError = (inputEl) => {
    const box = inputEl.closest('.input-box');
    const errorMsg = box.querySelector('.error-message');
    box.classList.remove('error');
    errorMsg.style.display = 'none';
  };
  
  /* === Ім'я (логіка з оригіналу без змін) === */
  const validateName = () => {
    const value = nameInput.value.trim();
    if (!value) {
      setError(nameInput, "To pole nie może być puste");
      return false;
    }
    if (!/^[A-Za-zÀ-ſ\s'-]{3,}$/.test(value)) {
      setError(nameInput, "Imię zawiera niedozwolone znaki");
      return false;
    }
    clearError(nameInput);
    return true;
  };
  
  /* === Телефон — під формат від 9 до 13 цифр ===. */
  const validatePhone = () => {
    const digits = phoneInput.value.replace(/\D/g, "");
  
    if (!digits) {
      setError(phoneInput, "To pole nie może być puste");
      return false;
    }
    if (digits.length < 9 || digits.length > 13) {
      setError(phoneInput, "Numer telefonu musi mieć od 9 do 13 cyfr");
      return false;
    }
    clearError(phoneInput);
    return true;
  };
  
  /* === Телефон — міжнародний формат, без прив'язки до коду країни === */
  phoneInput.addEventListener("input", () => {
    const raw = phoneInput.value;
    const hasPlus = raw.trim().startsWith("+");
    const digits = raw.replace(/\D/g, "").slice(0, 13); // обмежуємо максимум 13 цифр
  
    phoneInput.value = (hasPlus ? "+" : "") + digits;
  
    validatePhone();
  });
  
  /* === Дата і час — тільки цифри, автопідстановка роздільників ===
     Дозволяємо вводити виключно цифри; крапка/двокрапка вставляються самі. */
  function guardDigitsOnly(inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
      if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
  
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setError(inputEl, "Wprowadź tylko cyfry");
        clearTimeout(inputEl._errTimer);
        inputEl._errTimer = setTimeout(() => {
          // не гасимо помилку, якщо поле й так невалідне з іншої причини
          if (inputEl === timeInput) validateTime();
          if (inputEl === dateInput) validateDate();
        }, 1200);
      }
    });
  }
  
  guardDigitsOnly(timeInput);
  guardDigitsOnly(dateInput);
  
  timeInput.addEventListener("input", () => {
    let digits = timeInput.value.replace(/\D/g, "").slice(0, 4);
    timeInput.value = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
  });
  
  dateInput.addEventListener("input", () => {
    let digits = dateInput.value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 4) {
      dateInput.value = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
    } else if (digits.length > 2) {
      dateInput.value = `${digits.slice(0, 2)}.${digits.slice(2)}`;
    } else {
      dateInput.value = digits;
    }
  });
  
  const validateTime = () => {
    const match = timeInput.value.match(/^(\d{2}):(\d{2})$/);
    if (!match) {
      setError(timeInput, "Podaj czas w formacie GG:MM");
      return false;
    }
    const [, hh, mm] = match.map(Number) ? [null, +match[1], +match[2]] : [];
    if (+match[1] > 23 || +match[2] > 59) {
      setError(timeInput, "Nieprawidłowy czas");
      return false;
    }
    clearError(timeInput);
    return true;
  };
  
  const validateDate = () => {
    const match = dateInput.value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) {
      setError(dateInput, "Podaj datę w formacie DD.MM.RRRR");
      return false;
    }
    const [, dd, mm, yyyy] = match;
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (+dd > 31 || +mm > 12 || d < today) {
      setError(dateInput, "Nieprawidłowa lub przeszła data");
      return false;
    }
    clearError(dateInput);
    return true;
  };
  
  const validateGuests = () => {
    const value = +guestsInput.value;
    if (!value || value < 1) {
      setError(guestsInput, "Podaj liczbę osób");
      return false;
    }
    clearError(guestsInput);
    return true;
  };
  
  nameInput.addEventListener("input", validateName);
  guestsInput.addEventListener("input", validateGuests);
  timeInput.addEventListener("blur", validateTime);
  dateInput.addEventListener("blur", validateDate);
  
  /* === Відправка === */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const isValid = [validateName(), validatePhone(), validateGuests(), validateTime(), validateDate()]
      .every(Boolean);
  
    if (!isValid) return;
  
    const formData = new FormData();
    formData.append("name", nameInput.value.trim());
    formData.append("phone", phoneInput.value.trim());
    formData.append("guests", guestsInput.value.trim());
    formData.append("time", timeInput.value.trim());
    formData.append("date", dateInput.value.trim());
  
    sendBtn.disabled = true;
    formStatus.textContent = "Wysyłanie...";
    formStatus.className = "reservation-status reservation-status--sending";

    try {
      const response = await fetch("./php/mail.php", { method: "POST", body: formData });
      const result = await response.json();

      formStatus.textContent = "";
      formStatus.className = "reservation-status";

      if (result.status === "success") {
        showSuccessMessage();
        form.reset();
      } else {
        formStatus.textContent = result.message || "Wystąpił błąd. Spróbuj ponownie.";
        formStatus.className = "reservation-status reservation-status--error";
      }
    } catch (error) {
      console.error("Błąd sieci lub serwera:", error);
      formStatus.textContent = "Błąd połączenia z serwerem. Spróbuj ponownie.";
      formStatus.className = "reservation-status reservation-status--error";
    } finally {
      sendBtn.disabled = false;
}
  });
  
  /* === Попап успіху === */
  const successMessage = document.getElementById("successMessage");
  const closeSuccess = document.getElementById("closeSuccess");
  let successTimer;
  
  function showSuccessMessage() {
    successMessage.classList.add("active");
    successTimer = setTimeout(hideSuccessMessage, 5000);
  }
  function hideSuccessMessage() {
    successMessage.classList.remove("active");
    clearTimeout(successTimer);
  }
  closeSuccess.addEventListener("click", hideSuccessMessage);
}
