import STRIPE_KEYS from "./stripe-keys.js";
const d = document;

d.addEventListener("submit", async e => {
    if (e.target.matches('.formulario')) {
        e.preventDefault();

        try {
            let response = await fetch('https://api.stripe.com/v1/products', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer sk_test_51I9EwXBKcPEpELLASrxtkOwNUJgIe2Tx72og68V7N3HIrfs6VBPeJjJsB4lbzPy2elanYjeOsdNjrNQQqJTptNsD006lLlwr1s`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `name=${e.target.nombre.value}`
            });

            if (response.ok) {
                let dataProduct = await response.json();
                let costo = e.target.costo.value;

                let costoFormat = `${costo}00`;



                let response2 = await fetch('https://api.stripe.com/v1/prices', {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer sk_test_51I9EwXBKcPEpELLASrxtkOwNUJgIe2Tx72og68V7N3HIrfs6VBPeJjJsB4lbzPy2elanYjeOsdNjrNQQqJTptNsD006lLlwr1s`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `currency=mxn&unit_amount=${costoFormat}&recurring[interval]=month&product=${dataProduct['id']}`

                });

                if(response2.ok){
                    window.location.href="index.html"
                }
               
            }

        } catch (err) {
           
        }

    }
});