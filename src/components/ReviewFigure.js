import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistoricalFigureById } from '../redux/QuestionSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { API_URL } from '@env';
import { WebView } from 'react-native-webview';
import { useWindowDimensions } from 'react-native';

const ReviewFigure = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const figureId = route.params.id;
  const historicalFigure = useSelector((state) => state.questions.historicalFigure);
  const loading = useSelector((state) => state.questions.loading);
  const error = useSelector((state) => state.questions.error);
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef();

  useEffect(() => {
    console.log('Fetching historical figure with ID:', figureId);
    dispatch(fetchHistoricalFigureById(figureId));
  }, [dispatch, figureId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent} ref={scrollViewRef}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : historicalFigure ? (
          <>
            <Image 
              source={{ uri: `${API_URL}${historicalFigure.imageUrl}` }} 
              style={styles.figureImage} 
            />
            <Text style={styles.figureName}>{historicalFigure.name}</Text>
            <WebView
              style={{ height: 800, width }}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              onScroll={(event) => {
                const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
                const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height;
                const isAtTop = contentOffset.y <= 0;

                if (isAtBottom) {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                } else if (isAtTop) {
                  scrollViewRef.current.scrollTo({ y: 0, animated: true });
                }
              }}
              source={{ html: `<html>
                                <head>
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <style>
                                    body { 
                                      font-size: 20px; 
                                      max-width: 100%; 
                                      overflow-wrap: break-word; 
                                    }
                                    img { 
                                      max-width: 100%; 
                                      height: auto; 
                                    }
                                  </style>
                                </head>
                                <body>
                                  ${historicalFigure.content}
                                  ${historicalFigure.videoUrl ? `<iframe width="100%" height="300" src="${historicalFigure.videoUrl.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>` : ''}
                                </body>
                              </html>` }}
              originWhitelist={['*']}
            />
            {/* {historicalFigure.videoUrl && (
              <View style={styles.videoContainer}>
                <WebView 
                  source={{ uri: historicalFigure.videoUrl.replace('watch?v=', 'embed/') }} 
                  style={styles.videoWebView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  onError={(error) => console.log('WebView error: ', error.nativeEvent)}
                />
              </View>
            )} */}
          </>
        ) : (
          <Text style={styles.noDataText}>No data available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
  },
  figureImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  figureName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
  },
  videoLink: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },

    videoContainer: {
      width: '100%', 
      height: 300, 
      borderWidth: 1, 
      borderColor: '#ccc', 
      borderRadius: 8, 
      overflow: 'hidden', 
      marginVertical: 10,
    },
    videoWebView: {
      width: '100%', 
      height: '100%', 
    },

});

export default ReviewFigure;
