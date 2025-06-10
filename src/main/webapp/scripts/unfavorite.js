export function unfavoriteStation(stationUrl, elementToRemove) {
    fetch('unfavorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: stationUrl })
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to unfavorite');
            elementToRemove.remove();
        })
        .catch(err => {
            console.error('Unfavorite failed', err);
        });
}
