async function testRegistration() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'customer'
            })
        });
        const data = await res.text();
        console.log('Status:', res.status);
        console.log('Data:', data);
    } catch (err) {
        console.error('Error Message:', err.message);
    }
}

testRegistration();
