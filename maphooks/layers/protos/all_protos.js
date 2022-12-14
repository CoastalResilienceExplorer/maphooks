// PROTOS
import DiscretePointProto from './DiscretePointProto';
import SimpleOutlineProto from './SimpleOutlineProto';
import FillWithOutlineProto from './FillWithOutlineProto';
import RasterInterpolatedProto from './RasterInterpolatedProto';
import HexLayerProto from './FillExtrusionBase';
import GeoScaledPointProto from './GeoScaledPointProto';


export const all_protos = Object.assign(
    { 'DISCRETE_POINT': DiscretePointProto },
    { 'SIMPLE_OUTLINE': SimpleOutlineProto },
    { 'FILL_WITH_OUTLINE': FillWithOutlineProto },
    { 'RASTER': RasterInterpolatedProto },
    { 'HEX_3D': HexLayerProto},
    { 'GEO_POINT': GeoScaledPointProto}
)