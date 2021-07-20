import { Transfer, Form } from 'antd';
import difference from 'lodash/difference';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';
import FormItem from '@/components/CommonComponent/FormItem';
import variables from '@/utils/variables';
import { isEmpty } from 'lodash';

const TableTransfer = ({ leftColumns, rightColumns, search, changeSearch, categories, valuesForm,...restProps }) => (
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
        <>
          {!isEmpty(search) && (
            <Form layout="vertical">
              <div className="row">
                {search.includes('branch') && (
                  <div className="col-lg-6">
                    <FormItem
                      data={[{ id: '', name: 'Tất cả cơ sở'}, ...categories?.branches]}
                      onChange={(event) => changeSearch(event, 'branchId', direction)}
                      type={variables.SELECT}
                      value={valuesForm?.[direction]?.branchId}
                    />
                  </div>
                )}
                {search.includes('class') && (
                  <div className="col-lg-6">
                    <FormItem
                      data={[{ id: '', name: 'Tất cả lớp'}, ...categories?.classes]}
                      onChange={(event) => changeSearch(event, 'classId', direction)}
                      type={variables.SELECT}
                      value={valuesForm?.[direction]?.classId}
                    />
                  </div>
                )}
                {search.includes('keyWord') && (
                  <div className="col-lg-12">
                    <FormItem
                      onChange={(event) => changeSearch(event, 'keyWord', direction)}
                      placeholder="Nhập tên trẻ"
                      type={variables.INPUT_SEARCH}
                      value={valuesForm?.[direction]?.keyWord}
                    />
                  </div>
                )}
              </div>
            </Form>
          )}
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
        </>
      );
    }}
  </Transfer>
);

TableTransfer.propTypes = {
  leftColumns: PropTypes.any,
  rightColumns: PropTypes.any,
  restProps: PropTypes.any,
  search: PropTypes.arrayOf(PropTypes.any),
  changeSearch: PropTypes.func,
  categories: PropTypes.objectOf(PropTypes.any),
  valuesForm: PropTypes.objectOf(PropTypes.any),
};

TableTransfer.defaultProps = {
  rightColumns: [],
  leftColumns: [],
  restProps: {},
  search: [],
  changeSearch: () => {},
  categories: {
    branches: [],
    classes: [],
  },
  valuesForm: {}
};

export default TableTransfer;
