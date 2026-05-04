import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        
        console.log('Navigating to http://localhost:5173/register');
        await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
        
        console.log('Filling form...');
        await page.type('input[name="name"]', 'Puppeteer User');
        await page.type('input[name="email"]', `pup${Date.now()}@example.com`);
        await page.type('input[name="password"]', 'password123');
        await page.select('select[name="role"]', 'customer');
        
        console.log('Setting up dialog listener...');
        page.on('dialog', async dialog => {
            console.log('DIALOG APPEARED:', dialog.message());
            await dialog.accept();
        });
        
        console.log('Submitting form...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(e => console.log('Navigation timeout, which is expected if registration fails')),
            page.click('button[type="submit"]')
        ]);
        
        console.log('Current URL after submit:', page.url());
        
        await browser.close();
        console.log('Done.');
    } catch (err) {
        console.error('Puppeteer Script Error:', err);
        process.exit(1);
    }
})();
