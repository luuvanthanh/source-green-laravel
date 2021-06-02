import { MapLayer, withLeaflet } from 'react-leaflet';
import { isEmpty } from 'lodash';
import L from 'leaflet';
import 'leaflet-routing-machine';

class Routing extends MapLayer {
  createLeafletElement() {
    const { map, routes } = this.props;
    let waypoints = [];
    if (!isEmpty(routes)) {
      waypoints = routes.map((item) => L.latLng(item?.lat, item?.long));
    }
    const leafletElement = L.Routing.control({
      waypoints,
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
