import { createStationPlayer } from './player.js';
import { checkStreamStatus } from './streamStatus.js';

export function renderStation(station, container) {
    const div = document.createElement('div');
    const playerElement = createStationPlayer(station);

    div.innerHTML = `
        <img src="${station.favicon || './res/default-icon.png'}" alt="📻" style="vertical-align: middle; max-width: 8rem;" />
        <strong><a href="${station.url}">${station.name}</a></strong>
        <span class="status"></span><br/>`;
    div.appendChild(playerElement);
    div.innerHTML += `<hr/>`;
    container.appendChild(div);

    const statusSpan = div.querySelector('.status');
    checkStreamStatus(station.url).then(status => {
        statusSpan.textContent = status;
        statusSpan.style.color = {
            'OK': 'green',
            'Checking': 'orange',
            'Offline': 'red'
        }[status];
    });
}
