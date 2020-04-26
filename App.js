import React, {useState} from 'react';
import { Animated, PanResponder, TouchableOpacity, StyleSheet, Text, View } from 'react-native';

export default function App() {
    const rotation1 = new Animated.Value(0);
    let rotation1Value = 0;
    let responder1Timeout;
    let rotation1Paused = false;
    const between = (x, min, max) => x >= min && x <= max;
    const panResponder1 = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
            if (rotation1Paused) return;
            const {dx, dy} = gestureState;
            // console.log(`dx: ${dx}, dy: ${dy}`);
            // const change = Math.floor(Math.min(dx, dy) * -1);
            const change = Math.floor(-dy);
            console.log('change:', change);
            if (!between(change, 90, 100) && !between(change, -100, -90)) return;
            console.log('past between');
            rotation1Value += Math.sign(change) * 36;
            Animated.timing(
                rotation1,
                { toValue: rotation1Value, duration: 100, useNativeDriver: true, }
            ).start();
            rotation1Paused = true;
            setTimeout(() => rotation1Paused = false, 300);
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            // return true if user is swiping, return false if it's a single click
            return !(gestureState.dx === 0 && gestureState.dy === 0)
        },
    });

    const interpolateRotation = rotation1.interpolate({
        // acceptable range of pan responder values
        inputRange: [-360, 360], 
        // acceptable degree changes
        outputRange: ['-360deg', '360deg'], 
    });

    const animatedRotation1 = { transform: [{ rotate: interpolateRotation }] };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.blackCircle1, animatedRotation1]}
                {...panResponder1.panHandlers}>
                <View style={[styles.setting1, {transform: [{rotate: `${36 * 0}deg`}]}]}>
                    <TouchableOpacity style={styles.setting1Left}>
                        <Text style={styles.buttonText}>Av</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>SCN</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.setting1, {transform: [{rotate: `${36 * 1}deg`}]}]}>
                    <TouchableOpacity style={styles.setting1Left}>
                        <Text style={styles.buttonText}>M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>A</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.setting1, {transform: [{rotate: `${36 * 2}deg`}]}]}>
                    <TouchableOpacity style={styles.setting1Left}>
                        <Text style={styles.buttonText}>C</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>AUTO</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.setting1, {transform: [{rotate: `${36 * 3}deg`}]}]}>
                    <TouchableOpacity style={styles.setting1Left}>
                        <Text style={styles.buttonText}>CAM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>P</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.setting1, {transform: [{rotate: `${36 * 4}deg`}]}]}>
                    <TouchableOpacity style={styles.setting1Left}>
                        <Text style={styles.buttonText}>DIFF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.setting1Right}>
                        <Text style={[styles.buttonText, styles.rotateText]}>Tv</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
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
        top: 100 - setting1Height/2,
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
        transform: [
            {rotate: '180deg',}
        ],
    },
});
