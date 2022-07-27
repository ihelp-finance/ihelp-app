import React, {useState} from 'react'

export function Videos(props) {
    
    const charityInfo = props.charityInfo;
    
    return (
        <div className='data'>
            <div style={{width:'100%'}}>
                {charityInfo['Video for Charity Card'].split('\n').map((item, index) => {
                    return (
                        <iframe height={'250px'} width={'400px'} src={`https://www.youtube.com/embed/${item.split('v=')[1]}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    )
                })}
            </div>
        </div>
    )
}
