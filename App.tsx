import React, { useImperativeHandle, useCallback, forwardRef, useState, useRef, useMemo } from "react";
import { StyleSheet, Pressable, Image, Text, View, Modal, FlatList, Platform, ImageSourcePropType } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface EmojiStickerRef {
   setStickerSource: React.Dispatch<React.SetStateAction<ImageSourcePropType | null>>;
}

interface EmojiStickerProps {
   imageSize: number;
}

const EmojiSticker: React.ForwardRefExoticComponent<React.RefAttributes<EmojiStickerRef> & EmojiStickerProps> =
   forwardRef(({ imageSize }, ref) => {
      const [stickerSource, setStickerSource] = useState<ImageSourcePropType | null>(null);

      const scaleImage = useSharedValue(imageSize);
      const translateX = useSharedValue(0);
      const translateY = useSharedValue(0);

      const containerStyle = useAnimatedStyle(() => ({
         transform: [
            {
               translateX: translateX.value,
            },
            {
               translateY: translateY.value,
            },
         ],
      }));

      const imageStyle = useAnimatedStyle(() => ({
         height: withSpring(scaleImage.value),
         width: withSpring(scaleImage.value),
      }));

      const doubleTap = useMemo(
         () =>
            Gesture.Tap()
               .numberOfTaps(2)
               .onStart(() => {
                  if (scaleImage.value !== imageSize * 2) {
                     scaleImage.value = scaleImage.value * 2;
                  }
               }),
         []
      );

      const drag = useMemo(
         () =>
            Gesture.Pan().onChange(
               (event) => ((translateX.value += event.changeX), (translateY.value += event.changeY))
            ),
         []
      );

      useImperativeHandle(ref, () => ({ setStickerSource }), []);

      return (
         <>
            {stickerSource && (
               <GestureDetector gesture={drag}>
                  <Animated.View style={[containerStyle, { top: -350 }]}>
                     <GestureDetector gesture={doubleTap}>
                        <Animated.Image
                           resizeMode={"contain"}
                           source={stickerSource}
                           style={[imageStyle, { width: imageSize, height: imageSize }]}
                        />
                     </GestureDetector>
                  </Animated.View>
               </GestureDetector>
            )}
         </>
      );
   });

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

interface ImageViewerRef {
   setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
   setEmojiSticker: (source: ImageSourcePropType | null) => void;
}

const ImageViewer: React.ForwardRefExoticComponent<React.RefAttributes<ImageViewerRef> & object> = forwardRef(
   (props, ref) => {
      const [selectedImage, setSelectedImage] = useState<string | null>(null);

      const emojiStickerRef = useRef<EmojiStickerRef | null>(null);

      useImperativeHandle(
         ref,
         () => ({
            setSelectedImage,
            setEmojiSticker: (source) => emojiStickerRef.current?.setStickerSource(source),
         }),
         []
      );

      return (
         <View style={imageViewerStyles.container}>
            <Image
               source={selectedImage ? { uri: selectedImage } : require("./assets/images/background-image.png")}
               style={imageStyles.image}
            />
            <EmojiSticker imageSize={40} ref={emojiStickerRef} />
         </View>
      );
   }
);

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
         <View style={[buttonStyles.container, { borderRadius: 18, borderWidth: 4, borderColor: "#ffd33d" }]}>
            <Pressable onPress={onPress} style={[buttonStyles.button, { backgroundColor: "#fff" }]}>
               <FontAwesome color="#25292e" name="picture-o" size={18} />
               <Text style={[buttonStyles.label, { color: "#25292e" }]}>{label}</Text>
            </Pressable>
         </View>
      ) : theme === "circle-button" ? (
         <View style={buttonStyles.circleButtonContainer}>
            <Pressable style={buttonStyles.circleButton} onPress={onPress}>
               <MaterialIcons name="add" size={38} color="#25292e" />
            </Pressable>
         </View>
      ) : theme === "icon-button" ? (
         <Pressable style={buttonStyles.iconButton} onPress={onPress}>
            <MaterialIcons name={icon} size={24} color="#fff" />
            <Text style={buttonStyles.iconButtonLabel}>{label}</Text>
         </Pressable>
      ) : (
         <View style={buttonStyles.container}>
            <Pressable onPress={onPress} style={buttonStyles.button}>
               <Text style={buttonStyles.label}>{label}</Text>
            </Pressable>
         </View>
      )}
   </>
);

