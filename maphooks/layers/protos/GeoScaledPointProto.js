export default class GeoScaledPointProto {
    constructor({ 
        id, //Unique ID
        source_layer, source, //Source to Load
        colorValue, //Field used to drive symbology
        legend, //Symbology
        format,
        layer_title, 
        layer_type, 
        floodGroup, 
        minzoom=6,
        legend_prefix=null, legend_suffix=null,
        display_legend=false
    }) {
        this.id = id
        this.source = source
        this.source_layer = source_layer
        this.colorValue = colorValue
        this.legend = legend
        this.legend_prefix = legend_prefix
        this.legend_suffix = legend_suffix
        this.strokes = legend.strokes
        this.layer_title = layer_title
        this.layer_type = layer_type
        this.color_header = legend.colorHeader(colorValue)
        this.colorValue = colorValue
        this.minzoom = minzoom
        this.display_legend = display_legend ? (
            (floodGroup === 'with' && this.id.includes('flooding_with') && !this.id.includes('flooding_without'))
            ||
            (floodGroup === 'without' && this.id.includes('flooding_without'))
        ) : false
        // this.display_legend = display_legend
        this.format = format

        this.visible = (
            (floodGroup === 'with' && this.id.includes('flooding_with') && !this.id.includes('flooding_without'))
            ||
            (floodGroup === 'without' && this.id.includes('flooding_without'))
        ) ? 'visible' : 'none'
    }

    get MBLayer() {

        const layer_proto = {
            id: this.id,
            key: this.id,
            type: "circle",
            source: this.source,
            minzoom: this.minzoom,
            "source-layer": this.source_layer,
            "paint": {
                "circle-radius": [
                    'interpolate',
                    // Set the exponential rate of change to 0.5
                    ['exponential', 2],
                    ['zoom'],
                    // When zoom is 0, radius will be 1px.
                    0,
                    1,
                    // When zoom is 15 or higher, radius will be 15px.
                    15,
                    16
                ],
                // "circle-color": [].concat(this.color_header, ...this.legend.ColorRamp),
                "circle-color": this.colorValue,
                "circle-stroke-color": "#000000",
                "circle-stroke-width": [
                    'interpolate',
                    // Set the exponential rate of change to 2
                    ['exponential', 2],
                    ['zoom'],
                    // When zoom is 0
                    0,
                    0.001,
                    // When zoom is 15
                    15,
                    0.1
                ],
                "circle-pitch-scale": "map",
                "circle-pitch-alignment": "map"
            }
        }

        return Object.assign(
            layer_proto,
            {
                'layout': {
                    'visibility': this.visible
                }
            }
        )
    }

    get Legend() {
        return Object.assign(
            this.legend,
            {
                layer_title: this.layer_title,
                prefix: this.legend_prefix,
                suffix: this.legend_suffix,
                format: this.format,
                layer_type: this.layer_type
            }
        )
    }
}
