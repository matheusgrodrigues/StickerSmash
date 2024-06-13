import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Pressable, Text, View } from "react-native";

const styles = StyleSheet.create({
   container: {
      marginHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
      padding: 3,
      height: 68,
      width: 320,
   },
   label: {
      fontSize: 16,
      color: "#fff",
   },
   button: {
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: 10,
      alignItems: "center",
      height: "100%",
      width: "100%",
      gap: 8,
   },
   circleButtonContainer: {
      width: 84,
      height: 84,
      marginHorizontal: 60,
      borderWidth: 4,
      borderColor: "#ffd33d",
      borderRadius: 42,
      padding: 3,
   },
   circleButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 42,
      backgroundColor: "#fff",
   },
   iconButton: {
      justifyContent: "center",
      alignItems: "center",
   },
   iconButtonLabel: {
      color: "#fff",
      marginTop: 12,
   },
});

interface ButtonProps {
   onPress?: () => Promise<void>;
   theme?: "circle-button" | "icon-button" | "primary";
   label?: string;
   icon?: keyof typeof MaterialIcons.glyphMap;
}

const Button: React.FC<ButtonProps> = ({ onPress, theme, label, icon }) => (
   <>
      {theme === "primary" ? (
         <View style={[styles.container, { borderRadius: 18, borderWidth: 4, borderColor: "#ffd33d" }]}>
            <Pressable onPress={onPress} style={[styles.button, { backgroundColor: "#fff" }]}>
               <FontAwesome color="#25292e" name="picture-o" size={18} />
               <Text style={[styles.label, { color: "#25292e" }]}>{label}</Text>
            </Pressable>
         </View>
      ) : theme === "circle-button" ? (
         <View style={styles.circleButtonContainer}>
            <Pressable style={styles.circleButton} onPress={onPress}>
               <MaterialIcons name="add" size={38} color="#25292e" />
            </Pressable>
         </View>
      ) : theme === "icon-button" ? (
         <Pressable style={styles.iconButton} onPress={onPress}>
            <MaterialIcons name={icon} size={24} color="#fff" />
            <Text style={styles.iconButtonLabel}>{label}</Text>
         </Pressable>
      ) : (
         <View style={styles.container}>
            <Pressable onPress={onPress} style={styles.button}>
               <Text style={styles.label}>{label}</Text>
            </Pressable>
         </View>
      )}
   </>
);

export default Button;
