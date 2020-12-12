var product_list = [];
var total_products = [];

function returnHomePage() {
    window.location.href = "mainpage.html";
}
function getData(page) {
    let url = `https://products-json.herokuapp.com/products?_page=${page}&_limit=12`
    $.getJSON(url, function (data) {
        product_list = data;
        console.log(product_list);
        renderProductList(product_list);
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
$(document).ready(function () {
    var i = 1;
    getData(i);
    $('#next').click(() => {
        if (i < 12) {
            getData(i + 1);
            i += 1;
        }
    })
    $('#prev').click(() => {
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
                        .prepend(`<a data-target="#pic" data-toogle="tab"><img id="pic${i + 1}" class="picture" src="${product.media.link[i]}"></a>`)
                )
            }
        }
    })

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