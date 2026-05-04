const axios = require('axios');

async function testFrontendFlow() {
    try {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = 'http://localhost:5000/api';

        // 1. Register
        console.log('Registering...');
        const res = await axios.post('/auth/register', { 
            name: 'John Doe', 
            email: 'john@example.com', 
            password: 'password123', 
            role: 'customer' 
        });
        console.log('Register response:', res.status, res.data);

        // 2. We need to extract the cookie from the response to send it back!
        const cookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0] : null;
        console.log('Cookie received:', cookie);

        // 3. Get /auth/me
        console.log('Getting /auth/me...');
        const res2 = await axios.get('/auth/me', {
            headers: {
                Cookie: cookie
            }
        });
        console.log('Me response:', res2.status, res2.data);
    } catch (err) {
        console.error('Error in flow:');
        console.error(err.response ? err.response.data : err.message);
    }
}

testFrontendFlow();
