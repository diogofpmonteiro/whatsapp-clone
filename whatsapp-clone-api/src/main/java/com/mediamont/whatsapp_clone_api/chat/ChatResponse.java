package com.mediamont.whatsapp_clone_api.chat;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatResponse {
    private String id;
    private String name;
    private long unreadCount;
    private String lastMessage;
    private LocalDateTime lastMessageDate;
    private boolean isRecipientOnline;
    private String senderId;
    private String recipientId;
}
