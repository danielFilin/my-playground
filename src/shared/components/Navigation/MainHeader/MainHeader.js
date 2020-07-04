import React from 'react';

import './MainHeader.css';

const MainHedaer = props => {
    return <header className='main-header'>
        {props.children}
    </header>
}

export default MainHedaer;