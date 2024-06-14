import React, { useImperativeHandle, useCallback, forwardRef, useState, useRef, useMemo } from "react";
import { StyleSheet, Image, View, ImageSourcePropType } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";

import ModalEmojiPicker, { ModalEmojiPickerRef } from "./components/ModalEmojiPicker";
import Button from "./components/Button";

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
   getImageRef: () => View;
}

const ImageViewer: React.ForwardRefExoticComponent<React.RefAttributes<ImageViewerRef> & object> = forwardRef(
   (props, ref) => {
      const [selectedImage, setSelectedImage] = useState<string | null>(null);

      const emojiStickerRef = useRef<EmojiStickerRef | null>(null);
      const imageRef = useRef<View>(null);

      useImperativeHandle(
         ref,
         () => ({
            setSelectedImage,
            setEmojiSticker: (source) => emojiStickerRef.current?.setStickerSource(source),
            getImageRef: () => imageRef.current!,
         }),
         []
      );

      return (
         <View style={imageViewerStyles.container}>
            <View ref={imageRef} collapsable={false}>
               <Image
                  source={selectedImage ? { uri: selectedImage } : require("./assets/images/background-image.png")}
                  style={imageStyles.image}
               />
               <EmojiSticker imageSize={40} ref={emojiStickerRef} />
            </View>
         </View>
      );
   }
);

export interface AppOptionProps {
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

   const onSaveImageAsync = useCallback(async () => {
      try {
         const localUri = await captureRef(externalRefs.imageViewerRef.current?.getImageRef()!, {
            height: 440,
            quality: 1,
         });

         await MediaLibrary.saveToLibraryAsync(localUri);
         if (localUri) {
            alert("Imagem salva com sucesso!");
         }
      } catch (e) {
         console.log(e);
      }
   }, []);

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
   const [status, requestPermission] = MediaLibrary.usePermissions();

   const imageViewerRef = useRef<ImageViewerRef>(null);

   if (status === null) {
      requestPermission();
   }

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
