import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
   return (
      <View>
         <Text>Route `/home`</Text>

         <Link style={{ color: "red" }} href="/" asChild>
            <Pressable>
               <Text>Ir para rota /</Text>
            </Pressable>
         </Link>
      </View>
   );
}
