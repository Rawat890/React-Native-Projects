import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../utils/colors";

interface WrapperWithGradientProps {
  children: ReactNode;
}

const WrapperWithGradient: React.FC<WrapperWithGradientProps> = ({ children }) => {
  return (
    <>
      <LinearGradient
        style={styles.container}
        colors={[COLORS.success, COLORS.success]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.contentContainer} edges={["top", "left", "right"]}>
        {children}
      </SafeAreaView>
    </>
  );
};

export default WrapperWithGradient;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
  },
});
