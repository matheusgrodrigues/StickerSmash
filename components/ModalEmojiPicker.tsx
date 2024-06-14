import { useImperativeHandle, useCallback, forwardRef, useState, useMemo } from "react";
import { ImageSourcePropType, StyleSheet, FlatList, Platform, Pressable, Image, Modal, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { AppOptionProps } from "../App";

const styles = StyleSheet.create({
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

export interface ModalEmojiPickerRef {
   setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModalEmojiPickerProps extends Pick<AppOptionProps, "externalRefs"> {}

const ModalEmojiPicker: React.ForwardRefRenderFunction<ModalEmojiPickerRef, ModalEmojiPickerProps> = (
   { externalRefs },
   ref
) => {
   const [isVisible, setIsVisible] = useState(false);

   const emoji: ImageSourcePropType[] = useMemo(() => {
      const baseUrl = "../assets/images";

      return [
         require(`${baseUrl}/emoji1.png`),
         require(`${baseUrl}/emoji2.png`),
         require(`${baseUrl}/emoji3.png`),
         require(`${baseUrl}/emoji4.png`),
         require(`${baseUrl}/emoji5.png`),
         require(`${baseUrl}/emoji6.png`),
      ];
   }, []);

   const onClose = useCallback(() => setIsVisible(false), []);

   useImperativeHandle(ref, () => ({ setIsVisible }), []);

   return (
      <>
         {isVisible && (
            <Modal animationType="slide" transparent={true} visible={isVisible}>
               <View style={styles.modalContent}>
                  <View style={styles.titleContainer}>
                     <Text style={styles.title}>Choose a sticker</Text>

                     <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                     </Pressable>
                  </View>

                  <FlatList
                     showsHorizontalScrollIndicator={Platform.OS === "web"}
                     contentContainerStyle={styles.listContainer}
                     renderItem={({ item, index }) => (
                        <Pressable
                           onPress={() => {
                              externalRefs.imageViewerRef.current?.setEmojiSticker(item);
                              setIsVisible(false);
                           }}
                        >
                           <Image source={item} key={index} style={styles.image} />
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
};

export default forwardRef(ModalEmojiPicker);
