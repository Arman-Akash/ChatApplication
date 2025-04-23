import React, { useState } from 'react'
import { Form, Formik } from 'formik';
import * as yup from "yup";
import * as axios from './Axios/Axios';
import * as keys from './Axios/keys';
import * as storage from './Axios/storage';
import { useNavigate } from 'react-router-dom';

const style = {
    card: {
        padding: '20px',
        boxShadow: '#00000033 0px 4px 8px 0px, #00000030 0px 6px 20px 0px'
    },
    label: {
        color: '#555',
        marginBottom: '5px',
        marginTop: '10px',
        textAlign: 'left',
    },
    cardTitle: {
        color: '#555',
        fontSize: '30px',
        fontWeight: '700'
    },
    title: {
        color: '#555',
        fontSize: '20px',
        fontWeight: '700'
    },
    radio: {
        marginLeft: '20px'
    }
}

const SignIn = () => {
    const history = useNavigate();
    const [errMsg, setErrMsg] = useState('');

    const handleChange = (e, formProps) => {
        formProps.setFieldValue(e.target.name, e.target.value);
    }

    return (
        <div style={{ width: "400px", margin: "auto", paddingTop: '100px', height: '460px' }}>
            <div className='card' style={style.card}>

            <h4 className='text-center font-weight-bold'>Sign in!</h4>
            <Formik
                enableReinitialize
                initialValues={{
                    username: '',
                    password: ''
                }}
                validationSchema={
                    yup.object({
                        username: yup.string()
                            .required("Required"),
                        password: yup.string()
                            .required("Required")
                    })
                }
                onSubmit={(values) => {
                    axios.post('api/account/authenticate', values, undefined, (response) => {
                        storage.removeState(keys.LOGGED_IN_USER);
                        console.log(response)
                        storage.saveState(keys.LOGGED_IN_USER, response);
                        history('/')
                    }, (error) => {
                        if (error.response.status === 401) {
                            setErrMsg("Username or Password in invalid!");
                        }
                        else {
                            setErrMsg("Something Went wrong! Please try again letter");
                        }
                    })
                }}
            >
                {
                    formProps => (
                        <Form>
                            <div className='form-group'>
                                <label style={style.label}>User Name</label>
                                <input name="username" type="text" required className="form-control"
                                    onChange={(e) => handleChange(e, formProps)}
                                />
                                <span className='text-danger'>{formProps.errors.username}</span>
                            </div>
                            <div className='form-group'>
                                <label style={style.label}>Password</label>
                                <input name="password" type="password" required className="form-control"
                                    onChange={(e) => handleChange(e, formProps)}
                                />
                                <span className='text-danger'>{formProps.errors.password}</span>
                            </div>
                           
                            <p className='text-danger mb-3'>{errMsg}</p>
                            <input type="submit" className='btn btn-primary form-control' value="Sign In" />
                           
                            {/* <Button
                                variant="contained"
                                color="primary"
                            >
                                Forgot Password
                            </Button> */}
                            <br /><br />
                            <div className='text-center'>
                                <a href="/signup">Not an User? Register</a>
                            </div>
                        </Form>
                    )
                }
            </Formik>
            </div>
        </div>
    )
}

export default SignIn;