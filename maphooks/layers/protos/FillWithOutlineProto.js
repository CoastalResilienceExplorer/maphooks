export default class FillWithOutlineProto {
    constructor({ 
        id, //Unique ID
        source_layer, source, //Source to Load
        colorValue, //Field used to drive symbology
        legend, //Symbology
        format,
        layer_title, 
        layer_type, 
        opacity,
        display_legend = true, filter_value = 250000 ,
        legend_prefix=null, legend_suffix=null,
        minzoom=0, maxzoom=12
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
        this.display_legend = display_legend
        this.filter_value = filter_value
        this.format = format
        this.opacity = opacity
        this.minzoom = minzoom
        this.maxzoom = maxzoom
    }

    get MBLayer() {

        const layer_proto = {
            'id': this.id,
            'key': this.id,
            'type': 'fill',
            'source-layer': this.source_layer,
            'source': this.source,
            'paint': {
                // Color
                'fill-color': [].concat(this.color_header, ...this.legend.ColorRamp),
                // Size
                // 'circle-radius': [].concat(this.color_header, ...this.legend.SizeRamp),
                // Strokes
                'fill-color': ['case',
                    ['boolean', ['feature-state', 'selected'], false], 
                    this.strokes.selected.color,
                    [].concat(this.color_header, ...this.legend.ColorRamp),
                ],
                'fill-opacity': this.opacity
            },
            'minzoom': this.minzoom,
            'maxzoom': this.maxzoom
        }


        return layer_proto
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
