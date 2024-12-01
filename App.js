import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={[styles.content, backgroundStyle]}>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, backgroundStyle]}>Chào mừng</Text>
            <Text style={[styles.sectionDescription, backgroundStyle]}>
              Đây là ứng dụng React Native của bạn
            </Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, backgroundStyle]}>Hướng dẫn</Text>
            <Text style={[styles.sectionDescription, backgroundStyle]}>
              Bắt đầu chỉnh sửa để tạo ứng dụng của riêng bạn
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default App;
