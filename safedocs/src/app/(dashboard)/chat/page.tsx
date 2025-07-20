"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Message = {
  sender: "me" | "other"
  text: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001")
    socketRef.current = socket

    socket.onopen = () => {
      console.log("Conectado al servidor WebSocket")
    }

    socket.onmessage = (event) => {
      setMessages((prev) => {
        if (prev.length > 0) {
          const lastMsg = prev[prev.length - 1]
          // Evitar mostrar eco del mensaje enviado
          if (lastMsg.sender === "me" && lastMsg.text === event.data) {
            return prev
          }
        }
        return [...prev, { sender: "other", text: event.data }]
      })
    }

    socket.onclose = () => {
      console.log("Desconectado del servidor WebSocket")
    }

    socket.onerror = (err) => {
      console.error("WebSocket error:", err)
    }

    return () => {
      socket.close()
    }
  }, [])

  const sendMessage = () => {
    if (socketRef.current && input.trim()) {
      socketRef.current.send(input)
      setMessages((prev) => [...prev, { sender: "me", text: input }])
      setInput("")
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Chat en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2 bg-muted/10">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded max-w-[70%] ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white ml-auto text-right"
                    : "bg-gray-300 text-black mr-auto text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="mt-4 flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage()
              }}
            />
            <Button onClick={sendMessage}>Enviar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
