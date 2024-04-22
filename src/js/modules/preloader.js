function preloader() {
	const preloader = document.querySelector('#preloader');

	window.addEventListener('load', () => {
		preloader.classList.add('preloader-wrapper_hiden');
	});
}

export default preloader;