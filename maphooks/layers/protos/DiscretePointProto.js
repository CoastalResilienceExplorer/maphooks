export default class DiscretePointProto {
    constructor({ 
        id, //Unique ID
        source_layer, source, //Source to Load
        colorValue, //Field used to drive symbology
        legend, //Symbology
        format,
        layer_title, 
        layer_type, 
        display_legend = true, filter_value = 250000 ,
        legend_prefix=null, legend_suffix=null
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
    }

    get MBLayer() {

        const layer_proto = {
            'id': this.id,
            'key': this.id,
            'type': 'circle',
            'source-layer': this.source_layer,
            'source': this.source,
            'paint': {
                // Color
                'circle-color': [].concat(this.color_header, ...this.legend.ColorRamp),
                // Size
                'circle-radius': [].concat(this.color_header, ...this.legend.SizeRamp),
                // Strokes
                'circle-stroke-color': ['case',
                    ['boolean', ['feature-state', 'selected'], false], this.strokes.selected.color,
                    this.strokes.color
                ],
                'circle-stroke-width': ['case',
                    ['boolean', ['feature-state', 'selected'], false], this.strokes.selected.width,
                    this.strokes.width
                ],
                'circle-stroke-opacity': ['case',
                    ['boolean', ['feature-state', 'selected'], false], this.strokes.selected.opacity,
                    this.strokes.opacity
                ]
            },
            'layout': {
                'circle-sort-key': ['*', -1, this.colorValue]
            },
            'minzoom': 0,
            'maxzoom': 16,
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
