import React, {useState} from 'react'



export function Details(props) {
    
    const charityInfo = props.charityInfo;
    
    const [data1, setData1] = useState([
        {
            dataName: 'Charity General Category',
            dataVal: charityInfo['Charity GENERAL Category (One Cell)'].replace(/\n/,', '),
        }, 
        {
            dataName: 'Charity Detailed Category',
            dataVal: charityInfo['Charity Detailed Category (One Cell)'].replace(/\n/,', '),
        },
        {
            dataName: 'Year Incorporated',
            dataVal: charityInfo['Year Incorporated'],
        },
        
    ])
    const [data2, setData2] = useState([
        {
            dataName: 'Country of Incorporation',
            dataVal: charityInfo['Country of Incorporation'],
        },
        {
            dataName: 'Active In',
            dataVal: charityInfo['Main Areas of Operation']
        },
        {
            dataName: 'Tax ID Number',
            dataVal: charityInfo['Tax ID Number']
        },
        {
            dataName: 'Organization Type',
            dataVal: charityInfo['Organization Type']
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
