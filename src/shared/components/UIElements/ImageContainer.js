import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './ImageContainer.css';
import Button from '../FormElements/Button';

const ModalOverlay = props => {
    
    let [index, setIndex] = useState(0)
    const [loadedImage, setLoadedImage] = useState(props.images[index]);

    const prevImage = () => {
        if (index === 0) {
            setIndex(props.images.length-1);
        } else {
            setIndex(index - 1);
        }
        setLoadedImage(props.images[index])
    };

    const nextImage = () => {
        if (index === props.images.length-1) {
            setIndex(0);
        } else {
            setIndex(index + 1)
        }
        setLoadedImage(props.images[index])
    };

    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
            </header>
            <div className='image-container'>
            <Button inverse onClick={prevImage}>Previous Image</Button>
            <h2 className='image-title'>{props.header}</h2>
            <Button float inverse onClick={nextImage}>Next Image</Button>
            </div>
            
                <img className='single-image' src={`${process.env.REACT_APP_ASSET_URL}/${loadedImage}`} alt={props.title}></img>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}


const ImageContainer = props => {
    return <React.Fragment>
        {props.show && <Backdrop onClick={props.onCancel}/>}
        <CSSTransition 
            in={props.show} 
            mountOnEnter 
            unmountOnExit 
            timeout={200}
            classNames='modal'>
            <ModalOverlay {...props}/>
        </CSSTransition>
    </React.Fragment>
};

export default ImageContainer;