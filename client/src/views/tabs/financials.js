import React, {useState} from 'react'

export function Financials(props) {
    
    const charityInfo = props.charityInfo;
    
    const [data1, setData1] = useState([
        {
            dataName: 'Total Revenue',
            dataVal: charityInfo['Total Revenue']
        }, 
        {
            dataName: 'Total Expenses',
            dataVal: charityInfo['Total Expenses']
        },
        {
            dataName: 'Net Income',
            dataVal: charityInfo['Net Income'],
        },
        {
            dataName: 'Financial Data Year',
            dataVal: charityInfo['Financial Data Year'],
        }
    ])
    const [data2, setData2] = useState([
        {
            dataName: 'Program Expenses',
            dataVal: charityInfo['Program Expense']
        }, 
        {
            dataName: 'Program Expenses / Revenue',
            dataVal: charityInfo['Program Expense / Revenue']
        },
        {
            dataName: 'Administrative Expenses',
            dataVal: charityInfo['Administrative Expense'],
        }
    ])
    
    return (
        <div className='data'>
            <div className='dataBanner'>
                {data1.map((item, index) => {
                    return (
                        <div className='dataItem' key={index}>
                            <h4>{item.dataName}</h4>
                            <p>{item.dataVal}</p>
                        </div>
                    )
                })}
            </div>
            <div className='dataBanner'>
                {data2.map((item, index) => {
                    return (
                        <div className='dataItem' key={index}>
                            <h4>{item.dataName}</h4>
                            <p>{item.dataVal}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
