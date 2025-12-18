import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileCheck, Check, X, Eye, Loader2, AlertTriangle, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KYCDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string;
  document_url: string | null;
  verified: boolean | null;
  created_at: string;
  profile?: {
    full_name: string | null;
  };
}

const KYCReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Fetch pending KYC documents
      const { data: kycData } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('verified', false)
        .order('created_at', { ascending: false });

      if (kycData) {
        // Fetch profiles for each document
        const userIds = [...new Set(kycData.map(d => d.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        setDocuments(kycData.map(doc => ({
          ...doc,
          profile: profileMap.get(doc.user_id) || undefined
        })));
      }

      setLoading(false);
    };

    checkAdminAndFetch();
  }, [user]);

  const handleApprove = async (docId: string, userId: string) => {
    setProcessing(docId);
    
    const { error } = await supabase
      .from('kyc_verifications')
      .update({ 
        verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', docId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve document',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Document approved successfully',
      });
      setDocuments(prev => prev.filter(d => d.id !== docId));
      
      // Create notification for user
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'kyc_approved',
        title: 'KYC Approved',
        body: 'Your identity verification has been approved. You are now verified!',
        link: '/profile',
      });
    }
    
    setProcessing(null);
  };

  const handleReject = async (docId: string, userId: string) => {
    setProcessing(docId);
    
    const notes = reviewNotes[docId] || 'Document rejected by admin';
    
    const { error } = await supabase
      .from('kyc_verifications')
      .delete()
      .eq('id', docId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject document',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Document Rejected',
        description: 'The document has been rejected',
      });
      setDocuments(prev => prev.filter(d => d.id !== docId));
      
      // Create notification for user
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'kyc_rejected',
        title: 'KYC Rejected',
        body: `Your identity verification was rejected. Reason: ${notes}`,
        link: '/kyc',
      });
    }
    
    setProcessing(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to access admin dashboard</h1>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" className="mb-6" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <h1 className="text-4xl font-bold flex items-center gap-3 mb-8">
              <FileCheck className="w-8 h-8" />
              KYC Review
              <Badge variant="secondary">{documents.length} Pending</Badge>
            </h1>

            {documents.length === 0 ? (
              <Card className="p-12 text-center">
                <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No pending KYC documents to review.</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {doc.profile?.full_name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            User ID: {doc.user_id.slice(0, 8)}...
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {doc.document_type.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Document Number</p>
                          <p className="font-medium">{doc.document_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted</p>
                          <p className="font-medium">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {doc.document_url && (
                        <Button variant="outline" className="mb-4" asChild>
                          <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-2" />
                            View Document
                          </a>
                        </Button>
                      )}

                      <Textarea
                        placeholder="Review notes (optional for approval, required for rejection)"
                        value={reviewNotes[doc.id] || ''}
                        onChange={(e) => setReviewNotes(prev => ({
                          ...prev,
                          [doc.id]: e.target.value
                        }))}
                        className="mb-4"
                      />

                      <div className="flex gap-4">
                        <Button
                          onClick={() => handleApprove(doc.id, doc.user_id)}
                          disabled={processing === doc.id}
                          className="flex-1"
                        >
                          {processing === doc.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(doc.id, doc.user_id)}
                          disabled={processing === doc.id}
                          className="flex-1"
                        >
                          {processing === doc.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <X className="w-4 h-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KYCReview;
