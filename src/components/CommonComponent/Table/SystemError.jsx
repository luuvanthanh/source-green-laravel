import React from 'react';
import { history } from 'umi';
import PropTypes from 'prop-types';
import { Result, Button } from 'antd';

export default function SystemError({ ...rest }) {
  const onRedirect = () => history.push('/');

  return (
    <Result
      {...rest}
      extra={
        <Button
          onClick={onRedirect}
          type="primary"
        >
          Back Home
        </Button>
      }
    />
  );
}

SystemError.propTypes = {
  rest: PropTypes.any
};

SystemError.defaultProps = {
  rest: {}
};

SystemError.displayName = 'SystemError';
