import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { Text, View } from "react-native";

import * as SplashScreen from "expo-splash-screen";

const Header: React.FC = () => (
   <View>
      <Text>Header</Text>
   </View>
);
const Footer: React.FC = () => (
   <View>
      <Text>Footer</Text>
   </View>
);

export default function HomeLayout() {
   return (
      <>
         <Header />
         <Slot />
         <Footer />
      </>
   );
}
