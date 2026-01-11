// screens/ChatbotScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";

import Constants from "expo-constants";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;
const GROQ_API_KEY = extra?.GROQ_API_KEY;

const MODEL_ID = "llama-3.1-8b-instant";

export default function ChatbotScreen() {
  const SYSTEM_PROMPT =
    "You are PlantLens' plant care expert. Give short, actionable, friendly plant care guidance (watering, light, soil, pests, troubleshooting).";

  const [messages, setMessages] = useState([
    {
      id: "bot-1",
      role: "bot",
      text: "Hi! I'm PlantLens Expert 🌱 — ask me anything about plant care!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 80);
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payloadMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role === "bot" ? "assistant" : m.role,
          content: m.text,
        })),
        { role: "user", content: trimmed },
      ];

      const resp = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL_ID,
            messages: payloadMessages,
            temperature: 0.2,
            max_tokens: 512,
          }),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`API error ${resp.status}: ${text}`);
      }

      const data = await resp.json();

      const botText =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a reply.";

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: "bot",
        text: botText,
      };

      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);

      const errMsg = {
        id: `bot-err-${Date.now()}`,
        role: "bot",
        text: "Sorry — I couldn't reach the AI service. Please check your API key or network.",
      };

      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.msgRow,
          isUser ? styles.msgRowUser : styles.msgRowBot,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text style={styles.msgText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/bg-chat.png")}
      style={styles.bg}
      imageStyle={{ opacity: 0.50 }}  // LOW INTENSITY BACKGROUND
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kContainer}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.chatList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          <View style={styles.composer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about plant care..."
              placeholderTextColor="#777"
              style={styles.input}
              multiline
            />

            <TouchableOpacity
              onPress={sendMessage}
              style={styles.sendBtn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  kContainer: {
    flex: 1,
  },
  chatList: {
    padding: 12,
    paddingBottom: 8,
  },
  msgRow: {
    marginVertical: 6,
    flexDirection: "row",
  },
  msgRowUser: {
    justifyContent: "flex-end",
  },
  msgRowBot: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 14,
  },
  userBubble: {
    backgroundColor: "rgba(220,235,255,0.95)",
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopLeftRadius: 4,
  },
  msgText: {
    fontSize: 15,
    color: "#222",
  },
  composer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});
