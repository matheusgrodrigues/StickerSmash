import { Link } from "expo-router";
import { Text, View } from "react-native";
import Button from "./components/Button";

export default function Home() {
   return (
      <View>
         <Text>Route `/home`</Text>

         <Link href="/" asChild>
            <Button theme="primary" label="Voltar" />
         </Link>
      </View>
   );
}
