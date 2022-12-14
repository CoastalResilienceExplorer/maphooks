import { useState, useEffect, useRef, useMemo } from 'react'
import getLayers from './getLayer'

// Data
import sky from './sky'
// PROTOS
import { all_protos } from './protos/all_protos'

export function useLayers(map, mapLoaded, init_layer_group, init_subgroup, style, all_layers, all_sources, custom_protos) {
    /**
   * Maintains the loaded sources and layers for a MapboxGL Map.  Allows for switching of groups of layers.  
   * @param map  MapboxGL map
   * @param mapLoaded   Boolean state watcher to ensure the map is ready
   * @param init_layer_group Initial layer group to use
   * @param init_subgroup  Initial layer subgroup to use
   * @param style  Map style.  React State from useMap.  Layers must be reloaded when the style changes.
   * @param all_layers   An object mapping layer_groups to sets of layers
   * @param all_sources All sources used amongst layers
   * @param custom_protos  Custom layer parsers, which lets you create your own symbology.
   * @return {Object} layerGroup, layerSelectionDependencies, subgroup, subgroupOn, setLayerGroup, setSubgroup
   */
    const [layerGroup, setLayerGroup] = useState(init_layer_group)
    const [subgroup, setSubgroup] = useState(init_subgroup)
    const [subgroupOn, setSubgroupOn] = useState(false)
    const layersRef = useRef([])

    const layers_and_legends = useMemo(
        () => {
            return getLayers(all_layers, layerGroup, { 'floodGroup': subgroup }, custom_protos || all_protos)
        },
        [layerGroup, subgroup]
    )

    const layers = useMemo(
        () => layers_and_legends.layers, [layers_and_legends])
    const layerSelectionDependencies = useMemo(
        () => layers_and_legends.selectionDependencies, [layers_and_legends])


    function unloadLayers() {
        for (const existing of layersRef.current) {
            map.removeLayer(existing.id)
        }
    }

    function addSourcesAndSupps() {
        const existing_sources = map.getStyle().sources
        for (const source of all_sources) {
            if (!Object.keys(existing_sources).includes(source[0])) {
                map.addSource(source[0], source[1])
            }
        }
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        map.setFog({ 'color': 'rgba(255, 255, 255, 0.82)' });
    }

    function addLayers(layers_to_add) {
        for (const layer of layers_to_add) {
            map.addLayer(layer)
        }
        map.addLayer(sky)
        layersRef.current = [...layers_to_add, sky]
    }

    useEffect(() => {
        if (!mapLoaded) return
        map.setStyle(style)
        map.on('style.load', () => {
            unloadLayers(layers)
            addSourcesAndSupps()
            addLayers(layers)
        })
    }, [style])

    useEffect(() => {
        if (!mapLoaded) return
        setSubgroupOn(
            layers.map(l => l.id)
                .filter(l => l.includes('flooding'))
                .length > 0
        )
        unloadLayers(layers)
        addSourcesAndSupps()
        addLayers(layers)
    }, [mapLoaded, layers])

    return {
        layerGroup,
        layerSelectionDependencies,
        subgroup,
        subgroupOn,
        setLayerGroup,
        setSubgroup
    }
}

