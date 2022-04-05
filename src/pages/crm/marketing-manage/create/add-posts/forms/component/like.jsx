import { memo } from 'react';
import PropTypes from 'prop-types';
import TableCus from '@/components/CommonComponent/Table';

const Index = memo(({ dataLike }) => {
    const header = () => {
        const columns = [
            {
                title: 'STT ',
                key: 'index',
                width: 80,
            },
            {
                title: 'Thời gian',
                key: 'created_at',
                className: 'min-width-150',
                width: 150,
                render: (record) => record?.created_at,
            },
            {
                title: 'Trạng thái',
                className: 'min-width-250',
                key: 'reaction_type',
                render: (record) => record?.reaction_type,
            },
            {
                title: 'Họ và tên',
                key: 'name',
                className: 'min-width-150',
                width: 150,
                render: (record) => record?.full_name,
            },
            {
                title: 'Số điện thoại',
                key: 'phone',
                className: 'min-width-150',
                width: 150,
            },
            {
                title: 'Email',
                key: 'email',
                className: 'min-width-150',
                width: 150,
            },
        ];
        return columns;
    };


    
    console.log("dataLike",dataLike)
    return (
        <>
            <TableCus
                className="content-vertical-top mb20"
                columns={header}
                dataSource={dataLike}
                loading={false}
                error={{}}
                isError={false}
                pagination={false}
                rowKey="id"
                scroll={{ x: '100%' }}
            />
        </>
    );
});

Index.propTypes = {
    dataLike: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
    dataLike: [],
};

export default Index;