import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { CATEGORIES } from '../utils/helper';

interface CategoryProps {
  modalVisible: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
}

const Category: React.FC<CategoryProps> = ({
  modalVisible,
  onClose,
  onSelect,
}) => {
  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.selectedText}>Select Category</Text>
          <Text style={styles.select}>Select a category that best describes your expense</Text>

          <FlatList
            data={CATEGORIES}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: 'space-between', marginTop: scale(20) }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.optionText}>{item.name}</Text>
              </Pressable>
            )}
          />

        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
  },
  option: {
    paddingVertical: scale(12),
    width: '43%',
    marginHorizontal: scale(10),
    height: scale(100),
    elevation: 2,
    backgroundColor: COLORS.white,
    borderRadius: scale(10),
    alignItems: 'center',
    marginBottom: scale(12)
  },

  optionText: {
    fontSize: scale(18),
    fontFamily: fonts.balooMedium,
    marginTop: scale(10)
  },
  icon: {
    fontSize: scale(30)
  },
  selectedText: {
    fontSize: scale(18),
    fontFamily: fonts.balooBold,
    marginTop: scale(10),
    marginHorizontal: scale(10)

  },
  select: {
    fontSize: scale(16),
    fontFamily: fonts.balooMedium,
    marginTop: scale(10),
    marginHorizontal: scale(10)

  }
})
export default Category