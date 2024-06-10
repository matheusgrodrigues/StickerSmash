import { useImperativeHandle, useCallback, forwardRef, useState, useRef } from "react";
import { StyleSheet, Pressable, Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

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

const ImageViewer = forwardRef(({ placeholderImageSource }, ref) => {
   const [selectedImage, setSelectedImage] = useState(null);

   console.log("imageViewr", selectedImage);

   useImperativeHandle(
      ref,
      () => ({
         setSelectedImage,
      }),
      []
   );

   return <Image source={selectedImage ? { uri: selectedImage } : placeholderImageSource} style={styles.image} />;
});

const PrimaryButton = ({ onPress, label }) => (
   <View style={[styles.buttonContainer, { borderRadius: 18, borderWidth: 4, borderColor: "#ffd33d" }]}>
      <Pressable onPress={onPress} style={[styles.button, { backgroundColor: "#fff" }]}>
         <FontAwesome style={styles.buttonIcon} name="picture-o" size={18} color="#25292e" />
         <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
      </Pressable>
   </View>
);

const Button = ({ onPress, theme, label }) => {
   return (
      <>
         {theme === "primary" ? (
            <PrimaryButton onPress={onPress} label={label} />
         ) : (
            <View style={styles.buttonContainer}>
               <Pressable onPress={onPress} style={styles.button}>
                  <Text style={styles.buttonLabel}>{label}</Text>
               </Pressable>
            </View>
         )}
      </>
   );
};

export default function App() {
   const imageViewerRef = useRef(null);

   const pickImageSync = useCallback(async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         quality: 1,
      });

      if (!result.canceled) {
         imageViewerRef.current.setSelectedImage(result.assets[0].uri);
      } else {
         alert("Você não selecionou uma imagem!");
      }
   }, []);

   return (
      <View style={styles.container}>
         <View style={styles.imageContainer}>
            <ImageViewer placeholderImageSource={PlaceholderImage} ref={imageViewerRef} />
         </View>

         <View style={styles.footerContainer}>
            <Button onPress={pickImageSync} theme={"primary"} label={"Selecione a foto"} />
            <Button label={"Use esta foto"} />
         </View>

         <StatusBar style="auto" />
      </View>
   );
}