const modalEmojiPickerStyles = StyleSheet.create({
   modalContent: {
      height: "25%",
      width: "100%",
      backgroundColor: "#25292e",
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: "absolute",
      bottom: 0,
   },
   titleContainer: {
      height: "16%",
      backgroundColor: "#464C55",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   title: {
      color: "#fff",
      fontSize: 16,
   },

   listContainer: {
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   image: {
      width: 100,
      height: 100,
      marginRight: 20,
   },
});

interface ModalEmojiPickerRef {
   setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModalEmojiPickerProps extends Pick<AppOptionProps, "externalRefs"> {}

const ModalEmojiPicker: React.ForwardRefExoticComponent<
   React.RefAttributes<ModalEmojiPickerRef> & ModalEmojiPickerProps
> = forwardRef(({ externalRefs }, ref) => {
   const [isVisible, setIsVisible] = useState(false);

   const emoji: ImageSourcePropType[] = useMemo(
      () => [
         require("./assets/images/emoji1.png"),
         require("./assets/images/emoji2.png"),
         require("./assets/images/emoji3.png"),
         require("./assets/images/emoji4.png"),
         require("./assets/images/emoji5.png"),
         require("./assets/images/emoji6.png"),
      ],
      []
   );

   const onClose = useCallback(() => setIsVisible(false), []);

   useImperativeHandle(ref, () => ({ setIsVisible }), []);

   return (
      <>
         {isVisible && (
            <Modal animationType="slide" transparent={true} visible={isVisible}>
               <View style={modalEmojiPickerStyles.modalContent}>
                  <View style={modalEmojiPickerStyles.titleContainer}>
                     <Text style={modalEmojiPickerStyles.title}>Choose a sticker</Text>

                     <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                     </Pressable>
                  </View>

                  <FlatList
                     showsHorizontalScrollIndicator={Platform.OS === "web"}
                     contentContainerStyle={modalEmojiPickerStyles.listContainer}
                     renderItem={({ item, index }) => (
                        <Pressable
                           onPress={() => {
                              externalRefs.imageViewerRef.current?.setEmojiSticker(item);
                              setIsVisible(false);
                           }}
                        >
                           <Image source={item} key={index} style={modalEmojiPickerStyles.image} />
                        </Pressable>
                     )}
                     horizontal
                     data={emoji}
                  />
               </View>
            </Modal>
         )}
      </>
   );
});

interface AppOptionProps {
   externalRefs: {
      imageViewerRef: React.RefObject<ImageViewerRef>;
   };
}

const AppOption: React.FC<AppOptionProps> = ({ externalRefs }) => {
   const [showAppOption, setShowAppOptions] = useState(false);

   const modalEmojiPicker = useRef<ModalEmojiPickerRef>(null);

   const pickImageSync = useCallback(async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         quality: 1,
      });

      if (!result.canceled) {
         externalRefs.imageViewerRef.current?.setSelectedImage(result.assets[0].uri);
         setShowAppOptions(true);
      } else {
         alert("Você não selecionou uma imagem!");
      }
   }, []);

   const onSaveImageAsync = useCallback(async () => alert("onSaveImageAsync"), []);

   const onAddSticker = useCallback(async () => modalEmojiPicker.current?.setIsVisible(true), []);

   const onReset = useCallback(async () => {
      setShowAppOptions(false);
      externalRefs.imageViewerRef.current?.setSelectedImage(null);
      externalRefs.imageViewerRef.current?.setEmojiSticker(null);
   }, []);

   return (
      <>
         {showAppOption ? (
            <View style={styles.optionsContainer}>
               <View style={styles.optionsRow}>
                  <Button onPress={onReset} theme="icon-button" label="Reset" icon="refresh" />
                  <Button onPress={onAddSticker} theme="circle-button" />
                  <Button onPress={onSaveImageAsync} theme="icon-button" label="Save" icon="save-alt" />
               </View>
            </View>
         ) : (
            <View style={styles.container}>
               <Button onPress={pickImageSync} theme={"primary"} label={"Selecione a foto"} />
               <Button label={"Use esta foto"} />
            </View>
         )}

         <ModalEmojiPicker externalRefs={externalRefs} ref={modalEmojiPicker} />
      </>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#25292e",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
   },
   footerContainer: {
      alignItems: "center",
      flex: 1 / 3,
   },
   optionsContainer: {
      position: "absolute",
      bottom: 80,
   },
   optionsRow: {
      alignItems: "center",
      flexDirection: "row",
   },
});

export default function App() {
   const imageViewerRef = useRef<ImageViewerRef>(null);

   return (
      <GestureHandlerRootView style={styles.container}>
         <ImageViewer ref={imageViewerRef} />

         <AppOption
            externalRefs={{
               imageViewerRef,
            }}
         />
      </GestureHandlerRootView>
   );
}
