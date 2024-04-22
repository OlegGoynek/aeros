function captcha() {
	document.querySelector('form').addEventListener('submit', (e) => {
		e.preventDefault();

		grecaptcha.ready(function() {
			grecaptcha.execute('6LfcfpIpAAAAAIB_vM5Par_7jzUM-M-ZXYaqSJSI', { action: 'homepage' }).then(function (token) {
		
				document.getElementById('token').value = token;

				const data = new URLSearchParams();
				for (const pair of new FormData(document.querySelector('form'))) {
					data.append(pair[0], pair[1]);
				}

				fetch('check.php', {
					method: 'post',
					body: data,
				})
				.then(response => response.json())
				.then(result => {
					console.log(result);
					if (result['om_score'] >= 0.5) {
						console.log('Human');
						window.top.location = 'https://aeros.com.ua/dealers.html';
					} else {
						alert('You are bot!');
						console.log('Bot');
					}
				});
			});
		});

	});
}

export default captcha;