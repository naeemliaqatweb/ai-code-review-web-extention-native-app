import { View, ScrollView, RefreshControlProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  scrollable = false, 
  className = "",
  refreshControl
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <SafeAreaView className={`flex-1 bg-[#F8FAFC] ${className}`} edges={['top', 'bottom']}>
      <ContentWrapper 
        className="flex-1 px-6 pt-4"
        refreshControl={scrollable ? refreshControl : undefined}
      >
        {children}
      </ContentWrapper>
    </SafeAreaView>
  );
};
