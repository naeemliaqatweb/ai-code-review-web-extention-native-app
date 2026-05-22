import React from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Typography } from './Typography';
import { IconSymbol } from './icon-symbol';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  value, 
  options, 
  onSelect, 
  placeholder = "Select an option" 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const selectedOption = options.find(o => o.value === value);

  return (
    <View className="mb-6">
      <Typography variant="label" className="mb-3 ml-1">{label}</Typography>
      
      <TouchableOpacity 
        onPress={() => setIsVisible(true)}
        className="bg-white border border-gray-100 rounded-2xl p-4 flex-row justify-between items-center shadow-sm"
      >
        <Typography variant="body" className={value ? 'text-black' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </Typography>
        <IconSymbol name="chevron.right" color="#8E8E93" size={16} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[40px] p-6 pb-12">
            <View className="flex-row justify-between items-center mb-6">
              <Typography variant="h2">{label}</Typography>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Typography variant="body" className="text-primary font-bold">Done</Typography>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => {
                    onSelect(item.value);
                    setIsVisible(false);
                  }}
                  className={`py-4 border-b border-gray-50 flex-row justify-between items-center ${item.value === value ? 'bg-primary/5 rounded-xl px-4' : ''}`}
                >
                  <Typography variant="body" className={item.value === value ? 'text-primary font-bold' : ''}>
                    {item.label}
                  </Typography>
                  {item.value === value && <IconSymbol name="checkmark.seal.fill" color="#007AFF" size={20} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
