import React, { useState, useContext }  from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './Auth.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true)
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
          value: '',
          isValid: false
        },
        password: {
          value: '',
          isValid: false
        }
      }, 
      false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            },  
            formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, 
            false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    }

    const authSumbitHandler = async event => {
    event.preventDefault();
    if (isLoginMode) {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`,'POST', JSON.stringify({
                email: formState.inputs.email.value, 
                password: formState.inputs.password.value
            }), {
            'Content-Type': 'application/json' 
            });
            auth.login(responseData.userId, responseData.token);
        } catch (err) {

        }
    } else {
        try {
            const formData = new FormData();
            formData.append('email', formState.inputs.email.value);
            formData.append('name', formState.inputs.name.value);
            formData.append('password', formState.inputs.password.value);
            formData.append('image', formState.inputs.image.value);
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, 'POST', formData);
            auth.login(responseData.userId, responseData.token);
        } catch (err) {
            }
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Card className='authentication'>
            {isLoading && <LoadingSpinner asOverlay />}
            <h2>{isLoginMode? 'LOGIN': 'SIGNUP'}</h2>
            <form className='place-form' onSubmit={authSumbitHandler}>
                {!isLoginMode && 
                <Input 
                    element='input' 
                    id='name' 
                    type='text' 
                    label='your name' 
                    validators={[VALIDATOR_REQUIRE()]}
                    erroText='Please enter a name'
                    onInput={inputHandler}/>}
                {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText='Please provide an image'/>}
                <Input
                    id='email' 
                    element='input' 
                    type='email' 
                    label='EMAIL' 
                    validators={[VALIDATOR_EMAIL()]}
                    onInput={inputHandler} 
                    errorText='Please enter a valid email'/>
                <Input
                    id='password' 
                    element='input'
                    type='password' 
                    label='PASSWORD' 
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    onInput={inputHandler} 
                    errorText='Please enter a valid password (min 5 charachters long)'/>
                <Button type='submit' disabled={!formState.isValid}>
                    {isLoginMode? 'LOGIN': 'SIGNUP'}
                </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode? 'SIGNUP': 'LOGIN'}</Button>
        </Card>
        </React.Fragment>
    );
}

export default Auth;