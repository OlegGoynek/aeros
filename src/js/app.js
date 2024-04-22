//PRELOADER
import preloader from "./modules/preloader.js";
preloader();

// BURGER MENU
import burger from "./modules/burger.js";
burger();

//HEADER FIXED & SCROOL TO TOP
import headerFixed from "./modules/header-fixed.js";
headerFixed();

// SLIDERS
// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
// import 'swiper/css/bundle';

const headSlider = new Swiper('.head-slider', {
	speed: 1400,
	direction: 'horizontal',
	spaceBetween: 20,
	parallax: true,
	autoplay: {
		delay: 5000,
	},
	grabCursor: true,
	mousewheel: {
		releaseOnEdges: true,
	},
	keyboard: {
		enabled: true,
	},
	pagination: {
		el: '.head-slider-pagination',
		clickable: true,
	},
});

const productSlider = new Swiper('.product-slider', {
	speed: 2400,
	loop: true,
	freeMode: true,
	centeredSlides: true,
	breakpoints: {
		0: {
			slidesPerView: 1.8,
			slidesOffsetBefore: -40,
			spaceBetween: 20,
		},
		480: {
			slidesPerView: 2.5,
			slidesOffsetBefore: -60,
			spaceBetween: 30,
		},
		768: {
			slidesPerView: 3.5,
			slidesOffsetBefore: -80,
			spaceBetween: 50,
		}
	}
});

const offerSlider = new Swiper('.offer-slider', {
	speed: 2400,
	spaceBetween: 20,
	parallax: true,
	loop: true,
	autoplay: {
		delay: 5000,
	},
});

const memorialSlider = new Swiper('.memorial-slider', {
	speed: 3000,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	autoplay: {
		delay: 1000,
	},
});

const enginesSlider = new Swiper('.engines-slider', {
	speed: 2000,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

//PARTICLES
import particles from "./modules/particles.js";
particles();

// GSAP
import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.from('.offer-slider__text-block', {
	x: -100,
	opacity: 0,
	duration: 1,
	delay: 2,
	scale: 0.8
});

let itemsMilestone = gsap.utils.toArray('.about-us__milestone');

itemsMilestone.forEach(item => {
	gsap.fromTo(item, {
		x: '100%',
		opacity: 0
	},
	{
		x: '-30%',
		opacity: 1,
		scrollTrigger: {
			trigger: item,
			start: 'top 100%',
			end: 'top -20%',
			scrub: true
		}
	});
});

//SEARCH DEALER
import searchDealer from "./modules/search-dealer.js";
searchDealer();



// let itemsTitle = gsap.utils.toArray('h2, h3, h4, h5, h6, p, img');

// itemsTitle.forEach(item => {
// 	gsap.from(item, {
// 		y: 50,
// 		x: -50,
// 		opacity: 0,
// 		scrollTrigger: {
// 			trigger: item,
// 			start: 'top 105%',
// 			end: 'top 90%',
// 			scrub: true
// 		}
// 	});
// });