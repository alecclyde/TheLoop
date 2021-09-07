import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { signIn } from '../shared/firebaseMethods';
import { globalStyles } from '../styles/global';
import * as yup from 'yup';
import { Formik } from 'formik';

const LoginSchema = yup.object({
    email: yup
        .string()
        .email()
        .required("Please enter your email"),
    password: yup
        .string()
        .required("Please enter your password"),
})


export default function Login({ navigation }) {
    return(
        <SafeAreaView style={globalStyles.container}>
            <View>
                <FormIk
                    initialValues={{email: '', password: ''}}
                    validationSchema={LoginSchema}
                    onSubmit={(values) => {signIn(values.email, values.password, navigation);}}
                
                >
                {/* {(props) => (

                )} */}

                </FormIk>



            </View>
        </SafeAreaView>
    );
}