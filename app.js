document.addEventListener('DOMContentLoaded', () => {

  /* ================== HAMBURGER ================== */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });


  /* ================== CINEMA TRACK ================== */
  const track = document.querySelector('.cinema-track');
  let isDraggingGallery = false;
  let isSwipingGallery = false;

  if (track) {
    let position = 0;
    let speed = 0.4;
    let scrollVelocity = 3;
    let touchStartX = 0;
    let touchLastX = 0;

    track.innerHTML += track.innerHTML; // boucle infinie

    function animate() {
      position -= speed + scrollVelocity;
      scrollVelocity *= 0.9;

      if (position <= -track.scrollWidth / 2) {
        position = 0;
      }

      if (position > 0) {
        position = -track.scrollWidth / 2;
      }

      track.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    }

    animate();

    // Scroll interaction desktop
    // only respond when the cursor is over the gallery track, and prevent the
    // wheel from scrolling the rest of the page
    track.addEventListener('wheel', (e) => {
      e.preventDefault();
      scrollVelocity += e.deltaY * 0.002;
    }, { passive: false });

    // Hover pause desktop
    track.addEventListener('mouseenter', () => speed = 0);
    track.addEventListener('mouseleave', () => speed = 0.4);

    // Swipe mobile/tablette sans flèches
    track.addEventListener('touchstart', (e) => {
      const x = e.touches[0].clientX;
      touchStartX = x;
      touchLastX = x;
      isSwipingGallery = false;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      // prevent vertical page scrolling when swiping horizontally on the
      // gallery
      e.preventDefault();
      const x = e.touches[0].clientX;
      const delta = x - touchLastX;
      if (Math.abs(x - touchStartX) > 8) {
        isSwipingGallery = true;
      }
      position += delta;
      scrollVelocity = -delta * 0.15;
      touchLastX = x;
    }, { passive: false });

    track.addEventListener('touchend', () => {
      setTimeout(() => {
        isSwipingGallery = false;
      }, 0);
    });

    // Navigation buttons
    const prevBtn = document.querySelector('.cinema-prev');
    const nextBtn = document.querySelector('.cinema-next');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        position += 380;
        if (position > 0) position = -track.scrollWidth / 2;
        track.style.transform = `translateX(${position}px)`;
      });

      nextBtn.addEventListener('click', () => {
        position -= 380;
        if (position <= -track.scrollWidth / 2) position = 0;
        track.style.transform = `translateX(${position}px)`;
      });
    }
  }


  /* ================== LIGHTBOX ================== */
  const frames = document.querySelectorAll('.frame img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxPrice = document.getElementById('lightbox-price');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.querySelector('.close');

  frames.forEach(img => {
    const frame = img.closest('.frame');
    const titleText = img.dataset.title || '';
    const priceText = img.dataset.price || '';
    if (frame && !frame.querySelector('.frame-info') && (titleText || priceText)) {
      const info = document.createElement('div');
      info.className = 'frame-info';

      if (titleText) {
        const title = document.createElement('h3');
        title.textContent = titleText;
        info.appendChild(title);
      }

      if (priceText) {
        const price = document.createElement('span');
        price.className = 'frame-price';
        price.textContent = priceText;
        info.appendChild(price);
      }

      frame.appendChild(info);
    }

    img.addEventListener('click', () => {
      if (isDraggingGallery || isSwipingGallery) {
        return;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxImg.src = img.src;
      lightboxTitle.textContent = img.dataset.title;
      if (lightboxPrice) {
        lightboxPrice.textContent = img.dataset.price || '';
        lightboxPrice.style.display = img.dataset.price ? '' : 'none';
      }
      lightboxDesc.textContent = img.dataset.desc;
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });


  /* ================== SERVICES ANIMATION ================== */
  const cards = document.querySelectorAll('.service-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));

});


// /* ================== HEADER SLIDESHOW ================== */
// const header = document.querySelector(".header");

// const images = [
//   "Image/maquettejessycuts.png",
//   "Image/image2.png",
//   "Image/image3.png"
// ];

// let current = 0;

// setInterval(() => {
//   current++;
//   if (current >= images.length) {
//     current = 0;
//   }
//   header.style.setProperty(
//     "--bg-image",
//     `url('${images[current]}')`
//   );
// }, 4000);
