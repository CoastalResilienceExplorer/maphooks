import { useRef, useEffect, useState} from 'react'

export default function useBreadcrumbs(aois, viewport) {
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const previousBreadcrumbs = useRef([])

    function getBreadcrumbs(viewport) {
        previousBreadcrumbs.current = breadcrumbs
        function formatBB(area) {
            return {
                lng: {
                    min: Math.min(area[0][0], area[1][0]),
                    max: Math.max(area[0][0], area[1][0])
                },
                lat: {
                    min: Math.min(area[0][1], area[1][1]),
                    max: Math.max(area[0][1], area[1][1])
                }
            }
        }
    
        function testContains(area, vp) {
            const bbox = formatBB(area)
            if ((vp.longitude > bbox.lng.min && vp.longitude < bbox.lng.max) &&
                (vp.latitude > bbox.lat.min && vp.latitude < bbox.lat.max)) {
                return true
            }
        }
    
        const parents = aois.locations.filter(x => !x.parent).filter(p => testContains(p.location_awareness.bbox, viewport))
        if (parents.length === 0) {
            return []
        }
    
        const children = aois.locations.filter(c => c.parent === parents[0].id).filter(c => testContains(c.location_awareness.bbox, viewport))
        if (children.length === 0) return [parents[0].id]
        return [parents[0].id, children[0].id]
    }

    useEffect(() => {
        setBreadcrumbs(getBreadcrumbs(viewport))
    }, [viewport]) // eslint-disable-line react-hooks/exhaustive-deps

    return breadcrumbs
}