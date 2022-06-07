import React, {useState} from 'react'



export function Data(props) {
    
    const charityInfo = props.charityInfo;
    
    const [data1, setData1] = useState([
        {
            dataName: 'Administrative Expense (%)',
            dataVal: '23%. 14% ',
        },
        {
            dataName: 'Main areas of operation',
            dataVal: 'United States, France, Italy',
        },
        {
            dataName: 'Country of Incorporation',
            dataVal: 'United States, France, Italy',
        },
        {
            dataName: 'Tax ID Number',
            dataVal: '27-2204538',
        },
        {
            dataName: 'Year Incorporated',
            dataVal: '2005, 2016 ',
        },
        {
            dataName: 'Charity Detailed Category',
            dataVal: 'Natural Resource Conservation and Protection (C30) Land Resources Conservation (C34) Alliance/Advocacy Organizations (N01)' ,
        },
    ])
    const [data2, setData2] = useState([
        {
            dataName: 'Charity General Category',
            dataVal: 'Environment (C) Recreation & Sports (N) ',
        },
        {
            dataName: 'Organization Type',
            dataVal: '501(c)3. 501(c)4 ',
        },
        {
            dataName: 'Organization Type',
            dataVal: 'USDC DAI AVAX',
        },
        {
            dataName: 'Total Capital Pooled ',
            dataVal: '-',
        },
        {
            dataName: 'Total Interest Generated ',
            dataVal: '-',
        },
        {
            dataName: 'Your Deposits',
            dataVal: '-',
        },
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
