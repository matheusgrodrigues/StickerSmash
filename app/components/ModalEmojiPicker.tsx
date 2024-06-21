import { useImperativeHandle, useCallback, forwardRef, useState, useMemo } from "react";
import { ImageSourcePropType, FlatList, Platform, Pressable, Image, Modal, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { AppOptionProps } from "../..";

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
      const baseUrl = "../../assets/images";

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
               <View
                  style={{
                     borderTopRightRadius: 18,
                     borderTopLeftRadius: 18,
                     backgroundColor: "#25292e",
                     position: "absolute",
                     bottom: 0,
                     height: "25%",
                     width: "100%",
                  }}
               >
                  <View
                     style={{
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                        paddingHorizontal: 20,
                        backgroundColor: "#464C55",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                        height: "16%",
                     }}
                  >
                     <Text
                        style={{
                           fontSize: 16,
                           color: "#fff",
                        }}
                     >
                        Choose a sticker
                     </Text>

                     <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                     </Pressable>
                  </View>

                  <FlatList
                     showsHorizontalScrollIndicator={Platform.OS === "web"}
                     contentContainerStyle={{
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                        paddingHorizontal: 20,
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                     }}
                     renderItem={({ item, index }) => (
                        <Pressable
                           onPress={() => {
                              externalRefs.imageViewerRef.current?.setEmojiSticker(item);
                              setIsVisible(false);
                           }}
                        >
                           <Image
                              source={item}
                              key={index}
                              style={{
                                 marginRight: 20,
                                 height: 100,
                                 width: 100,
                              }}
                           />
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
