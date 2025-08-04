package com.mediamont.whatsapp_clone_api.message;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageRequest {

    private String content;
    private String senderId;
    private String recipientId;
    private String chatId;
    private MessageType messageType;
}
