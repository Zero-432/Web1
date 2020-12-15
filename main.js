var product_list = [];
var totalProducts;
var related_products = [];
var lasted_products = [];
function returnHomePage() {
	window.location.href = "mainpage.html";
}
function getData(page) {
	let url = `https://products-json.herokuapp.com/products?_page=${page}&_limit=12`;
	return $.getJSON(url, function (data) {
		product_list = data;
		totalProducts = product_list.length;
		renderProductList(product_list);
	});
}
function getProductsCount() {
	let url = `https://products-json.herokuapp.com/totalProducts`;
	$.getJSON(url, function (data) {
		createPagination(data.total, 12);
	});
}
function renderProductList(products) {
	$('#product_list').empty();
	products.forEach(item => {
		let row = $('#product_list');
		row.append(
			"<div class='col-4'" + '>' +
			"<div class='card' style='width: 18rem;'>" +
			`<img class='card-img-top' src="${item.media.link[0]}" alt='image'>` +
			"<div class='card-body'>" +
			`<a href="detail.html?id=${item.productID}"><h5 class='card-title'>${item.productName}</h5></a>` +
			`<p class='card-text'>Color: ${item.productColor}</p>` +
			`<p class='card-text'>Price: ${item.productPrice}</p>` +
			"</div>" +
			"</div>" +
			"</div>"
		)
	});
}
async function getAll() {
	for (let i = 0; i < 12; i++) {
		let url = `https://products-json.herokuapp.com/products?_page=${page}&_limit=12`;
		$.getJSON(url, function (data) {
			total_products = total_products.concat(data.listProduct);
		});
	}
}

$('#product-info').ready(function () {
	const urlParams = new URLSearchParams(window.location.search);
	const product_id = urlParams.get('id');
	showDetail(product_id);
})

function showDetail(id) {
	let url = `https://products-json.herokuapp.com/products/${id}`;
	$.getJSON(url, function (data) {
		let product = data;
		// let product_detail = $('#product-info');
		// var content =
		//     `<img class='card-img-top' src="${product.media.link[0]}" alt='image'>` +
		//     "<div class='card-body text-center'>" +
		//     `<h5 class='card-title'>${product.productName}</h5>` +
		//     `<p class='card-text'>Color: ${product.productColor}</p>` +
		//     `<p class='card-text'>Price: ${product.productPrice}</p>` +
		//     "</div>";
		// product_detail.append(content);

		$('.product-detail__content > h3').text(product.productName);
		$('.page__title').text(product.productName);
		$('.product-detail__content > .price .new__price').text(product.productPrice);
		$('.product-detail__content .in-stock').text(product.statusQuantity);
		$('.product-detail__content .product-color +a').text(product.productColor);
		$('#product__picture .picture__container img').attr('src', product.media.link[0]);
		if (product.media.link.length > 1) {
			for (let i = 0; i < product.media.link.length; i++) {
				$('.product__pictures').append(
					$('<div/>').addClass('pictures__container')
						.prepend(`<img id="pic${i + 1}" class="picture" src="${product.media.link[i]}" onClick="clickImgs(this)">`)
				)
			}
		}
	})

	// 
	relatedProducts();
	lastedProducts();
}
// Tab_Gallery
// $(".picture").on("click", function(imgs){
// })
function clickImgs(imgs) {
	// for (i = 1; i <= product.media.link.length; i++) {
		var expandImg = document.getElementById("expandedImg");
		expandImg.src = imgs.src;
		expandImg.parentElement.style.display = "block"
	// }
}

$(".minus_plus").on("click", function () {
	var $button = $(this);
	var oldValue = $button.closest('.input-counter1').find("input.counter-btn").val();
	if ($button.text() == "+") {
		var newVal = parseFloat(oldValue) + 1;
	}
	else {
		if (oldValue > 1) {
			var newVal = parseFloat(oldValue) - 1;
		}
		else {
			newVal = 1;
		}
	}
	$button.closest('.input-counter1').find("input.counter-btn").val(newVal);
})

