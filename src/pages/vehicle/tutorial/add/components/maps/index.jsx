import React, { useState, useRef, useMemo, useCallback } from 'react';
import { connect, withRouter } from 'umi';
import { Modal } from 'antd';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [17, 46],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Index({ visible }) {
  const [position, setPosition] = useState([16.07176, 108.223961]);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  const onDrag = (e) => {
    setPosition(e.latlng);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );

  return (
    <Modal
      centered
      className={styles['modal-container']}
      footer={[
        <div className={classnames('d-flex', 'justify-content-center')} key="action">
          <Button color="white" icon="cross" size="medium">
            ĐÓNG
          </Button>
          <Button color="green" icon="save" size="medium">
            XÁC NHẬN VỊ TRÍ
          </Button>
        </div>,
      ]}
      title="Maps"
      visible={visible}
    >
      <div className={styles.leafletContainer}>
        <MapContainer
          style={{ height: '100vh' }}
          center={position}
          zoom={15}
          maxZoom={22}
          refs={mapRef}
          scrollWheelZoom={true}
          whenReady={(map) => {
            map.target.on('click', function (e) {
              onDrag(e);
            });
          }}
        >
          <TileLayer
            url="http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
            maxNativeZoom="23"
            minZoom="0"
            maxZoom="23"
          />
          <Marker
            position={position}
            draggable={true}
            ref={markerRef}
            eventHandlers={eventHandlers}
          ></Marker>
        </MapContainer>
      </div>
    </Modal>
  );
}

export default Index;
