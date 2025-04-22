import React, { useState } from 'react'
import { Form, Formik } from "formik";
import * as Yup from "yup";
import * as axios from './Axios/Axios';
import { useNavigate } from 'react-router-dom';

const style = {
    label: {
        color: '#555',
        marginBottom: '5px',
        marginTop: '10px'
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

const SignUp = () => {
    const navigate = useNavigate();
    const [attachment, setAttachment] = useState(null);

    const handleChange = (e, formProps) => {
        formProps.setFieldValue(e.target.name, e.target.value);
    }

    return (
        <div style={{ width: "60%", margin: "auto" }}>
            <h5 className='text-left'>SignUp!</h5>
            <Formik
                enableReinitialize
                initialValues={{}}
                validationSchema={
                    Yup.object({
                        name: Yup.string()
                            .required("Required"),
                        username: Yup.string()
                            .required("Required")
                            .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                "Provide a valid Email"),
                        password: Yup.string()
                            .required("Provide a password"),
                        confirmPassword: Yup
                            .string()
                            .required("Passwords don't match.")
                            .oneOf([Yup.ref('password'), null], "Passwords don't match.")
                    })
                }
                onSubmit={(values) => {
                    axios.postFormData('api/account/createUser', values, null,
                        [{ name: "photo", attachment: attachment }], (response) => {
                            if (response.data.success) {
                                navigate('/signin');
                            }
                            else {
                                alert(response.data.message);
                            }
                        })
                }}
            >
                {
                    formProps => (
                        <Form noValidate>
                            <div className='form-group'>
                                <label  style={style.label}>Full Name</label>
                                <input name="name" type="name" required className="form-control"
                                    onChange={(e) => handleChange(e, formProps)}
                                />
                                <span className='text-danger'>{formProps.errors.name}</span>
                            </div>
                            
                            <div className='form-group'>
                                <label  style={style.label}>Email</label>
                                <input name="username" type="email" required className="form-control"
                                    onChange={(e) => handleChange(e, formProps)}
                                />
                                <span className='text-danger'>{formProps.errors.username}</span>
                            </div>
                            <div className='form-group'>
                                <label  style={style.label}>Date of Birth</label>
                                <input name="dob" type="date" required className="form-control"
                                    onChange={(e) => handleChange(e, formProps)}
                                />
                                <span className='text-danger'>{formProps.errors.dob}</span>
                            </div>
                            <div className='form-group'>
                                <label  style={style.label}>Photo</label>
                                <input name="photo" type="file" required className="form-control"
                                    onChange={(e) => {
                                        setAttachment(e.target.files[0]);
                                    }}
                                />
                            </div>
                            {/* <TextField
                                name="photo"
                                label="Photo"
                                // variant="outlined"
                                margin="normal"
                                fullWidth
                                type="file"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={(e) => {
                                    setAttachment(e.target.files[0]);
                                }}
                            /> */}
                            <div className='form-group'>
                                <label  style={style.label}>Password</label>
                                <input name="password" type="password" required className="form-control"
                                    onChange={(e) => handleChange(e, formProps)}
                                />
                                <span className='text-danger'>{formProps.errors.password}</span>
                            </div>
                            <div className='form-group'>
                                <label  style={style.label}>Confirm Password</label>
                                <input name="confirmPassword" type="password" required className="form-control"
                                    onChange={(e) => handleChange(e, formProps)}
                                />
                                <span className='text-danger'>{formProps.errors.confirmPassword}</span>
                            </div>
                            <input type="submit" className='btn btn-primary mt-3' value="Sign Up" />
                        </Form>
                    )
                }
            </Formik>

            <p>Already have an Account?</p>
            <a href="/signin">Sign In</a>
            {/* <Grid
                container
                justifyContent="flex-end"
            >
                <Grid item>
                    <Button
                        variant="contained"
                        className="br-20"
                        color="primary"
                    >
                        Sign In
                    </Button>
                </Grid>
            </Grid> */}
        </div>
    )
}

export default SignUp;