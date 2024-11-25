// AccordionComponent.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/MaterialIcons";

const AccordionComponent = ({
  title,
  children,
}: {
  title: string;
  children: any;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <Icon
          name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={24}
        />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.body}>{children}</View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    // borderRadius: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 0,
    // backgroundColor: '#f7f7f7',
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    padding: 15,
    // backgroundColor: '#fff',
  },
});

export default AccordionComponent;
