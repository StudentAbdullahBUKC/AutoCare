const BASE = 'http://localhost:5000/api';

async function apiTest() {
    let cookie = '';

    // 1. Register a fresh user
    console.log('\n--- 1. Register ---');
    const regRes = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'E2E Tester', email: `e2e_${Date.now()}@test.com`, password: 'password123', role: 'customer' })
    });
    const regData = await regRes.json();
    console.log(`Status: ${regRes.status}`, regData);
    cookie = regRes.headers.get('set-cookie');
    if (regRes.status !== 200) throw new Error('Registration failed');

    // 2. Get /auth/me
    console.log('\n--- 2. Get /auth/me ---');
    const meRes = await fetch(`${BASE}/auth/me`, { headers: { Cookie: cookie } });
    const meData = await meRes.json();
    console.log(`Status: ${meRes.status}`, meData);

    // 3. Get services
    console.log('\n--- 3. Get Services ---');
    const svcRes = await fetch(`${BASE}/services`);
    const services = await svcRes.json();
    console.log(`Status: ${svcRes.status}, Count: ${services.length}`);
    services.forEach(s => console.log(`  - ${s.name}: $${s.price} (${s.duration} mins) [${s._id}]`));
    if (services.length === 0) throw new Error('No services seeded!');

    const serviceId = services[0]._id;
    const servicePrice = services[0].price;

    // 4. Book appointment
    console.log('\n--- 4. Book Appointment ---');
    const apptRes = await fetch(`${BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ serviceId, date: '2026-06-20', timeSlot: '10:00 AM' })
    });
    const apptData = await apptRes.json();
    console.log(`Status: ${apptRes.status}`, apptData);
    if (apptRes.status !== 200) throw new Error('Booking failed: ' + JSON.stringify(apptData));

    // 5. Mock payment
    console.log('\n--- 5. Mock Payment ---');
    const payRes = await fetch(`${BASE}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ appointmentId: apptData._id, amount: servicePrice, paymentMethod: 'credit_card' })
    });
    const payData = await payRes.json();
    console.log(`Status: ${payRes.status}`, payData);

    // 6. Get history
    console.log('\n--- 6. Appointment History ---');
    const histRes = await fetch(`${BASE}/appointments/history`, { headers: { Cookie: cookie } });
    const histData = await histRes.json();
    console.log(`Status: ${histRes.status}, Count: ${histData.length}`);
    histData.forEach(a => console.log(`  - ${a.service?.name} on ${a.date} @ ${a.timeSlot} | Status: ${a.status} | Price: $${a.service?.price}`));

    console.log('\n✅ ALL E2E TESTS PASSED');
}

apiTest().catch(err => {
    console.error('\n❌ E2E TEST FAILED:', err.message);
    process.exit(1);
});
