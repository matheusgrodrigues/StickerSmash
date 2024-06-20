import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
   if (IS_DEV) {
      return "com.matheusgomesweb.StickerSmash.development";
   }

   if (IS_PREVIEW) {
      return "com.matheusgomesweb.StickerSmash.preview";
   }

   return "com.matheusgomesweb.stickersmash";
};

const appName = "StickerSmash";

export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   name: appName,
   slug: appName,
   version: "1.0.0",
   orientation: "portrait",
   icon: "./assets/icon.png",
   userInterfaceStyle: "light",
   splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#25292e",
   },
   ios: {
      bundleIdentifier: getUniqueIdentifier(),
      supportsTablet: true,
      buildNumber: "1",
   },
   android: {
      adaptiveIcon: {
         foregroundImage: "./assets/adaptive-icon.png",
         backgroundColor: "#ffffff",
      },
      package: getUniqueIdentifier(),
      versionCode: 1,
   },
   web: {
      favicon: "./assets/favicon.png",
   },
   extra: {
      eas: {
         projectId: "875c38b9-2bff-421b-a9dd-2292d0a84aed",
      },
   },

   plugins: ["expo-router"],

   scheme: "your-app-scheme",
});
