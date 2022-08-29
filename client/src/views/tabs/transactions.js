import React, {useState} from 'react'
import commafy from 'commafy';
import { Table,Tooltip } from 'antd';
import { Address } from "../../components";
import { utils } from "ethers";
import moment from 'moment'

export function Transactions(props) {
    
    const charityInfo = props.charityInfo;
    const eventsByCharity = props.eventsByCharity;
    const charityDecimals = props.charityDecimals;
    const st = props.st;
    
    const transactionsColumns = [
        // {
        //   title: 'Logo',
        //   dataIndex: 'logo',
        //   key: 'logo',
        //   //sorter: (a, b) => a.age - b.age,
        //   //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
        //   render: url => <img style={{textAlign:'center'}} height={24} src={url}/>,
        //   // width: '5%',
        // }
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            //defaultSortOrder: 'descend',
            //sorter: (a, b) => a.age - b.age,
            //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
            render: t => (`${moment(t).format('DD-MMM-YYYY hh:mm:ss a')}`),
            //sorter: (a, b) => a['name'].localeCompare(b['name']),
            //sortDirections: ['ascend', 'descend'],
             width: '15%',
          },
        {
            title: 'Type',
            dataIndex: 'name',
            key: 'name',
            filters: [
                { text: 'Deposited', value: 'Deposited' },
                { text: 'Withdrawn', value: 'Withdrawn' },
                { text: 'DirectDonation', value: 'DirectDonation' },
              ],
               width: '5%',
              onFilter: (value, c) => c['name'].indexOf(value) > -1,
            //defaultSortOrder: 'descend',
            //sorter: (a, b) => a.age - b.age,
            //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
            //render: t => (<Address address={t} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />),
            //sorter: (a, b) => a['name'].localeCompare(b['name']),
            //sortDirections: ['ascend', 'descend'],
          },
          {
            title: 'Nickname',
            dataIndex: 'nickname',
            key: 'nickname',
            //defaultSortOrder: 'descend',
            //sorter: (a, b) => a.age - b.age,
            //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
            //render: t => (<Address address={t} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />),
            //sorter: (a, b) => a['address'].localeCompare(b['sender']),
            //sortDirections: ['ascend', 'descend'],
             width: '10%',
          },
        {
          title: 'Address',
          dataIndex: 'sender',
          key: 'sender',
          //defaultSortOrder: 'descend',
          //sorter: (a, b) => a.age - b.age,
          //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
          render: t => (<Address address={t} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />),
         // sorter: (a, b) => a['address'].localeCompare(b['sender']),
          //sortDirections: ['ascend', 'descend'],
           width: '8%',
        },
        // {
        //   title: 'Nickname',
        //   dataIndex: 'name',
        //   key: 'name',
        //   //defaultSortOrder: 'descend',
        //   //sorter: (a, b) => a.age - b.age,
        //   //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
        //   //render: text => <a>{text}</a>,
        //   sorter: (a, b) => a['name'].localeCompare(b['name']),
        //   sortDirections: ['ascend', 'descend'],
        //   //  width: '15%',
        // },
        {
          title: 'Currency',
          dataIndex: 'currency',
          key: 'currency',
          //sorter: (a, b) => a.age - b.age,
          //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
          filters: [
            { text: 'DAI', value: 'DAI' },
            { text: 'USDC', value: 'USDC' },
            { text: 'USDT', value: 'USDT' },
            { text: 'WAVAX', value: 'WAVAX' },
            { text: 'WETH', value: 'WETH' },
          ],
           width: '5%',
          onFilter: (value, c) => c['currency'].indexOf(value) > -1,
          render: (c) => {
              return (<Tooltip title={c}>
                <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'10px',display:'inline'}}/>
            </Tooltip>);
            }
        },
        {
            title: 'Amount (USD)',
            dataIndex: "amountUSD",
            key: 'amountUSD',
            render: c => `${charityDecimals ? '$'+commafy(c.toFixed(2)) : ''}`,
            sorter: (a, b) => a['amountUSD'] - b['amountUSD'],
            sortDirections: ['ascend', 'descend'],
            width: '8%',
          },
        {
            title: 'Memo',
            dataIndex: 'memo',
            key: 'memo',
            //defaultSortOrder: 'descend',
            //sorter: (a, b) => a.age - b.age,
            //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
            //render: t => (`${moment(t['createdAt']).locale('en-US').format('DD-MMM-YYYY hh:mm a')} UTC`),
            //sorter: (a, b) => a['name'].localeCompare(b['name']),
            //sortDirections: ['ascend', 'descend'],
             width: '20%',
          },
        // {
        //   title: 'Direct Donations',
        //   dataIndex: "directdonations",
        //   key: 'directdonations',
        //   render: c => `${charityDecimals ? '$'+commafy(parseFloat(utils.formatUnits(c,charityDecimals['DAI'])).toFixed(2) ) : ''}`,
        //   sorter: (a, b) => a['contributed'] - b['contributed'],
        //   sortDirections: ['ascend', 'descend'],
        //   // width: '10%',
        // },
        // {
        //   title: 'Details',
        //   dataIndex: 'address',
        //   key: 'id',
        //   render: (c) => {
        //     return (<Tooltip title={`Go to Charity ${c}`}>
        //     <div>
        //       <button className="grd-btn" onClick={(e)=>{history.push('/charity/'+c)}}>Adjust</button>
        //     </div>
        //     </Tooltip>)
        //   },
    
        //   //width: '10%',
        // },
        /* {
           title: 'Pool Size',
           dataIndex: ["Stats", "Total","interest"],
           key: 'poolsize',
           render: c => `$${commafy(c.toFixed(0))}`,
           sorter: (a, b) => a['Stats']['Total']['interest'] - b['Stats']['Total']['interest'],
           sortDirections: ['ascend','descend'],
           width: '10%',
         },
         {
           title: 'Contributed',
           dataIndex: ["Stats", "Total","contribution"],
           key: 'contributed',
           render: c => `$${commafy(c.toFixed(0))}`,
           sorter: (a, b) => a['Stats']['Total']['contribution'] - b['Stats']['Total']['contribution'],
           sortDirections: ['ascend','descend'],
           width: '10%',
         }*/
      ];

    return (
        <div className='data'>
            <div style={{width:'100%'}}>

            <div className={st.transactionTable + " " + "table"} style={{marginTop:'-20px'}}>
          
                <Table className={st.tableContribute + " " + "table"} loading={eventsByCharity == null ? true : false} columns={transactionsColumns} dataSource={eventsByCharity} pagination={{ defaultPageSize: 6,showSizeChanger:true,pageSizeOptions:[6,10,20,50] }} /> 
                
              </div>

            </div>
        </div>
    )
}
