function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str ?? '';
      return div.innerHTML;
    }
 
    function starString(rating) {
      const r = Math.max(0, Math.min(5, Math.round(rating || 0)));
      return '★'.repeat(r) + '☆'.repeat(5 - r);
    }
 
    function reviewSlideHtml(r) {
      return `
        <div class="swiper-slide">
          <article class="review__card">
            <div class="review__head">
              <img
                class="review__avatar"
                src="${escapeHtml(r.authorPhoto || './public/Avatar-Placeholder@2x.png')}"
                alt=""
                loading="lazy"
                onerror="this.style.background='#555'; this.src='./public/Avatar-Placeholder@2x.png';"
              />
              <div class="review__name-block">
                <p class="review__author">
                  ${r.authorUrl
                    ? `<a href="${escapeHtml(r.authorUrl)}" target="_blank" rel="noopener">${escapeHtml(r.author)}</a>`
                    : escapeHtml(r.author)}
                </p>
                <div class="review__stars" aria-label="Ocena: ${r.rating} na 5">${starString(r.rating)}</div>
              </div>
            </div>
            <p class="review__text">${escapeHtml(r.text)}</p>
            <div class="review__google-badge">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.8v3.6h5.1c-.2 1.2-1.6 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6c1.8 0 2.9.7 3.6 1.4l2.5-2.4C16.6 4.4 14.5 3.6 12 3.6 7.2 3.6 3.3 7.5 3.3 12.3S7.2 21 12 21c4.9 0 7.7-3.4 7.7-8.2 0-.6-.1-1-.1-1.4H12Z"/></svg>
              Opinia z Google
            </div>
          </article>
        </div>
      `;
    }
 
    async function renderReviewSlides() {
      const wrapper = document.getElementById('reviewsWrapper');
      const emptyMsg = document.getElementById('reviewsEmpty');
 
      let reviews = [];
      try {
        const res = await fetch('reviews.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('bad response');
        reviews = await res.json();
      } catch (e) {
        console.warn('Не вдалося завантажити reviews.json, показую demo-дані:', e);
        // demo-заглушка, щоб слайдер було видно навіть без реального reviews.json поруч
        reviews = [
          { author: 'Rusłan Krugly', rating: 5, text: 'Pyszna kuchnia, doskonała obsługa i przyjemna atmosfera. Wszystko było na najwyższym poziomie. Gorąco polecam to miejsce!', authorPhoto: '', authorUrl: '' },
          { author: 'Petro Shevchuk', rating: 5, text: 'Odwiedziłem tę wspaniałą restaurację już kilkukrotnie. Jedzenie jest po prostu wyśmienite, a dbałość o szczegóły jest po prostu nie do pobicia.', authorPhoto: '', authorUrl: '' },
          { author: 'Martin', rating: 4, text: 'A Restaurant with a lovely bar and intimate dining area. Food is sensational, exciting, highly innovative, the service is friendly & professional.', authorPhoto: '', authorUrl: '' },
          { author: 'Natasha D', rating: 5, text: 'Słynie z niesamowitego smaku i jedzenia. Oferują najlepszego smażonego kurczaka i burgery, które są przepyszne.', authorPhoto: '', authorUrl: '' }
        ];
      }
 
      if (!reviews.length) {
        emptyMsg.classList.remove('is-hidden');
        document.querySelector('.reviews__swiper').classList.add('is-hidden');
        return;
      }
 
      wrapper.innerHTML = reviews.map(reviewSlideHtml).join('');
 
      new Swiper('.reviews__swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: reviews.length > 3,
        autoHeight: false,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
          700:  { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }
      });
    }
 
    renderReviewSlides();