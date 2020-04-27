import React, { useState } from 'react';
import {
    Animated,
    PanResponder,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function App() {
    const rotation1 = new Animated.Value(0);
    const color1 = new Animated.Value(0);
    const animationDefaults = {
        duration: 90,
        useNativeDriver: true,
    };
    let rotation1Value = 0;
    let responder1Timeout;
    const between = (x, min, max) => x >= min && x <= max;
    const animateRotation1 = (valueAdd) => {
        rotation1Value += valueAdd;
        Animated.timing(rotation1, {
            toValue: rotation1Value,
            ...animationDefaults,
        }).start();
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
    const panResponder1 = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderGrant: async (evt, gestureState) => {
            const { locationX, locationY } = evt.nativeEvent;
            console.log('locationX:', locationX, ', locationY:', locationY);
            const { pageX, pageY } = evt.nativeEvent;
            console.log('pageX:', pageX, ', pageY:', pageY);
        },
        onPanResponderMove: (evt, gestureState) => {
            if (pause) return;
            const { dx, dy } = gestureState;
            const changeY = Math.floor(-dy);
            const changeX = Math.floor(-dx);
            if (changeY > 90 || changeY < -90) {
                animateRotation1(Math.sign(changeY) * 36);
                animateColor1();
                pause = true;
                return setTimeout(() => (pause = false), 300);
            }
            if (changeX > 90 || changeX < -90) {
                animateRotation1(Math.sign(changeX) * -36);
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
        rotation1Value = degree;
        Animated.timing(rotation1, {
            toValue: rotation1Value,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const interpolateRotation = rotation1.interpolate({
        // acceptable range of pan responder values
        inputRange: [-360, 360],
        // acceptable degree changes
        outputRange: ['-360deg', '360deg'],
    });

    const calcDeg = (interval) => `${36 * interval}deg`;
    const calcTransform = (interval) => ({
        transform: [{ rotate: calcDeg(interval) }],
    });

    const animatedRotation1 = { transform: [{ rotate: interpolateRotation }] };
    const animatedColor1 = { backgroundColor: interpolateColor };

    return (
        <Animated.View style={[styles.container, animatedColor1]}>
            <Animated.View style={[styles.blackCircle2]}>
                <Animated.View
                    onLayout={({ nativeEvent }) => {
                        console.log('hi there');
                        console.log('xxx:', nativeEvent.layout.y);
                    }}
                    style={[styles.blackCircle1, animatedRotation1]}
                    {...panResponder1.panHandlers}>
                    <View style={[styles.setting1, calcTransform(0)]}>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * 0;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Left}>
                            <Text style={styles.buttonText}>Av</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * 5;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Right}>
                            <Text style={[styles.buttonText, styles.rotateText]}>
                                SCN
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.setting1, calcTransform(1)]}>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -1;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Left}>
                            <Text style={styles.buttonText}>M</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -6;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Right}>
                            <Text style={[styles.buttonText, styles.rotateText]}>
                                A
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.setting1, calcTransform(2)]}>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -2;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Left}>
                            <Text style={styles.buttonText}>C</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -7;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Right}>
                            <Text style={[styles.buttonText, styles.rotateText]}>
                                AUTO
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.setting1, calcTransform(3)]}>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -3;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Left}>
                            <Text style={styles.buttonText}>CAM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -8;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Right}>
                            <Text style={[styles.buttonText, styles.rotateText]}>
                                P
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.setting1, calcTransform(4)]}>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -4;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Left}>
                            <Text style={styles.buttonText}>DIFF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const val = 36 * -9;
                                rotateTo1(val);
                                animateColor1();
                            }}
                            style={styles.setting1Right}>
                            <Text style={[styles.buttonText, styles.rotateText]}>
                                Tv
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <View style={[styles.setting2, calcTransform(0)]}>
                    <TouchableOpacity
                        onPress={() => {
                            const val = 36 * -4;
                            // rotateTo1(val);
                            animateColor1();
                        }}
                        style={styles.setting1Left}>
                        <Text style={styles.buttonText}>+1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            const val = 36 * -9;
                            // rotateTo1(val);
                            animateColor1();
                        }}
                        style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>+2</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const setting1Height = 28;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blackCircle2: {
        width: 320,
        height: 320,
        backgroundColor: '#151515',
        borderRadius: 160,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    setting2: {
        position: 'absolute',
        top: 160 - setting1Height / 2,
        width: 320,
        height: setting1Height,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
    },
    blackCircle1: {
        width: 200,
        height: 200,
        backgroundColor: '#000',
        borderRadius: 100,
        position: 'relative',
        overflow: 'hidden',
    },
    setting1: {
        position: 'absolute',
        top: 100 - setting1Height / 2,
        width: 200,
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
        fontSize: 16,
    },
    rotateText: {
        transform: [{ rotate: '180deg' }],
    },
});