// Pagination

function createPagination(total, limit) {
	$("#product_list:gt(" + (limit - 1) + ")").hide();
	var totalPages = Math.round(total / limit);
	$(".pagination").append("<li id='prev-page'><a class='page-link' aria-label='Previous'><span aria-hidden='true'>&laquo;</span><span class='sr-only btn-previous'>Previous</span></a></li>")

	for (var i = 0; i < totalPages; i++) {
		$(".pagination").append(`<li class="page-item"><a href="javascript:void(0)" class="page-link ${i == 0 ? "active" : ""}">` + (i + 1) + "</a></li>");
	}
	$(".pagination").append("<li id='next-page'><a class='page-link' aria-label='Next'><span aria-hidden='true'>&raquo;</span><span class='sr-only btn-next'>Next</span></a></li>")
	$(".pagination li.page-item").on("click", function () {
		if ($(this).hasClass("active")) {
			return false;
		}
		else {
			var pageItem = $(this).index();
			console.log(pageItem);
			$(".pagination li").removeClass("active");
			$(this).addClass("active");
			$("#product_list").hide();
			var grandTotal = limit * pageItem;
			console.log(grandTotal);
			for (var i = grandTotal - limit; i < grandTotal; i++) {
				$("#product_list:eq(" + i + ")").show();
			}
		}
	})
}
$(".pagination").ready(function () {
	var i = 1;
	getData(i);
	getProductsCount();
	$('#next-page').click(() => {
		if (i < 12) {
			getData(i + 1);
			i += 1;
		}
	})
	$('#prev-page').click(() => {
		if (i > 1) {
			getData(i - 1);
			i -= 1;
		}
	})
	$('#filter').click(() => {
		let filtered_product = product_list.filter(x => x.productPrice == '550.000 VND');
		console.log(filtered_product, product_list)
		renderProductList(filtered_product);
	})
});

// Related__P
async function relatedProducts() {
	$('#related__p').empty();
	let products = await getData(1);
	related_products = [];
	while (related_products.length < 5) {
		let item = products[Math.floor(Math.random() * products.length)];
		if (!related_products.includes(item)) {
			related_products.push(item);
		}
	}
	console.log(related_products);
	related_products.forEach(item => {
		let row = $('#related__p');
		row.append(
			"<div class='card' style='width: 18rem;'>" +
			`<img class='card-img-top' src="${item.media.link[0]}" alt='image'>` +
			"<div class='card-body'>" +
			`<a href="detail.html?id=${item.productID}"><h5 class='card-title'>${item.productName}</h5></a>` +
			`<p class='card-text'>Color: ${item.productColor}</p>` +
			`<p class='card-text'>Price: ${item.productPrice}</p>` +
			"</div>" +
			"</div>"
		)
	});
}
// Lasted__P
async function lastedProducts() {
	$('#lasted__p').empty();
	let products = await getData(1);
	lasted_products = [];
	while (lasted_products.length < 5) {
		// Lasted products
		// lasted_products = products.slice(Math.max(products.length - 5, 1));
		let item = products[Math.floor(Math.random() * products.length)];

		if (!lasted_products.includes(item)) {
			lasted_products.push(item);
		}
	}
	lasted_products.forEach(item => {
		let row = $('#lasted__p');
		row.append(
			"<div class='card' style='width: 18rem;'>" +
			`<img class='card-img-top' src="${item.media.link[0]}" alt='image'>` +
			"<div class='card-body'>" +
			`<a href="detail.html?id=${item.productID}"><h5 class='card-title'>${item.productName}</h5></a>` +
			`<p class='card-text'>Color: ${item.productColor}</p>` +
			`<p class='card-text'>Price: ${item.productPrice}</p>` +
			"</div>" +
			"</div>"
		)
	});
}