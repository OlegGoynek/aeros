function searchDealer() {
	let dealerCountry = document.querySelectorAll('.dealer__country');
	let input = document.getElementById('search-dealer-input');
	let dealerCountryTitle = document.querySelectorAll('.dealer__country-title');

	for (let i = 0; i < dealerCountry.length; i++) {
		dealerCountry[i].addEventListener('click', function () {
			this.classList.toggle('dealer__country_active');
			let dealerContact = this.nextElementSibling;
			if (dealerContact.style.maxHeight) {
				dealerContact.style.maxHeight = null;
			} else {
				dealerContact.style.maxHeight = dealerContact.scrollHeight + "px";
			}
		});
	}

	input.addEventListener('keyup', () => {
		for (let i = 0; i < dealerCountry.length; i++) {
				dealerCountry[i].classList.remove('dealer__country_active');
				let dealerContact = dealerCountry[i].nextElementSibling;
				if (dealerContact.style.maxHeight) {
					dealerContact.style.maxHeight = null;
				}
			};	
		
		for (let j = 0; j < dealerCountryTitle.length; j++) {
			let country = dealerCountryTitle[j];
			let txtValue = country.textContent || country.innerText;
			if (txtValue.toUpperCase().indexOf(input.value.toUpperCase()) > -1) {
				dealerCountry[j].style.display = "";
			} else {
				dealerCountry[j].style.display = "none";
			}
		}
	});
}

export default searchDealer;