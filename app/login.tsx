import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors, ColorPrimary } from '@/constants/Colors';
import { Context } from './_layout';
import { router } from 'expo-router';
import { saveItem } from '@/utils/localStorage';
import { LocalStorageKey } from '@/constants/LocalStorageKey';
import { login, register } from '@/api/api';

interface LoginValues {
    email: string;
    password: string;
    confirm_password?: string;
    name?: string;
}

const LoginScreen: React.FC = () => {
    const { state, setState } = useContext(Context);
    console.log("🚀 ~ state:", state)
    const [isRegister, setIsRegister] = useState(false);
    const title = isRegister ? 'Registration' : 'Login';

    // Yup validation schema
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .matches(/[a-zA-Z]/, 'Password must contain both letters and numbers')
            .required('Password is required'),
        ...(isRegister && {
            name: Yup.string()
                .required('Name is required'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
    });

    const handleLogin = async (values: LoginValues) => {
        // setState({ ...state, isLogin: true });
        let payload = { name: values?.name ?? "Login", email: values?.email, password: values.password }
        // saveItem(LocalStorageKey.user,payload)
        if (isRegister) {
            const response = await register(payload)
            console.log("🚀 ~ handleLogin ~ payload:", payload)
            if (response?.code === 200) {
                console.log("🚀 ~ handleLogin ~ response:", response.data)
                Alert.alert('Registration Successful', `Email: ${values.email}`);
                router.push('profile')
                setState({ ...state, isLogin: true });
                saveItem(LocalStorageKey.user, response.data)
            } else {
                console.log("🚀 ~ handleLogin ~ response?.data?.message:", response)
                Alert.alert('Register', response?.data?.message);
            }
        } else {
            const req = { email: values.email, password: values.password };
            const response = await login(req)
            if (response?.code === 200) {
                console.log("🚀 ~ handleLogin ~ response:", response)
                Alert.alert('Login Successful', `Email: ${values.email}`);
                router.push('(tabs)');
                setState({ ...state, isLogin: true });
                saveItem(LocalStorageKey.user, response.data[0])
            } else {
                console.log(response)
                Alert.alert('Login', response?.data?.message);
            }

        }

    };

    const handleToggleMode = async (resetForm: () => void) => {
        setIsRegister(!isRegister);
        resetForm();
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Formik
                initialValues={{ email: '', password: '', confirm_password: '', name: '' }}
                validationSchema={loginSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, resetForm }) => (
                    <>
                        {isRegister && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.name && errors.name ? styles.errorInput : null,
                                    ]}
                                    placeholder="Name"
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                    placeholderTextColor="#7f8c8d"
                                />
                                {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
                            </View>
                        )}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    touched.email && errors.email ? styles.errorInput : null,
                                ]}
                                placeholder="Email"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                                placeholderTextColor="#7f8c8d"
                            />
                            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    touched.password && errors.password ? styles.errorInput : null,
                                ]}
                                placeholder="Password"
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry
                                placeholderTextColor="#7f8c8d"
                            />
                            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                        </View>

                        {isRegister && (
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.confirm_password && errors.confirm_password ? styles.errorInput : null,
                                    ]}
                                    placeholder="Confirm Password"
                                    onChangeText={handleChange('confirm_password')}
                                    onBlur={handleBlur('confirm_password')}
                                    value={values.confirm_password}
                                    secureTextEntry
                                    placeholderTextColor="#7f8c8d"
                                />
                                {touched.confirm_password && errors.confirm_password && (
                                    <Text style={styles.error}>{errors.confirm_password}</Text>
                                )}
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                {
                                    backgroundColor: isValid ? Colors.primary : Colors.colorSecondaryText,
                                    opacity: isValid ? 1 : 0.6
                                }
                            ]}
                            disabled={!isValid}
                            onPress={isValid ? handleSubmit as any : () => { }}
                        >
                            <Text style={styles.buttonText}>{title}</Text>
                        </TouchableOpacity>
                        <View style={styles.toggleContainer}>
                            {isRegister ? (
                                <Text>
                                    Already have an account?{' '}
                                    <Text style={styles.link} onPress={() => handleToggleMode(resetForm)}>
                                        Login now!
                                    </Text>
                                </Text>
                            ) : (
                                <Text>
                                    Don't have an account?{' '}
                                    <Text style={styles.link} onPress={() => handleToggleMode(resetForm)}>
                                        Sign up now!
                                    </Text>
                                </Text>
                            )}
                        </View>
                    </>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: Colors.colorText,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: Colors.colorSecondaryText,
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginVertical: 5,
        height: 65
    },
    input: {
        height: 50,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 16,
        backgroundColor: '#fff',
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2, // Shadow for Android
    },
    errorInput: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontSize: 12,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    toggleContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    link: {
        color: Colors.primary,
        fontWeight: '600',
    },
});

export default LoginScreen;
