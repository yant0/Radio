export async function checkStreamStatus(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        await fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            signal: controller.signal
        });

        clearTimeout(timeout);
        return 'OK';
    } catch (err) {
        if (err.name === 'AbortError') return 'Checking';
        return 'Offline';
    }
}
