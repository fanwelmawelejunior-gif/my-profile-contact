console.log("Script is loaded");
document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    if (!hamburger || !menu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener("click", function () {
        menu.classList.toggle("active");
        hamburger.classList.toggle("active"); // X animation
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            menu.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });

    // Close menu when clicking a link
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function () {
            menu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });

});

const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const res = await fetch('/submit', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ name, email, message })
        });

        if (res.ok) {
            const msg = await res.text();

            // Show alert
            alert(msg);

            //  Remove this line so the form stays visible
            // form.style.display='none';

            // Optional: clear inputs but keep form visible
            form.reset();

        } else {
            const errMsg = await res.text();
            alert('Error: ' + errMsg);
        }

    } catch (err) {
        console.error(err);
        alert('Error sending message');
    }
});

