import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import PropTypes from 'prop-types';

import Dimensions from 'Dimensions';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


export default function ActionButton(props) {
  const {
    children,
    color,
    onPress,
    onPressIn,
    onPressOut,
    rounded,
    style,
    textStyle
} = props;

    return (
      <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPress}
              onPressIn={onPressIn}
              style={[styles.root, {        backgroundColor: color, opacity: 0.5}]}
          >
              {children}
          </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: height * .09,
    }
});
