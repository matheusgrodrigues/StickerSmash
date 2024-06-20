import { forwardRef } from "react";
import { PressableProps, StyleSheet, Pressable, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const styles = StyleSheet.create({
   button: {
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: 10,
      alignItems: "center",
      padding: 3,
      height: 68,
      width: 320,
      gap: 8,
   },
   label: {
      fontSize: 16,
      color: "#fff",
   },
});

interface ButtonProps extends Omit<PressableProps, "style"> {
   theme?: "circle-button" | "icon-button" | "primary" | "default";
   label?: string;
   icon?: keyof typeof MaterialIcons.glyphMap;
}

const Button: React.ForwardRefRenderFunction<object, ButtonProps> = (
   { theme = "default", label, icon, ...props },
   ref
) => (
   <>
      {theme === "circle-button" && (
         <Pressable
            {...props}
            style={{
               backgroundColor: "#fff",
               justifyContent: "center",
               borderRadius: 42,
               borderWidth: 4,
               borderColor: "#ffd33d",
               alignItems: "center",
               padding: 3,
               height: 84,
               width: 84,
            }}
         >
            <MaterialIcons color="#25292e" name={icon} size={38} />
         </Pressable>
      )}

      {theme === "icon-button" && (
         <Pressable
            {...props}
            style={{
               justifyContent: "center",
               alignItems: "center",
            }}
         >
            <MaterialIcons color="#fff" name={icon} size={24} />
            <Text
               style={{
                  marginTop: 12,
                  color: "#fff",
               }}
            >
               {label}
            </Text>
         </Pressable>
      )}

      {theme === "primary" && (
         <Pressable
            {...props}
            style={[
               styles.button,
               { backgroundColor: "#fff", borderRadius: 18, borderWidth: 4, borderColor: "#ffd33d" },
            ]}
         >
            <MaterialIcons color="#25292e" name={icon} size={18} />
            <Text style={[styles.label, { color: "#25292e" }]}>{label}</Text>
         </Pressable>
      )}

      {theme === "default" && (
         <Pressable {...props} style={styles.button}>
            <Text style={styles.label}>{label}</Text>
         </Pressable>
      )}
   </>
);

export default forwardRef(Button);
