import { MapLayer, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

class Routing extends MapLayer {
  createLeafletElement() {
    const { map, route } = this.props;
    let waypoints = [];
    if (
      route?.busPlace?.busRoute?.startedPlaceLat &&
      route?.busPlace?.busRoute?.startedPlaceLong &&
      route?.busPlace?.busRoute?.endedPlaceLat &&
      route?.busPlace?.busRoute?.endedPlaceLong
    ) {
      waypoints = [
        L.latLng(
          route?.busPlace?.busRoute?.startedPlaceLat,
          route?.busPlace?.busRoute?.startedPlaceLong,
        ),
        L.latLng(
          route?.busPlace?.busRoute?.endedPlaceLat,
          route?.busPlace?.busRoute?.endedPlaceLong,
        ),
      ];
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
