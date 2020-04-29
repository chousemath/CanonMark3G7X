import React, { useState } from 'react';
import {
    Image,
    Animated,
    PanResponder,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from 'react-native';
const images = {
    'video-camera': require('./images/video-camera.png'),
    camera: require('./images/camera.png'),
    'venn-diagram': require('./images/venn-diagram.png'),
};

export default function App() {
    const rotations = {
        inner: new Animated.Value(0),
        outer: new Animated.Value(0),
        compensator: new Animated.Value(0),
    };
    const color1 = new Animated.Value(0);
    const animationDefaults = { duration: 90, useNativeDriver: true };
    const rotValues = { inner: 0, outer: 0, compensator: 0 };
    const between = (x, min, max) => x >= min && x <= max;
    const animate = {
        inner: (v) => {
            rotValues.inner += v;
            Animated.timing(rotations.inner, {
                toValue: rotValues.inner,
                ...animationDefaults,
            }).start();
        },
        outer: (v) => {
            rotValues.outer += v;
            Animated.timing(rotations.outer, {
                toValue: rotValues.outer,
                ...animationDefaults,
            }).start();
        },
        compensator: (v) => {
            rotValues.compensator -= v;
            Animated.timing(rotations.compensator, {
                toValue: rotValues.compensator,
                ...animationDefaults,
            }).start();
        },
    };
    const randomChannel = () => Math.round(255 * Math.random());
    const interpolateColor = color1.interpolate({
        inputRange: [0, 360],
        outputRange: [
            `rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`,
            `rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`,
        ],
    });
    const animateColor1 = () => {
        Animated.timing(color1, {
            toValue: Math.round(Math.random() * 360),
            duration: 500,
            useNativeDriver: false,
        }).start();
    };
    let pause = false;
    const innerPan = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: async (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            // console.log('locationX:', locationX, ', locationY:', locationY);
            const { pageX, pageY } = evt.nativeEvent;
            console.log('inner circle => pageX:', pageX, ', pageY:', pageY);
        },
        onPanResponderMove: (evt, gestureState) => {
            if (pause) return;
            const { dx, dy } = gestureState;
            const changeY = Math.floor(-dy);
            const changeX = Math.floor(-dx);
            if (changeY > 60 || changeY < -60) {
                animate.inner(Math.sign(changeY) * 36);
                animateColor1();
                pause = true;
                return setTimeout(() => (pause = false), 300);
            }
            if (changeX > 90 || changeX < -90) {
                animate.inner(Math.sign(changeX) * -36);
                animateColor1();
                pause = true;
                return setTimeout(() => (pause = false), 300);
            }
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            // return true if user is swiping, return false if it's a single click
            return !(gestureState.dx === 0 && gestureState.dy === 0);
        },
    });
    const outerPan = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: async (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            // console.log('locationX:', locationX, ', locationY:', locationY);
            const { pageX, pageY } = evt.nativeEvent;
            console.log('outer circle => pageX:', pageX, ', pageY:', pageY);
        },
        onPanResponderMove: (evt, gestureState) => {
            if (pause) return;
            const { dx, dy } = gestureState;
            const changeY = Math.floor(-dy);
            const changeX = Math.floor(-dx);
            if (changeY > 60 || changeY < -60) {
                const val = Math.sign(changeY) * 15;
                animate.outer(val);
                animate.compensator(val);
                animateColor1();
                pause = true;
                return setTimeout(() => (pause = false), 300);
            }
            if (changeX > 90 || changeX < -90) {
                const val = Math.sign(changeX) * -15;
                animate.outer(val);
                animate.compensator(val);
                animateColor1();
                pause = true;
                return setTimeout(() => (pause = false), 300);
            }
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            // return true if user is swiping, return false if it's a single click
            return !(gestureState.dx === 0 && gestureState.dy === 0);
        },
    });

    const rotateTo1 = (degree) => {
        rotValues.inner = degree;
        Animated.timing(rotations.inner, {
            toValue: rotValues.inner,
            duration: 400,
            useNativeDriver: true,
        }).start();
        animateColor1();
    };
    const rotateTo2 = (degree) => {
        rotValues.outer = degree;
        Animated.timing(rotations.outer, {
            toValue: rotValues.outer,
            duration: 400,
            useNativeDriver: true,
        }).start();
        rotValues.compensator = -degree;
        Animated.timing(rotations.compensator, {
            toValue: rotValues.compensator,
            ...animationDefaults,
        }).start();
        animateColor1();
    };

    const interpolateRotation = rotations.inner.interpolate({
        // acceptable range of pan responder values
        inputRange: [-360, 360],
        // acceptable degree changes
        outputRange: ['-360deg', '360deg'],
    });
    const interpolateRotation2 = rotations.outer.interpolate({
        // acceptable range of pan responder values
        inputRange: [-360, 360],
        // acceptable degree changes
        outputRange: ['-360deg', '360deg'],
    });
    const interpolateRotation3 = rotations.compensator.interpolate({
        // acceptable range of pan responder values
        inputRange: [-360, 360],
        // acceptable degree changes
        outputRange: ['-360deg', '360deg'],
    });

    const calcDeg = (interval) => `${36 * interval}deg`;
    const calcTransform = (interval) => ({
        transform: [{ rotate: calcDeg(interval) }],
    });
    const calcDeg2 = (interval) => `${15 * interval}deg`;
    const calcTransform2 = (interval) => ({
        transform: [{ rotate: calcDeg2(interval) }],
    });

    const animatedRotation1 = { transform: [{ rotate: interpolateRotation }] };
    const animatedRotation2 = { transform: [{ rotate: interpolateRotation2 }] };
    const animatedRotation3 = { transform: [{ rotate: interpolateRotation3 }] };
    const animatedColor1 = { backgroundColor: interpolateColor };

    const outerWheelButton = (text, onPress, side) => {
        if (Boolean(text) && Boolean(onPress) && Boolean(side)) {
            return (
                <TouchableOpacity
                    onPress={onPress}
                    style={{
                        ...(side === 'left'
                            ? styles.setting1Left
                            : styles.setting1Right),
                    }}>
                    <Text
                        style={{
                            ...styles.buttonText,
                            ...(side === 'right' ? styles.rotateText : {}),
                        }}>
                        {text}
                    </Text>
                </TouchableOpacity>
            );
        }
        const sideStyle =
            side === 'left' ? styles.setting1Left : styles.setting1Right;
        return <View style={sideStyle} />;
    };
    const isNum = (val) => typeof val === 'number';
    const outerWheelOption = ({
        transformVal,
        rotateLeft,
        rotateRight,
        textLeft,
        textRight,
    }) => {
        const onPressLeft = isNum(rotateLeft)
            ? () => rotateTo2(15 * rotateLeft)
            : null;
        const onPressRight = isNum(rotateRight)
            ? () => rotateTo2(15 * rotateRight)
            : null;
        return (
            <View
                key={`outerwheel-${transformVal.toString()}`}
                {...outerPan.panHandlers}
                style={[styles.setting2, calcTransform2(transformVal)]}>
                {outerWheelButton(textLeft, onPressLeft, 'left')}
                {outerWheelButton(textRight, onPressRight, 'right')}
            </View>
        );
    };
    const innerWheelLeft = (text) => {
        if (text.indexOf('img---') > -1) {
            const imageName = text.split('---')[1];
            return <Image source={images[imageName]} style={styles.icon} />;
        }
        return <Text style={styles.buttonText}>{text}</Text>;
    };
    const innerWheelRight = (text) => {
        if (text.indexOf('img---') > -1) {
            const imageName = text.split('---')[1];
            return (
                <Image
                    source={images[imageName]}
                    style={{
                        ...styles.icon,
                        transform: [{ rotate: '180deg' }],
                    }}
                />
            );
        }
        return (
            <Text style={[styles.buttonText, styles.rotateText]}>{text}</Text>
        );
    };
    const innerWheelOption = ({
        transformVal,
        rotateLeft,
        rotateRight,
        textLeft,
        textRight,
    }) => {
        return (
            <View
                key={`inner-${transformVal}`}
                style={[styles.setting1, calcTransform(transformVal)]}>
                <TouchableOpacity
                    onPress={() => rotateTo1(36 * rotateLeft)}
                    style={styles.setting1Left}>
                    {innerWheelLeft(textLeft)}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => rotateTo1(36 * rotateRight)}
                    style={styles.setting1Right}>
                    {innerWheelRight(textRight)}
                </TouchableOpacity>
            </View>
        );
    };

    const outerWheelItems = [
        { rotateLeft: 0, rotateRight: 12, textLeft: '0', textRight: '*' },
        { rotateLeft: -1, rotateRight: null, textLeft: '-', textRight: null },
        { rotateLeft: -2, rotateRight: null, textLeft: '-', textRight: null },
        { rotateLeft: -3, rotateRight: 9, textLeft: '+1', textRight: '-3' },
        { rotateLeft: -4, rotateRight: 8, textLeft: '-', textRight: '-' },
        { rotateLeft: -5, rotateRight: 7, textLeft: '-', textRight: '-' },
        { rotateLeft: -6, rotateRight: 6, textLeft: '+2', textRight: '-2' },
        { rotateLeft: -7, rotateRight: 5, textLeft: '-', textRight: '-' },
        { rotateLeft: -8, rotateRight: 4, textLeft: '-', textRight: '-' },
        { rotateLeft: -9, rotateRight: 3, textLeft: '+3', textRight: '-1' },
        { rotateLeft: null, rotateRight: 2, textLeft: null, textRight: '-' },
        { rotateLeft: null, rotateRight: 1, textLeft: null, textRight: '-' },
    ];
    const innerWheelItems = [
        { rotateLeft: 0, rotateRight: 5, textLeft: 'Av', textRight: 'SCN' },
        {
            rotateLeft: -1,
            rotateRight: -6,
            textLeft: 'M',
            textRight: 'img---camera',
        },
        { rotateLeft: -2, rotateRight: -7, textLeft: 'C', textRight: 'AUTO' },
        {
            rotateLeft: -3,
            rotateRight: -8,
            textLeft: 'img---video-camera',
            textRight: 'P',
        },
        {
            rotateLeft: -4,
            rotateRight: -9,
            textLeft: 'img---venn-diagram',
            textRight: 'Tv',
        },
    ];
    return (
        <Animated.View style={[styles.container, animatedColor1]}>
            <Animated.View style={[styles.blackCircle2, animatedRotation2]}>
                {outerWheelItems.map((item, i) =>
                    outerWheelOption({ ...item, transformVal: i }),
                )}
                <Animated.View
                    style={[styles.blackCircle1Container, animatedRotation3]}>
                    <Animated.View
                        onLayout={({ nativeEvent }) => {
                            console.log('hi there');
                            console.log('xxx:', nativeEvent.layout.y);
                        }}
                        style={[styles.blackCircle1, animatedRotation1]}
                        {...innerPan.panHandlers}>
                        {innerWheelItems.map((item, i) =>
                            innerWheelOption({ ...item, transformVal: i }),
                        )}
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    );
}

const setting1Height = 28;
const circle1Height = 200;
const circle2Height = 300;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blackCircle2: {
        width: circle2Height,
        height: circle2Height,
        backgroundColor: '#151515',
        borderRadius: circle2Height / 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    setting2: {
        position: 'absolute',
        top: circle2Height / 2 - setting1Height / 2,
        width: circle2Height,
        height: setting1Height,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
    },
    blackCircle1: {
        width: circle1Height,
        height: circle1Height,
        backgroundColor: '#000',
        borderRadius: circle1Height / 2,
        position: 'relative',
        overflow: 'hidden',
    },
    blackCircle1Container: {
        width: circle1Height,
        height: circle1Height,
        backgroundColor: '#000',
        borderRadius: circle1Height / 2,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    setting1: {
        position: 'absolute',
        top: circle1Height / 2 - setting1Height / 2,
        width: circle1Height,
        height: setting1Height,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
    },
    setting1Left: {
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingLeft: 8,
    },
    setting1Right: {
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rotateText: {
        transform: [{ rotate: '180deg' }],
    },
    icon: {
        width: 25,
        height: 25,
    },
    autoContainer: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#fff',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 2,
        paddingBottom: 2,
    },
});
