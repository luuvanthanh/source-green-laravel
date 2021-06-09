import { MapLayer, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

class Routing extends MapLayer {
  createLeafletElement() {
    const { map, route } = this.props;
    let waypoints = [];
    if (
      route.busRoute.startedPlaceLat &&
      route.busRoute.startedPlaceLong &&
      route.busRoute.endedPlaceLat &&
      route.busRoute.endedPlaceLong
    ) {
      waypoints = [
        L.latLng(route.busRoute.startedPlaceLat, route.busRoute.startedPlaceLong),
        L.latLng(route.busRoute.endedPlaceLat, route.busRoute.endedPlaceLong),
      ];
    }
    const leafletElement = L.Routing.control({
      waypoints,
      lineOptions: {
        styles: [
          {
            color: '#7A7E84',
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
