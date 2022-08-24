import React, {useState} from 'react'
// import {kse, location, twitterPurple, web, youtubePurple} from "assets/images";

import kse from '../../assets/images/other/kse.png';
import location from '../../assets/images/icon/location.png';
import twitterPurple from '../../assets/images/icon/twitterPurple.png';
import web from '../../assets/images/icon/web.png';
import youtubePurple from '../../assets/images/icon/youtubePurple.png';

const PlaceholderLogo = () => (
<svg width="8rem" height="8rem" viewBox="0 0 66 58" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M60.5028 6.52588L34.332 34.9145L35.049 47.9139L65.3139 20.9819C65.3139 20.755 65.3426 20.5244 65.3498 20.2938C65.5469 15.2361 63.8086 10.2985 60.5028 6.52588Z" fill="#8E40DA"/>
<path d="M8.09663 3.57959C7.21158 4.22008 6.38053 4.935 5.6122 5.71688C5.17841 6.16337 4.76613 6.62816 4.37895 7.10393C2.54421 9.369 1.23635 12.0292 0.553711 14.8845L30.3848 40.6345L31.2309 27.7595L8.09663 3.57959Z" fill="#8830EF"/>
<path d="M60.4986 6.52573C60.262 6.25125 60.0146 5.9841 59.7565 5.7206C59.4984 5.45709 59.2402 5.21188 58.9749 4.96668C55.328 1.64183 50.573 -0.132469 45.6853 0.00771667C40.7977 0.147903 36.1478 2.19195 32.6895 5.7206L34.0733 30.3507L60.4986 6.52573Z" fill="#B559F7"/>
<path d="M10.0792 2.32444C9.39451 2.70227 8.73249 3.12145 8.09668 3.57974L31.4747 24.034L32.6793 5.73533C29.7713 2.76323 26.0028 0.82652 21.9321 0.212159C17.8615 -0.402202 13.7052 0.338472 10.0792 2.32444Z" fill="#AC6EF4"/>
<path d="M35.2988 52.3418L35.6143 57.9998L59.7559 33.3551C62.9878 30.0662 64.9569 25.7031 65.3056 21.0583C65.3038 21.0352 65.3038 21.0119 65.3056 20.9888L35.2988 52.3418Z" fill="#5C1AA8"/>
<path d="M0.549778 14.8882L0.506754 15.0858C-0.238276 18.3225 -0.160683 21.6998 0.732159 24.8972C1.625 28.0946 3.30347 31.0061 5.60826 33.3553L29.2695 57.5096L30.0941 45.0006L0.549778 14.8882Z" fill="#560AC1"/>
</svg>
)

export function General(props) {
    
    const charityInfo = props.charityInfo;
    
    return (

        <div className='generalInformationItem'>
            <div className='infoBody'>
            
                <div className='infoLogo'>{charityInfo['Logo'] != '' ? (<img src={charityInfo['Logo']} alt=""/>) : <PlaceholderLogo />}</div>
                
                <div>
                    <h2>{charityInfo['Organization Name']}</h2>
                    <p>
                        {charityInfo['Brief Description & History']}
                    </p>
                    <div className='psInfo'>
                        <div>
                        <a href={`https://google.com/maps/search/${charityInfo['Headquarter Street Address']}, ${charityInfo['Headquarter City']}, ${charityInfo['Headquarter State/Province']} ${charityInfo['Headquarter Zip/Postal Code']} ${charityInfo['Headquarter Country']}`} target="_blank">
                            <img src={location} style={{display:'inline-block'}} alt="" title=''/>
                            {`${charityInfo['Headquarter Street Address']}, ${charityInfo['Headquarter City']}, ${charityInfo['Headquarter State/Province']} ${charityInfo['Headquarter Zip/Postal Code']} ${charityInfo['Headquarter Country']}`}
                        </a>
                        </div>
                        <div>
                        <a href={`https://${charityInfo['Organization Website'].replace('http://','').replace('https://','')}`} target="_blank">
                            <img src={web} style={{display:'inline-block'}} alt="" title=''/>
                            {`${charityInfo['Organization Website'].replace('http://','').replace('https://','')}`}</a>
                        </div>
                        <div>
                        
                        {charityInfo['Organization Twitter'] != '' ? <a href={charityInfo['Organization Twitter']} target="_blank"> <img src={twitterPurple} alt="" title=''/></a> : ''}
                        {charityInfo['Organization Youtube'] != '' ? <a href={charityInfo['Organization Youtube']} target="_blank"><img src={youtubePurple} alt="" title=''/></a> : ''}
                           
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
