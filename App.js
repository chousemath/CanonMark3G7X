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
    'camera': require('./images/camera.png'),
    'venn-diagram': require('./images/venn-diagram.png'),
};

export default function App() {
    const rotation1 = new Animated.Value(0);
    const rotation2 = new Animated.Value(0);
    const rotation3 = new Animated.Value(0);
    const color1 = new Animated.Value(0);
    const animationDefaults = { duration: 90, useNativeDriver: true };
    let rotation1Value = 0;
    let rotation2Value = 0;
    let rotation3Value = 0;
    const between = (x, min, max) => x >= min && x <= max;
    const animateRotation1 = (valueAdd) => {
        rotation1Value += valueAdd;
        Animated.timing(rotation1, {
            toValue: rotation1Value,
            ...animationDefaults,
        }).start();
    };
    const animateRotation2 = (valueAdd) => {
        rotation2Value += valueAdd;
        Animated.timing(rotation2, {
            toValue: rotation2Value,
            ...animationDefaults,
        }).start();
    };
    const animateRotation3 = (valueAdd) => {
        console.log('animateRotation3', rotation3Value, valueAdd);
        rotation3Value -= valueAdd;
        Animated.timing(rotation3, {
            toValue: rotation3Value,
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
    const panResponder2 = PanResponder.create({
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
                animateRotation2(val);
                animateRotation3(val);
                animateColor1();
                pause = true;
                return setTimeout(() => (pause = false), 300);
            }
            if (changeX > 90 || changeX < -90) {
                const val = Math.sign(changeX) * -15;
                animateRotation2(val);
                animateRotation3(val);
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
    const rotateTo2 = degree => {
        rotation2Value = degree;
        Animated.timing(rotation2, {
            toValue: rotation2Value,
            duration: 400,
            useNativeDriver: true,
        }).start();
        rotation3Value = -degree;
        Animated.timing(rotation3, {
            toValue: rotation3Value,
            ...animationDefaults,
        }).start();
    };

    const interpolateRotation = rotation1.interpolate({
        // acceptable range of pan responder values
        inputRange: [-360, 360],
        // acceptable degree changes
        outputRange: ['-360deg', '360deg'],
    });
    const interpolateRotation2 = rotation2.interpolate({
        // acceptable range of pan responder values
        inputRange: [-360, 360],
        // acceptable degree changes
        outputRange: ['-360deg', '360deg'],
    });
    const interpolateRotation3 = rotation3.interpolate({
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

    return (
        <Animated.View style={[styles.container, animatedColor1]}>
            <Animated.View style={[styles.blackCircle2, animatedRotation2]}>
                <View 
                    {...panResponder2.panHandlers}
                    style={[styles.setting2, calcTransform2(0)]}>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * 0);
                            animateColor1();
                        }}
                        style={styles.setting1Left}>
                        <Text style={styles.buttonText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * 12);
                            animateColor1();
                        }}
                        style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>*</Text>
                    </TouchableOpacity>
                </View>
                <View
                    {...panResponder2.panHandlers}
                    style={[styles.setting2, calcTransform2(1)]}>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * -1);
                            animateColor1();
                        }}
                        style={styles.setting1Left}>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.setting1Right} />
                </View>
                <View
                    {...panResponder2.panHandlers}
                    style={[styles.setting2, calcTransform2(2)]}>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * -2);
                            animateColor1();
                        }}
                        style={styles.setting1Left}>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.setting1Right} />
                </View>
                <View
                    {...panResponder2.panHandlers}
                    style={[styles.setting2, calcTransform2(3)]}>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * -3);
                            animateColor1();
                        }}
                        style={styles.setting1Left}>
                        <Text style={styles.buttonText}>+1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * 9);
                            animateColor1();
                        }}
                        style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>-3</Text>
                    </TouchableOpacity>
                </View>
                <View
                    {...panResponder2.panHandlers}
                    style={[styles.setting2, calcTransform2(4)]}>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * -4);
                            animateColor1();
                        }}
                        style={styles.setting1Left}>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * 8);
                            animateColor1();
                        }}
                        style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>-</Text>
                    </TouchableOpacity>
                </View>
                <View
                    {...panResponder2.panHandlers}
                    style={[styles.setting2, calcTransform2(5)]}>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * -5);
                            animateColor1();
                        }}
                        style={styles.setting1Left}>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            rotateTo2(15 * 7);
                            animateColor1();
                        }}
                        style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>-</Text>
                    </TouchableOpacity>
            </View>
            <View {...panResponder2.panHandlers}
                style={[styles.setting2, calcTransform2(6)]}>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * -6);
                        animateColor1();
                    }}
                    style={styles.setting1Left}>
                    <Text style={styles.buttonText}>+2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * 6);
                        animateColor1();
                    }}
                    style={styles.setting1Right}>
                    <Text style={[styles.buttonText, styles.rotateText]}>-2</Text>
                </TouchableOpacity>
            </View>
            <View
                {...panResponder2.panHandlers}
                style={[styles.setting2, calcTransform2(7)]}>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * -7);
                        animateColor1();
                    }}
                    style={styles.setting1Left}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * 5);
                        animateColor1();
                    }}
                    style={styles.setting1Right}>
                    <Text style={[styles.buttonText, styles.rotateText]}>-</Text>
                </TouchableOpacity>
            </View>
            <View
                {...panResponder2.panHandlers}
                style={[styles.setting2, calcTransform2(8)]}>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * -8);
                        animateColor1();
                    }}
                    style={styles.setting1Left}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * 4);
                        animateColor1();
                    }}
                    style={styles.setting1Right}>
                    <Text style={[styles.buttonText, styles.rotateText]}>-</Text>
                </TouchableOpacity>
            </View>
            <View
                {...panResponder2.panHandlers}
                style={[styles.setting2, calcTransform2(9)]}>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * -9);
                        animateColor1();
                    }}
                    style={styles.setting1Left}>
                    <Text style={styles.buttonText}>+3</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * 3);
                        animateColor1();
                    }}
                    style={styles.setting1Right}>
                    <Text style={[styles.buttonText, styles.rotateText]}>-1</Text>
                </TouchableOpacity>
            </View>
            <View
                {...panResponder2.panHandlers}
                style={[styles.setting2, calcTransform2(10)]}>
                <View style={styles.setting1Left} />
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * 2);
                        animateColor1();
                    }}
                    style={styles.setting1Right}>
                    <Text style={[styles.buttonText, styles.rotateText]}>-</Text>
                </TouchableOpacity>
            </View>
            <View
                {...panResponder2.panHandlers}
                style={[styles.setting2, calcTransform2(11)]}>
                <View style={styles.setting1Left} />
                <TouchableOpacity
                    onPress={() => {
                        rotateTo2(15 * 1);
                        animateColor1();
                    }}
                    style={styles.setting1Right}>
                    <Text style={[styles.buttonText, styles.rotateText]}>-</Text>
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.blackCircle1Container, animatedRotation3]}>
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
                        <Image source={images['camera']} style={{
                            ...styles.icon,
                            transform: [{rotate: '180deg'}],
                        }} />
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
                        <View style={styles.autoContainer}>
                            <Text style={[styles.buttonText, styles.rotateText]}>
                                AUTO
                            </Text>
                        </View>
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
                        <Image source={images['video-camera']} style={styles.icon} />
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
                        <Image source={images['venn-diagram']} style={styles.icon} />
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
        borderRadius: circle2Height/2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    setting2: {
        position: 'absolute',
        top: circle2Height/2- setting1Height/2,
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
        borderRadius: circle1Height/2,
        position: 'relative',
        overflow: 'hidden',
    },
    blackCircle1Container: {
        width: circle1Height,
        height: circle1Height,
        backgroundColor: '#000',
        borderRadius: circle1Height/2,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    setting1: {
        position: 'absolute',
        top: circle1Height/2 - setting1Height/2,
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
