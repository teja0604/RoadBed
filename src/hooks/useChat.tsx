import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  attachments: unknown[];
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string | null;
  created_by: string;
  property_id: string | null;
  participant_ids: string[];
  created_at: string;
  updated_at: string;
}

export function useChat(conversationId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`created_by.eq.${user.id},participant_ids.cs.{${user.id}}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      setConversations((data || []) as Conversation[]);
    }
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages((data || []).map(m => ({
        ...m,
        attachments: Array.isArray(m.attachments) ? m.attachments : []
      })) as Message[]);
    }
    setLoading(false);
  }, [conversationId]);

  // Send a message
  const sendMessage = useCallback(async (body: string, attachments: unknown[] = []) => {
    if (!user || !conversationId || !body.trim()) return;

    const { data, error } = await supabase.functions.invoke('send-message', {
      body: { conversationId, body, attachments },
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return null;
    }

    return data?.message;
  }, [user, conversationId, toast]);

  // Create a new conversation
  const createConversation = useCallback(async (title: string, participantIds: string[], propertyId?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        title,
        created_by: user.id,
        participant_ids: participantIds,
        property_id: propertyId,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      });
      return null;
    }

    await fetchConversations();
    return data;
  }, [user, fetchConversations, toast]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!conversationId || !user) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .eq('is_read', false);
  }, [conversationId, user]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, {
            ...newMessage,
            attachments: Array.isArray(newMessage.attachments) ? newMessage.attachments : []
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    conversations,
    messages,
    loading,
    sendMessage,
    createConversation,
    markAsRead,
    refetch: fetchMessages,
  };
}
