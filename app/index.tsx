import React, { useImperativeHandle, useCallback, forwardRef, useState, useRef, useMemo } from "react";
import { StyleSheet, Image, View, ImageSourcePropType, Platform, Text } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";

import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import { captureRef } from "react-native-view-shot";
import Toast from "react-native-root-toast";

import domtoimage from "dom-to-image";

import ModalEmojiPicker, { ModalEmojiPickerRef } from "./components/ModalEmojiPicker";
import Button from "./components/Button";
import { ErrorBoundaryProps, Link } from "expo-router";

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
         <View
            style={{
               paddingTop: 58,
               flex: 1,
            }}
         >
            <View ref={imageRef} collapsable={false}>
               <Image
                  source={selectedImage ? { uri: selectedImage } : require("../assets/images/background-image.png")}
                  style={{
                     borderRadius: 18,
                     height: 440,
                     width: 320,
                  }}
               />
               <EmojiSticker imageSize={40} ref={emojiStickerRef} />
            </View>
         </View>
      );
   }
);

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#25292e",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
   },
});

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
         let toast = Toast.show("Você não selecionou uma imagem!", {
            duration: Toast.durations.LONG,
         });

         setTimeout(() => Toast.hide(toast), 3000);
      }
   }, []);

   const saveImageOnMobile = useCallback(async () => {
      const localUri = await captureRef(externalRefs.imageViewerRef.current?.getImageRef()!, {
         height: 440,
         quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
         let toast = Toast.show("Imagem salva com sucesso!", {
            duration: Toast.durations.LONG,
         });

         setTimeout(() => Toast.hide(toast), 3000);
      }
   }, []);

   const saveImageOnWeb = useCallback(async () => {
      const dataUrl = await domtoimage.toJpeg(externalRefs.imageViewerRef.current?.getImageRef()! as unknown as Node, {
         quality: 0.95,
         width: 320,
         height: 440,
      });

      let link = document.createElement("a");
      link.download = "sticker-smash.jpeg";
      link.href = dataUrl;
      link.click();
   }, []);

   const onSaveImageAsync = useCallback(async () => {
      if (Platform.OS !== "web") {
         try {
            saveImageOnMobile();
         } catch (e) {
            console.log(e);
         }
      } else {
         try {
            saveImageOnWeb();
         } catch (e) {
            console.log(e);
         }
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
            <View
               style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 60,
                  position: "absolute",
                  bottom: 80,
               }}
            >
               <Button onPress={onReset} theme="icon-button" label="Reset" icon="refresh" />
               <Button onPress={onAddSticker} theme="circle-button" icon="add" />
               <Button onPress={onSaveImageAsync} theme="icon-button" label="Save" icon="save-alt" />
            </View>
         ) : (
            <View style={styles.container}>
               <Button onPress={pickImageSync} theme={"primary"} label={"Selecione a foto"} icon="image" />
               <Button label={"Use esta foto"} />
            </View>
         )}

         <ModalEmojiPicker externalRefs={externalRefs} ref={modalEmojiPicker} />
      </>
   );
};

export default function App() {
   const [status, requestPermission] = MediaLibrary.usePermissions();

   const imageViewerRef = useRef<ImageViewerRef>(null);

   if (status === null) {
      requestPermission();
   }

   return (
      <RootSiblingParent>
         <GestureHandlerRootView style={styles.container}>
            <ImageViewer ref={imageViewerRef} />

            <Link href={"/homesd"} asChild>
               <Button theme="primary" label="Home Page" />
            </Link>

            <AppOption
               externalRefs={{
                  imageViewerRef,
               }}
            />

            <StatusBar style="light" />
         </GestureHandlerRootView>
      </RootSiblingParent>
   );
}
