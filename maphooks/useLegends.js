// import 'react'
import { useMemo } from 'react'

import getLayers from './layers/getLayer'

export function useLegends(layerGroup, subgroup, mapLoaded, layers, custom_layer_protos) {
    
    const legends = useMemo(
        () => {
            return getLayers(layers, layerGroup, { 'floodGroup': subgroup }, custom_layer_protos).legends
        },
        [layerGroup, subgroup, mapLoaded]
    )

    return { 
        legends
    }
}

