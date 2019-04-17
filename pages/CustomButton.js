import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Styles from "./Styles"

export default class CustomButton extends React.Component {
    render(){
        const { text, onPress, buttonStyle, textStyle } = this.props;
        const modifiedButtonStyle = StyleSheet.flatten([Styles.defaultButtonStyle, buttonStyle]);
        const modifiedTextStyle = StyleSheet.flatten([Styles.defaultButtonTextStyle, textStyle]);
        return (
            <View>
            <View style={Styles.buttonBuffer} />
            <TouchableOpacity style={modifiedButtonStyle}
                onPress={() => onPress()}
            >
                <Text style={modifiedTextStyle}>{text}</Text>
            </TouchableOpacity>
            </View>
        );
    }
}

CustomButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};