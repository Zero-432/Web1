var product_list = [];
var total_products = [];
var totalProducts;
var related_products = [];
var lasted_products = [];
function returnHomePage() {
	window.location = "mainpage.html";
}
function getData(page) {
	let url = `https://products-json.herokuapp.com/products?_page=${page}&_limit=12`;
	return $.getJSON(url, function (data) {
		product_list = data;
		totalProducts = product_list.length;
		renderProductList(product_list);
	});
}
function get_totalProducts(page) {
	let url = `https://products-json.herokuapp.com/products`;
	return $.getJSON(url, function (data) {
		total_products = data;
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


function showDetail(id) {
	let url = `https://products-json.herokuapp.com/products/${id}`;
	$.getJSON(url, function (data) {
		let product = data;
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
function clickImgs(imgs) {
	var expandImg = document.getElementById("expandedImg");
	expandImg.src = imgs.src;
	expandImg.parentElement.style.display = "block"
}

// Khi nhấn trừ số lương
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

// Tạo Pagination

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
			// hide product list đi làm clgt????
			// $("#product_list").hide(); 
			// var grandTotal = limit * pageItem;
			// console.log(grandTotal);
			getData(pageItem);
			// for (var i = grandTotal - limit; i < grandTotal; i++) {
			// 	$("#product_list:eq(" + i + ")").show();
			// }
		}
	})
}


/// Khi trang home được load
$(document).ready(function () {
	var i = 1;
	getData(i);
	getProductsCount();
	get_totalProducts();
	$('#filter_price_1').click(() => {
		let filtered_product = total_products.filter(x => x.productPrice == '550.000 VND');
		console.log(filtered_product, product_list)
		renderProductList(filtered_product);
	})
	$('#filter_price_2').click(() => {
		let filtered_product = total_products.filter(x => x.productPrice == '450.000 VND');
		renderProductList(filtered_product);
	})
	$('#filter_color_1').click(() => {
		let filtered_product = total_products.filter(x => x.productColor == 'Insignia/Sulphur');
		renderProductList(filtered_product);
	})
	$('#filter_color_2').click(() => {
		let filtered_product = total_products.filter(x => x.productColor == 'Dark Grey');
		renderProductList(filtered_product);
	})
	$('#filter_brand_1').click(() => {
		let filtered_product = total_products.filter(x => x.productName.substr(0, 5) == 'Urbas');
		renderProductList(filtered_product);
	})
	$('#filter_brand_2').click(() => {
		let filtered_product = total_products.filter(x => x.productName.substr(0, 6) == 'Vintas');
		renderProductList(filtered_product);
	})
});

function loadCart() {
	if (localStorage.getItem('cart')) {
		return JSON.parse(localStorage.getItem('cart'));
	}
}
function saveCart(cart) {
	if (cart) {
		return localStorage.setItem('cart', JSON.stringify(cart));
	}
	return false;
}

// Khi trang chi tiết sản phẩm load
$('#product-info').ready(function () {
	const urlParams = new URLSearchParams(window.location.search);
	const product_id = urlParams.get('id');
	showDetail(product_id);

	var cart = loadCart() || []; // Mảng chứa các item có trong cart | load ra từ local hoặc [] nếu chưa có
	$('#add_cart').click(function () {
		let item = {
			id: '',
			name: '',
			image: '',
			price: 0
		};
		item.id = product_id;
		item.name = $('.product-detail__content > h3').text();
		item.image = $('#product__picture .picture__container img').attr('src');
		item.price = parseInt($('.product-detail__content > .price .new__price').text().replace(',', '.').replace(' ', '').slice(0, -4));
		// kiểm tra trong cart có sp này chưa
		// tìm index của item trùng
		let duplicate_index = cart.findIndex(cart_item => cart_item.product.id === item.id);
		if (duplicate_index > -1) { // nếu trùng
			cart[duplicate_index].quantity += parseInt($('#product_qty').val());
		} else { // ko trùng
			cart.push({
				product: item,
				quantity: parseInt($('#product_qty').val())
			});
		}
		// lưu cart vào local
		saveCart(cart);
	})
});
// Khi trang cart load
$('cart-container').ready(function () {
	displayCart();
})

function displayCart() {
	let cart = loadCart();
	let total_price = 0;
	cart.forEach(item => total_price += item.product.price * item.quantity);
	$('.new__price').text(total_price.toString() + 'VND');
	for (let item of cart) {
		$('.cart-items').append(
			`
			<tr class="cake-top">
				<td class="product__thumbnail">
					<a href="#">
						<img style="width:100%" src="${item.product.image}" alt="item image">
					</a>
				</td>
				<td class="product__name">
					<a href="#">${item.product.name}</a>
					<br><br>
					<small>White/6.25</small>
				</td>
				<td class="quantity">
					<div class="product-right">
						<input size="5" min="1" type="number" id="quantity" name="quantity"
							value="${item.quantity}" class="form-control input-small">
					</div>
				</td>
				<td class="price">
					<h4>${item.product.price} VND</h4>
				</td>
				<td class="top-remove">
					<h4>${item.quantity * item.product.price} VND</h4>
					<div class="close">
						<h5>Remove</h5>
					</div>
				</td>
			</tr>
			`
		)
	}

}

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

// export default { getData, get_totalProducts, getProductsCount };