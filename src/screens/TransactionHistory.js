import { View, Text, FlatList, ActivityIndicator, StyleSheet, Modal, Image, TouchableOpacity, RefreshControl } from 'react-native';
import React from 'react'
import webserverConnection from '../../WebServer';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TransactionHistory() {
  const [items, setItems] = useState([]);
  const [icon, setIcon] = useState(false)
  const [color, setColor] = useState()
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedHash, setSelectedHash] = useState(null);

  const getEmail = async () => {
    const mail = await AsyncStorage.getItem('userMail')
    setEmail(mail);
    fetchItems();
  }

  const iconMap = {
    "giden": "arrow-up",
    "gelen": "arrow-down",
  };

  const iconColor = {
    "giden": "red",
    "gelen": "green",
  };

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Gönderim Geçmişi</Text>
      </View>
    );
  };

  const ItemSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  const formatDateTime = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');

    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    return `${day}/${month}/${year} - ${hour}:${minute}`;
  };

  const fetchItems = async () => {
    if (email) {
      const result = await webserverConnection.getTransactions(email)

      if (result) {
        const sortedData = result.data.sort((a, b) => new Date(b.trn_dt) - new Date(a.trn_dt));
        setItems(sortedData)
        setLoading(false);
      }
      if (!result) {
        alert("Transactions not found");
      }
    }
  };

  useEffect(() => {
    getEmail();
  }, [email]);

  const openLinkInWebView = async (trn_hash) => {
    setSelectedHash(trn_hash);
    setVisible(true);
  }

  const closeWebView = async () => {
    setVisible(false);
    setSelectedHash(null);
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchItems().then(() => setRefreshing(false));
  }

  const renderListItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Icon name={iconMap[item.yon]} size={28} color={iconColor[item.yon]} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Alıcı: {item.email_to}</Text>
          <Text style={styles.title}>Gönderici: {item.email_from}</Text>
          <Text style={styles.description}>{item.trn_hash}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatDateTime(item.trn_dt)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iconContainer} onPress={() => openLinkInWebView(item.trn_hash)}>
          <Icon name="globe" size={28} />
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <FlatList
        data={items}
        keyExtractor={item => item.trn_hash}
        renderItem={renderListItem}
        style={{ width: '100%' }}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
      <Modal
        visible={visible}
        presentationStyle={'overFullScreen'}
        animationType={'slide'}
        onRequestClose={() => closeWebView()}
      >
        {selectedHash && (
          <WebView source={{ uri: 'https://sepolia.etherscan.io/tx/' + selectedHash }} />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    paddingTop: 30
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: "#888",
    marginTop: 5,
    marginBottom: 5,
    width: "90%"
  },
  time: {
    fontSize: 13,
    color: "#808080",
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 3,
    backgroundColor: 'darkgreen',
    marginHorizontal: 2,
  },
});
