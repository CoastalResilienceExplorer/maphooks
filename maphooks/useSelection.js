import { useEffect, useState, useRef } from "react";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

export function useSelection(map, mapLoaded, mapContainer, all_selectable_layers, layerSelectionDependencies) {

    const [selectedFeatures, setSelectedFeatures] = useState([])
    const featuresRef = useRef([])
    const [selectionType, setSelectionType] = useState(null)
    const layerSelectionDependenciesRef = useRef([])

    useEffect(() => {
        setSelectedFeatures(selectedFeatures.filter(f => f.layer.id === selectionType))
    }, [selectionType])

    function setFeatureState_withDependencies(f, state) {
        map.setFeatureState(
            {
                source: f.layer.source,
                sourceLayer: f.layer['source-layer'],
                id: f.id
            },
            { selected: state }
        )
        layerSelectionDependenciesRef.current.forEach(lsd => {
            if (lsd[0] === f.layer['source-layer']) {
                map.setFeatureState(
                    {
                        source: f.layer.source,
                        sourceLayer: lsd[1],
                        id: f.id
                    },
                    { selected: state }
                )
            }
        })
    }

    useEffect(() => {
        // return
        if (!mapLoaded) return
        mapContainer.current.addEventListener('mousedown', mouseDown, true);
        let start, current, box;

        // Return the xy coordinates of the mouse position
        function mousePos(e) {
            const rect = mapContainer.current.getBoundingClientRect();
            return new mapboxgl.Point(
                e.clientX - rect.left - mapContainer.current.clientLeft,
                e.clientY - rect.top - mapContainer.current.clientTop
            );
        }

        function mouseDown(e) {
            // Continue the rest of the function if the shiftkey is pressed.
            if (!(e.shiftKey && e.button === 0)) return;

            // Disable default drag zooming when the shift key is held down.
            map.dragPan.disable();

            // Call functions for the following events
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('keydown', onKeyDown);

            // Capture the first xy coordinates
            start = mousePos(e);
        }

        function onMouseMove(e) {
            // Capture the ongoing xy coordinates
            current = mousePos(e);

            // Append the box element if it doesnt exist
            if (!box) {
                box = document.createElement('div');
                box.classList.add('boxdraw');
                mapContainer.current.appendChild(box);
            }

            const minX = Math.min(start.x, current.x),
                maxX = Math.max(start.x, current.x),
                minY = Math.min(start.y, current.y),
                maxY = Math.max(start.y, current.y);

            // Adjust width and xy position of the box element ongoing
            const pos = `translate(${minX}px, ${minY}px)`;
            box.style.transform = pos;
            box.style.width = maxX - minX + 'px';
            box.style.height = maxY - minY + 'px';
        }

        function onMouseUp(e) {
            // Capture xy coordinates
            finish([start, mousePos(e)]);
        }

        function onKeyDown(e) {
            // If the ESC key is pressed
            if (e.keyCode === 27) finish();
        }

        function finish(bbox) {
            // Remove these events now that finish has been called.
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mouseup', onMouseUp);

            if (box) {
                box.parentNode.removeChild(box);
                box = null;
            }

            // If bbox exists. use this value as the argument for `queryRenderedFeatures`
            if (bbox) {
                // Handle small drags via 'click'
                const max_dim = Math.max(Math.abs(bbox[0].x - bbox[1].x), Math.abs(bbox[0].y - bbox[1].y))
                if (max_dim < 5) {
                    map.dragPan.enable();
                    return
                }

                const current_ids = featuresRef.current.map(feat => feat.id)
                const features = map.queryRenderedFeatures(bbox, {
                    layers: ['countries', 'tessela_rps']
                }).filter(f => !current_ids.includes(f.id));
                if (features.length >= 1000) {
                    return window.alert('Select a smaller number of features');
                }
                // setSelectedFeatures(features)
                setSelectedFeatures([...new Set([
                    ...featuresRef.current,
                    ...features])])
            }

            map.dragPan.enable();
        }
    }, [mapContainer, mapLoaded])

    useEffect(() => {
        if (!mapLoaded) return
        featuresRef.current.forEach(f => {
            if (!selectedFeatures.includes(f)) {
                setFeatureState_withDependencies(f, false)
            }
        })
        selectedFeatures.forEach(f => {
            if (!featuresRef.current.includes(f)) {
                setFeatureState_withDependencies(f, true)
            }
        })
        featuresRef.current = selectedFeatures
    }, [selectedFeatures])


    function onClick(e) {
        function getQueryableFeatures(e) {
            var bbox = [
                [e.point.x - 5, e.point.y - 5],
                [e.point.x + 5, e.point.y + 5]
            ];
            console.log( map.queryRenderedFeatures(bbox))
            var features = map.queryRenderedFeatures(bbox).filter(
                x => all_selectable_layers.includes(x.layer.id)
            );
            return features
        }

        const features = getQueryableFeatures(e)
        const is_shift = e.originalEvent.shiftKey

        // Features were clicked, figure out what to do
        if (features.length !== 0) {
            const f = features[0]
            const current_ids = featuresRef.current.map(feat => feat.id)

            // Set the first feature and dependencies to selected
            // setFeatureState_withDependencies(features[0], true)
            // Decide on adding new features to selected features buffer, or replacing the buffer
            if (is_shift) {
                if (current_ids.includes(f.id)) {
                    setSelectedFeatures([...new Set([...featuresRef.current.filter(feat => feat.id != f.id)])])
                }
                else {
                    setSelectedFeatures([...new Set([...featuresRef.current, f])])
                }
            }
            else setSelectedFeatures([features[0]])
            setSelectionType(f.layer.id)
        }
        else {
            setSelectedFeatures([])
            setSelectionType(null)
        }
    }

    useEffect(() => {
        layerSelectionDependenciesRef.current = layerSelectionDependencies
    }, [layerSelectionDependencies])

    useEffect(() => {
        if (!mapLoaded) return
        map.on('click', (e) => {
            onClick(e)
        })
    }, [mapLoaded])

    return { selectedFeatures, selectionType }
}