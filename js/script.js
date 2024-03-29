"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /////////////_______________________________________________HAMBURGER MENU TOGGLER
  let timer;
  const toggleMenu = (event) => {
    const body = document.querySelector('body');
    const hamburger = document.querySelector(".header__hamburger");
    const navLinks = document.querySelectorAll(".header a");
    const headerLogo = document.querySelector(".header__logo");
    const header = document.querySelector(".header");
    const icon = document.querySelector('.header__icon');
    const tab = document.querySelector(".header__tab");
    const close = () => {
      header.classList.remove("header_show");
    };
    if (event.target == document.querySelector(".header__wrapper")) return void 0;

    // hamburger button
    if (event.target.closest("button") == hamburger) {
      header.classList.toggle("hamburger_open");
      clearInterval(timer);
    }

    // close hamburger on home button click
    if (event.target.closest("a") == icon) {
      header.classList.remove('hamburger_open');
      header.classList.remove("header_show");
      clearInterval(timer);
    }

    // close hamburger on link click
    navLinks.forEach(item => {
      if (item == event.target) {
        header.classList.remove('hamburger_open');
        header.classList.remove("header_show");
        clearInterval(timer);
      }
    });

    //show sticky menu on tab click
    if (event.target.closest('div') == tab) {
      header.classList.toggle("header_show");
      clearInterval(timer);
    }
    // set timer on menu close
    if (!header.classList.contains('hamburger_open')) timer = setTimeout(close, 3000);

    (header.classList.contains('hamburger_open')) ? body.style.overflow = "hidden": body.style.overflow = "";
    (header.classList.contains("hamburger_open") || !header.classList.contains("stickyNavBar")) ? headerLogo.classList.remove("header__logo_icon"): headerLogo.classList.add("header__logo_icon");
  };
  document.querySelector(".header").addEventListener('click', toggleMenu);

  /////////////___________________________________NAVBAR-TOGGLER(observe data-toggle)
  const menuToggler = target => {
    const header = document.querySelector(".header");
    const headerLogo = document.querySelector(".header__logo");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target.dataset.toggle == "intro") {
          if (entry.isIntersecting) {
            header.classList.remove('stickyNavBar');
            headerLogo.classList.remove("header__logo_icon");
            headerLogo.setAttribute("tabindex", -1);
            setTimeout(() => {
              header.style = null;
            }, 300);
          } else {
            header.classList.add('stickyNavBar');
            headerLogo.classList.add("header__logo_icon");
            header.style.position = "fixed";
            headerLogo.setAttribute("tabindex", 0);
          }
        } else if (entry.target.dataset.toggle == "clear" && entry.isIntersecting) {
          document.querySelectorAll(".header nav a").forEach((item) => item.classList.remove("header__link_active"));
        } else if (entry.target.dataset.toggle.startsWith("#") && entry.isIntersecting) {
          document.querySelectorAll(".header nav a").forEach((item) => item.classList.remove("header__link_active"));
          document.querySelector(`[href="${entry.target.dataset.toggle}"`).classList.add("header__link_active");
        }
      });
    }, {
      threshold: 0.1
    });
    io.observe(target);
  };
  document.querySelectorAll("[data-toggle]").forEach(menuToggler);

  /////////////______________________________________________________TEAM CARDS FOCUS
  const toggleTeamLinksOnFocus = (event) => {
    event.target.closest(".team__background").classList.toggle("team__background_focused")
  };

  document.querySelectorAll(".team__links a").forEach(item => {
    item.addEventListener("focus", toggleTeamLinksOnFocus);
    item.addEventListener("blur", toggleTeamLinksOnFocus);
  });

  /////////////____________________________________________SHOW GOOGLE MAPS IN IFRAME

  const createIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.src = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d19424.915957017794!2d13.407166!3d52.513267!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851dc1ef8939d%3A0xf9fb901171a947c3!2sGerman%20Historical%20Museum!5e0!3m2!1sen!2sru!4v1607802493547!5m2!1sen!2sru";
    const width = document.body.getBoundingClientRect().width;
    iframe.width = (width <= 1903) ? width : 1903;
    iframe.height = "200";
    iframe.style = "border:0;";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("aria-hidden", "false");
    iframe.tabindex = "0";
    iframe.dataset.resize = "iframe";
    return iframe;
  };

  const replaceIframe = () => {
    const iframe = document.querySelector(".map iframe");
    if (document.body.getBoundingClientRect().width <= 1902 || iframe.getBoundingClientRect().width <= 1902) {
      iframe.replaceWith(createIframe());
    }
  };

  const changeOnResize = target => {
    const ro = new ResizeObserver(() => {
      const checkSize = () => {
        const a = document.body.getBoundingClientRect().width;

        setTimeout(() => {
          const b = document.body.getBoundingClientRect().width;
          if (a == b) replaceIframe();
        }, 1000);
      };
      checkSize();
    });
    ro.observe(target);
  };

  const showMap = function () {
    //insert iframe:
    this.append(createIframe());

    const hideLink = () => {
      const mapLink = document.querySelector(".map a");
      mapLink.classList.add("map__link_hidden");
      mapLink.setAttribute("tabindex", "-1");
      mapLink.setAttribute("aria-hidden", "true");
    };

    document.querySelector(".map iframe").addEventListener("load", hideLink);
    // hide map link:

    setTimeout(() => {
      hideLink();
    }, 5000);

    // update map on resize:
    changeOnResize(document.querySelector(".footer"));
  };

  document.querySelector(".map").addEventListener("mouseover", showMap, {
    once: true
  });

  /////////////____________________________________________LAZY LOAD

  const lazyLoad = (target) => {
    const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const src = entry.target.dataset.lazy;
                const entryItem = entry.target;

                if (src.endsWith("png")) {
                    entryItem.src = src;
                    entryItem.addEventListener("load", () => {
                      entryItem.classList.remove("loading");
                      entryItem.classList.add("fadeIn");
                      return void 0;
                    });
                }

                if (src.endsWith("jpg")) {
                    entryItem.src = src;
                    entryItem.addEventListener("load", () => {
                      entryItem.classList.remove("loading");
                      entryItem.classList.add("fadeIn");
                      return void 0;
                    });
                }

                entryItem.childNodes.forEach((item) => {
                    const showItem = () => {
                      item.addEventListener("load", () => {
                          entryItem.classList.remove("loading");
                          entryItem.classList.add("fadeIn");
                      });
                    };
                    if (item.tagName == "IMG") {
                      item.src = src + ".jpg";
                      showItem();
                    } else if (item.tagName == "SOURCE") {
                      item.srcset = src + ".webp";
                      showItem();
                    }
                });
                observer.disconnect();
              }
          });
        },
        {
          margin: 200,
        }
    );
    io.observe(target);
  };
  document.querySelectorAll("[data-lazy]").forEach(lazyLoad);

  /////////////____________________________________________SWIPER
  const swiperOptions = {
    updateOnWindowResize: true,
    loop: true,
    speed: 700,
    slidesPerView: 1, // or 'auto'
    spaceBetween: 100,
    centeredSlides: true,
    effect: "coverflow", // 'cube', 'fade', 'coverflow',
    coverflowEffect: {
       rotate: 50, // Slide rotate in degrees
       stretch: 0, // Stretch space between slides (in px)
       depth: 100, // Depth offset in px (slides translate in Z axis)
       modifier: 1, // Effect multipler
       slideShadows: false, // Enables slides shadows
    },
    grabCursor: true,
    parallax: true,
    pagination: {
       el: ".swiper-pagination",
       clickable: true,
    },
    navigation: {
       nextEl: ".swiper-button-next",
       prevEl: ".swiper-button-prev",
    },
    breakpoints: {
       992: {
          slidesPerView: 1,
          spaceBetween: 200,
       },
    },
    keyboard: {
       enabled: true,
       onlyInViewport: true,
    },
 };
 
 new Swiper(".swiper__qoute-upper", swiperOptions);
 new Swiper(".swiper__qoute-lower", swiperOptions);

}); //end DOMContentLoaded;