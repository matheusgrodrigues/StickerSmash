import { useImperativeHandle, useCallback, forwardRef, useState, useRef } from "react";
import { StyleSheet, Pressable, Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

const PlaceholderImage = require("./assets/images/background-image.png");

const imageStyles = StyleSheet.create({
   image: {
      borderRadius: 18,
      height: 440,
      width: 320,
   },
});

const imageViewerStyles = StyleSheet.create({
   container: {
      paddingTop: 58,
      flex: 1,
   },
});

const ImageViewer = forwardRef((props, ref) => {
   const [selectedImage, setSelectedImage] = useState(null);

   useImperativeHandle(
      ref,
      () => ({
         setSelectedImage,
      }),
      []
   );

   return (
      <View style={imageViewerStyles.container}>
         <Image source={selectedImage ? { uri: selectedImage } : PlaceholderImage} style={imageStyles.image} />
      </View>
   );
});

const buttonStyles = StyleSheet.create({
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
});

const PrimaryButton = ({ onPress, label }) => (
   <View style={[buttonStyles.container, { borderRadius: 18, borderWidth: 4, borderColor: "#ffd33d" }]}>
      <Pressable onPress={onPress} style={[buttonStyles.button, { backgroundColor: "#fff" }]}>
         <FontAwesome color="#25292e" name="picture-o" size={18} />
         <Text style={[buttonStyles.label, { color: "#25292e" }]}>{label}</Text>
      </Pressable>
   </View>
);

const Button = ({ onPress, theme, label }) => (
   <>
      {theme === "primary" ? (
         <PrimaryButton onPress={onPress} label={label} />
      ) : (
         <View style={buttonStyles.container}>
            <Pressable onPress={onPress} style={styles.button}>
               <Text style={buttonStyles.label}>{label}</Text>
            </Pressable>
         </View>
      )}
   </>
);

const footerStyles = StyleSheet.create({
   container: {
      alignItems: "center",
      flex: 1 / 3,
   },
});

const Footer = ({ children }) => <View style={footerStyles.container}>{children}</View>;

const appStyles = StyleSheet.create({
   container: {
      backgroundColor: "#25292e",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
   },
});

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
      <View style={appStyles.container}>
         <ImageViewer ref={imageViewerRef} />

         <Footer>
            <Button onPress={pickImageSync} theme={"primary"} label={"Selecione a foto"} />
            <Button label={"Use esta foto"} />
         </Footer>

         <StatusBar style="auto" />
      </View>
   );
}
