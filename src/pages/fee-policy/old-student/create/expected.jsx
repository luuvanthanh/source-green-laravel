import { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';

import { variables, Helper } from '@/utils';
import ScrollContainer from 'react-indiana-drag-scroll';
import stylesModule from '../styles.module.scss';


const Index = memo(({ yearsSchool, idYear, idRes, YearsDetail }) => {
    const dispatch = useDispatch();
    const { fees } = useSelector(({ fees }) => ({
        fees: fees.data,
    }));

    const dataYear = yearsSchool?.filter((p) => (idYear === p.id ? (p) : ""));
    const data = YearsDetail?.length > 0 && !dataYear?.length > 0 ?
        YearsDetail?.map((p) =>
        (
            {
                date: p?.month,
                fees: fees.map(id => ({
                    money: idRes?.map((a) => {
                        for (let i = 0; i <= a?.detailData?.length; i++) {
                            if (a.feeId === id?.id && a?.detailData[i]?.month === p?.month) {
                                return a?.detailData[i]?.fee[0]?.money || 0;
                            }
                        }
                        for (let i = 0; i <= p?.fee?.length; i++) {
                            if (a.feeId === id?.id) {
                                return p?.fee[i]?.money || 0;
                            }
                        }

                        return 0;
                    })
                })),
            }))
        :
        dataYear[0]?.changeParameter?.changeParameterDetail?.map((p) =>
        (
            {
                date: p?.date,
                fees: fees.map(id => ({
                    money: idRes?.map((a) => {
                        for (let i = 0; i <= a?.detailData?.length; i++) {
                            if (a.feeId === id.id && a?.detailData[i]?.month === p?.date?.slice(0, 7)) {
                                return a?.detailData[i]?.fee[0]?.money || 0;
                            }
                        }
                        return 0;
                    })
                })),
            }));

    useEffect(() => {
        dispatch({
            type: 'fees/GET_DATA',
            payload: {
                page: variables.PAGINATION.PAGE,
                limit: variables.PAGINATION.SIZEMAX,
            },
        });
        dispatch({
            type: 'paymentMethod/GET_DATA',
            payload: {
                page: variables.PAGINATION.PAGE,
                limit: variables.PAGINATION.SIZEMAX,
            },
        });
    }, []);

    const total = (index) => {
        var table = document.getElementById("table"), sumVal = 0;
        for (let i = 1; i < fees?.length; i++) {
            const a = table?.rows[index]?.cells[i]?.innerHTML;
            const b = a?.replace(/,/g, "");
            sumVal = sumVal + parseFloat(b);
        }
        return sumVal?.toLocaleString();
    };


    const row = (index) => {
        var table = document.getElementById("table"), sumVal = 0;
        for (let i = 1; i < data?.length + 1; i++) {
            const a = table?.rows[i]?.cells[index]?.innerHTML;
            const b = a?.replace(/,/g, "");
            sumVal = sumVal + parseFloat(b);
        }
        return sumVal?.toLocaleString();
    };


    return (
        <>
            <ScrollContainer hideScrollbars={false}>
                <table className={stylesModule['table-container']} id="table" >
                    <thead>
                        <tr>
                            <th scope="col" className={stylesModule['table-top']}>Tháng</th>
                            {fees.map(i => <th scope="col" className={stylesModule['table-top']}>{i.name}</th>)}
                            <th scope="col" className={stylesModule['table-top']} >Ngoài giờ(đ) </th>
                            <th scope="col" className={stylesModule['table-top']}>Giảm trừ(đ)</th>
                            <th scope="col" className={stylesModule['table-top']} style={{ background: '#eef0f4' }}>Tổng tiền(đ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((i, index) =>
                            <tr>
                                <td className={stylesModule['table-content']}>{Helper.getDate(i?.date, variables.DATE_FORMAT.DATE_MONTH)}</td>
                                {i?.fees?.map(item => <td className={stylesModule['table-content']}> {(item?.money?.filter((str) => { return str != '0' })).length > 0
                                    ? Helper?.getPrice(item?.money?.filter((str) => { return str != '0' }), 0, true) : '0'}</td>)}
                                <td className={stylesModule['table-content']}>-</td>
                                <td className={stylesModule['table-content']}>-</td>
                                <td className={stylesModule['table-content']}> {total(index + 1)}</td>
                            </tr>
                        )}
                        <tr>
                            <td className={stylesModule['table-footer']} />
                            {fees?.map((i, index) =>
                                <td className={stylesModule['table-footer']}>{row(index + 1)}</td>
                            )}
                            <td className={stylesModule['table-footer']} />
                            <td className={stylesModule['table-footer']} />
                            <td className={stylesModule['table-footer']} style={{ background: '#fff1eb' }} >{total(data?.length + 1)}</td>
                        </tr>
                    </tbody>
                </table>
            </ScrollContainer>
        </>
    );
});

Index.propTypes = {
    yearsSchool: PropTypes.arrayOf(PropTypes.any),
    idRes: PropTypes.arrayOf(PropTypes.any),
    YearsDetail: PropTypes.arrayOf(PropTypes.any),
    idYear: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
    yearsSchool: [],
    idRes: [],
    YearsDetail: [],
    idYear: {},
};

export default Index;