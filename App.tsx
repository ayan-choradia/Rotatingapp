import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { RotationGestureHandler, RotationGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const RotatingComponent: React.FC = () => {
  const rotate = useRef(new Animated.Value(0)).current;

  const { width, height } = Dimensions.get('window');
  const centerX = width / 2;
  const centerY = height / 2;

  const [mouseCoordinates, setMouseCoordinates] = useState({ x: centerX, y: centerY });
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      setMouseCoordinates({ x: clientX, y: clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate the angle in radians based on the mouse coordinates relative to the center of the image
  const angle = Math.atan2(mouseCoordinates.y - centerY, mouseCoordinates.x - centerX);
  
  // Convert radians to degrees
  const rotationAngle = (angle * 180) / Math.PI;

  const onRotateGestureEvent = Animated.event([], {
    useNativeDriver: true,
  });

  const rotationStyle = {
    transform: [{ rotate: `${rotationAngle}deg` }],
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/background.png')} style={styles.backgroundImage} />
      <View style={styles.imageContainer}>
        <RotationGestureHandler onGestureEvent={onRotateGestureEvent}>
          <Animated.View style={[styles.rotatingImage, rotationStyle]}>
            <Image
              source={require('./assets/rotating.png')}
              style={styles.imageFit}
            />
          </Animated.View>
        </RotationGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain', // Maintain aspect ratio and fit the display
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatingImage: {
    width: '80%',
    height: '80%',
  },
  imageFit: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});

export default RotatingComponent;
