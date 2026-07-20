function escapeHtml(e){let a=document.createElement("div");return a.textContent=e??"",a.innerHTML}function starString(e){let a=Math.max(0,Math.min(5,Math.round(e||0)));return"★".repeat(a)+"☆".repeat(5-a)}function reviewSlideHtml(e){return`
        <div class="swiper-slide">
          <article class="review__card">
            <div class="review__head">
              <img
                class="review__avatar"
                src="${escapeHtml(e.authorPhoto||"./public/Avatar-Placeholder@2x.png")}"
                alt=""
                loading="lazy"
                onerror="this.style.background='#555'; this.src='./public/Avatar-Placeholder@2x.png';"
              />
              <div class="review__name-block">
                <p class="review__author">
                  ${e.authorUrl?`<a href="${escapeHtml(e.authorUrl)}" target="_blank" rel="noopener">${escapeHtml(e.author)}</a>`:escapeHtml(e.author)}
                </p>
                <div class="review__stars" aria-label="Ocena: ${e.rating} na 5">${starString(e.rating)}</div>
              </div>
            </div>
            <p class="review__text">${escapeHtml(e.text)}</p>
            <div class="review__google-badge">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.8v3.6h5.1c-.2 1.2-1.6 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6c1.8 0 2.9.7 3.6 1.4l2.5-2.4C16.6 4.4 14.5 3.6 12 3.6 7.2 3.6 3.3 7.5 3.3 12.3S7.2 21 12 21c4.9 0 7.7-3.4 7.7-8.2 0-.6-.1-1-.1-1.4H12Z"/></svg>
              Opinia z Google
            </div>
          </article>
        </div>
      `}async function renderReviewSlides(){let e=document.getElementById("reviewsWrapper"),a=document.getElementById("reviewsEmpty"),t=[];try{let e=await fetch("reviews.json",{cache:"no-store"});if(!e.ok)throw Error("bad response");t=await e.json()}catch(e){console.warn("Не вдалося завантажити reviews.json, показую demo-дані:",e),t=[{author:"Rusłan Krugly",rating:5,text:"Pyszna kuchnia, doskonała obsługa i przyjemna atmosfera. Wszystko było na najwyższym poziomie. Gorąco polecam to miejsce!",authorPhoto:"",authorUrl:""},{author:"Petro Shevchuk",rating:5,text:"Odwiedziłem tę wspaniałą restaurację już kilkukrotnie. Jedzenie jest po prostu wyśmienite, a dbałość o szczegóły jest po prostu nie do pobicia.",authorPhoto:"",authorUrl:""},{author:"Martin",rating:4,text:"A Restaurant with a lovely bar and intimate dining area. Food is sensational, exciting, highly innovative, the service is friendly & professional.",authorPhoto:"",authorUrl:""},{author:"Natasha D",rating:5,text:"Słynie z niesamowitego smaku i jedzenia. Oferują najlepszego smażonego kurczaka i burgery, które są przepyszne.",authorPhoto:"",authorUrl:""}]}if(!t.length){a.classList.remove("is-hidden"),document.querySelector(".reviews__swiper").classList.add("is-hidden");return}e.innerHTML=t.map(reviewSlideHtml).join(""),new Swiper(".reviews__swiper",{slidesPerView:1,spaceBetween:24,loop:t.length>3,autoHeight:!1,pagination:{el:".swiper-pagination",clickable:!0},breakpoints:{700:{slidesPerView:2},1200:{slidesPerView:3}}})}renderReviewSlides();
//# sourceMappingURL=index-design.5540f4d7.js.map
