$(document).ready(function() {
	$('#btn-racik').click(function(e) {
		e.preventDefault();
		racikMenu();
		$('#input').addClass('d-none');
		$('#output').removeClass('d-none');
	});

	$('#btn-ulangi').click(function(e) {
		e.preventDefault();
		$('#output').addClass('d-none');
		$('#input').removeClass('d-none');
	});

	function racikMenu() {
		////
		// Logika input
		////

		// Ambil data jenis diet
		let tipeDiet = $("input[name='jenisDiet']:checked").val();
		// Ambil list makanan kesukaan
		let daftarTipeMakanan = $("input[name='keinginanMakanan']:checked").map(function () {
		    return this.value;
		}).get();


		////
		// Logika pemilihan makanan
		////

		// Makanan yang akan disarankan ke pengguna
		let makananTerpilih = [];

		// Pilih 3 makanan (pagi, siang, sore)
		let slotMakanan = 3;

		while (makananTerpilih.length < slotMakanan) {
			let makanan = ambilAcakDariArray(databaseMakanan);
			console.log(makanan);

			// Makanan sudah ada, jangan duplikasi
			if (makananTerpilih.indexOf(makanan) != -1) {
				continue;
			}

			// Jangan pilih makanan yg bertentangan diet
			if (tipeDiet === 'dietKarbohidrat') {
				if (makanan.tag.indexOf('nasi') != -1) {
					continue;
				}
				if (makanan.tag.indexOf('kentang') != -1) {
					continue;
				}
			}

			makananTerpilih.push(makanan);
		}


		////
		// Logika output
		////

		// Compile template html
		let sourceTemplate = $('#template-makanan').html();
		let template = Handlebars.compile(sourceTemplate);
		let html = makananTerpilih.map(function(makanan) {
			return template(makanan);
		});
		// Pasang ke html
		$('#output-card').empty().append(html);
	}

	function ambilAcakDariArray(array) {
		return array[Math.floor(Math.random()*array.length)]
	}

	let databaseMakanan = [
		{
			nama: 'Bakso Pak Abe',
			lokasi: 'Jl. Perkututu no 1',
			harga: 8000,
			tag: ['bakso', 'daging', 'kuah'],
		}, {
			nama: 'Soto Kambing Pak Bece',
			lokasi: 'Jl. Perkututu no 2',
			harga: 7500,
			tag: ['soto', 'nasi', 'daging', 'kambing', 'kuah'],
		}, {
			nama: 'Mie Ayam Pak Cede',
			lokasi: 'Jl. Perkututu no 3',
			harga: 9000,
			tag: ['bakso', 'daging', 'kuah'],
		}, {
			nama: 'Nasi Goreng Bu De\'e',
			lokasi: 'Jl. Perkututu no 4',
			harga: 5000,
			tag: ['nasi', 'nasiGoreng', 'daging'],
		}, {
			nama: 'Steak ikan',
			lokasi: 'Jl. Perkututu no 4',
			harga: 5000,
			tag: ['ikan', 'bakar'],
		}
	];
});