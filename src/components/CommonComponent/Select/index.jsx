import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import Helper from '@/utils/Helper';

import NoData from '../NoData'
export default function SelectCustom({ options, dataSet, ...rest }) {
  return (
    <Select
      {...rest}
      filterOption={(input, option) =>
        Helper.slugify(option.children)?.indexOf(Helper.slugify(input)) >= 0
      }
      notFoundContent={<NoData simple />}
    >
      {dataSet.map(item => (
        <Select.Option key={item[`${options[0]}`]} value={item[`${options[0]}`]}>
          {item[`${options[1]}`]}
        </Select.Option>
      ))}
    </Select>
  );
}

SelectCustom.propTypes = {
  options: PropTypes.arrayOf(PropTypes.any),
  dataSet: PropTypes.arrayOf(PropTypes.any).isRequired,
};

SelectCustom.defaultProps = {
  options: ['id', 'name'],
};

SelectCustom.displayName = 'Button';
