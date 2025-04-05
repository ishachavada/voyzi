import React from 'react';
import { Text } from 'react-native';

const AppText = ({ children, style, weight = 'regular', italic = false, ...props }) => {
  const getFont = () => {
    if (italic && weight === 'bold') return 'Poppins_700Bold_Italic';
    if (italic) return 'Poppins_400Regular_Italic';
    if (weight === 'bold') return 'Poppins_700Bold';
    return 'Poppins_400Regular';
  };

  return (
    <Text style={[{ fontFamily: getFont() }, style]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;
