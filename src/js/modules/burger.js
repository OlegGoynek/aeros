function burger() {
	const burgerMenu = document.querySelector('.burger-menu');
	const menuBtn = document.querySelector('.menu__icon');
	const body = document.body;

	menuBtn.addEventListener('click', () => {
		burgerMenu.classList.toggle('active');
		menuBtn.classList.toggle('active');
		body.classList.toggle('lock');
	})

	burgerMenu.querySelectorAll('.menu__link').forEach(link => {
		link.addEventListener('click', () => {
			burgerMenu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('lock');
		})
	})
}

export default burger;