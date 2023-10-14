/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client'
import * as native from 'natives'

export function enable() {
    var player = alt.Player.local
    var dumbsters = ['prop_dumpster_01a', 'prop_dumpster_02a', 'prop_dumpster_02b', 'prop_cs_bin_01', 'prop_cs_bin_02', 'prop_cs_rub_binbag_01', 'prop_bin_01a', 'prop_bin_02a', 'prop_bin_03a', 'prop_bin_04a', 'prop_bin_05a', 'prop_bin_06a', 'prop_bin_07a', 'prop_bin_07b', 'prop_bin_07c', 'prop_bin_07d', 'prop_bin_12a', 'prop_bin_13a', 'prop_bin_14a', 'prop_bin_beach_01a', 'prop_recyclebin_01a', 'prop_recyclebin_02_c']

    alt.on('keydown', key => {
        if (key === 69) { // e
            dumbsters.forEach(e => {
                var object = native.getClosestObjectOfType(player.pos.x, player.pos.y, player.pos.z, 1.0, alt.hash(e), false, false, false)

                if (object) {
                    alt.emitServer('Server:Search:Request')
                    return
                } 
            });
        }
    })
}