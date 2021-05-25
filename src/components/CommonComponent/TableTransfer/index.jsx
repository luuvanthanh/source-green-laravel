import { Transfer } from 'antd';
import difference from 'lodash/difference';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer
    {...restProps}
    showSelectAll={false}
    locale={{
      searchPlaceholder: 'Nhập tên học sinh',
      itemsUnit: 'Học sinh',
      itemUnit: 'Học sinh',
    }}
  >
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          pagination
          isEmpty
          scroll={{ x: '100%', y: '50vh' }}
          className="table-transfer table-edit"
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

TableTransfer.propTypes = {
  leftColumns: PropTypes.any,
  rightColumns: PropTypes.any,
  restProps: PropTypes.any,
};

TableTransfer.defaultProps = {
  rightColumns: [],
  leftColumns: [],
  restProps: {},
};

export default TableTransfer;
