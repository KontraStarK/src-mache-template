$(document).ready(function () {


  //  Slider Swiper  https://swiperjs.com/
  var mySwiper = new Swiper('.swiper-container', {

    autoplay: {
      delay: 5000
    },
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  })

  // Smooth Scroll with jQuery
  $("a.menu__link").on("click", function () {
    var anchor = $(this).attr('href');
    $('html, body').stop().animate({
      scrollTop: $(anchor).offset().top - 47
    }, 600);
  });
});

// Sticky Menu

window.addEventListener("scroll", function () {
  var header = document.querySelector(".header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

// Scroll animation https://wowjs.uk/

new WOW().init();

// Burger menu

var burger = document.querySelector(".burger");
var menu = document.querySelector(".menu");
var menuLinks = document.querySelectorAll(".menu__link");
var body = document.querySelector("body");

burger.addEventListener("click", function () {
  burger.classList.toggle("active");
  menu.classList.toggle("active");
  body.classList.toggle("lock");
  closeMenu();
});

function closeMenu() {
  for (i = 0; i < menuLinks.length; i++) {
    elem = menuLinks[i];
    elem.addEventListener("click", function () {
      burger.classList.remove("active");
      menu.classList.remove("active");
      body.classList.remove("lock");
    });
  }
}
