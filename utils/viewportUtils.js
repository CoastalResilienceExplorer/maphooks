import Point from '@mapbox/point-geometry';

export function getHeight(transform) {
    const pitch = transform._pitch;
    const altitude = Math.cos(pitch) * transform.cameraToCenterDistance;
    const latOffset = Math.tan(pitch) * transform.cameraToCenterDistance;
    const lngLat = transform.pointLocation(transform.centerPoint.add(new Point(0, latOffset)));
    const circumferenceAtEquator = 2 * Math.PI * 6378137;
    const verticalScaleConstant = transform.worldSize / (circumferenceAtEquator * Math.abs(Math.cos(lngLat.lat * (Math.PI / 180))));
    const altitudeInMeters = altitude / verticalScaleConstant;

    return altitudeInMeters;
}

export function getViewport(map) {
    const { lng, lat } = map.getCenter()
    const zoom = map.getZoom()
    const pitch = map.getPitch()
    const bearing = map.getBearing()
    return {
        latitude: lat,
        longitude: lng,
        zoom,
        bearing,
        pitch
    }
}