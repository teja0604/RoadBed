import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, MoreVertical, Phone, Video, Image as ImageIcon, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ParticipantProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, messages, loading, sendMessage, createConversation, markAsRead } = useChat(selectedConversationId || undefined);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [participantProfiles, setParticipantProfiles] = useState<Record<string, ParticipantProfile>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when selecting a conversation
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead();
    }
  }, [selectedConversationId, markAsRead]);

  // Fetch participant profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      const allParticipantIds = new Set<string>();
      conversations.forEach(conv => {
        allParticipantIds.add(conv.created_by);
        conv.participant_ids.forEach(id => allParticipantIds.add(id));
      });

      if (allParticipantIds.size === 0) return;

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', Array.from(allParticipantIds));

      if (data) {
        const profileMap: Record<string, ParticipantProfile> = {};
        data.forEach(p => {
          profileMap[p.id] = p;
        });
        setParticipantProfiles(profileMap);
      }
    };

    fetchProfiles();
  }, [conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    await sendMessage(newMessage);
    setNewMessage('');
    setSending(false);
  };

  const handleCreateConversation = async () => {
    const title = prompt('Enter conversation title:');
    if (!title) return;
    const result = await createConversation(title, []);
    if (result) {
      setSelectedConversationId(result.id);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    (conv.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOtherParticipant = (conv: typeof conversations[0]) => {
    const otherId = conv.created_by === user?.id 
      ? conv.participant_ids[0] 
      : conv.created_by;
    return participantProfiles[otherId] || { id: otherId, full_name: 'Unknown User', avatar_url: null };
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view messages</h1>
          <Button onClick={() => window.location.href = '/auth'}>Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      <div className="pt-24 pb-8 px-4 h-screen">
        <div className="container mx-auto h-[calc(100vh-8rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Conversations List */}
              <Card className="col-span-12 md:col-span-4 lg:col-span-3 p-0 overflow-hidden flex flex-col">
                <div className="p-4 border-b space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Messages</h2>
                    <Button variant="ghost" size="icon" onClick={handleCreateConversation}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <p>No conversations yet</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleCreateConversation}>
                        Start a conversation
                      </Button>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {filteredConversations.map((conversation) => {
                        const participant = getOtherParticipant(conversation);
                        return (
                          <motion.button
                            key={conversation.id}
                            onClick={() => setSelectedConversationId(conversation.id)}
                            className={cn(
                              'w-full p-3 rounded-lg text-left transition-all hover:bg-accent',
                              selectedConversationId === conversation.id && 'bg-accent'
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={participant.avatar_url || undefined} />
                                <AvatarFallback>{(participant.full_name || 'U')[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold truncate">
                                    {conversation.title || participant.full_name || 'Conversation'}
                                  </h3>
                                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                    {new Date(conversation.updated_at).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </Card>

              {/* Messages Area */}
              <Card className="col-span-12 md:col-span-8 lg:col-span-9 p-0 overflow-hidden flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {(selectedConversation.title || 'C')[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedConversation.title || 'Conversation'}</h3>
                          <p className="text-xs text-muted-foreground">
                            {selectedConversation.participant_ids.length + 1} participants
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        <AnimatePresence>
                          {messages.map((message, index) => {
                            const isMe = message.sender_id === user?.id;
                            const senderProfile = participantProfiles[message.sender_id];
                            return (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                  'flex',
                                  isMe ? 'justify-end' : 'justify-start'
                                )}
                              >
                                <div className={cn('flex items-end gap-2', isMe && 'flex-row-reverse')}>
                                  {!isMe && (
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={senderProfile?.avatar_url || undefined} />
                                      <AvatarFallback>{(senderProfile?.full_name || 'U')[0]}</AvatarFallback>
                                    </Avatar>
                                  )}
                                  <div
                                    className={cn(
                                      'max-w-[70%] rounded-2xl px-4 py-2',
                                      isMe
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                    )}
                                  >
                                    <p className="text-sm">{message.body}</p>
                                    <span className="text-xs opacity-70 mt-1 block">
                                      {new Date(message.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t">
                      <div className="flex items-end gap-2">
                        <Button variant="ghost" size="icon">
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="pr-12"
                            disabled={sending}
                          />
                        </div>
                        <Button onClick={handleSendMessage} size="icon" disabled={sending}>
                          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
