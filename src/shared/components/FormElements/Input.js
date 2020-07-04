import React, { useReducer, useEffect} from 'react';

import { validate} from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOGGLE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
}

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {     
        value: props.initialValue || '',
        isValid: props.element === 'checkbox'? true: false,
        isTouched: props.initialValid || false
    });

    const {id, onInput} = props;
    const { value, isValid} = inputState;

    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput]);

    const changeHandler = event => {
        dispatch({type: 'CHANGE', val: event.target.value, validators: props.validators})
    }
    const toggleHandler = event => {
        dispatch({type: 'TOGGLE', val: event.target.checked, validators: props.validators})
    }
    
    function showPosition(position) {
        // let userPosition = {

        // }
        const changeHandler = event => {
            dispatch({type: 'CHANGE', val: position.coords.latitude, validators: props.validators})
        }
        changeHandler();
        console.log(position.coords.latitude);
        console.log(position.coords.longitude)
        
      }

    const shareLocation = event => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
            } else {
              console.log("Geolocation is not supported by this browser.");
            }
    }

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        })
    }

    const basicInput =  <input id={props.id}
                            type={props.type}
                            onChange={changeHandler}
                            onBlur={touchHandler}
                            placeholder={props.placeholder}
                            value={inputState.value}
                        />;

    let element;
        switch (props.element) {
            case 'input':
                element =  basicInput;
                break;
            case 'textarea':
                element =  (
                    <textarea   
                        onChange={changeHandler}  
                        onBlur={touchHandler} 
                        id={props.id} 
                        rows={props.rows ||3} 
                        value={inputState.value}/>
                    )
                break;
            case 'checkbox':
                element = (
                    <input id={props.id}
                    className='checkbox'
                    type='checkbox'
                    onChange={toggleHandler} 
                    onBlur={touchHandler} 
                    placeholder={props.placeholder}
                    value={inputState.checked}/>
            )
                break;
            case 'radio':
                element = (
                    <input id={props.id}
                    className='radio'
                    type='radio'
                    onChange={shareLocation} 
                    onBlur={touchHandler} 
                    placeholder={props.placeholder}
                    value={inputState.checked}/>
            )
                break;
            case 'select':
                element = (
                    <select id={props.id}
                    className='select'
                    type='select'
                    label='select'
                    onChange={changeHandler}  
                    onBlur={touchHandler} 
                    placeholder={props.placeholder}
                    value={inputState.checked}>
                        <option value="unsafe">Unsafe</option>
                        <option value="mostly safe">Usually Safe</option>
                        <option value="safe">Safe</option>
                        <option value="very safe">Very Safe</option>
                    </select>
            )
                break;
            default:
                element =  basicInput;
        }
    let divType; 
    if (element.props.className === 'radio' || element.props.className === 'checkbox' || element.props.className === 'select') {
        divType = 'inline-form';
    } else {
        divType = 'form-control';
    }

    return <div className={`${divType} ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!inputState.isValid && inputState.isTouched &&  <p>{props.errorText}</p>}
    </div>
}

export default Input; 