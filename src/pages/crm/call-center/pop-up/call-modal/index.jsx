import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

function Index({ visibleCall, phoneNumber }) {
  const [isVisible, setIsVisible] = useState(visibleCall);
  const [isDisabled, setIsDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef();

  const handleCancel = () => {
    setIsVisible(false);
  };

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      <Modal
        // maskClosable={false}
        footer={null}
        visible={isVisible}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={isDisabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div
          style={{
            width: '100%',
            cursor: 'move',
            padding: 24,
          }}
          onMouseOver={() => {
            if (isDisabled) setIsDisabled(false);
          }}
          onMouseOut={() => setIsDisabled(true)}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          <p>{phoneNumber}</p>
        </div>
      </Modal>
    </>
  );
}

Index.propTypes = {
  visibleCall: PropTypes.bool,
  phoneNumber: PropTypes.string,
};

Index.defaultProps = {
  visibleCall: true,
  phoneNumber: '',
};

export default Index;
