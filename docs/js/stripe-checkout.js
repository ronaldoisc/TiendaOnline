import STRIPE_KEYS from "./stripe-keys.js";

const d = document;
const $section_tacos = d.getElementById("tacos");
const $template_tacos = d.getElementById("taco-template").content;
const $fragmet = d.createDocumentFragment("fragment");

let options = {
    headers: {
        Authorization: `Bearer ${STRIPE_KEYS.secret}`
    }
}

const getPay = async() => {
    // let response = await fetch("https://api.stripe.com/v1/payment_intents/pi_1IF1b6BKcPEpELLAJ6RvSuzD", options);
    let response = await fetch("https://api.stripe.com/v1/payment_intents/pi_1IF1b6BKcPEpELLAJ6RvSuzD", options);
    // let response = await fetch("https://api.stripe.com/v1/customers ", options);
    console.log(response);
    let json = await response.json();

    console.log(json);
}
d.addEventListener("DOMContentLoaded", e => {
    var numero = '300';
    var resultado = numero.padEnd(3, "0");
   
    // getPay();
});

let products, prices;
const monyFormat = num => `$${num.slice(0,-2)}.${num.slice(-2)}`;
Promise.all([
        fetch("https://api.stripe.com/v1/products", options),
        fetch("https://api.stripe.com/v1/prices", options)
    ])
    .then(responses => Promise.all(responses.map((resp) => resp.json())))
    .then((json) => {
        products = json[0].data;
        prices = json[1].data;

      
        prices.forEach(el => {
           

            let productData = products.filter(product => product.id === el.product);
            $template_tacos.querySelector(".taco").setAttribute("data-price", el.id);
            // $template_tacos.querySelector("img").src = "assets/tacos.jpg";
            $template_tacos.querySelector("img").src = productData[0].images[0] ? productData[0].images[0] : "https://unaricareceta.com/wp-content/uploads/2020/04/capture-20200420-231640-1.jpg";
            $template_tacos.querySelector("img").alt = productData[0].name;
            $template_tacos.querySelector("figcaption").innerHTML = `
             ${productData[0].name}
             <br>
             ${ monyFormat( el.unit_amount_decimal)} ${el.currency}
            `;
            let $clone = d.importNode($template_tacos, true);
            $fragmet.appendChild($clone);

        });
        $section_tacos.appendChild($fragmet);

    }).catch(err => {
      
        let message = err.statusText || "Ocurrio un err";
        $section_tacos.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    });

d.addEventListener("click", e => {
    
    if (e.target.matches(".taco *")) {
        let price = e.target.parentElement.getAttribute("data-price");
        Stripe(STRIPE_KEYS.public)
            .redirectToCheckout({
                lineItems: [{ price, quantity: 1 }],
                mode: "subscription",
                successUrl: "http://127.0.0.1:5501/stripe_success.html",
                cancelUrl: "http://127.0.0.1:5501/stripe_cancel.html"
            }).then(resp => {
                if (resp.error) {
                    $section_tacos.insertAdjacentHTML("afterend", `Error: ${resp.error.message}`);
                }
            })

    }
})