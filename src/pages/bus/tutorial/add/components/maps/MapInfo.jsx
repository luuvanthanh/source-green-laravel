import { MapLayer, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

class Routing extends MapLayer {
  createLeafletElement() {
    const { map } = this.props;
    const leafletElement = L.Routing.control({
      waypoints: [L.latLng(16.050051, 108.155123), L.latLng(16.06471, 108.15115)],
      lineOptions: {
        styles: [
          {
            color: '#27A600',
            opacity: 0.8,
            weight: 4,
          },
        ],
      },
      createMarker: () => null,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
    }).addTo(map.leafletElement);
    return leafletElement.getPlan();
  }

  render() {
    return null;
  }
}
export default withLeaflet(Routing);
