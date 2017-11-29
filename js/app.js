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

	/*
	Auto generate tag berdasarkan isi database makaanan.
	*/
	function initPilihanTag(databaseMakanan) {
		let mount = $("#tag-makanan");

		// Buat set pilihan makanan
		let tagMakanan = databaseMakanan.reduce(function(tagList, makanan) {
			makanan.tag.forEach(tag => {
				tagList.add(tag);
			});
			return tagList;
		}, new Set()); 
		
		// Compile template html
		let sourceTemplate = $('#template-tag-makanan').html();
		let template = Handlebars.compile(sourceTemplate);
		let html = Array.from(tagMakanan).map(function(tag) {
			tag = {
				'tag': toTitleCase(tag),
				'tagId': toCamelCase(tag),
			}
			return template(tag);
		});
		// Pasang ke html
		mount.empty().append(html);
	}

	function racikMenu() {
		////
		// Logika input
		////

		// Ambil data jenis diet
		let tipeDiet = $("input[name='jenisDiet']:checked").val();
		// Ambil list makanan kesukaan
		let daftarMakananFavorit = $("input[name='keinginanMakanan']:checked").map(function () {
		    return this.value;
		}).get();


		////
		// Logika pemilihan makanan
		////

		let namaHari = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
		let waktuMakan = ['pagi', 'siang', 'malam'];

		// Makanan yang akan disarankan ke pengguna
		let makananTerpilih = [];

		// Pilih 3 makanan (pagi, siang, sore)
		let slotMakanan = 3;

		// Iterasi 7 hari dalam seminggu
		for(let i = 0; i < 7; i++) {
			let makananHarian = [];
			let favorit = false;
			while (makananHarian.length < slotMakanan) {
				let makanan = ambilAcakDariArray(databaseMakanan);

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

				// Cek apakah hari ini sudah makan enak
				if (contains(makanan.tag, daftarMakananFavorit)) {
					favorit = true;
				}
				// Paling tidak 1 hari makan enak 1x, fallback di waktu malam.
				if (!favorit && makananHarian.length === 2) {
					continue;
				}

				makanan.waktu = waktuMakan[makananHarian.length];
				makananHarian.push(makanan);
			}
			makananTerpilih.push(makananHarian);
		}


		////
		// Logika output
		////

		// Compile template html
		let sourceTemplate = $('#template-makanan').html();
		let template = Handlebars.compile(sourceTemplate);
		namaHari.forEach(function(hari, index) {
			let html = makananTerpilih[index].map(function(makanan) {
				return template(makanan);
			});
			// Pasang ke html tiap harinya
			$('#' + hari).empty().append(html);
		})
	}

	function ambilAcakDariArray(array) {
		return array[Math.floor(Math.random()*array.length)]
	}

	/*
	Mengubah sembarang string menjadi camelCase
	Credit https://stackoverflow.com/a/2970667/4504053
	*/
	function toCamelCase(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
			return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		}).replace(/\s+/g, '');
	}

	/* 
	Mengubah teks ke Title Case
	Credit https://stackoverflow.com/a/4878800/4504053
	*/
	function toTitleCase(str)
	{
		return str.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	function contains(haystack, arr) {
		return arr.some(function (v) {
			return haystack.indexOf(v) >= 0;
		});
	};

	let databaseMakanan = [
		// Diet Atkins
		{
			nama: 'Paha Gending Ayam Goreng (Tanpa Nasi)',
			warung: 'Bebek Sidolaris',
			lokasi: 'Jl. Kaliurang Km. 5 Gang Pangkur No.5, Depok, Yogyakarta',
			harga: 18000,
			tag: ['ayam', 'goreng', 'timun', 'tomat', 'asin'],
		}, {
			nama: 'Dada Bebek',
			warung: 'Bebek Sidolaris',
			lokasi: 'Jl. Kaliurang Km. 5 Gang Pangkur No.5, Depok, Yogyakarta',
			harga: 22000,
			tag: ['bebek', 'kangkung', 'kubis', 'sambal', 'pedas'],
		}, {
			nama: 'Tom Yum Ayam',
			warung: 'Rempah Asia',
			lokasi: 'Jl. Kaliurang Km 5, Depok, Yogyakarta',
			harga: 22000,
			tag: ['ayam', 'jagung', 'bawang bombai', 'wortel', 'bawang putih', 'asam', 'pedas'],
		}, {
			nama: 'Ayam Geprek',
			warung: 'Dapoer Ayam Geprek & Es Buah, Kaliurang',
			lokasi: 'Jl. Kaliurang KM 5 (Halaman Bungong Jeumpa), Depok, Yogyakarta',
			harga: 12000,
			tag: ['ayam', 'timun', 'sambal', 'pedas'],
		}, {
			nama: 'Ikan Asin',
			warung: 'Dapoer Ayam Geprek & Es Buah, Kaliurang',
			lokasi: 'Jl. Kaliurang KM 5 (Halaman Bungong Jeumpa), Depok, Yogyakarta',
			harga: 4500,
			tag: ['ikan', 'asin'],
		}, {
			nama: 'Ayam Geprek + Oseng Teri',
			warung: 'Dapoer Ayam Geprek & Es Buah, Kaliurang',
			lokasi: 'Jl. Kaliurang KM 5 (Halaman Bungong Jeumpa), Depok, Yogyakarta',
			harga: 15000,
			tag: ['ayam', 'timun', 'sambal', 'ikan teri', 'pare', 'tomat', 'tauge', 'pedas'],
		}, {
			nama: 'Spicy Chicken Bites',
			warung: 'McDonald\'s, Yogyakarta-Kaliurang',
			lokasi: ' Jl. Kaliurang, Depok, Yogyakarta',
			harga: 10000,
			tag: ['ayam', 'telur', 'pedas'],
		}, {
			nama: 'Ayam Serundeng Sambal Ijo',
			warung: 'Ayam & Bebek SPG',
			lokasi: 'Jl. Lempong Sari No. 172, Ngaglik, Yogyakarta',
			harga: 14000,
			tag: ['ayam', 'serundeng', 'sambal', 'pedas'],
		},
		// Vegetarian Diet
		{
			nama: 'Burjo',
			warung: 'Warmindo Maharasa, Pandega',
			lokasi: 'Jl. Pandega Marta, Depok, Yogyakarta',
			harga: 4500,
			tag: ['kacang hijau', 'ketan hitam', 'manis'],
		}, {
			nama: 'Burjo Susu',
			warung: 'Warmindo Maharasa, Pandega',
			lokasi: 'Jl. Pandega Marta, Depok, Yogyakarta',
			harga: 6000,
			tag: ['kacang hijau', 'ketan hitam', 'susu', 'manis'],
		}, {
			nama: 'Telor 1/2 Matang',
			warung: 'Warmindo Maharasa, Pandega',
			lokasi: 'Jl. Pandega Marta, Depok, Yogyakarta',
			harga: 3000,
			tag: ['telur', 'asin'],
		}, {
			nama: 'Ketupat Sayur',
			warung: 'Warmindo Maharasa, Pandega',
			lokasi: 'Jl. Pandega Marta, Depok, Yogyakarta',
			harga: 8000,
			tag: ['tahu', 'labu siam', 'ketupat', 'telur', 'pedas'],
		}, {
			nama: 'Apple Pie',
			warung: 'McDonald\'s, Yogyakarta-Kaliurang',
			lokasi: 'Jl. Kaliurang, Depok, Yogyakarta',
			harga: 10000,
			tag: [],
		}, {
			nama: 'Hash Brown',
			warung: 'McDonald\'s, Yogyakarta-Kaliurang',
			lokasi: 'Jl. Kaliurang, Depok, Yogyakarta',
			harga: 9500,
			tag: ['kentang', 'telur', 'gurih'],
		}, {
			nama: 'Egg and Cheese Muffin',
			warung: 'McDonald\'s, Yogyakarta-Kaliurang',
			lokasi: 'Jl. Kaliurang, Depok, Yogyakarta',
			harga: 12500,
			tag: ['telur', 'keju', 'muffin'],
		}, {
			nama: 'Nasi Perkedel',
			warung: 'Duta Minang, Kaliurang',
			lokasi: 'Jl. Kaliurang, Depok, Yogyakarta',
			harga: 10000,
			tag: ['nasi', 'kentang', 'telur'],
		}, {
			nama: 'Nasi Pecel Biasa',
			warung: 'Warung Lamparan Jember',
			lokasi: 'Jl. Magelang Km 5,5, Mlati, Yogyakarta',
			harga: 9000,
			tag: ['nasi', 'tempe', 'timun', 'tomat', 'tauge', 'kerupuk', 'bayam'],
		},
		// Gluten-Free Diet
		{
			nama: 'Ayam Serundeng Sambal Ijo',
			warung: 'Ayam & Bebek SPG',
			lokasi: 'Jl. Lempong Sari No. 172, Ngaglik, Yogyakarta',
			harga: 14000,
			tag: ['ayam', 'serundeng', 'sambal', 'pedas'],
		}, {
			nama: 'Pepes Tuna + Nasi',
			warung: 'Warung Makan Hercules',
			lokasi: 'Jl. Selokan Mataram UGM Pogung Kidul, Depok, Yogyakarta',
			harga: 14000,
			tag: ['ikan tuna', 'tomat', 'daun kemangi', 'nasi'],
		}, {
			nama: 'Ayam Crispy Asam Manis + Nasi',
			warung: 'SBC Spesial Cah Kangkung',
			lokasi: 'Jl. Pandega Marta, No. 102A, Mlati, Yogyakarta',
			harga: 15000,
			tag: ['ayam', 'nasi', 'manis', 'asam'],
		}, {
			nama: 'Pas 19 Ikan Nila Bakar',
			warung: 'SBC Spesial Cah Kangkung',
			lokasi: 'Jl. Pandega Marta, No. 102A, Mlati, Yogyakarta',
			harga: 23000,
			tag: ['nasi', 'kangkung', 'ikan nila', 'sambal', 'pedas'],
		}, {
			nama: 'Pas 14 Ayam Bakar (Paha Atas)',
			warung: 'SBC Spesial Cah Kangkung',
			lokasi: 'Jl. Pandega Marta, No. 102A, Mlati, Yogyakarta',
			harga: 16000,
			tag: ['nasi', 'kangkung', 'ayam', 'pedas'],
		}, {
			nama: 'Gado Gado',
			warung: 'Warung Lotek Bu Topo',
			lokasi: 'Jl. Sawitsari, Depok, Yogyakarta',
			harga: 15000,
			tag: ['lontong', 'kentang', 'tomat', 'selada', 'timun', 'tahu', 'tempe', 'pedas'],
		}, {
			nama: 'Lotek',
			warung: 'Warung Lotek Bu Topo',
			lokasi: 'Jl. Sawitsari, Depok, Yogyakarta',
			harga: 15000,
			tag: ['kangkung', 'kol', 'tahu putih', 'timun', 'kacang panjang', 'touge', 'kerupuk'],
		}, {
			nama: 'Kupat Tahu',
			warung: 'Warung Lotek Bu Topo',
			lokasi: 'Jl. Sawitsari, Depok, Yogyakarta',
			harga: 15000,
			tag: ['lontong', 'tahu putih', 'touge', 'kol', 'seledri', 'kacang tanah'],
		}, {
			nama: 'Kubis Goreng',
			warung: 'Pecel Bu Tien 24 Jam',
			lokasi: 'Jl. Gejayan No. 26 A, Depok, Yogyakarta',
			harga: 4000,
			tag: ['kubis', 'asin'],
		}, {
			nama: 'Lontong Lodeh',
			warung: 'Pecel Bu Tien 24 Jam',
			lokasi: 'Jl. Gejayan No. 26 A, Depok, Yogyakarta',
			harga: 12000,
			tag: ['lontong', 'labu siam', 'tempe', 'pedas'],
		},
	];
	initPilihanTag(databaseMakanan);	
});