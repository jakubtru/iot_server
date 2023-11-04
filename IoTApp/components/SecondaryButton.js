import { Text, Pressable, StyleSheet } from 'react-native';


export function SecondaryButton({ text, onPress }) {
    return (
        <Pressable style={styles.btn} onPress={onPress}>
            <Text style={styles.btnTitle} >{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FCA311',
    },
    btnTitle: {
        color: '#14213D',
        fontSize: 16,
    },
});