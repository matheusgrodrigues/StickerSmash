import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import FontAwesome from "@expo/vector-icons/FontAwesome";

const PlaceholderImage = require("./assets/images/background-image.png");

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#25292e",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
   },
   imageContainer: {
      paddingTop: 58,
      flex: 1,
   },
   image: {
      borderRadius: 18,
      height: 440,
      width: 320,
   },
   buttonContainer: {
      marginHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
      padding: 3,
      height: 68,
      width: 320,
   },
   buttonLabel: {
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
   footerContainer: {
      alignItems: "center",
      flex: 1 / 3,
   },
});

const ImageViewer = ({ placeholderImageSource }) => {
   return <Image source={placeholderImageSource} style={styles.container} />;
};

const PrimaryButton = ({ label }) => (
   <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}>
      <Pressable style={[styles.button, { backgroundColor: "#fff" }]} onPress={() => alert("Você pressionou o botão.")}>
         <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
         <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
      </Pressable>
   </View>
);

const Button = ({ theme, label }) => {
   return (
      <>
         {theme === "primary" ? (
            <PrimaryButton label={label} />
         ) : (
            <View style={styles.buttonContainer}>
               <Pressable style={styles.button} onPress={() => alert("Você pressionou o botão.")}>
                  <Text style={styles.buttonLabel}>{label}</Text>
               </Pressable>
            </View>
         )}
      </>
   );
};

export default function App() {
   return (
      <View style={styles.container}>
         <View style={styles.imageContainer}>
            <ImageViewer placeholderImageSource={PlaceholderImage} />
         </View>

         <View style={styles.footerContainer}>
            <Button theme={"primary"} label={"Selecione a foto"} />
            <Button label={"Use esta foto"} />
         </View>

         <StatusBar style="auto" />
      </View>
   );
}
