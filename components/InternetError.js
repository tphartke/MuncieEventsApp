import React from 'react';
import {View, Text} from 'react-native';
import CustomButton from '../pages/CustomButton';
import Styles from "../pages/Styles"
import PropTypes from 'prop-types';

export default class InternetError extends React.Component{
    render(){
        const { onRefresh } = this.props;
        return(
            <View style={{flexDirection:"column", alignItems:'center'}}>
                <Text style={{textAlign:"center", paddingBottom: 5}}>
                    Failed to connect to Muncie Events. Please make sure your phone is connected to the internet and try again.
                </Text>
                    <CustomButton
                        text="Reload"
                        onPress = {() => onRefresh()}
                        buttonStyle = {Styles.mediumButtonStyle}
                        textStyle = {Styles.mediumButtonTextStyle}
                    />
            </View>
        );
    }
}

InternetError.propTypes = {
    onRefresh: PropTypes.func.isRequired,
};