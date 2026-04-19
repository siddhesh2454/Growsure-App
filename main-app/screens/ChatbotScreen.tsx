import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";

const CHAT_API_URL = "http://172.20.10.2:4000/chat";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  source: string | null;
  language: string;
};

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: "Hello! How can I help you today?",
      sender: "bot",
      source: null,
      language: "English",
    },
  ]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("English");
  const flatListRef = useRef<FlatList<any> | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const insets = useSafeAreaInsets();

  // ✅ Safe fallback for tabBarHeight
  const safeTabBarHeight = (() => {
    try {
      return useBottomTabBarHeight();
    } catch {
      return 0;
    }
  })();

  // Always scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const fetchAnswer = async (question: string) => {
    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, lang }),
      });
      const data = await response.json();
      addMessage(
        data.answer || "Sorry, I couldn't find an answer.",
        "bot",
        data.source || "Gemini/FAQ",
        lang
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      addMessage("Something went wrong while fetching data.", "bot", null, lang);
    }
  };

  const addMessage = (
    text: string,
    sender: "user" | "bot",
    source: string | null,
    language: string = "English"
  ) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sender, source, language },
    ]);
  };

  const sendMessage = () => {
    if (input.trim() === "") return;
    addMessage(input.trim(), "user", null, lang);
    fetchAnswer(input.trim());
    setInput("");

    // ✅ Keep focus on iOS after sending
    if (Platform.OS === "ios") {
      inputRef.current?.focus();
    }
  };

  const openIosLanguagePicker = () => {
    const options = ["English", "Hindi", "Marathi", "Cancel"];
    ActionSheetIOS.showActionSheetWithOptions(
      { options, cancelButtonIndex: 3 },
      (buttonIndex) => {
        if (buttonIndex >= 0 && buttonIndex < 3) {
          setLang(options[buttonIndex]);
        }
      }
    );
  };

  const renderHeaderLanguageControl = () => {
    if (Platform.OS === "ios") {
      return (
        <TouchableOpacity
          style={styles.headerDropdownWrapperTouchable}
          onPress={openIosLanguagePicker}
          activeOpacity={0.7}
        >
          <Text style={styles.headerDropdownText}>{lang}</Text>
          <Icon name="chevron-down" size={18} color="#000" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.headerDropdownWrapper}>
        <Picker
          selectedValue={lang}
          style={styles.headerDropdown}
          dropdownIconColor="#000"
          onValueChange={(value) => setLang(value)}
          mode="dropdown"
        >
          <Picker.Item label="English" value="English" color="#000" />
          <Picker.Item label="Hindi" value="Hindi" color="#000" />
          <Picker.Item label="Marathi" value="Marathi" color="#000" />
        </Picker>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={safeTabBarHeight + insets.top + 10}
      >
        {Platform.OS === "web" ? (
          // Web: no TouchableWithoutFeedback (fixes focus issue)
          <View style={styles.inner}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Help & Support</Text>
              {renderHeaderLanguageControl()}
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.sender === "user" ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.sender === "user" ? styles.userMessageText : styles.botMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>
                  {item.sender === "bot" && (
                    <Text style={styles.sourceLabel}>
                      ({item.source || "AI"}
                      {item.language && item.language !== "English"
                        ? ` – Translated to ${item.language}`
                        : ""}
                      )
                    </Text>
                  )}
                </View>
              )}
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Row */}
            <View style={[styles.inputArea, { paddingBottom: insets.bottom }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Ask me something..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
                blurOnSubmit={false}
                autoFocus // ✅ Web autoFocus
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // iOS/Android: dismiss keyboard on outside touch
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.inner}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                  <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Help & Support</Text>
                {renderHeaderLanguageControl()}
              </View>

              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.messageContainer,
                      item.sender === "user" ? styles.userMessage : styles.botMessage,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        item.sender === "user" ? styles.userMessageText : styles.botMessageText,
                      ]}
                    >
                      {item.text}
                    </Text>
                    {item.sender === "bot" && (
                      <Text style={styles.sourceLabel}>
                        ({item.source || "AI"}
                        {item.language && item.language !== "English"
                          ? ` – Translated to ${item.language}`
                          : ""}
                        )
                      </Text>
                    )}
                  </View>
                )}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10, paddingBottom: 30 }}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />

              <View style={[styles.inputArea, { paddingBottom: insets.bottom }]}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="Ask me something..."
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                  blurOnSubmit={false} // ✅ keeps iOS keyboard open
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F5F5" },
  container: { flex: 1 },
  inner: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#43A047",
    padding: 14,
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  headerDropdownWrapper: {
    marginLeft: "auto",
    width: Platform.OS === "web" ? 120 : 110,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  headerDropdown: { height: 40, color: "#000", width: "100%" },
  headerDropdownWrapperTouchable: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerDropdownText: { color: "#000", fontSize: 14 },

  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  userMessage: { backgroundColor: "#43A047", alignSelf: "flex-end" },
  botMessage: { backgroundColor: "#E5E5EA", alignSelf: "flex-start" },
  messageText: { fontSize: 16 },
  userMessageText: { color: "#fff" },
  botMessageText: { color: "#000" },
  sourceLabel: { fontSize: 12, color: "#555", marginTop: 4 },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 6,
    minHeight: 44,
  },
  sendButton: {
    backgroundColor: "#43A047",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
