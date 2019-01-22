import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class CustomButton extends React.Component {
    render(){
        const { text, onPress, buttonStyle, textStyle} = this.props;
        const modifiedButtonStyle = StyleSheet.flatten([styles.defaultButtonStyle, buttonStyle]);
        const modifiedTextStyle = StyleSheet.flatten([styles.defaultTextStyle, textStyle]);
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

const styles = StyleSheet.create({
    defaultTextStyle: {
        fontSize:13,
        color: '#efe0d5',
        textAlign: 'center'
    },

    defaultButtonStyle: {
        height:30,
        width:40,
        backgroundColor: '#cb532b',
        borderRadius:5,
        justifyContent: 'center', 
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black'
    }
});
