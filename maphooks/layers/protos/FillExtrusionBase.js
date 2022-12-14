export default class HexLayerProto {
    constructor({
        id, //Unique ID
        source_layer, source, //Source to Load
        colorValue, //Field used to drive symbology
        heightValue,
        baseValue,
        scale,
        legend, //Symbology
        format,
        layer_title,
        layer_type,
        hex_type = 'REDUCTION',
        display_legend = true, filter_value = 250000,
        legend_prefix = null, legend_suffix = null
    }) {
        this.id = id
        this.source = source
        this.source_layer = source_layer
        this.colorValue = colorValue
        this.heightValue = heightValue
        this.baseValue = baseValue
        this.scale = scale
        this.legend = legend
        this.legend_prefix = legend_prefix
        this.legend_suffix = legend_suffix
        this.strokes = legend.strokes
        this.layer_title = layer_title
        this.layer_type = layer_type
        this.hex_type = hex_type
        this.color_header = legend.colorHeader(colorValue)
        this.display_legend = display_legend
        this.filter_value = filter_value
        this.legend_prefix = legend_prefix
        this.legend_suffix = legend_suffix
        this.format = format
        console.log(legend)
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

    get MBLayer() {

        const layer_proto = {
            'id': this.id,
            'key': this.id,
            'type': 'fill-extrusion',
            'source-layer': this.source_layer,
            'source': this.source,
            'paint': {
                // Color
                'fill-extrusion-color': ['case',
                    ['boolean', ['feature-state', 'selected'], false], this.strokes.selected.color,
                    this.hex_type === 'REDUCTION' ?
                        [].concat(this.color_header, ...this.legend.ColorRamp) :
                        'white',
                ],
                'fill-extrusion-height': ['*', ['^',
                    this.heightValue, 2/3],
                    this.scale],
                'fill-extrusion-base': ['*', ['^',
                    this.baseValue, 2/3],
                    this.scale],
                // ['*',
                //     this.baseValue,
                //     this.scale]],
            }

            // {
            //     // 'fill-extrusion-color': 'black',
            //     // 'fill-extrusion-color': [].concat(this.color_header, formatted_legend),
            //     'fill-extrusion-color': [ 'case', 
            //         ['boolean', ['feature-state', 'hover'], false], 'blue', 
            //             [].concat(this.color_header, ...this.legend.ColorRamp),
            //         ],
            //     // 'fill-extrusion-opacity': 0.9,
            //     'fill-extrusion-height': ['+',
            //         ['+', 
            //             ['*', 
            //                 this.height_value, 
            //                 this.scale], 
            //             ],
            //         ['*', 
            //             this.base,  
            //             this.scale], this.offset],
            //     'fill-extrusion-base': ['+', ['*', 
            //             this.base, 
            //             this.scale], this.offset],
            // },
            // 'filter': ['>', this.color_value, this.filter_value]
        }

        return layer_proto
    }
}
