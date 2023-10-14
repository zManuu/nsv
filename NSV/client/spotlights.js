/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import alt from 'alt-client';
import native from 'natives';

export function enable() {
    let spotlights;

    // KEY LISTENER
    alt.on('keydown', (key) => {
        if (key === 116) { // F5
            alt.emitServer('Client:ToggleSpotlight');
        }
    });

    // UPDATE LISTENER
    alt.onServer("Server:UpdateSpotlights", vehicleArray => {
        if (vehicleArray instanceof alt.Vehicle) {
            spotlights = [ vehicleArray ];
        } else {
            spotlights = vehicleArray;
        }
    });

    // DRAW INTERVAL
    alt.setInterval(() => {
        if (!spotlights || spotlights == undefined || spotlights == null) return;
        spotlights.forEach(v => {
            var dir = native.getEntityForwardVector(v).mul(20).add(0, 0, -10);
            var start = v.pos.add(native.getEntityForwardVector(v).mul(5));
            native.drawSpotLight(start.x, start.y, start.z, dir.x, dir.y, dir.z, 200, 200, 200, 100, 10, 10, 15, 5);
        });
    }, 3);
}