export default class RasterInterpolatedProto {
    constructor({
        id, //Unique ID
        layer,
        legend, //Symbology
        layer_title,
        floodGroup,
        layer_type,
        legend_suffix,
        display_legend = true
    }) {
        console.log(layer)
        console.log(layer.id)
        this.id = layer.id
        this.layer = layer
        this.legend = legend
        this.layer_title = layer_title
        this.legend_suffix = legend_suffix
        this.layer_type = layer_type
        this.display_legend = (
            (floodGroup === 'with' && this.id === 'flooding_with_mangroves1')
            ||
            (floodGroup === 'without' && this.id === 'flooding_with_mangroves2')
        )
        console.log('ARGS')
        console.log(floodGroup)
        this.visible = (
            (floodGroup === 'with' && this.id === 'flooding_with')
            ||
            (floodGroup === 'without' && this.id === 'flooding_without')
        ) ? 'visible' : 'none'
        console.log(this.visible)
    }

    get MBLayer() {
        return Object.assign(
            this.layer,
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
                layer_type: this.layer_type,
                suffix: this.legend_suffix
            }
        )
    }
}
