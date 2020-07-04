import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm} from '../../shared/hooks/form-hook';
import { useHttpClient} from '../../shared/hooks/http-hook';
import './PlaceForm.css'; 
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext} from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const UpdatePlace = (props) => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();

    const placeId = useParams().placeId;
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
     }, false);

     // the logi that solves no identified places is redundant here, something is probably wrong with the routing, I am being redirected as if I had no places at all,
     useEffect(() => {
         const fetchPlace = async () => {
             try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({ title: {
                    value: responseData.place.title,
                    isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }}, true
                    );
             } catch (err) {
                 console.log(err)
             }
         };
         fetchPlace();
     }, [sendRequest, placeId, setFormData]);
     
     
    if(isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner/>
            </div>
        );
    }
 
    if(!loadedPlace && !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        )
    }


    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('image', formState.inputs.image.value);

            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH',formData,
            {
                Authorization: 'Bearer ' + auth.token
            });
            history.push('/'+ auth.userId + '/places')
        } catch (err) { }

    }
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
                <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid title'
                    onInput={inputHandler}
                    initialValue={loadedPlace.title}
                    InitialValid={true} />
                <Input id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid description (min 5 charachters).'
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    InitialValid={true} />
                <ImageUpload InitialValid={true} center id="image" onInput={inputHandler} errorText='Please provide an image'/>
                <Button type='submit' disabled={formState.isValid}>UPDATE PLACE</Button>
            </form> 
            )} 
        </React.Fragment>
    ) 
}

export default UpdatePlace;