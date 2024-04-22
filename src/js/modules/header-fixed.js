function headerFixed () {

	window.onscroll = function showHeader() {
		let header = document.querySelector('.header');
		let scrollUpBtn = document.querySelector('.scroll-up');

		if (window.scrollY > 300) {
			header.classList.add('header_transparent');
		} else {
			header.classList.remove('header_transparent');
		};

		if (window.scrollY > 500) {
			header.classList.add('header_fixed');
			scrollUpBtn.classList.add('scroll-up_show');
		} else {
			header.classList.remove('header_fixed');
			scrollUpBtn.classList.remove('scroll-up_show');
		};

		scrollUpBtn.addEventListener('click', () => {
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		});
	};
};

export default headerFixed;


