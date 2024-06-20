import { Link } from "expo-router";
import { Text, View } from "react-native";
import Button from "./components/Button";

export default function User() {
   return (
      <>
         <View>
            <Text>Rota `/any`</Text>

            <Link href="/" asChild>
               <Button theme="primary" label="Voltar" />
            </Link>
         </View>
      </>
   );
}
