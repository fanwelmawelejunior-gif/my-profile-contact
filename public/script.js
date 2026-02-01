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
            alert(msg);  
            form.style.display='none';
        } else {
            const errMsg = await res.text();
            alert('Error: ' + errMsg);
        }

    } catch (err) {
        console.error(err);
      alert('Error sending message');
    }

});
