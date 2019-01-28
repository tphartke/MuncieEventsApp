import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import styles from "./Styles"

export default class CustomButton extends React.Component {
    render(){
        const { text, onPress, buttonStyle, textStyle} = this.props;
        const modifiedButtonStyle = StyleSheet.flatten([styles.defaultButtonStyle, buttonStyle]);
        const modifiedTextStyle = StyleSheet.flatten([styles.defaultButtonTextStyle, textStyle]);
        return (
            <TouchableOpacity style={modifiedButtonStyle}
                onPress={() => onPress()}
            >
                <Text style={modifiedTextStyle}>{text}</Text>
            </TouchableOpacity>
        );
    }
}

CustomButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,

};